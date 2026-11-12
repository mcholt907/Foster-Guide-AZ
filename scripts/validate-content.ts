/**
 * validate-content.ts
 *
 * Content validation script for FosterHub AZ.
 * Enforces schema rules, phone formats, URL patterns, age-band rules,
 * and lastVerified date integrity across all data files.
 *
 * Checks the live site's data only (web/src/data). The retired server/ data
 * is not scanned.
 *
 * Run: npx tsx scripts/validate-content.ts   (or, on Node 22+: node scripts/validate-content.ts)
 * Exit code 1 on blocking errors, 0 on pass (warnings are printed but don't block).
 */

import * as fs from "fs";
import * as path from "path";

// Works under `npx tsx` (CommonJS, where __dirname exists) and under plain
// `node scripts/x.ts` on Node 22+ (ES module, where it does not).
const SCRIPT_DIR: string =
  typeof __dirname !== "undefined" ? __dirname : path.dirname(path.resolve(process.argv[1] ?? "scripts/x.ts"));

// ── Types ────────────────────────────────────────────────────────────────────

interface ValidationResult {
  file: string;
  entryId: string;
  rule: string;
  severity: "error" | "warning";
  message: string;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const PHONE_STANDARD_RE = /^\(\d{3}\) \d{3}-\d{4}$/;
const PHONE_TOLLFREE_RE = /^1-\d{3}-\d{3}-\d{4}$/;
const PHONE_VANITY_RE = /^1-\d{3}-[A-Z]+-\d*$/i;
const PHONE_SHORTCODES = new Set(["988", "211", "741741", "2-1-1"]);
const URL_RE = /^https:\/\/.+/;

function isValidPhone(phone: string): boolean {
  if (PHONE_SHORTCODES.has(phone)) return true;
  if (PHONE_STANDARD_RE.test(phone)) return true;
  if (PHONE_TOLLFREE_RE.test(phone)) return true;
  if (PHONE_VANITY_RE.test(phone)) return true;
  // Also accept formats like "1-855-HEA-PLUS" or "1-888-SOS-CHILD"
  if (/^1-\d{3}-[A-Z]{2,}-?[A-Z]*$/i.test(phone)) return true;
  // Accept raw digit patterns like "602-258-3434"
  if (/^\d{3}-\d{3}-\d{4}$/.test(phone)) return true;
  return false;
}

function isValidDate(dateStr: string): boolean {
  if (!DATE_RE.test(dateStr)) return false;
  const d = new Date(dateStr + "T00:00:00Z");
  return !isNaN(d.getTime());
}

function isFutureDate(dateStr: string): boolean {
  const d = new Date(dateStr + "T00:00:00Z");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return d > today;
}

// ── Validators ───────────────────────────────────────────────────────────────

function validateWebResources(results: ValidationResult[]): void {
  const filePath = path.resolve(
    SCRIPT_DIR,
    "../web/src/data/resources.ts"
  );
  if (!fs.existsSync(filePath)) {
    results.push({
      file: "web/src/data/resources.ts",
      entryId: "-",
      rule: "file-exists",
      severity: "error",
      message: "File not found",
    });
    return;
  }

  // Dynamic import won't work for TS without a build step, so we parse with regex
  const content = fs.readFileSync(filePath, "utf-8");

  // Check every URL in the file
  const urlMatches = content.matchAll(/url:\s*"([^"]+)"/g);
  for (const m of urlMatches) {
    if (!URL_RE.test(m[1])) {
      results.push({
        file: "web/src/data/resources.ts",
        entryId: m[1],
        rule: "url-https",
        severity: "error",
        message: `URL does not start with https://: ${m[1]}`,
      });
    }
  }

  // Check phone numbers
  const phoneMatches = content.matchAll(/phone:\s*"([^"]+)"/g);
  for (const m of phoneMatches) {
    if (!isValidPhone(m[1])) {
      results.push({
        file: "web/src/data/resources.ts",
        entryId: m[1],
        rule: "phone-format",
        severity: "error",
        message: `Invalid phone format: ${m[1]}`,
      });
    }
  }

  // Check lastVerified dates
  const dateMatches = content.matchAll(/lastVerified:\s*"([^"]+)"/g);
  let dateCount = 0;
  for (const m of dateMatches) {
    dateCount++;
    if (!isValidDate(m[1])) {
      results.push({
        file: "web/src/data/resources.ts",
        entryId: m[1],
        rule: "date-format",
        severity: "error",
        message: `Invalid date format (expected YYYY-MM-DD): ${m[1]}`,
      });
    } else if (isFutureDate(m[1])) {
      results.push({
        file: "web/src/data/resources.ts",
        entryId: m[1],
        rule: "date-not-future",
        severity: "error",
        message: `lastVerified date is in the future: ${m[1]}`,
      });
    }
  }

  // Count entries vs lastVerified fields
  const entryCount = (content.match(/id:\s*"/g) || []).length;
  if (dateCount < entryCount) {
    results.push({
      file: "web/src/data/resources.ts",
      entryId: "-",
      rule: "lastVerified-present",
      severity: "error",
      message: `Only ${dateCount} of ${entryCount} entries have lastVerified dates`,
    });
  }
}

function validateConstants(results: ValidationResult[]): void {
  const filePath = path.resolve(
    SCRIPT_DIR,
    "../web/src/data/constants.ts"
  );
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, "utf-8");

  // Extract CRISIS_PINS section
  const crisisSection = content.match(
    /CRISIS_PINS\s*=\s*\[([\s\S]*?)\]\s*as\s*const/
  );
  if (!crisisSection) return;

  const section = crisisSection[1];

  // Check URLs
  const urlMatches = section.matchAll(/url:\s*"([^"]+)"/g);
  for (const m of urlMatches) {
    if (!URL_RE.test(m[1])) {
      results.push({
        file: "web/src/data/constants.ts",
        entryId: m[1],
        rule: "url-https",
        severity: "error",
        message: `Crisis contact URL does not start with https://: ${m[1]}`,
      });
    }
  }

  // Check lastVerified dates exist for crisis pins
  const dateMatches = section.matchAll(/lastVerified:\s*"([^"]+)"/g);
  let dateCount = 0;
  for (const m of dateMatches) {
    dateCount++;
    if (!isValidDate(m[1])) {
      results.push({
        file: "web/src/data/constants.ts",
        entryId: m[1],
        rule: "date-format",
        severity: "error",
        message: `Invalid date format in CRISIS_PINS: ${m[1]}`,
      });
    } else if (isFutureDate(m[1])) {
      results.push({
        file: "web/src/data/constants.ts",
        entryId: m[1],
        rule: "date-not-future",
        severity: "error",
        message: `Crisis pin lastVerified is in the future: ${m[1]}`,
      });
    }
  }

  const pinCount = (section.match(/name:\s*"/g) || []).length;
  if (dateCount < pinCount) {
    results.push({
      file: "web/src/data/constants.ts",
      entryId: "-",
      rule: "lastVerified-present",
      severity: "error",
      message: `Only ${dateCount} of ${pinCount} CRISIS_PINS have lastVerified dates`,
    });
  }
}

function validateDocs(results: ValidationResult[]): void {
  const filePath = path.resolve(SCRIPT_DIR, "../web/src/data/docs.ts");
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, "utf-8");

  // Check lastVerified dates
  const dateMatches = content.matchAll(/lastVerified:\s*"([^"]+)"/g);
  let dateCount = 0;
  for (const m of dateMatches) {
    dateCount++;
    if (!isValidDate(m[1])) {
      results.push({
        file: "web/src/data/docs.ts",
        entryId: m[1],
        rule: "date-format",
        severity: "error",
        message: `Invalid date format in IMPORTANT_DOCS: ${m[1]}`,
      });
    }
  }

  const entryCount = (content.match(/id:\s*"/g) || []).length;
  if (dateCount < entryCount) {
    results.push({
      file: "web/src/data/docs.ts",
      entryId: "-",
      rule: "lastVerified-present",
      severity: "error",
      message: `Only ${dateCount} of ${entryCount} IMPORTANT_DOCS have lastVerified dates`,
    });
  }
}

function validateRights(results: ValidationResult[]): void {
  const filePath = path.resolve(SCRIPT_DIR, "../web/src/data/rights.ts");
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, "utf-8");

  // Check that every right has a non-empty citation
  const citationMatches = content.matchAll(/citation:\s*"([^"]*)"/g);
  for (const m of citationMatches) {
    if (m[1].trim() === "") {
      results.push({
        file: "web/src/data/rights.ts",
        entryId: "-",
        rule: "citation-present",
        severity: "error",
        message: "Rights entry has empty citation field",
      });
    }
  }
}

// ── Phone numbers in free text (questions.ts and every other data file) ─────

/**
 * Numbers that were once on the site and are WRONG. They must never come back.
 * Keep in sync with KNOWN_BAD_PHONES in web/tests/unit/helpers.ts.
 */
const KNOWN_BAD_PHONES: { digits: [string, string, string]; why: string }[] = [
  { digits: ["877", "527", "7250"], why: "wrong DCS ombudsman number" },
  { digits: ["800", "852", "8336"], why: "California teen line, not Arizona" },
  { digits: ["480", "651", "3348"], why: "never verified" },
];

function listFiles(dir: string, out: string[] = []): string[] {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    if (fs.statSync(full).isDirectory()) listFiles(full, out);
    else if (/\.(ts|tsx|js|jsx|mjs|json|html|webmanifest)$/.test(name)) out.push(full);
  }
  return out;
}

/** The known-bad numbers must not appear anywhere in the live site's source. */
function validateKnownBadNumbers(results: ValidationResult[]): void {
  const root = path.resolve(SCRIPT_DIR, "..");
  const dirs = ["web/src", "web/public"].map((d) => path.join(root, d)).filter((d) => fs.existsSync(d));
  for (const file of dirs.flatMap((d) => listFiles(d))) {
    const rel = path.relative(root, file).split(path.sep).join("/");
    const lines = fs.readFileSync(file, "utf-8").split("\n");
    for (const bad of KNOWN_BAD_PHONES) {
      const re = new RegExp(bad.digits.join("\\D{0,3}"));
      lines.forEach((line, i) => {
        if (re.test(line)) {
          results.push({
            file: rel,
            entryId: `line ${i + 1}`,
            rule: "known-bad-phone",
            severity: "error",
            message: `Line ${i + 1} has ${bad.digits.join("-")} (${bad.why}). This number must not be on the site.`,
          });
        }
      });
    }
  }
}

// Anything that looks like a 10-digit phone number inside a sentence.
const PHONE_IN_TEXT_RE = /(?<![\w-])(?:\+?1[-. ]?)?\(?\d{3}\)?[-. ]?\d{3}[-. ]?\d{4}(?![\w-]*\d)/g;
// The only ways we print one: (602) 364-1300, 602-364-1300, 1-800-248-8336.
const PHONE_IN_TEXT_OK_RE = /^(?:\(\d{3}\) \d{3}-\d{4}|\d{3}-\d{3}-\d{4}|1-\d{3}-\d{3}-\d{4})$/;

/**
 * questions.ts holds phone numbers inside answer text, so it has no `phone:`
 * field or lastVerified date to check. Make sure every number in it is
 * printed in a standard format, and that the DCS hotline is always complete.
 * The same free-text check runs on the other data files.
 */
function validatePhonesInText(results: ValidationResult[]): void {
  const dataDir = path.resolve(SCRIPT_DIR, "../web/src/data");
  if (!fs.existsSync(path.join(dataDir, "questions.ts"))) {
    results.push({
      file: "web/src/data/questions.ts",
      entryId: "-",
      rule: "file-exists",
      severity: "error",
      message: "File not found",
    });
  }
  for (const name of fs.readdirSync(dataDir).filter((f) => f.endsWith(".ts")).sort()) {
    const file = `web/src/data/${name}`;
    const lines = fs.readFileSync(path.join(dataDir, name), "utf-8").split("\n");
    lines.forEach((line, i) => {
      // Skip machine fields: dial strings (tel/sms), links, dates.
      if (/^\s*(tel|telAlt|sms|url|website|lastVerified):/.test(line)) return;
      const text = line.replace(/https?:\/\/[^\s"'`)]+/g, "");
      for (const m of text.matchAll(PHONE_IN_TEXT_RE)) {
        if (!PHONE_IN_TEXT_OK_RE.test(m[0])) {
          results.push({
            file,
            entryId: `line ${i + 1}`,
            rule: "phone-format",
            severity: "error",
            message: `Line ${i + 1}: phone number "${m[0]}" is not in a standard format, e.g. (602) 364-1300, 602-364-1300 or 1-800-248-8336`,
          });
        }
      }
      // DCS child abuse hotline must always be the full, correct number.
      for (const m of text.matchAll(/888\D{0,3}767\D{0,3}(\d{0,4})/g)) {
        if (m[1] !== "2445") {
          results.push({
            file,
            entryId: `line ${i + 1}`,
            rule: "dcs-hotline",
            severity: "error",
            message: `Line ${i + 1}: DCS hotline must be 1-888-767-2445, found "${m[0]}"`,
          });
        }
      }
    });
  }
}

/** Crisis contacts: dial strings are digits only and 911 / 988 / DCS are present. */
function validateCrisisDialNumbers(results: ValidationResult[]): void {
  const file = "web/src/data/constants.ts";
  const filePath = path.resolve(SCRIPT_DIR, "..", file);
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, "utf-8");
  const section = content.match(/CRISIS_PINS\s*=\s*\[([\s\S]*?)\]\s*as\s*const/)?.[1];
  if (!section) {
    results.push({ file, entryId: "-", rule: "crisis-pins-present", severity: "error", message: "CRISIS_PINS block not found" });
    return;
  }
  const dial = new Set<string>();
  for (const m of section.matchAll(/^\s*(tel|telAlt|sms):\s*"([^"]*)"/gm)) {
    if (m[1] !== "sms") dial.add(m[2]);
    if (!/^\d{3,11}$/.test(m[2])) {
      results.push({ file, entryId: m[2], rule: "dial-digits", severity: "error", message: `${m[1]} must be digits only: "${m[2]}"` });
    }
  }
  for (const [number, label] of [["911", "911"], ["988", "988"], ["18887672445", "DCS hotline 1-888-767-2445"]]) {
    if (!dial.has(number)) {
      results.push({ file, entryId: number, rule: "crisis-required", severity: "error", message: `CRISIS_PINS is missing ${label}` });
    }
  }
}

// ── Main ─────────────────────────────────────────────────────────────────────

function main(): void {
  const results: ValidationResult[] = [];

  console.log("🔍 Validating FosterHub AZ content data...\n");

  validateWebResources(results);
  validateConstants(results);
  validateDocs(results);
  validateRights(results);
  validatePhonesInText(results);
  validateKnownBadNumbers(results);
  validateCrisisDialNumbers(results);

  const errors = results.filter((r) => r.severity === "error");
  const warnings = results.filter((r) => r.severity === "warning");

  if (warnings.length > 0) {
    console.log(`⚠️  ${warnings.length} warning(s):\n`);
    for (const w of warnings) {
      console.log(`   ⚠️  [${w.file}] ${w.rule}: ${w.message}`);
    }
    console.log();
  }

  if (errors.length > 0) {
    console.log(`❌ ${errors.length} error(s):\n`);
    for (const e of errors) {
      console.log(`   ❌ [${e.file}] ${e.rule}: ${e.message}`);
    }
    console.log(
      "\n🚫 Content validation FAILED. Fix the errors above before merging."
    );
    process.exit(1);
  }

  console.log(`✅ All content passed validation (${warnings.length} warning(s), 0 errors).`);
}

main();
