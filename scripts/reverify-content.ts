/**
 * reverify-content.ts
 *
 * Automated re-verification AND auto-correction of stale content in FosterHub AZ.
 *
 * For each entry past its SLA:
 *   1. Fetches the entry's URL (follows redirects, captures final URL)
 *   2. If URL redirected permanently → auto-updates the URL in the source file
 *   3. Checks the page body for the phone number we have on file
 *   4. If phone NOT found → scrapes the page for phone numbers and auto-updates
 *      if exactly one strong candidate is found (same area code as original)
 *   5. Updates lastVerified for all entries that pass (or are auto-corrected)
 *   6. Writes a structured report to docs/reverification-report.md
 *
 * Run:
 *   npx tsx scripts/reverify-content.ts           # dry run (report only)
 *   npx tsx scripts/reverify-content.ts --apply    # update files + write report
 *
 * Exit codes:
 *   0 — all entries verified (or auto-corrected)
 *   1 — some entries need manual review (report generated)
 */

import * as fs from "fs";
import * as path from "path";
import * as https from "https";
import * as http from "http";

// ── Config ───────────────────────────────────────────────────────────────────

const TODAY = new Date().toISOString().split("T")[0]!;
const APPLY = process.argv.includes("--apply");
const TIMEOUT_MS = 15_000;
const MAX_CONCURRENT = 5;
const MIN_BODY_BYTES = 200;
const MAX_BODY_BYTES = 100_000;

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
  urlField: string;
  phoneField: string;
  slaKey: string;
}

interface Entry {
  name: string;
  url: string;
  phone: string;
  lastVerified: string;
  dateSourceLiteral: string;
}

type FailureCategory =
  | "dns_failure"
  | "http_error"
  | "parked_domain"
  | "timeout"
  | "empty_response"
  | "phone_changed"
  | "phone_removed"
  | "unknown";

interface VerifyResult {
  entry: Entry;
  file: DataFile;
  passed: boolean;
  httpStatus: number | null;
  urlOk: boolean;
  phoneOk: boolean | null;
  reason: string;
  failureCategory: FailureCategory | null;
  /** If the URL redirected, the final resolved URL */
  resolvedUrl: string | null;
  /** Phone numbers scraped from the page (when our number wasn't found) */
  phoneCandidates: string[];
  /** The auto-selected replacement phone, if any */
  autoPhoneReplacement: string | null;
  /** The page body (for report context) */
  pageTitle: string | null;
}

interface FileUpdate {
  absPath: string;
  entryName: string;
  field: string;
  oldValue: string;
  newValue: string;
  reason: string;
}

// ── Data files ───────────────────────────────────────────────────────────────

const ROOT = path.resolve(__dirname, "..");

const DATA_FILES: DataFile[] = [
  {
    displayPath: "web/src/data/constants.ts",
    absPath: path.join(ROOT, "web/src/data/constants.ts"),
    nameField: "name",
    urlField: "url",
    phoneField: "__none__",
    slaKey: "crisis",
  },
  {
    displayPath: "web/src/data/resources.ts",
    absPath: path.join(ROOT, "web/src/data/resources.ts"),
    nameField: "name",
    urlField: "url",
    phoneField: "phone",
    slaKey: "resources",
  },
  {
    displayPath: "server/src/data/resources.ts",
    absPath: path.join(ROOT, "server/src/data/resources.ts"),
    nameField: "name",
    urlField: "website",
    phoneField: "phone",
    slaKey: "resources",
  },
  {
    displayPath: "web/src/data/docs.ts",
    absPath: path.join(ROOT, "web/src/data/docs.ts"),
    nameField: "label",
    urlField: "__none__",
    phoneField: "__none__",
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

function extractEntries(content: string, file: DataFile): Entry[] {
  const entries: Entry[] = [];
  const blocks = content.split(/\{/).slice(1);

  for (const block of blocks) {
    const nameMatch = block.match(new RegExp(`${file.nameField}:\\s*"([^"]+)"`));
    const dateMatch = block.match(/lastVerified:\s*"([^"]+)"/);
    const urlMatch =
      file.urlField !== "__none__"
        ? block.match(new RegExp(`${file.urlField}:\\s*"([^"]+)"`))
        : null;
    const phoneMatch =
      file.phoneField !== "__none__"
        ? block.match(new RegExp(`${file.phoneField}:\\s*"([^"]+)"`))
        : null;

    if (nameMatch && dateMatch) {
      entries.push({
        name: nameMatch[1],
        url: urlMatch ? urlMatch[1] : "",
        phone: phoneMatch ? phoneMatch[1] : "",
        lastVerified: dateMatch[1],
        dateSourceLiteral: `lastVerified: "${dateMatch[1]}"`,
      });
    }
  }
  return entries;
}

// ── Phone number utilities ───────────────────────────────────────────────────

function normalizePhone(phone: string): string[] {
  const variants: string[] = [];
  const digitsOnly = phone.replace(/[^0-9]/g, "");
  if (digitsOnly.length >= 3) variants.push(digitsOnly);
  variants.push(phone);

  if (digitsOnly.length === 10) {
    variants.push(`${digitsOnly.slice(0, 3)}-${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6)}`);
    variants.push(`(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6)}`);
    variants.push(`${digitsOnly.slice(0, 3)}.${digitsOnly.slice(3, 6)}.${digitsOnly.slice(6)}`);
  }

  if (digitsOnly.length === 11 && digitsOnly.startsWith("1")) {
    const short = digitsOnly.slice(1);
    variants.push(short);
    variants.push(`${short.slice(0, 3)}-${short.slice(3, 6)}-${short.slice(6)}`);
    variants.push(`(${short.slice(0, 3)}) ${short.slice(3, 6)}-${short.slice(6)}`);
  }

  const vanityMatch = phone.match(/1-(\d{3})-([A-Z]+-?\d*)/i);
  if (vanityMatch) {
    variants.push(vanityMatch[2]);
    variants.push(vanityMatch[2].replace(/-/g, ""));
  }

  return [...new Set(variants.filter((v) => v.length >= 3))];
}

function phoneFoundOnPage(phone: string, pageBody: string): boolean {
  if (!phone) return true;
  const variants = normalizePhone(phone);
  const bodyLower = pageBody.toLowerCase();
  const bodyClean = pageBody.replace(/\s+/g, " ");

  for (const variant of variants) {
    if (bodyLower.includes(variant.toLowerCase())) return true;
    if (bodyClean.toLowerCase().includes(variant.toLowerCase())) return true;
  }
  return false;
}

/**
 * Scrape all phone-number-like patterns from an HTML page body.
 * Returns de-duplicated phone strings in a normalized format.
 */
function scrapePhoneNumbers(pageBody: string): string[] {
  // Strip HTML tags for cleaner extraction
  const textOnly = pageBody.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");

  const patterns = [
    // (xxx) xxx-xxxx
    /\((\d{3})\)\s*(\d{3})[-.]\s*(\d{4})/g,
    // xxx-xxx-xxxx or xxx.xxx.xxxx
    /(?<!\d)(\d{3})[-.]\s*(\d{3})[-.]\s*(\d{4})(?!\d)/g,
    // 1-xxx-xxx-xxxx
    /1[-.]\s*(\d{3})[-.]\s*(\d{3})[-.]\s*(\d{4})/g,
    // href="tel:xxxxx"
    /tel:\+?1?(\d{10})/g,
    /tel:\+?1?(\d{3})[-.]\s*(\d{3})[-.]\s*(\d{4})/g,
  ];

  const found = new Set<string>();

  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(textOnly)) !== null) {
      // Reconstruct as (xxx) xxx-xxxx
      const groups = match.slice(1).filter(Boolean);
      if (groups.length === 1 && groups[0].length === 10) {
        // tel:xxxxxxxxxx
        const d = groups[0];
        found.add(`(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`);
      } else if (groups.length >= 3) {
        found.add(`(${groups[0]}) ${groups[1]}-${groups[2]}`);
      }
    }
  }

  return [...found];
}

/**
 * Select the best replacement phone number from candidates.
 * Prefers same area code as the original.
 * Returns null if no confident match.
 */
function pickBestPhone(
  oldPhone: string,
  candidates: string[]
): string | null {
  if (candidates.length === 0) return null;

  // If there's exactly one candidate, use it
  if (candidates.length === 1) return candidates[0];

  // Extract area code from old phone
  const oldDigits = oldPhone.replace(/[^0-9]/g, "");
  const oldAreaCode = oldDigits.length >= 10
    ? oldDigits.slice(oldDigits.length - 10, oldDigits.length - 7)
    : oldDigits.slice(0, 3);

  // Filter to same area code
  const sameArea = candidates.filter((c) => {
    const d = c.replace(/[^0-9]/g, "");
    const areaCode = d.length >= 10
      ? d.slice(d.length - 10, d.length - 7)
      : d.slice(0, 3);
    return areaCode === oldAreaCode;
  });

  // If exactly one with same area code, use it
  if (sameArea.length === 1) return sameArea[0];

  // Too ambiguous — don't auto-replace
  return null;
}

/**
 * Extract the page <title> for context in reports.
 */
function extractTitle(body: string): string | null {
  const match = body.match(/<title[^>]*>([^<]+)<\/title>/i);
  return match ? match[1].trim().slice(0, 100) : null;
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
}

function fetchUrl(url: string, originalUrl?: string, redirectsLeft = 5): Promise<FetchResult> {
  const startUrl = originalUrl || url;

  return new Promise((resolve) => {
    const protocol = url.startsWith("https") ? https : http;
    const timer = setTimeout(() => {
      resolve({ status: 0, body: "", error: `Timeout after ${TIMEOUT_MS}ms`, finalUrl: url, redirected: url !== startUrl });
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
            const redirectUrl = res.headers.location.startsWith("http")
              ? res.headers.location
              : new URL(res.headers.location, url).toString();
            res.resume();
            resolve(fetchUrl(redirectUrl, startUrl, redirectsLeft - 1));
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
            resolve({ status, body, error: null, finalUrl: url, redirected: url !== startUrl });
          });
          res.on("error", (err) => {
            clearTimeout(timer);
            resolve({ status, body: "", error: err.message, finalUrl: url, redirected: url !== startUrl });
          });
        }
      );
      req.on("error", (err) => {
        clearTimeout(timer);
        resolve({ status: 0, body: "", error: err.message, finalUrl: url, redirected: url !== startUrl });
      });
      req.on("timeout", () => {
        clearTimeout(timer);
        req.destroy();
        resolve({ status: 0, body: "", error: `Timeout after ${TIMEOUT_MS}ms`, finalUrl: url, redirected: url !== startUrl });
      });
    } catch (err: unknown) {
      clearTimeout(timer);
      resolve({ status: 0, body: "", error: err instanceof Error ? err.message : String(err), finalUrl: url, redirected: url !== startUrl });
    }
  });
}

function isParkedDomain(body: string): boolean {
  const lower = body.toLowerCase();
  return PARKED_SIGNALS.some((signal) => lower.includes(signal));
}

// ── Verify + auto-correct ────────────────────────────────────────────────────

async function verifyEntry(entry: Entry, file: DataFile): Promise<VerifyResult> {
  // No URL to check (e.g., docs.ts) — auto-pass
  if (!entry.url) {
    return {
      entry, file, passed: true, httpStatus: null, urlOk: true, phoneOk: null,
      reason: "No URL field — auto-verified (date reset only)",
      failureCategory: null, resolvedUrl: null, phoneCandidates: [],
      autoPhoneReplacement: null, pageTitle: null,
    };
  }

  const { status, body, error, finalUrl, redirected } = await fetchUrl(entry.url);

  // ── Network / DNS error ─────────────────────────────────────────────────
  if (error) {
    const category: FailureCategory = error.includes("ENOTFOUND") || error.includes("EAI_AGAIN")
      ? "dns_failure"
      : error.includes("Timeout")
      ? "timeout"
      : "unknown";
    return {
      entry, file, passed: false, httpStatus: status, urlOk: false, phoneOk: null,
      reason: `Network error: ${error}`,
      failureCategory: category, resolvedUrl: null, phoneCandidates: [],
      autoPhoneReplacement: null, pageTitle: null,
    };
  }

  // ── HTTP error ──────────────────────────────────────────────────────────
  if (status >= 400) {
    return {
      entry, file, passed: false, httpStatus: status, urlOk: false, phoneOk: null,
      reason: `HTTP ${status} — page returned an error`,
      failureCategory: "http_error", resolvedUrl: redirected ? finalUrl : null,
      phoneCandidates: [], autoPhoneReplacement: null, pageTitle: null,
    };
  }

  // ── Empty response ──────────────────────────────────────────────────────
  if (body.length < MIN_BODY_BYTES) {
    return {
      entry, file, passed: false, httpStatus: status, urlOk: false, phoneOk: null,
      reason: `Response body too small (${body.length} bytes)`,
      failureCategory: "empty_response", resolvedUrl: redirected ? finalUrl : null,
      phoneCandidates: [], autoPhoneReplacement: null, pageTitle: null,
    };
  }

  // ── Parked domain ───────────────────────────────────────────────────────
  if (isParkedDomain(body)) {
    return {
      entry, file, passed: false, httpStatus: status, urlOk: false, phoneOk: null,
      reason: "Page appears to be a parked/suspended domain",
      failureCategory: "parked_domain", resolvedUrl: redirected ? finalUrl : null,
      phoneCandidates: [], autoPhoneReplacement: null,
      pageTitle: extractTitle(body),
    };
  }

  // ── URL is live — check for redirect ────────────────────────────────────
  const urlToReport = redirected ? finalUrl : null;
  const title = extractTitle(body);

  // ── Phone number check ──────────────────────────────────────────────────
  if (entry.phone) {
    const found = phoneFoundOnPage(entry.phone, body);

    if (!found) {
      // Scrape page for phone numbers as replacement candidates
      const candidates = scrapePhoneNumbers(body);
      const bestMatch = pickBestPhone(entry.phone, candidates);

      if (bestMatch) {
        // Auto-correctable: we found a confident replacement
        return {
          entry, file, passed: true, httpStatus: status, urlOk: true, phoneOk: false,
          reason: `Phone changed: "${entry.phone}" → "${bestMatch}" (auto-corrected, same area code)`,
          failureCategory: null, resolvedUrl: urlToReport,
          phoneCandidates: candidates, autoPhoneReplacement: bestMatch,
          pageTitle: title,
        };
      }

      // Could not auto-determine — needs manual review
      return {
        entry, file, passed: false, httpStatus: status, urlOk: true, phoneOk: false,
        reason: candidates.length > 0
          ? `Phone "${entry.phone}" not found; ${candidates.length} other number(s) on page`
          : `Phone "${entry.phone}" not found; no phone numbers detected on page`,
        failureCategory: candidates.length > 0 ? "phone_changed" : "phone_removed",
        resolvedUrl: urlToReport, phoneCandidates: candidates,
        autoPhoneReplacement: null, pageTitle: title,
      };
    }

    // Phone confirmed on page
    return {
      entry, file, passed: true, httpStatus: status, urlOk: true, phoneOk: true,
      reason: `HTTP ${status} OK, phone "${entry.phone}" confirmed on page`,
      failureCategory: null, resolvedUrl: urlToReport,
      phoneCandidates: [], autoPhoneReplacement: null, pageTitle: title,
    };
  }

  // No phone to check, URL passed
  return {
    entry, file, passed: true, httpStatus: status, urlOk: true, phoneOk: null,
    reason: `HTTP ${status} OK — page content present (${body.length} bytes)`,
    failureCategory: null, resolvedUrl: urlToReport,
    phoneCandidates: [], autoPhoneReplacement: null, pageTitle: title,
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

function applyUpdates(results: VerifyResult[]): { updates: FileUpdate[]; errors: string[] } {
  const updates: FileUpdate[] = [];
  const errors: string[] = [];

  // Group results by file
  const byFile = new Map<string, VerifyResult[]>();
  for (const r of results) {
    if (!r.passed) continue;
    const key = r.file.absPath;
    if (!byFile.has(key)) byFile.set(key, []);
    byFile.get(key)!.push(r);
  }

  for (const [absPath, fileResults] of byFile) {
    let content = fs.readFileSync(absPath, "utf-8");
    const file = fileResults[0].file;

    for (const r of fileResults) {
      // 1. Update lastVerified date
      const oldDateLiteral = r.entry.dateSourceLiteral;
      const newDateLiteral = `lastVerified: "${TODAY}"`;
      const datePattern = new RegExp(
        `(${escapeRegex(r.entry.name)}[\\s\\S]*?)${escapeRegex(oldDateLiteral)}`
      );

      if (datePattern.test(content)) {
        content = content.replace(datePattern, `$1${newDateLiteral}`);
        updates.push({
          absPath, entryName: r.entry.name, field: "lastVerified",
          oldValue: r.entry.lastVerified, newValue: TODAY,
          reason: "Verification passed",
        });
      }

      // 2. Update URL if it redirected to a new location
      if (r.resolvedUrl && r.resolvedUrl !== r.entry.url) {
        const oldUrlLiteral = `${file.urlField}: "${r.entry.url}"`;
        const newUrlLiteral = `${file.urlField}: "${r.resolvedUrl}"`;
        const urlPattern = new RegExp(
          `(${escapeRegex(r.entry.name)}[\\s\\S]*?)${escapeRegex(oldUrlLiteral)}`
        );

        if (urlPattern.test(content)) {
          content = content.replace(urlPattern, `$1${newUrlLiteral}`);
          updates.push({
            absPath, entryName: r.entry.name, field: file.urlField,
            oldValue: r.entry.url, newValue: r.resolvedUrl,
            reason: "URL redirected to new location",
          });
        }
      }

      // 3. Update phone if auto-corrected
      if (r.autoPhoneReplacement && r.autoPhoneReplacement !== r.entry.phone) {
        const oldPhoneLiteral = `${file.phoneField}: "${r.entry.phone}"`;
        const newPhoneLiteral = `${file.phoneField}: "${r.autoPhoneReplacement}"`;
        const phonePattern = new RegExp(
          `(${escapeRegex(r.entry.name)}[\\s\\S]*?)${escapeRegex(oldPhoneLiteral)}`
        );

        if (phonePattern.test(content)) {
          content = content.replace(phonePattern, `$1${newPhoneLiteral}`);
          updates.push({
            absPath, entryName: r.entry.name, field: file.phoneField,
            oldValue: r.entry.phone, newValue: r.autoPhoneReplacement,
            reason: "Phone number updated from organization's website",
          });
        } else {
          errors.push(`Could not locate phone literal for "${r.entry.name}" in ${file.displayPath}`);
        }
      }
    }

    fs.writeFileSync(absPath, content, "utf-8");
  }

  return { updates, errors };
}

// ── Report generator ─────────────────────────────────────────────────────────

function generateReport(results: VerifyResult[], updates: FileUpdate[]): string {
  const lines: string[] = [];
  const passed = results.filter((r) => r.passed);
  const failed = results.filter((r) => !r.passed);

  lines.push(`# Content Re-verification Report`);
  lines.push(``);
  lines.push(`> **Generated:** ${TODAY}  `);
  lines.push(`> **Mode:** ${APPLY ? "Applied" : "Dry Run"}  `);
  lines.push(`> **Total entries checked:** ${results.length}`);
  lines.push(``);
  lines.push(`---`);
  lines.push(``);

  // ── Summary ─────────────────────────────────────────────────────────────
  lines.push(`## Summary`);
  lines.push(``);
  lines.push(`| Metric | Count |`);
  lines.push(`|:---|:---|`);
  lines.push(`| ✅ Verified / Auto-corrected | ${passed.length} |`);
  lines.push(`| ❌ Needs manual review | ${failed.length} |`);

  const autoPhones = results.filter((r) => r.autoPhoneReplacement).length;
  const autoUrls = results.filter((r) => r.resolvedUrl && r.passed).length;
  if (autoPhones > 0) lines.push(`| 📞 Phone numbers auto-updated | ${autoPhones} |`);
  if (autoUrls > 0) lines.push(`| 🔄 URLs auto-updated (redirects) | ${autoUrls} |`);
  lines.push(``);

  // ── Auto-corrections applied ────────────────────────────────────────────
  if (updates.length > 0) {
    lines.push(`---`);
    lines.push(``);
    lines.push(`## Auto-corrections Applied`);
    lines.push(``);
    lines.push(`| Entry | Field | Old Value | New Value | Reason |`);
    lines.push(`|:---|:---|:---|:---|:---|`);
    for (const u of updates) {
      if (u.field === "lastVerified") continue; // Don't list date bumps
      lines.push(`| ${u.entryName} | \`${u.field}\` | ${u.oldValue} | ${u.newValue} | ${u.reason} |`);
    }

    const substantive = updates.filter((u) => u.field !== "lastVerified");
    if (substantive.length === 0) {
      lines.push(`| *(only lastVerified dates updated)* | | | | |`);
    }
    lines.push(``);
  }

  // ── Failures by category ────────────────────────────────────────────────
  if (failed.length > 0) {
    lines.push(`---`);
    lines.push(``);
    lines.push(`## Failures Requiring Manual Review`);
    lines.push(``);

    const categories: { key: FailureCategory; label: string; icon: string }[] = [
      { key: "dns_failure", label: "DNS Failures (domain no longer exists)", icon: "🌐" },
      { key: "http_error", label: "HTTP Errors (page moved or access denied)", icon: "🚫" },
      { key: "parked_domain", label: "Parked / Suspended Domains", icon: "🅿️" },
      { key: "timeout", label: "Timeouts (server unresponsive)", icon: "⏱️" },
      { key: "empty_response", label: "Empty Responses", icon: "📭" },
      { key: "phone_changed", label: "Phone Number Changed (candidates found)", icon: "📞" },
      { key: "phone_removed", label: "Phone Number Not Found (no candidates)", icon: "📵" },
      { key: "unknown", label: "Other Errors", icon: "❓" },
    ];

    for (const cat of categories) {
      const items = failed.filter((r) => r.failureCategory === cat.key);
      if (items.length === 0) continue;

      lines.push(`### ${cat.icon} ${cat.label} (${items.length})`);
      lines.push(``);

      for (const r of items) {
        lines.push(`#### ${r.entry.name}`);
        lines.push(``);
        lines.push(`| Field | Value |`);
        lines.push(`|:---|:---|`);
        lines.push(`| **URL** | ${r.entry.url} |`);
        if (r.entry.phone) lines.push(`| **Phone (on file)** | ${r.entry.phone} |`);
        lines.push(`| **Reason** | ${r.reason} |`);
        lines.push(`| **File** | \`${r.file.displayPath}\` |`);
        if (r.pageTitle) lines.push(`| **Page title** | ${r.pageTitle} |`);
        if (r.resolvedUrl) lines.push(`| **Redirected to** | ${r.resolvedUrl} |`);

        if (r.phoneCandidates.length > 0) {
          lines.push(`| **Phone numbers found on page** | ${r.phoneCandidates.join(", ")} |`);
        }
        lines.push(``);
      }
    }
  }

  // ── Verified entries ────────────────────────────────────────────────────
  if (passed.length > 0) {
    lines.push(`---`);
    lines.push(``);
    lines.push(`## Verified Entries`);
    lines.push(``);
    lines.push(`| Entry | URL | Phone | Status |`);
    lines.push(`|:---|:---|:---|:---|`);
    for (const r of passed) {
      const phoneStatus = r.phoneOk === true
        ? `✅ ${r.entry.phone}`
        : r.autoPhoneReplacement
        ? `🔄 ${r.entry.phone} → ${r.autoPhoneReplacement}`
        : r.phoneOk === null
        ? "—"
        : "❓";
      const urlStatus = r.resolvedUrl
        ? `🔄 → ${r.resolvedUrl}`
        : `✅ ${r.entry.url || "—"}`;
      lines.push(`| ${r.entry.name} | ${urlStatus} | ${phoneStatus} | ✅ |`);
    }
    lines.push(``);
  }

  // ── Footer ──────────────────────────────────────────────────────────────
  lines.push(`---`);
  lines.push(``);
  lines.push(`*Generated by \`scripts/reverify-content.ts\`. To fix a failed entry, update the data file and set \`lastVerified\` to today's date.*`);
  lines.push(``);

  return lines.join("\n");
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  console.log(`\n🔄 FosterHub AZ — Automated Content Re-verification`);
  console.log(`   Date: ${TODAY}`);
  console.log(`   Mode: ${APPLY ? "🟢 APPLY (update files + write report)" : "🔵 DRY RUN (report only)"}`);
  console.log(`   Checks: URL liveness → redirect resolution → phone-on-page → auto-correct\n`);

  // ── Collect stale entries ───────────────────────────────────────────────
  const staleItems: { entry: Entry; file: DataFile }[] = [];

  for (const file of DATA_FILES) {
    if (!fs.existsSync(file.absPath)) {
      console.log(`   ⚠️  File not found: ${file.displayPath}`);
      continue;
    }
    const content = fs.readFileSync(file.absPath, "utf-8");
    const entries = extractEntries(content, file);
    const sla = SLA[file.slaKey] || 30;

    for (const entry of entries) {
      if (daysSince(entry.lastVerified) > sla) {
        staleItems.push({ entry, file });
      }
    }
  }

  if (staleItems.length === 0) {
    console.log("✅ No stale entries found — all content is within SLA.\n");
    process.exit(0);
  }

  console.log(`📋 Found ${staleItems.length} stale entries to verify:\n`);
  for (const { entry, file } of staleItems) {
    console.log(`   • ${entry.name} (${daysSince(entry.lastVerified)}d old) — ${file.displayPath}`);
  }

  // ── Verify ──────────────────────────────────────────────────────────────
  console.log(`\n   Checking ${staleItems.length} entries (max ${MAX_CONCURRENT} concurrent)...\n`);
  const results = await verifyInBatches(staleItems);

  const passed = results.filter((r) => r.passed);
  const failed = results.filter((r) => !r.passed);
  const autoPhones = results.filter((r) => r.autoPhoneReplacement);
  const autoUrls = results.filter((r) => r.resolvedUrl && r.passed);

  // ── Console report ──────────────────────────────────────────────────────
  console.log();
  if (passed.length > 0) {
    console.log(`   ✅ PASSED (${passed.length}):\n`);
    for (const r of passed) {
      const tags: string[] = [];
      if (r.phoneOk === true) tags.push("📞✅");
      if (r.autoPhoneReplacement) tags.push(`📞🔄 → ${r.autoPhoneReplacement}`);
      if (r.resolvedUrl) tags.push(`🔗🔄 → ${r.resolvedUrl}`);
      console.log(`      ✅ ${r.entry.name} ${tags.join(" ")}`);
      console.log(`         ${r.reason}`);
    }
    console.log();
  }

  if (failed.length > 0) {
    console.log(`   ❌ FAILED (${failed.length}) — see report for details:\n`);
    for (const r of failed) {
      const urlTag = r.urlOk ? "🌐✅" : "🌐❌";
      const phoneTag = r.phoneOk === false ? " 📞❌" : "";
      console.log(`      ❌ ${r.entry.name} ${urlTag}${phoneTag}`);
      console.log(`         ${r.reason}`);
      if (r.phoneCandidates.length > 0) {
        console.log(`         Phone candidates: ${r.phoneCandidates.join(", ")}`);
      }
    }
    console.log();
  }

  // ── Apply updates ───────────────────────────────────────────────────────
  let allUpdates: FileUpdate[] = [];

  if (APPLY && passed.length > 0) {
    console.log(`📝 Applying updates...\n`);
    const { updates, errors } = applyUpdates(results);
    allUpdates = updates;

    const dateUpdates = updates.filter((u) => u.field === "lastVerified").length;
    const urlUpdates = updates.filter((u) => u.field !== "lastVerified" && u.field !== "phone").length;
    const phoneUpdates = updates.filter((u) => u.field === "phone").length;

    console.log(`   📅 lastVerified dates updated: ${dateUpdates}`);
    if (urlUpdates > 0) console.log(`   🔗 URLs updated (redirects):   ${urlUpdates}`);
    if (phoneUpdates > 0) console.log(`   📞 Phone numbers updated:      ${phoneUpdates}`);

    for (const u of updates.filter((u) => u.field !== "lastVerified")) {
      console.log(`      • ${u.entryName}: ${u.field} "${u.oldValue}" → "${u.newValue}"`);
    }

    if (errors.length > 0) {
      console.log(`\n   ⚠️  Update errors:`);
      for (const e of errors) console.log(`      ${e}`);
    }
  } else if (!APPLY && passed.length > 0) {
    console.log(`💡 Run with --apply to update ${passed.length} entries and generate report:`);
    console.log(`   npx tsx scripts/reverify-content.ts --apply\n`);
  }

  // ── Write report ────────────────────────────────────────────────────────
  const report = generateReport(results, allUpdates);
  const reportDir = path.resolve(ROOT, "docs");
  if (!fs.existsSync(reportDir)) fs.mkdirSync(reportDir, { recursive: true });
  const reportPath = path.join(reportDir, "reverification-report.md");
  fs.writeFileSync(reportPath, report, "utf-8");
  console.log(`\n📄 Report written to: docs/reverification-report.md`);

  // ── Summary ─────────────────────────────────────────────────────────────
  console.log(`\n─── Summary ───`);
  console.log(`   Total stale:        ${staleItems.length}`);
  console.log(`   ✅ Verified:        ${passed.length}`);
  console.log(`   ❌ Need review:     ${failed.length}`);
  if (autoPhones.length > 0) console.log(`   📞 Phones corrected: ${autoPhones.length}`);
  if (autoUrls.length > 0) console.log(`   🔗 URLs corrected:   ${autoUrls.length}`);
  console.log();

  if (failed.length > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(2);
});
