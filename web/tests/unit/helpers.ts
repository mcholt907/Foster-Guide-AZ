import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

export const WEB_ROOT = fileURLToPath(new URL("../..", import.meta.url));
export const SRC_ROOT = join(WEB_ROOT, "src");

/** Every .ts/.tsx file under web/src, as { path (relative to web/), text }. */
export function sourceFiles(): { path: string; text: string }[] {
  const out: { path: string; text: string }[] = [];
  const walk = (dir: string) => {
    for (const name of readdirSync(dir)) {
      const full = join(dir, name);
      if (statSync(full).isDirectory()) walk(full);
      else if (/\.(ts|tsx|js|jsx|mjs|json|css)$/.test(name)) {
        out.push({ path: relative(WEB_ROOT, full), text: readFileSync(full, "utf8") });
      }
    }
  };
  walk(SRC_ROOT);
  return out;
}

/**
 * Phone numbers that were once on the site and are WRONG. They must never
 * come back. Matched with any (or no) separators between the digit groups.
 * Keep in sync with KNOWN_BAD_PHONES in scripts/validate-content.ts.
 */
export const KNOWN_BAD_PHONES = [
  { digits: ["877", "527", "7250"], why: "wrong DCS ombudsman number" },
  { digits: ["800", "852", "8336"], why: "California teen line, not Arizona" },
  { digits: ["480", "651", "3348"], why: "never verified" },
] as const;

export function badPhoneRegex(digits: readonly string[]): RegExp {
  return new RegExp(digits.join("\\D{0,3}"));
}

/** How phone numbers are printed on the site. */
export const US_PHONE =
  /^(?:911|988|2-1-1|211|(?:1-)?\d{3}-\d{3}-\d{4}|\(\d{3}\) \d{3}-\d{4})$/;

/** Real calendar date in YYYY-MM-DD form, not in the future. */
export function isPastIsoDate(value: unknown): boolean {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const d = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(d.getTime()) || d.toISOString().slice(0, 10) !== value) return false;
  // One day of slack so a date set "today" in Arizona never fails in UTC CI.
  return d.getTime() <= Date.now() + 24 * 60 * 60 * 1000;
}
