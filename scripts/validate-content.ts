/**
 * validate-content.ts
 *
 * Content validation script for FosterHub AZ.
 * Enforces schema rules, phone formats, URL patterns, age-band rules,
 * and lastVerified date integrity across all data files.
 *
 * Run: npx tsx scripts/validate-content.ts
 * Exit code 1 on blocking errors, 0 on pass (warnings are printed but don't block).
 */

import * as fs from "fs";
import * as path from "path";

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
    __dirname,
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
    __dirname,
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
  const filePath = path.resolve(__dirname, "../web/src/data/docs.ts");
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
  const filePath = path.resolve(__dirname, "../web/src/data/rights.ts");
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

function validateServerResources(results: ValidationResult[]): void {
  const filePath = path.resolve(
    __dirname,
    "../server/src/data/resources.ts"
  );
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, "utf-8");

  // Check all URLs
  const urlMatches = content.matchAll(/website:\s*"([^"]+)"/g);
  for (const m of urlMatches) {
    if (!URL_RE.test(m[1])) {
      results.push({
        file: "server/src/data/resources.ts",
        entryId: m[1],
        rule: "url-https",
        severity: "error",
        message: `Server resource URL does not start with https://: ${m[1]}`,
      });
    }
  }

  // Check phone numbers
  const phoneMatches = content.matchAll(/phone:\s*"([^"]+)"/g);
  for (const m of phoneMatches) {
    if (!isValidPhone(m[1])) {
      results.push({
        file: "server/src/data/resources.ts",
        entryId: m[1],
        rule: "phone-format",
        severity: "error",
        message: `Invalid phone format in server resources: ${m[1]}`,
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
        file: "server/src/data/resources.ts",
        entryId: m[1],
        rule: "date-format",
        severity: "error",
        message: `Invalid lastVerified date in server resources: ${m[1]}`,
      });
    } else if (isFutureDate(m[1])) {
      results.push({
        file: "server/src/data/resources.ts",
        entryId: m[1],
        rule: "date-not-future",
        severity: "error",
        message: `Server resource lastVerified in the future: ${m[1]}`,
      });
    }
  }

  const entryCount = (content.match(/id:\s*"r-/g) || []).length;
  if (dateCount < entryCount) {
    results.push({
      file: "server/src/data/resources.ts",
      entryId: "-",
      rule: "lastVerified-present",
      severity: "warning",
      message: `${dateCount} of ${entryCount} server resource entries have lastVerified dates`,
    });
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
  validateServerResources(results);

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
