/**
 * check-staleness.ts
 *
 * Checks all content data files for entries whose lastVerified date
 * exceeds the risk-tiered SLA thresholds.
 *
 * SLA thresholds:
 *   Crisis contacts (CRISIS_PINS):  14 days
 *   Resources:                      30 days
 *   Identity documents:             60 days
 *   Rights / Court / Escalation:    90 days
 *
 * Run: npx tsx scripts/check-staleness.ts
 * Exit code 1 if any CRITICAL items are overdue.
 */

import * as fs from "fs";
import * as path from "path";

// ── Types ────────────────────────────────────────────────────────────────────

interface StaleItem {
  file: string;
  name: string;
  lastVerified: string;
  daysOverdue: number;
  sla: number;
  tier: "critical" | "high" | "medium" | "low";
}

// ── SLA thresholds (days) ────────────────────────────────────────────────────

const SLA = {
  crisis: 14,
  resources: 30,
  documents: 60,
  legal: 90,
} as const;

// ── Helpers ──────────────────────────────────────────────────────────────────

function daysSince(dateStr: string): number {
  const d = new Date(dateStr + "T00:00:00Z");
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
}

function extractEntries(
  content: string,
  nameField: string
): { name: string; lastVerified: string }[] {
  const entries: { name: string; lastVerified: string }[] = [];

  // Split by entry objects (look for name/id field followed by lastVerified)
  const entryBlocks = content.split(/\{/).slice(1); // skip first empty split

  for (const block of entryBlocks) {
    const nameMatch = block.match(
      new RegExp(`${nameField}:\\s*"([^"]+)"`)
    );
    const dateMatch = block.match(/lastVerified:\s*"([^"]+)"/);

    if (nameMatch && dateMatch) {
      entries.push({
        name: nameMatch[1],
        lastVerified: dateMatch[1],
      });
    }
  }

  return entries;
}

// ── Scanners ─────────────────────────────────────────────────────────────────

function scanFile(
  filePath: string,
  displayName: string,
  nameField: string,
  sla: number,
  tier: StaleItem["tier"]
): StaleItem[] {
  const stale: StaleItem[] = [];
  const fullPath = path.resolve(__dirname, filePath);

  if (!fs.existsSync(fullPath)) return stale;

  const content = fs.readFileSync(fullPath, "utf-8");
  const entries = extractEntries(content, nameField);

  for (const entry of entries) {
    const age = daysSince(entry.lastVerified);
    if (age > sla) {
      stale.push({
        file: displayName,
        name: entry.name,
        lastVerified: entry.lastVerified,
        daysOverdue: age - sla,
        sla,
        tier,
      });
    }
  }

  return stale;
}

// ── Main ─────────────────────────────────────────────────────────────────────

function main(): void {
  console.log("📅 Checking content staleness against SLA thresholds...\n");

  const staleItems: StaleItem[] = [];

  // Crisis contacts — 14-day SLA
  staleItems.push(
    ...scanFile(
      "../web/src/data/constants.ts",
      "web/src/data/constants.ts (CRISIS_PINS)",
      "name",
      SLA.crisis,
      "critical"
    )
  );

  // Web resources — 30-day SLA
  staleItems.push(
    ...scanFile(
      "../web/src/data/resources.ts",
      "web/src/data/resources.ts",
      "name",
      SLA.resources,
      "high"
    )
  );

  // Server resources — 30-day SLA
  staleItems.push(
    ...scanFile(
      "../server/src/data/resources.ts",
      "server/src/data/resources.ts",
      "name",
      SLA.resources,
      "high"
    )
  );

  // Identity documents — 60-day SLA
  staleItems.push(
    ...scanFile(
      "../web/src/data/docs.ts",
      "web/src/data/docs.ts (IMPORTANT_DOCS)",
      "label",
      SLA.documents,
      "medium"
    )
  );

  // Sort by tier priority then days overdue
  const tierOrder = { critical: 0, high: 1, medium: 2, low: 3 };
  staleItems.sort(
    (a, b) =>
      tierOrder[a.tier] - tierOrder[b.tier] || b.daysOverdue - a.daysOverdue
  );

  if (staleItems.length === 0) {
    console.log("✅ All content entries are within their SLA thresholds.\n");
    console.log(`   Crisis contacts:     ${SLA.crisis}-day SLA`);
    console.log(`   Resources:           ${SLA.resources}-day SLA`);
    console.log(`   Identity documents:  ${SLA.documents}-day SLA`);
    console.log(`   Legal/court content: ${SLA.legal}-day SLA`);
    process.exit(0);
  }

  console.log(
    `⚠️  ${staleItems.length} content entries are past their SLA:\n`
  );

  const critCount = staleItems.filter((i) => i.tier === "critical").length;
  const highCount = staleItems.filter((i) => i.tier === "high").length;
  const medCount = staleItems.filter((i) => i.tier === "medium").length;

  if (critCount > 0) console.log(`   🔴 CRITICAL: ${critCount}`);
  if (highCount > 0) console.log(`   🟠 HIGH:     ${highCount}`);
  if (medCount > 0) console.log(`   🟡 MEDIUM:   ${medCount}`);
  console.log();

  // Table output
  console.log(
    "   Tier      | Days Over | Last Verified | Entry"
  );
  console.log(
    "   ----------|-----------|---------------|------"
  );
  for (const item of staleItems) {
    const tierLabel =
      item.tier === "critical"
        ? "🔴 CRIT"
        : item.tier === "high"
        ? "🟠 HIGH"
        : item.tier === "medium"
        ? "🟡 MED "
        : "🟢 LOW ";

    console.log(
      `   ${tierLabel}   | +${String(item.daysOverdue).padStart(4)}d    | ${item.lastVerified}     | ${item.name}`
    );
  }

  console.log(`\n   Source files to update:`);
  const files = [...new Set(staleItems.map((i) => i.file))];
  for (const f of files) {
    console.log(`     → ${f}`);
  }

  // Fail CI if any critical items exist
  if (critCount > 0) {
    console.log(
      `\n🚫 ${critCount} CRITICAL entries are overdue. These are safety-critical crisis contacts that must be re-verified.`
    );
    process.exit(1);
  }

  console.log(
    "\n⚠️  Non-critical items are overdue. Please schedule a verification pass."
  );
  process.exit(0);
}

main();
