/**
 * reverify-content.ts
 *
 * Automated re-check of stale content in FosterHub AZ (live site data only:
 * web/src/data/resources.ts, constants.ts, docs.ts).
 *
 * SAFETY RULES (youth rely on these numbers — do not loosen without review):
 *   • This script NEVER writes a phone number. If the stored number is not on
 *     the page, the entry goes in the report under
 *     "Needs human review: possible phone number change" and nothing changes.
 *   • `lastVerified` is only bumped when the script positively confirmed
 *     something: the stored phone number(s) appear on the entry's page, or the
 *     entry has no phone number and its URL loaded with no redirect.
 *     "The link returned 200" alone is NOT verification.
 *   • The only data value it may rewrite (besides the date) is a URL that
 *     permanently (301/308) redirects to an https URL on the same host
 *     (ignoring a leading "www."). Every such change is listed in the report.
 *     Any other redirect is reported for a human and left alone.
 *
 * For each entry past its SLA:
 *   1. Fetch the entry's URL (follow redirects, capture final URL)
 *   2. Look for the stored phone number(s) in the page text
 *   3. Classify: confirmed / possible phone change / not confirmed
 *   4. Write a report to docs/reverification-report.md
 *
 * Run:
 *   npx tsx scripts/reverify-content.ts            # check + write report only
 *   npx tsx scripts/reverify-content.ts --apply    # also bump confirmed dates
 *                                                  #   and fix safe redirects
 *   npx tsx scripts/reverify-content.ts --dry-run  # write NOTHING (no data
 *                                                  #   files, no report file)
 *   --limit N                                      # only check first N stale
 *
 * Exit codes:
 *   0 — every stale entry was confirmed
 *   1 — some entries need a human (report generated)
 *   2 — fatal error
 */

import * as fs from "fs";
import * as path from "path";
import * as https from "https";
import * as http from "http";

// ── Config ───────────────────────────────────────────────────────────────────

const TODAY = new Date().toISOString().split("T")[0]!;
const DRY_RUN = process.argv.includes("--dry-run");
const APPLY = process.argv.includes("--apply") && !DRY_RUN;
const LIMIT = (() => {
  const i = process.argv.indexOf("--limit");
  const n = i >= 0 ? Number(process.argv[i + 1]) : NaN;
  return Number.isInteger(n) && n > 0 ? n : Infinity;
})();
const MODE_LABEL = DRY_RUN ? "Dry run (nothing written)" : APPLY ? "Applied" : "Report only";

const TIMEOUT_MS = 15_000;
const MAX_CONCURRENT = 5;
const MIN_BODY_BYTES = 200;
const MAX_BODY_BYTES = 1_500_000;
const MAX_URL_LENGTH = 300;
const MAX_CANDIDATES_SHOWN = 10;

const PARKED_SIGNALS = [
  "domain is for sale",
  "this domain has expired",
  "buy this domain",
  "website is under construction",
  "parked free",
  "godaddy",
  "sedoparking",
  "hugedomains",
  "dan.com",
  "afternic",
];

// ── SLA thresholds ───────────────────────────────────────────────────────────

const SLA: Record<string, number> = {
  crisis: 14,
  resources: 30,
  documents: 60,
  legal: 90,
};

// ── Types ────────────────────────────────────────────────────────────────────

interface DataFile {
  displayPath: string;
  absPath: string;
  nameField: string;
  /** Field holding the entry's URL, or null if entries have none. */
  urlField: string | null;
  /** Field holding exactly one phone number, or null. */
  phoneField: string | null;
  /** Free-text field that may contain phone numbers / short codes, or null. */
  contactTextField: string | null;
  slaKey: string;
}

/** Absolute character offsets of a string literal's value (between the quotes). */
interface Span {
  start: number;
  end: number;
}

interface Entry {
  /** `id` field when the entry has one, otherwise its name. */
  id: string;
  name: string;
  url: string;
  /** Stored phone numbers / short codes that must all be found on the page. */
  phones: string[];
  lastVerified: string;
  urlSpan: Span | null;
  dateSpan: Span;
}

type Outcome =
  | "confirmed" //          positively confirmed → lastVerified may be bumped
  | "phone_mismatch" //     stored number missing, other numbers on the page
  | "phone_not_found" //    stored number missing, no numbers on the page
  | "redirected" //         no phone to check and the URL redirected
  | "no_url" //             nothing this script can check
  | "unreachable"; //       DNS / HTTP / timeout / parked / empty

interface VerifyResult {
  entry: Entry;
  file: DataFile;
  outcome: Outcome;
  /** Honest, human-readable statement of exactly what was (not) established. */
  reason: string;
  httpStatus: number | null;
  /** Final URL when the request was redirected, else null. */
  resolvedUrl: string | null;
  /** True when resolvedUrl is safe to write back automatically. */
  redirectAutoFixable: boolean;
  /** Why a redirect was not auto-corrected (when it wasn't). */
  redirectNote: string | null;
  /** Stored numbers that were not found on the page. */
  phonesMissing: string[];
  /** Other phone numbers seen on the page. NEVER written to data files. */
  phoneCandidates: string[];
  pageTitle: string | null;
}

interface FileUpdate {
  displayPath: string;
  entryId: string;
  entryName: string;
  field: string;
  oldValue: string;
  newValue: string;
  reason: string;
}

// ── Data files (live site only — the retired server/ data is not scanned) ────

const ROOT = path.resolve(__dirname, "..");

const DATA_FILES: DataFile[] = [
  {
    displayPath: "web/src/data/constants.ts",
    absPath: path.join(ROOT, "web/src/data/constants.ts"),
    nameField: "name",
    urlField: "url",
    phoneField: null,
    // CRISIS_PINS keep the number inside free text, e.g. "Call or text 988".
    contactTextField: "how",
    slaKey: "crisis",
  },
  {
    displayPath: "web/src/data/resources.ts",
    absPath: path.join(ROOT, "web/src/data/resources.ts"),
    nameField: "name",
    urlField: "url",
    phoneField: "phone",
    contactTextField: null,
    slaKey: "resources",
  },
  {
    // No url field: these can never be confirmed automatically. They are
    // listed in the report as "not confirmed" and their date is left alone.
    displayPath: "web/src/data/docs.ts",
    absPath: path.join(ROOT, "web/src/data/docs.ts"),
    nameField: "label",
    urlField: null,
    phoneField: null,
    contactTextField: null,
    slaKey: "documents",
  },
];

// ── Helpers ──────────────────────────────────────────────────────────────────

function daysSince(dateStr: string): number {
  const d = new Date(dateStr + "T00:00:00Z");
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Find `field: "value"` inside a block; returns value + absolute offsets. */
function findField(
  block: string,
  blockOffset: number,
  field: string
): { value: string; span: Span } | null {
  const m = new RegExp(`\\b${escapeRegex(field)}:\\s*"([^"\\\\\\n]*)"`).exec(block);
  if (!m) return null;
  const start = blockOffset + m.index + m[0].length - 1 - m[1]!.length;
  return { value: m[1]!, span: { start, end: start + m[1]!.length } };
}

function extractEntries(content: string, file: DataFile): Entry[] {
  const entries: Entry[] = [];
  // Each object literal starts at a "{"; a block runs to the next "{".
  const starts: number[] = [];
  for (let i = content.indexOf("{"); i !== -1; i = content.indexOf("{", i + 1)) starts.push(i);

  for (let b = 0; b < starts.length; b++) {
    const offset = starts[b]!;
    const block = content.slice(offset, starts[b + 1] ?? content.length);

    const name = findField(block, offset, file.nameField);
    const date = findField(block, offset, "lastVerified");
    if (!name || !date) continue;

    const id = findField(block, offset, "id");
    const url = file.urlField ? findField(block, offset, file.urlField) : null;
    const phone = file.phoneField ? findField(block, offset, file.phoneField) : null;
    const contact = file.contactTextField
      ? findField(block, offset, file.contactTextField)
      : null;

    const phones: string[] = [];
    if (phone && phone.value.trim()) phones.push(phone.value.trim());
    if (contact) phones.push(...extractContactTokens(contact.value));

    entries.push({
      id: id ? id.value : name.value,
      name: name.value,
      url: url ? url.value : "",
      phones: [...new Set(phones)],
      lastVerified: date.value,
      urlSpan: url ? url.span : null,
      dateSpan: date.span,
    });
  }
  return entries;
}

// ── Phone number utilities ───────────────────────────────────────────────────

/** Optional separators allowed between the characters of a phone number. */
const SEP = "[\\s.\\-()/\\u2010-\\u2015\\u00b7]{0,3}";

const KEYPAD: Record<string, string> = {
  a: "2", b: "2", c: "2", d: "3", e: "3", f: "3", g: "4", h: "4", i: "4",
  j: "5", k: "5", l: "5", m: "6", n: "6", o: "6", p: "7", q: "7", r: "7",
  s: "7", t: "8", u: "8", v: "8", w: "9", x: "9", y: "9", z: "9",
};

/**
 * Pull phone numbers / short codes out of free text such as
 * "Call or text 988", "Text HOME to 741741" or "1-888-SOS-CHILD".
 */
function extractContactTokens(text: string): string[] {
  const re =
    /(?<![\w-])1-\d{3}-[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*|\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}|(?<![\w-])\d{3,6}(?![\w-])/g;
  return [...new Set(text.match(re) ?? [])];
}

/** Reduce HTML to searchable text; keeps tel: link targets. */
function pageToText(html: string): string {
  const tels = [...html.matchAll(/href\s*=\s*["']tel:([^"']+)["']/gi)].map((m) =>
    decodeURIComponentSafe(m[1]!)
  );
  const text = html
    .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;|&#160;|&#xa0;/gi, " ")
    .replace(/&#40;|&lpar;/gi, "(")
    .replace(/&#41;|&rpar;/gi, ")")
    .replace(/&#45;|&hyphen;|&dash;|&ndash;|&#8209;|&#8211;/gi, "-")
    .replace(/\s+/g, " ");
  return `${tels.join(" ")} ${text}`;
}

function decodeURIComponentSafe(s: string): string {
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
}

/**
 * Build regexes that match a stored number in page text. Matches must be
 * bounded by non-digits so "988" does not match inside "19880".
 */
function phonePatterns(phone: string): RegExp[] {
  const chars = phone.replace(/[^0-9A-Za-z]/g, "");
  if (chars.length < 3) return [];

  const build = (core: string, optionalOne: boolean): RegExp =>
    new RegExp(
      `(?<![0-9A-Za-z])${optionalOne ? `(?:\\+?1${SEP})?` : ""}` +
        core.split("").map(escapeRegex).join(SEP) +
        `(?![0-9A-Za-z])`,
      "i"
    );

  const forms = new Set<string>([chars]);
  if (/[A-Za-z]/.test(chars)) {
    // Vanity number: also accept its all-digit keypad form.
    // Vanity words often run past the real number, so keep 10 digits (+1).
    const digits = chars.toLowerCase().replace(/[a-z]/g, (c) => KEYPAD[c]!);
    forms.add(digits.startsWith("1") ? digits.slice(0, 11) : digits.slice(0, 10));
  }

  const patterns: RegExp[] = [];
  for (const form of forms) {
    const hasCountryCode = form.length >= 11 && form.startsWith("1");
    const core = hasCountryCode ? form.slice(1) : form;
    patterns.push(build(core, core.length >= 10));
  }
  return patterns;
}

function phoneFoundOnPage(phone: string, pageText: string): boolean {
  return phonePatterns(phone).some((re) => re.test(pageText));
}

/**
 * Collect phone-number-like strings from a page, for a human to look at.
 * These are shown in the report only — they are never written to data files.
 */
function scrapePhoneNumbers(pageText: string): string[] {
  const found = new Set<string>();
  const re = /(?<!\d)(?:\+?1[\s.-]?)?\(?(\d{3})\)?[\s.-]{0,2}(\d{3})[\s.-]{0,2}(\d{4})(?!\d)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(pageText)) !== null) {
    found.add(`(${m[1]}) ${m[2]}-${m[3]}`);
  }
  return [...found];
}

/** Page <title>, reduced to harmless characters (it goes into a PR body). */
function extractTitle(body: string): string | null {
  const match = body.match(/<title[^>]*>([^<]+)<\/title>/i);
  if (!match) return null;
  const clean = match[1]!.replace(/[^\w\s.,'&:()\-]/g, " ").replace(/\s+/g, " ").trim();
  return clean ? clean.slice(0, 80) : null;
}

/** Make scraped / external text safe to drop into a markdown table cell. */
function md(value: string): string {
  return value.replace(/[|`<>\r\n]/g, " ").replace(/@/g, "(at)").trim();
}

function mdCode(value: string): string {
  return "`" + value.replace(/[`|<>\r\n]/g, "").trim() + "`";
}

// ── HTTP fetcher with redirect tracking ──────────────────────────────────────

interface FetchResult {
  status: number;
  body: string;
  error: string | null;
  /** The final URL after all redirects */
  finalUrl: string;
  /** Whether any redirects were followed */
  redirected: boolean;
  /** True when every redirect hop was permanent (301/308) */
  permanent: boolean;
}

function fetchUrl(
  url: string,
  originalUrl?: string,
  redirectsLeft = 5,
  permanent = true
): Promise<FetchResult> {
  const startUrl = originalUrl || url;
  const base = { finalUrl: url, redirected: url !== startUrl, permanent };

  return new Promise((resolve) => {
    const protocol = url.startsWith("https") ? https : http;
    const timer = setTimeout(() => {
      resolve({ status: 0, body: "", error: `Timeout after ${TIMEOUT_MS}ms`, ...base });
    }, TIMEOUT_MS);

    try {
      const req = protocol.get(
        url,
        {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            Accept: "text/html,application/xhtml+xml,*/*",
            "Accept-Language": "en-US,en;q=0.9",
          },
          timeout: TIMEOUT_MS,
        },
        (res) => {
          const status = res.statusCode || 0;

          if ([301, 302, 303, 307, 308].includes(status) && res.headers.location && redirectsLeft > 0) {
            clearTimeout(timer);
            let redirectUrl: string;
            try {
              redirectUrl = new URL(res.headers.location, url).toString();
            } catch {
              res.resume();
              resolve({ status, body: "", error: "Invalid redirect location", ...base });
              return;
            }
            res.resume();
            resolve(
              fetchUrl(redirectUrl, startUrl, redirectsLeft - 1, permanent && (status === 301 || status === 308))
            );
            return;
          }

          const chunks: Buffer[] = [];
          let bodyLen = 0;
          res.on("data", (chunk: Buffer) => {
            if (bodyLen < MAX_BODY_BYTES) { chunks.push(chunk); bodyLen += chunk.length; }
          });
          res.on("end", () => {
            clearTimeout(timer);
            const body = Buffer.concat(chunks).toString("utf-8").slice(0, MAX_BODY_BYTES);
            resolve({ status, body, error: null, ...base });
          });
          res.on("error", (err) => {
            clearTimeout(timer);
            resolve({ status, body: "", error: err.message, ...base });
          });
        }
      );
      req.on("error", (err) => {
        clearTimeout(timer);
        resolve({ status: 0, body: "", error: err.message, ...base });
      });
      req.on("timeout", () => {
        clearTimeout(timer);
        req.destroy();
        resolve({ status: 0, body: "", error: `Timeout after ${TIMEOUT_MS}ms`, ...base });
      });
    } catch (err: unknown) {
      clearTimeout(timer);
      resolve({ status: 0, body: "", error: err instanceof Error ? err.message : String(err), ...base });
    }
  });
}

function isParkedDomain(body: string): boolean {
  const lower = body.toLowerCase();
  return PARKED_SIGNALS.some((signal) => lower.includes(signal));
}

/**
 * A redirect target may be written back to the data file only when it is a
 * permanent redirect to a plain https URL on the same host (ignoring "www.").
 * Returns null when safe, otherwise the reason it is not.
 */
function redirectUnsafeReason(fromUrl: string, toUrl: string, permanent: boolean): string | null {
  if (!permanent) return "redirect is temporary (302/303/307), not permanent";
  if (toUrl.length > MAX_URL_LENGTH) return "redirect target is unusually long";
  if (/["'\\`\s<>{}$]/.test(toUrl)) return "redirect target contains unsafe characters";
  let from: URL, to: URL;
  try {
    from = new URL(fromUrl);
    to = new URL(toUrl);
  } catch {
    return "redirect target is not a valid URL";
  }
  if (to.protocol !== "https:") return "redirect target is not https";
  if (to.username || to.password) return "redirect target contains credentials";
  const host = (u: URL) => u.hostname.toLowerCase().replace(/^www\./, "");
  if (host(from) !== host(to)) return `redirects to a different site (${host(to)})`;
  return null;
}

// ── Verify (read-only) ───────────────────────────────────────────────────────

async function verifyEntry(entry: Entry, file: DataFile): Promise<VerifyResult> {
  const base: VerifyResult = {
    entry, file, outcome: "unreachable", reason: "", httpStatus: null,
    resolvedUrl: null, redirectAutoFixable: false, redirectNote: null,
    phonesMissing: [], phoneCandidates: [], pageTitle: null,
  };

  // Nothing to fetch (e.g. docs.ts) — this script cannot confirm anything.
  if (!entry.url) {
    return {
      ...base, outcome: "no_url",
      reason: "Entry has no URL for this script to check — a person must verify it",
    };
  }

  const { status, body, error, finalUrl, redirected, permanent } = await fetchUrl(entry.url);
  const resolvedUrl = redirected && finalUrl !== entry.url ? finalUrl : null;

  if (error) {
    return { ...base, httpStatus: status, reason: `Could not load the page: ${error}` };
  }
  if (status >= 400 || status < 200) {
    return { ...base, httpStatus: status, resolvedUrl, reason: `Page returned HTTP ${status}` };
  }
  if (body.length < MIN_BODY_BYTES) {
    return { ...base, httpStatus: status, resolvedUrl, reason: `Page was nearly empty (${body.length} bytes)` };
  }
  if (isParkedDomain(body)) {
    return {
      ...base, httpStatus: status, resolvedUrl, pageTitle: extractTitle(body),
      reason: "Page looks like a parked or for-sale domain",
    };
  }

  // ── Page loaded. Work out what, if anything, that confirms. ─────────────
  const redirectNote = resolvedUrl ? redirectUnsafeReason(entry.url, resolvedUrl, permanent) : null;
  const live: VerifyResult = {
    ...base, httpStatus: status, resolvedUrl,
    redirectAutoFixable: resolvedUrl !== null && redirectNote === null,
    redirectNote, pageTitle: extractTitle(body),
  };
  const pageText = pageToText(body);

  if (entry.phones.length > 0) {
    const missing = entry.phones.filter((p) => !phoneFoundOnPage(p, pageText));

    if (missing.length === 0) {
      return {
        ...live, outcome: "confirmed",
        reason: `link reachable and stored number found on page (${entry.phones.join(", ")})`,
      };
    }

    const candidates = scrapePhoneNumbers(pageText).filter(
      (c) => !entry.phones.some((p) => phoneFoundOnPage(p, c))
    );
    return {
      ...live, phonesMissing: missing, phoneCandidates: candidates,
      outcome: candidates.length > 0 ? "phone_mismatch" : "phone_not_found",
      reason: candidates.length > 0
        ? `link reachable, but stored number ${missing.join(", ")} was NOT found on page; other number(s) were`
        : `link reachable, but stored number ${missing.join(", ")} was NOT found on page (no phone numbers detected)`,
    };
  }

  // No phone number on this entry: a clean load is all we can confirm.
  if (resolvedUrl) {
    return {
      ...live, outcome: "redirected",
      reason: "link reachable but it redirected; entry has no phone number to confirm against",
    };
  }
  return {
    ...live, outcome: "confirmed",
    reason: "link reachable with no redirect (entry has no phone number to check)",
  };
}

// ── Batch processing ─────────────────────────────────────────────────────────

async function verifyInBatches(
  items: { entry: Entry; file: DataFile }[]
): Promise<VerifyResult[]> {
  const results: VerifyResult[] = [];
  for (let i = 0; i < items.length; i += MAX_CONCURRENT) {
    const batch = items.slice(i, i + MAX_CONCURRENT);
    const batchResults = await Promise.all(
      batch.map(({ entry, file }) => verifyEntry(entry, file))
    );
    results.push(...batchResults);
    const done = Math.min(i + MAX_CONCURRENT, items.length);
    process.stdout.write(`\r   Progress: ${done}/${items.length} checked`);
  }
  console.log();
  return results;
}

// ── File update engine ───────────────────────────────────────────────────────
//
// Writes ONLY: (a) lastVerified for "confirmed" entries, and (b) url for safe
// same-host permanent redirects. There is deliberately no code path here that
// writes a phone number.

function planUpdates(results: VerifyResult[]): FileUpdate[] {
  const updates: FileUpdate[] = [];
  for (const r of results) {
    if (r.outcome === "confirmed") {
      updates.push({
        displayPath: r.file.displayPath, entryId: r.entry.id, entryName: r.entry.name,
        field: "lastVerified", oldValue: r.entry.lastVerified, newValue: TODAY,
        reason: r.reason,
      });
    }
    if (r.redirectAutoFixable && r.resolvedUrl && r.file.urlField && r.entry.urlSpan) {
      updates.push({
        displayPath: r.file.displayPath, entryId: r.entry.id, entryName: r.entry.name,
        field: r.file.urlField, oldValue: r.entry.url, newValue: r.resolvedUrl,
        reason: "Permanent redirect to the same site",
      });
    }
  }
  return updates;
}

function writeUpdates(
  results: VerifyResult[],
  sources: Map<string, string>
): string[] {
  const errors: string[] = [];
  const edits = new Map<string, { span: Span; expect: string; value: string }[]>();
  const add = (file: DataFile, span: Span, expect: string, value: string) => {
    if (!edits.has(file.absPath)) edits.set(file.absPath, []);
    edits.get(file.absPath)!.push({ span, expect, value });
  };

  for (const r of results) {
    if (r.outcome === "confirmed") add(r.file, r.entry.dateSpan, r.entry.lastVerified, TODAY);
    if (r.redirectAutoFixable && r.resolvedUrl && r.entry.urlSpan) {
      add(r.file, r.entry.urlSpan, r.entry.url, r.resolvedUrl);
    }
  }

  for (const [absPath, fileEdits] of edits) {
    const original = sources.get(absPath)!;
    if (fs.readFileSync(absPath, "utf-8") !== original) {
      errors.push(`${absPath} changed while the check was running — no updates written to it`);
      continue;
    }
    let content = original;
    // Apply from the end of the file backwards so earlier offsets stay valid.
    for (const e of fileEdits.sort((a, b) => b.span.start - a.span.start)) {
      if (content.slice(e.span.start, e.span.end) !== e.expect) {
        errors.push(`Unexpected text at offset ${e.span.start} in ${absPath} — edit skipped`);
        continue;
      }
      content = content.slice(0, e.span.start) + e.value + content.slice(e.span.end);
    }
    if (content !== original) fs.writeFileSync(absPath, content, "utf-8");
  }
  return errors;
}

// ── Report generator ─────────────────────────────────────────────────────────

function generateReport(results: VerifyResult[], updates: FileUpdate[]): string {
  const lines: string[] = [];
  const by = (o: Outcome) => results.filter((r) => r.outcome === o);
  const confirmed = by("confirmed");
  const phoneReview = by("phone_mismatch");
  const notConfirmed = results.filter(
    (r) => r.outcome !== "confirmed" && r.outcome !== "phone_mismatch"
  );
  const urlFixes = updates.filter((u) => u.field !== "lastVerified");
  const redirectsLeft = results.filter((r) => r.resolvedUrl && !r.redirectAutoFixable);
  const willOrDid = APPLY ? "" : " (not applied in this mode)";

  lines.push(`# Content Re-verification Report`);
  lines.push(``);
  lines.push(`> **Generated:** ${TODAY}  `);
  lines.push(`> **Mode:** ${MODE_LABEL}  `);
  lines.push(`> **Stale entries checked:** ${results.length}`);
  lines.push(``);
  lines.push(
    `This is an automated check. It loads each entry's web page and looks for the ` +
      `phone number we have stored. Nobody called any number. The script never ` +
      `changes a phone number, and it only updates \`lastVerified\` for entries in ` +
      `the "Confirmed" section below.`
  );
  lines.push(``);
  lines.push(`## Summary`);
  lines.push(``);
  lines.push(`| Result | Count |`);
  lines.push(`|:---|:---|`);
  lines.push(`| Confirmed (\`lastVerified\` updated${willOrDid}) | ${confirmed.length} |`);
  lines.push(`| Needs human review: possible phone number change | ${phoneReview.length} |`);
  lines.push(`| Not confirmed (\`lastVerified\` left unchanged) | ${notConfirmed.length} |`);
  lines.push(`| URL redirects auto-corrected${willOrDid} | ${urlFixes.length} |`);
  lines.push(`| URL redirects needing human review | ${redirectsLeft.length} |`);
  lines.push(``);

  // ── Possible phone changes ──────────────────────────────────────────────
  lines.push(`## Needs human review: possible phone number change`);
  lines.push(``);
  if (phoneReview.length === 0) {
    lines.push(`None.`);
  } else {
    lines.push(
      `The stored number was **not** found on the page, and other numbers were. ` +
        `Nothing was changed. Call or check the organization before editing the ` +
        `data file — a number found on a page may be a fax line, another office, ` +
        `or an unrelated business.`
    );
    lines.push(``);
    lines.push(`| Entry id | Name | Stored number | Number(s) found on page | Source URL | File |`);
    lines.push(`|:---|:---|:---|:---|:---|:---|`);
    for (const r of phoneReview) {
      const shown = r.phoneCandidates.slice(0, MAX_CANDIDATES_SHOWN).join(", ");
      const more = r.phoneCandidates.length > MAX_CANDIDATES_SHOWN
        ? ` (+${r.phoneCandidates.length - MAX_CANDIDATES_SHOWN} more)`
        : "";
      lines.push(
        `| ${mdCode(r.entry.id)} | ${md(r.entry.name)} | ${md(r.phonesMissing.join(", "))} | ` +
          `${shown}${more} | ${mdCode(r.resolvedUrl ?? r.entry.url)} | \`${r.file.displayPath}\` |`
      );
    }
  }
  lines.push(``);

  // ── Not confirmed ───────────────────────────────────────────────────────
  lines.push(`## Not confirmed (lastVerified left unchanged)`);
  lines.push(``);
  if (notConfirmed.length === 0) {
    lines.push(`None.`);
  } else {
    lines.push(`A person needs to check each of these, fix the data file if needed, and set \`lastVerified\` by hand.`);
    lines.push(``);
    lines.push(`| Entry id | Name | Stored number | URL | Why it was not confirmed | Last verified | File |`);
    lines.push(`|:---|:---|:---|:---|:---|:---|:---|`);
    for (const r of notConfirmed) {
      const why = r.pageTitle ? `${r.reason} — page title: "${r.pageTitle}"` : r.reason;
      lines.push(
        `| ${mdCode(r.entry.id)} | ${md(r.entry.name)} | ${md(r.entry.phones.join(", ")) || "—"} | ` +
          `${r.entry.url ? mdCode(r.entry.url) : "—"} | ${md(why)} | ${md(r.entry.lastVerified)} | \`${r.file.displayPath}\` |`
      );
    }
  }
  lines.push(``);

  // ── Redirects ───────────────────────────────────────────────────────────
  lines.push(`## URL redirects auto-corrected${willOrDid}`);
  lines.push(``);
  if (urlFixes.length === 0) {
    lines.push(`None.`);
  } else {
    lines.push(`Only permanent (301/308) redirects to an https URL on the same site are changed. Please open each new URL once before merging.`);
    lines.push(``);
    lines.push(`| Entry id | Name | Old URL | New URL | File |`);
    lines.push(`|:---|:---|:---|:---|:---|`);
    for (const u of urlFixes) {
      lines.push(
        `| ${mdCode(u.entryId)} | ${md(u.entryName)} | ${mdCode(u.oldValue)} | ${mdCode(u.newValue)} | \`${u.displayPath}\` |`
      );
    }
  }
  lines.push(``);

  if (redirectsLeft.length > 0) {
    lines.push(`## URL redirects needing human review (not changed)`);
    lines.push(``);
    lines.push(`| Entry id | Name | Stored URL | Redirects to | Why it was not auto-corrected | File |`);
    lines.push(`|:---|:---|:---|:---|:---|:---|`);
    for (const r of redirectsLeft) {
      lines.push(
        `| ${mdCode(r.entry.id)} | ${md(r.entry.name)} | ${mdCode(r.entry.url)} | ${mdCode(r.resolvedUrl!)} | ` +
          `${md(r.redirectNote ?? "page did not load cleanly")} | \`${r.file.displayPath}\` |`
      );
    }
    lines.push(``);
  }

  // ── Confirmed ───────────────────────────────────────────────────────────
  lines.push(`## Confirmed`);
  lines.push(``);
  if (confirmed.length === 0) {
    lines.push(`None.`);
  } else {
    lines.push(`| Entry id | Name | What was confirmed | File |`);
    lines.push(`|:---|:---|:---|:---|`);
    for (const r of confirmed) {
      lines.push(
        `| ${mdCode(r.entry.id)} | ${md(r.entry.name)} | ${md(r.reason)} | \`${r.file.displayPath}\` |`
      );
    }
  }
  lines.push(``);

  lines.push(`---`);
  lines.push(``);
  lines.push(`*Generated by \`scripts/reverify-content.ts\`. To clear an unconfirmed entry, verify it yourself, update the data file, and set \`lastVerified\` to today's date.*`);
  lines.push(``);

  return lines.join("\n");
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  console.log(`\nFosterHub AZ — Automated Content Re-verification`);
  console.log(`   Date: ${TODAY}`);
  console.log(`   Mode: ${MODE_LABEL}`);
  console.log(`   Phone numbers are never changed by this script.\n`);

  // ── Collect stale entries ───────────────────────────────────────────────
  let staleItems: { entry: Entry; file: DataFile }[] = [];
  const sources = new Map<string, string>();

  for (const file of DATA_FILES) {
    if (!fs.existsSync(file.absPath)) {
      console.log(`   WARNING: file not found: ${file.displayPath}`);
      continue;
    }
    const content = fs.readFileSync(file.absPath, "utf-8");
    sources.set(file.absPath, content);
    const entries = extractEntries(content, file);
    const sla = SLA[file.slaKey] || 30;

    for (const entry of entries) {
      if (daysSince(entry.lastVerified) > sla) {
        staleItems.push({ entry, file });
      }
    }
  }

  if (staleItems.length === 0) {
    console.log("No stale entries found — all content is within SLA.\n");
    process.exit(0);
  }

  if (staleItems.length > LIMIT) {
    console.log(`   --limit ${LIMIT}: checking the first ${LIMIT} of ${staleItems.length} stale entries`);
    staleItems = staleItems.slice(0, LIMIT);
  }

  console.log(`Found ${staleItems.length} stale entries to check:\n`);
  for (const { entry, file } of staleItems) {
    console.log(`   - ${entry.name} (${daysSince(entry.lastVerified)}d old) — ${file.displayPath}`);
  }

  // ── Verify ──────────────────────────────────────────────────────────────
  console.log(`\n   Checking ${staleItems.length} entries (max ${MAX_CONCURRENT} concurrent)...\n`);
  const results = await verifyInBatches(staleItems);

  const confirmed = results.filter((r) => r.outcome === "confirmed");
  const phoneReview = results.filter((r) => r.outcome === "phone_mismatch");
  const notConfirmed = results.filter(
    (r) => r.outcome !== "confirmed" && r.outcome !== "phone_mismatch"
  );

  // ── Console report ──────────────────────────────────────────────────────
  console.log();
  if (confirmed.length > 0) {
    console.log(`   CONFIRMED (${confirmed.length}):\n`);
    for (const r of confirmed) console.log(`      [ok] ${r.entry.name}\n           ${r.reason}`);
    console.log();
  }
  if (phoneReview.length > 0) {
    console.log(`   NEEDS HUMAN REVIEW — possible phone number change (${phoneReview.length}):\n`);
    for (const r of phoneReview) {
      console.log(`      [review] ${r.entry.name}`);
      console.log(`           stored: ${r.phonesMissing.join(", ")}`);
      console.log(`           found on page: ${r.phoneCandidates.slice(0, MAX_CANDIDATES_SHOWN).join(", ")}`);
      console.log(`           source: ${r.resolvedUrl ?? r.entry.url}`);
    }
    console.log();
  }
  if (notConfirmed.length > 0) {
    console.log(`   NOT CONFIRMED (${notConfirmed.length}) — lastVerified left unchanged:\n`);
    for (const r of notConfirmed) console.log(`      [not confirmed] ${r.entry.name}\n           ${r.reason}`);
    console.log();
  }

  // ── Apply updates ───────────────────────────────────────────────────────
  const updates = planUpdates(results);
  const dateUpdates = updates.filter((u) => u.field === "lastVerified");
  const urlUpdates = updates.filter((u) => u.field !== "lastVerified");

  for (const u of urlUpdates) {
    console.log(`   URL redirect${APPLY ? "" : " (would be corrected with --apply)"}: ${u.entryName}: "${u.oldValue}" -> "${u.newValue}"`);
  }

  if (APPLY) {
    const errors = writeUpdates(results, sources);
    console.log(`   lastVerified dates updated: ${dateUpdates.length}`);
    console.log(`   URLs updated (redirects):   ${urlUpdates.length}`);
    if (errors.length > 0) {
      console.log(`\n   Update errors:`);
      for (const e of errors) console.log(`      ${e}`);
    }
  } else {
    console.log(`   Nothing was changed in the data files (${MODE_LABEL}).`);
  }

  // ── Write report ────────────────────────────────────────────────────────
  const report = generateReport(results, updates);
  if (DRY_RUN) {
    console.log(`\n--- Report (dry run — not written to disk) ---\n`);
    console.log(report);
  } else {
    const reportDir = path.resolve(ROOT, "docs");
    if (!fs.existsSync(reportDir)) fs.mkdirSync(reportDir, { recursive: true });
    fs.writeFileSync(path.join(reportDir, "reverification-report.md"), report, "utf-8");
    console.log(`\nReport written to: docs/reverification-report.md`);
  }

  // ── Summary ─────────────────────────────────────────────────────────────
  console.log(`\n--- Summary ---`);
  console.log(`   Stale entries checked:          ${results.length}`);
  console.log(`   Confirmed:                      ${confirmed.length}`);
  console.log(`   Possible phone number change:   ${phoneReview.length}`);
  console.log(`   Not confirmed:                  ${notConfirmed.length}`);
  console.log(`   URL redirects auto-corrected:   ${APPLY ? urlUpdates.length : 0}`);
  console.log();

  if (phoneReview.length + notConfirmed.length > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(2);
});
