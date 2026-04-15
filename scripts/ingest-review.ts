/**
 * ingest-review.ts
 *
 * Ingests the human/AI-reviewed revalidation report and applies corrections
 * to the data files automatically.
 *
 * Input:  docs/revalidation-report-reviewed.md
 * Output: Updates to data files + ingestion log to docs/ingestion-log.md
 *
 * The reviewed report may use either format:
 *
 * FORMAT A (flat table):
 *   ## Corrections
 *   | Entry | File | Action | Field | New Value | Notes |
 *
 * FORMAT B (per-entry sections, as produced by Claude Cowork Skill):
 *   ### 1. Entry Name
 *   | Field | Old Value | New / Correct Value |
 *   **Status:** ✅ Resolved — ...
 *
 * The script auto-detects the format and parses accordingly.
 *
 * Run:
 *   npx tsx scripts/ingest-review.ts           # dry run
 *   npx tsx scripts/ingest-review.ts --apply    # apply changes
 */

import * as fs from "fs";
import * as path from "path";

// ── Config ───────────────────────────────────────────────────────────────────

const TODAY = new Date().toISOString().split("T")[0]!;
const APPLY = process.argv.includes("--apply");
const ROOT = path.resolve(__dirname, "..");
const REVIEWED_PATH = path.join(ROOT, "docs", "revalidation-report-reviewed.md");
const LOG_PATH = path.join(ROOT, "docs", "ingestion-log.md");

// Mapping from entry names to their source files
// This lets the reviewed report omit the file path
const ENTRY_FILE_MAP: Record<string, string> = {};

// ── Types ────────────────────────────────────────────────────────────────────

interface Correction {
  entry: string;
  file: string;
  action: "update" | "remove" | "verify" | "skip";
  field: string;
  oldValue: string;
  newValue: string;
  notes: string;
}

interface ApplyResult {
  correction: Correction;
  success: boolean;
  message: string;
}

// ── Build entry→file map from data files ─────────────────────────────────────

function buildEntryMap(): void {
  const files = [
    { path: "server/src/data/resources.ts", nameField: "name" },
    { path: "web/src/data/resources.ts", nameField: "name" },
    { path: "web/src/data/constants.ts", nameField: "name" },
    { path: "web/src/data/docs.ts", nameField: "label" },
  ];

  for (const f of files) {
    const absPath = path.join(ROOT, f.path);
    if (!fs.existsSync(absPath)) continue;
    const content = fs.readFileSync(absPath, "utf-8");
    const namePattern = new RegExp(`${f.nameField}:\\s*"([^"]+)"`, "g");
    let match;
    while ((match = namePattern.exec(content)) !== null) {
      ENTRY_FILE_MAP[match[1]] = f.path;
    }
  }
}

/**
 * Find the file for an entry name, using fuzzy matching if needed.
 */
function findFile(entryName: string): string {
  // Exact match
  if (ENTRY_FILE_MAP[entryName]) return ENTRY_FILE_MAP[entryName];

  // Partial match (entry name is a substring)
  for (const [name, file] of Object.entries(ENTRY_FILE_MAP)) {
    if (name.includes(entryName) || entryName.includes(name)) return file;
  }

  // Default to server resources
  return "server/src/data/resources.ts";
}

// ── Parser: Format A (flat corrections table) ────────────────────────────────

function parseFormatA(content: string): Correction[] {
  const corrections: Correction[] = [];
  const sectMatch = content.match(
    /##\s*Corrections\s*\n([\s\S]*?)(?=\n##\s|\n---\s*$|$)/
  );
  if (!sectMatch) return corrections;

  const lines = sectMatch[1].split("\n");
  let inTable = false;
  let headerSkipped = false;

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.startsWith("|") && trimmed.includes("Entry") && trimmed.includes("Action")) {
      inTable = true;
      continue;
    }
    if (inTable && /^\|[\s:-]+\|/.test(trimmed) && !headerSkipped) {
      headerSkipped = true;
      continue;
    }
    if (inTable && trimmed.startsWith("|")) {
      const cells = trimmed.split("|").map((c) => c.trim()).filter((c) => c.length > 0);
      if (cells.length >= 4) {
        const action = cells[2].toLowerCase().trim();
        if (["update", "remove", "verify", "skip"].includes(action)) {
          corrections.push({
            entry: cells[0],
            file: cells[1] || findFile(cells[0]),
            action: action as Correction["action"],
            field: cells[3] || "—",
            oldValue: "",
            newValue: cells[4] || "—",
            notes: cells[5] || "",
          });
        }
      }
    }
    if (inTable && !trimmed.startsWith("|") && trimmed.length > 0) {
      inTable = false;
    }
  }

  return corrections;
}

// ── Parser: Format B (per-entry sections from Cowork Skill) ──────────────────

function parseFormatB(content: string): Correction[] {
  const corrections: Correction[] = [];

  // Split into entry sections by ### N. Entry Name
  const entryPattern = /###\s*\d+\.\s*(.+?)\s*\n([\s\S]*?)(?=###\s*\d+\.|## |$)/g;
  let match;

  while ((match = entryPattern.exec(content)) !== null) {
    const entryName = match[1].trim();
    const block = match[2];

    // Check status line
    const statusMatch = block.match(/\*\*Status:\*\*\s*(.*)/);
    if (!statusMatch) continue;
    const statusLine = statusMatch[1];

    // Skip unresolved entries — they need manual action
    if (statusLine.includes("⚠️ Unresolved")) {
      corrections.push({
        entry: entryName,
        file: findFile(entryName),
        action: "skip",
        field: "—",
        oldValue: "",
        newValue: "—",
        notes: `Unresolved — ${statusLine.replace(/^⚠️\s*/, "")}`,
      });
      continue;
    }

    // Skip "Partially resolved" entries  
    if (statusLine.includes("⚠️ Partially")) {
      corrections.push({
        entry: entryName,
        file: findFile(entryName),
        action: "skip",
        field: "—",
        oldValue: "",
        newValue: "—",
        notes: `Partially resolved — needs manual decision`,
      });
      continue;
    }

    // Parse the field/value table
    const tablePattern = /\|\s*\*\*(.+?)\*\*\s*\|\s*(.+?)\s*\|\s*(.+?)\s*\|/g;
    let tableMatch;
    const fields: { field: string; oldValue: string; newValue: string }[] = [];

    while ((tableMatch = tablePattern.exec(block)) !== null) {
      const fieldName = tableMatch[1].trim();
      const oldVal = tableMatch[2].trim();
      let newVal = tableMatch[3].trim();

      // Clean up markdown bold markers from new values
      newVal = newVal.replace(/^\*\*/, "").replace(/\*\*$/, "").replace(/\*\*\s*\(.*$/, "").trim();

      // Skip if values haven't changed
      if (oldVal === newVal) continue;

      // Skip "Could not verify" / "No replacement found"
      if (newVal.includes("Could not") || newVal.includes("No replacement") || newVal === "N/A") continue;

      // Map field names
      let normalizedField = "";
      if (fieldName === "URL") normalizedField = "website";
      else if (fieldName === "Phone") normalizedField = "phone";
      else continue; // skip unknown fields

      // Clean the new value further — extract just the URL or phone
      if (normalizedField === "website") {
        // Extract URL from markdown or plain text
        const urlMatch = newVal.match(/https?:\/\/[^\s)>|*]+/);
        if (urlMatch) newVal = urlMatch[0];
      }
      if (normalizedField === "phone") {
        // Use the first phone number (before any secondary numbers separated by ; or /)
        const phoneMatch = newVal.match(
          /(?:\d[-()\s.]*){7,}|\(\d{3}\)\s*\d{3}[-.]\d{4}|\d{3}[-.]\d{3}[-.]\d{4}|1-\d{3}-\d{3}-\d{4}/
        );
        if (phoneMatch) newVal = phoneMatch[0].trim();
      }

      fields.push({ field: normalizedField, oldValue: oldVal, newValue: newVal });
    }

    // Generate corrections for each changed field
    if (fields.length > 0) {
      for (const f of fields) {
        corrections.push({
          entry: entryName,
          file: findFile(entryName),
          action: "update",
          field: f.field,
          oldValue: f.oldValue,
          newValue: f.newValue,
          notes: statusLine.replace(/^✅\s*/, "").slice(0, 100),
        });
      }
    } else {
      // No field changes but resolved — just mark as verified
      corrections.push({
        entry: entryName,
        file: findFile(entryName),
        action: "verify",
        field: "—",
        oldValue: "",
        newValue: "—",
        notes: statusLine.replace(/^✅\s*/, "").slice(0, 100),
      });
    }
  }

  return corrections;
}

/**
 * Auto-detect format and parse.
 */
function parseReviewedReport(content: string): Correction[] {
  // Try Format A first (has a ## Corrections header with table)
  const formatA = parseFormatA(content);
  if (formatA.length > 0) {
    console.log("   Format detected: Table (Format A)");
    return formatA;
  }

  // Try Format B (### N. Entry Name sections)
  const formatB = parseFormatB(content);
  if (formatB.length > 0) {
    console.log("   Format detected: Per-entry sections (Format B / Cowork Skill)");
    return formatB;
  }

  return [];
}

// ── Applier ──────────────────────────────────────────────────────────────────

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Find entry name in file content.
 * Tries exact match first, then partial match.
 */
function findEntryInContent(content: string, entryName: string): string | null {
  // Exact match
  if (content.includes(`"${entryName}"`)) return entryName;

  // Partial match — entry name without special chars
  const cleanName = entryName.replace(/[—–•]/g, "").trim();
  if (content.includes(`"${cleanName}"`)) return cleanName;

  // Token-intersection match — extract significant words (4+ chars) and score overlap
  const tokens = (s: string) =>
    s.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter((w) => w.length >= 4);
  const searchTokens = new Set(tokens(cleanName));

  let bestName: string | null = null;
  let bestScore = 0;

  const namePattern = /name:\s*"([^"]+)"/g;
  let match;
  while ((match = namePattern.exec(content)) !== null) {
    const name = match[1];
    if (
      name.toLowerCase().includes(cleanName.toLowerCase()) ||
      cleanName.toLowerCase().includes(name.toLowerCase().slice(0, 20))
    ) {
      return name;
    }
    // Score by token overlap
    const overlap = tokens(name).filter((t) => searchTokens.has(t)).length;
    if (overlap > bestScore) {
      bestScore = overlap;
      bestName = name;
    }
  }

  // Also try label field for docs
  const labelPattern = /label:\s*"([^"]+)"/g;
  while ((match = labelPattern.exec(content)) !== null) {
    const label = match[1];
    if (label.toLowerCase().includes(cleanName.toLowerCase())) {
      return label;
    }
  }

  // Accept best token-intersection match if at least 2 significant words overlap
  if (bestScore >= 2 && bestName) return bestName;

  return null;
}

function applyUpdate(
  content: string,
  entryName: string,
  field: string,
  newValue: string,
  filePath: string
): { content: string; success: boolean; message: string } {
  // Resolve entry name in file
  const resolvedName = findEntryInContent(content, entryName);
  if (!resolvedName) {
    return { content, success: false, message: `Entry "${entryName}" not found in file` };
  }

  // Map field names based on file
  let actualField = field;
  if (filePath.includes("server/") && field === "url") actualField = "website";
  if (filePath.includes("web/src/data/resources") && field === "website") actualField = "url";
  if (filePath.includes("web/src/data/constants") && field === "website") actualField = "url";

  // Find and replace the field value
  const fieldPattern = new RegExp(
    `(${escapeRegex(resolvedName)}[\\s\\S]*?)${escapeRegex(actualField)}:\\s*"([^"]*)"`,
  );

  if (!fieldPattern.test(content)) {
    return { content, success: false, message: `Field "${actualField}" not found for "${resolvedName}"` };
  }

  let updated = content.replace(fieldPattern, `$1${actualField}: "${newValue}"`);

  // Also update lastVerified
  const datePattern = new RegExp(
    `(${escapeRegex(resolvedName)}[\\s\\S]*?)lastVerified:\\s*"([^"]*)"`
  );
  if (datePattern.test(updated)) {
    updated = updated.replace(datePattern, `$1lastVerified: "${TODAY}"`);
  }

  return {
    content: updated,
    success: true,
    message: `Updated ${actualField} → "${newValue}" and lastVerified → "${TODAY}"`,
  };
}

function applyRemove(
  content: string,
  entryName: string,
): { content: string; success: boolean; message: string } {
  const resolvedName = findEntryInContent(content, entryName);
  if (!resolvedName) {
    return { content, success: false, message: `Entry "${entryName}" not found in file` };
  }

  const escaped = escapeRegex(resolvedName);
  const blockPattern = new RegExp(
    `\\s*(?:\\/\\/[^\\n]*\\n\\s*)?\\{[^}]*?name:\\s*"${escaped}"[^}]*?\\},?`,
    "s"
  );

  if (!blockPattern.test(content)) {
    return { content, success: false, message: `Could not isolate entry block for "${resolvedName}"` };
  }

  return {
    content: content.replace(blockPattern, ""),
    success: true,
    message: `Removed entry "${resolvedName}"`,
  };
}

function applyVerify(
  content: string,
  entryName: string,
): { content: string; success: boolean; message: string } {
  const resolvedName = findEntryInContent(content, entryName);
  if (!resolvedName) {
    return { content, success: false, message: `Entry "${entryName}" not found in file` };
  }

  const datePattern = new RegExp(
    `(${escapeRegex(resolvedName)}[\\s\\S]*?)lastVerified:\\s*"([^"]*)"`
  );

  if (!datePattern.test(content)) {
    return { content, success: false, message: `lastVerified not found for "${resolvedName}"` };
  }

  return {
    content: content.replace(datePattern, `$1lastVerified: "${TODAY}"`),
    success: true,
    message: `Marked as verified — lastVerified → "${TODAY}"`,
  };
}

function applyCorrections(corrections: Correction[]): ApplyResult[] {
  const results: ApplyResult[] = [];
  const byFile = new Map<string, Correction[]>();

  for (const c of corrections) {
    if (c.action === "skip") {
      results.push({ correction: c, success: true, message: `Skipped — ${c.notes}` });
      continue;
    }
    const key = c.file;
    if (!byFile.has(key)) byFile.set(key, []);
    byFile.get(key)!.push(c);
  }

  for (const [relPath, fileCorrections] of byFile) {
    const absPath = path.join(ROOT, relPath);
    if (!fs.existsSync(absPath)) {
      for (const c of fileCorrections) {
        results.push({ correction: c, success: false, message: `File not found: ${relPath}` });
      }
      continue;
    }

    let content = fs.readFileSync(absPath, "utf-8");

    for (const c of fileCorrections) {
      let result: { content: string; success: boolean; message: string };

      switch (c.action) {
        case "update":
          result = applyUpdate(content, c.entry, c.field, c.newValue, relPath);
          break;
        case "remove":
          result = applyRemove(content, c.entry);
          break;
        case "verify":
          result = applyVerify(content, c.entry);
          break;
        default:
          result = { content, success: false, message: `Unknown action: ${c.action}` };
      }

      content = result.content;
      results.push({ correction: c, success: result.success, message: result.message });
    }

    if (APPLY) {
      fs.writeFileSync(absPath, content, "utf-8");
    }
  }

  return results;
}

// ── Log generator ────────────────────────────────────────────────────────────

function generateLog(corrections: Correction[], results: ApplyResult[]): string {
  const lines: string[] = [];
  const succeeded = results.filter((r) => r.success);
  const failed = results.filter((r) => !r.success);
  const skipped = results.filter((r) => r.correction.action === "skip");
  const applied = succeeded.filter((r) => r.correction.action !== "skip");

  lines.push(`# Review Ingestion Log`);
  lines.push(``);
  lines.push(`> **Date:** ${TODAY}  `);
  lines.push(`> **Mode:** ${APPLY ? "Applied" : "Dry Run"}  `);
  lines.push(`> **Input:** docs/revalidation-report-reviewed.md  `);
  lines.push(`> **Corrections parsed:** ${corrections.length}`);
  lines.push(``);

  lines.push(`## Results`);
  lines.push(``);
  lines.push(`| Metric | Count |`);
  lines.push(`|:---|:---|`);
  lines.push(`| Total corrections | ${corrections.length} |`);
  lines.push(`| ✅ Applied | ${applied.length} |`);
  lines.push(`| ⏭️ Skipped | ${skipped.length} |`);
  lines.push(`| ❌ Failed | ${failed.length} |`);
  lines.push(``);

  if (applied.length > 0) {
    lines.push(`## Applied Changes`);
    lines.push(``);
    lines.push(`| Entry | Action | Field | New Value | Result |`);
    lines.push(`|:---|:---|:---|:---|:---|`);
    for (const r of applied) {
      lines.push(
        `| ${r.correction.entry} | ${r.correction.action} | ${r.correction.field} | ${r.correction.newValue} | ${r.message} |`
      );
    }
    lines.push(``);
  }

  if (failed.length > 0) {
    lines.push(`## Failures`);
    lines.push(``);
    lines.push(`| Entry | Action | Error |`);
    lines.push(`|:---|:---|:---|`);
    for (const r of failed) {
      lines.push(`| ${r.correction.entry} | ${r.correction.action} | ${r.message} |`);
    }
    lines.push(``);
  }

  if (skipped.length > 0) {
    lines.push(`## Skipped (requires manual decision)`);
    lines.push(``);
    for (const r of skipped) {
      lines.push(`- **${r.correction.entry}** — ${r.correction.notes || "No notes"}`);
    }
    lines.push(``);
  }

  lines.push(`---`);
  lines.push(``);
  lines.push(`*Generated by \`scripts/ingest-review.ts\`*`);
  lines.push(``);
  return lines.join("\n");
}

// ── Main ─────────────────────────────────────────────────────────────────────

function main(): void {
  console.log(`\n📥 FosterHub AZ — Review Ingestion`);
  console.log(`   Date: ${TODAY}`);
  console.log(`   Mode: ${APPLY ? "🟢 APPLY" : "🔵 DRY RUN"}\n`);

  // Build entry→file map from current data
  buildEntryMap();
  console.log(`   Entry map built: ${Object.keys(ENTRY_FILE_MAP).length} entries across all data files\n`);

  // Check for reviewed file
  if (!fs.existsSync(REVIEWED_PATH)) {
    console.log("📭 No reviewed report found at docs/revalidation-report-reviewed.md");
    console.log("   Nothing to ingest. Exiting.\n");
    process.exit(0);
  }

  const content = fs.readFileSync(REVIEWED_PATH, "utf-8");
  console.log(`   File size: ${content.length} bytes`);

  // Parse corrections
  const corrections = parseReviewedReport(content);

  if (corrections.length === 0) {
    console.log("📭 No corrections parsed from the reviewed report.\n");
    process.exit(0);
  }

  console.log(`\n📋 Parsed ${corrections.length} corrections:\n`);

  const updateCount = corrections.filter((c) => c.action === "update").length;
  const verifyCount = corrections.filter((c) => c.action === "verify").length;
  const removeCount = corrections.filter((c) => c.action === "remove").length;
  const skipCount = corrections.filter((c) => c.action === "skip").length;

  console.log(`   📝 Updates:  ${updateCount}`);
  console.log(`   ✅ Verifies: ${verifyCount}`);
  console.log(`   🗑️  Removes:  ${removeCount}`);
  console.log(`   ⏭️  Skips:    ${skipCount}`);
  console.log();

  for (const c of corrections) {
    const icon =
      c.action === "update" ? "📝" :
      c.action === "remove" ? "🗑️" :
      c.action === "verify" ? "✅" :
      "⏭️";
    if (c.action === "update") {
      console.log(`   ${icon} ${c.entry}: ${c.field} → "${c.newValue}"`);
    } else if (c.action === "skip") {
      console.log(`   ${icon} ${c.entry}: ${c.notes.slice(0, 80)}`);
    } else {
      console.log(`   ${icon} ${c.entry}`);
    }
  }

  // Apply
  console.log(`\n${APPLY ? "📝 Applying..." : "🔍 Dry run..."}\n`);
  const results = applyCorrections(corrections);

  const succeeded = results.filter((r) => r.success);
  const failed = results.filter((r) => !r.success);

  for (const r of results) {
    const icon = r.success ? "✅" : "❌";
    console.log(`   ${icon} ${r.correction.entry}: ${r.message}`);
  }

  // Write log
  const log = generateLog(corrections, results);
  const logDir = path.dirname(LOG_PATH);
  if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });
  fs.writeFileSync(LOG_PATH, log, "utf-8");
  console.log(`\n📄 Ingestion log: docs/ingestion-log.md`);

  // Archive the reviewed file
  if (APPLY && succeeded.filter((r) => r.correction.action !== "skip").length > 0) {
    const archiveDir = path.join(ROOT, "docs", "archive");
    if (!fs.existsSync(archiveDir)) fs.mkdirSync(archiveDir, { recursive: true });
    const archiveName = `revalidation-report-reviewed-${TODAY}.md`;
    fs.copyFileSync(REVIEWED_PATH, path.join(archiveDir, archiveName));
    fs.unlinkSync(REVIEWED_PATH);
    console.log(`   📦 Archived → docs/archive/${archiveName}`);
    console.log(`   🗑️  Removed original`);
  }

  // Summary
  console.log(`\n─── Summary ───`);
  console.log(`   Total:    ${corrections.length}`);
  console.log(`   ✅ Done:  ${succeeded.length}`);
  console.log(`   ❌ Failed: ${failed.length}`);
  console.log();

  if (failed.length > 0) process.exit(1);
}

main();
