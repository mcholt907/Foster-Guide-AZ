/**
 * generate-freshness-report.ts
 *
 * Generates a comprehensive content health report for FosterHub AZ.
 * Output: docs/freshness-report.md
 *
 * Run: npx tsx scripts/generate-freshness-report.ts
 */

import * as fs from "fs";
import * as path from "path";

// ── Helpers ──────────────────────────────────────────────────────────────────

function daysSince(dateStr: string): number {
  const d = new Date(dateStr + "T00:00:00Z");
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
}

function extractLastVerifiedEntries(
  content: string,
  nameField: string
): { name: string; lastVerified: string }[] {
  const entries: { name: string; lastVerified: string }[] = [];
  const blocks = content.split(/\{/).slice(1);

  for (const block of blocks) {
    const nameMatch = block.match(new RegExp(`${nameField}:\\s*"([^"]+)"`));
    const dateMatch = block.match(/lastVerified:\s*"([^"]+)"/);
    if (nameMatch && dateMatch) {
      entries.push({ name: nameMatch[1], lastVerified: dateMatch[1] });
    }
  }

  return entries;
}

function extractUrls(content: string): string[] {
  const urls: string[] = [];
  const matches = content.matchAll(/(?:url|website):\s*"([^"]+)"/g);
  for (const m of matches) {
    urls.push(m[1]);
  }
  return urls;
}

function statusIcon(days: number, sla: number): string {
  if (days <= sla * 0.5) return "✅";
  if (days <= sla) return "🟡";
  return "🔴";
}

// ── Report Generation ────────────────────────────────────────────────────────

function main(): void {
  const today = new Date().toISOString().split("T")[0];
  const lines: string[] = [];

  lines.push(`# FosterHub AZ — Content Freshness Report`);
  lines.push(``);
  lines.push(`> Generated: **${today}**`);
  lines.push(``);
  lines.push(`---`);
  lines.push(``);

  // ── Summary Scorecard ─────────────────────────────────────────────────

  const SLA = { crisis: 14, resources: 30, documents: 60, legal: 90 };

  const files = [
    { path: "../web/src/data/constants.ts", name: "Crisis Contacts", field: "name", sla: SLA.crisis },
    { path: "../web/src/data/resources.ts", name: "Web Resources", field: "name", sla: SLA.resources },
    { path: "../server/src/data/resources.ts", name: "Server Resources", field: "name", sla: SLA.resources },
    { path: "../web/src/data/docs.ts", name: "Identity Documents", field: "label", sla: SLA.documents },
  ];

  let totalEntries = 0;
  let withinSla = 0;
  let overdue = 0;
  const allEntries: {
    category: string;
    name: string;
    lastVerified: string;
    age: number;
    sla: number;
    status: string;
  }[] = [];

  for (const f of files) {
    const fullPath = path.resolve(__dirname, f.path);
    if (!fs.existsSync(fullPath)) continue;
    const content = fs.readFileSync(fullPath, "utf-8");
    const entries = extractLastVerifiedEntries(content, f.field);

    for (const entry of entries) {
      const age = daysSince(entry.lastVerified);
      const status = statusIcon(age, f.sla);
      totalEntries++;
      if (age <= f.sla) withinSla++;
      else overdue++;
      allEntries.push({
        category: f.name,
        name: entry.name,
        lastVerified: entry.lastVerified,
        age,
        sla: f.sla,
        status,
      });
    }
  }

  const healthPct = totalEntries > 0 ? Math.round((withinSla / totalEntries) * 100) : 0;
  const healthIcon = healthPct >= 90 ? "✅" : healthPct >= 70 ? "🟡" : "🔴";

  lines.push(`## Summary Scorecard`);
  lines.push(``);
  lines.push(`| Metric | Value |`);
  lines.push(`|:---|:---|`);
  lines.push(`| **Overall Content Health** | ${healthIcon} **${healthPct}%** within SLA |`);
  lines.push(`| Total tracked entries | ${totalEntries} |`);
  lines.push(`| Within SLA | ✅ ${withinSla} |`);
  lines.push(`| Overdue | 🔴 ${overdue} |`);
  lines.push(``);

  lines.push(`### SLA Thresholds`);
  lines.push(``);
  lines.push(`| Category | SLA | Description |`);
  lines.push(`|:---|:---|:---|`);
  lines.push(`| Crisis Contacts | ${SLA.crisis} days | Phone numbers and URLs for crisis lines |`);
  lines.push(`| Resources | ${SLA.resources} days | Organization contact info, eligibility, and capacity |`);
  lines.push(`| Identity Documents | ${SLA.documents} days | Step-by-step document procurement instructions |`);
  lines.push(`| Legal/Court Content | ${SLA.legal} days | Statutory citations and court process descriptions |`);
  lines.push(``);

  // ── Detailed Tables ───────────────────────────────────────────────────

  const categories = [...new Set(allEntries.map((e) => e.category))];

  for (const category of categories) {
    const entries = allEntries.filter((e) => e.category === category);
    const catSla = entries[0]?.sla || 30;

    lines.push(`---`);
    lines.push(``);
    lines.push(`## ${category}`);
    lines.push(``);

    const catWithin = entries.filter((e) => e.age <= catSla).length;
    const catTotal = entries.length;
    const catPct = Math.round((catWithin / catTotal) * 100);

    lines.push(`> ${catPct}% within ${catSla}-day SLA (${catWithin}/${catTotal})`);
    lines.push(``);

    lines.push(`| Status | Entry | Last Verified | Age (days) | SLA |`);
    lines.push(`|:---|:---|:---|:---|:---|`);

    for (const entry of entries.sort((a, b) => b.age - a.age)) {
      lines.push(
        `| ${entry.status} | ${entry.name} | ${entry.lastVerified} | ${entry.age} | ${entry.sla} |`
      );
    }

    lines.push(``);
  }

  // ── URL Summary ───────────────────────────────────────────────────────

  lines.push(`---`);
  lines.push(``);
  lines.push(`## URL Inventory`);
  lines.push(``);
  lines.push(`Total unique URLs tracked across all data files:`);
  lines.push(``);

  const allUrls = new Set<string>();
  for (const f of files) {
    const fullPath = path.resolve(__dirname, f.path);
    if (!fs.existsSync(fullPath)) continue;
    const content = fs.readFileSync(fullPath, "utf-8");
    for (const url of extractUrls(content)) {
      allUrls.add(url);
    }
  }

  lines.push(`| # | URL |`);
  lines.push(`|:---|:---|`);
  let urlIdx = 0;
  for (const url of allUrls) {
    urlIdx++;
    lines.push(`| ${urlIdx} | ${url} |`);
  }
  lines.push(``);
  lines.push(`> Run the link-check workflow to validate all ${allUrls.size} URLs.`);
  lines.push(``);

  // ── Annual Deadlines ──────────────────────────────────────────────────

  const watchlistPath = path.resolve(__dirname, "watchlist.json");
  if (fs.existsSync(watchlistPath)) {
    const watchlist = JSON.parse(fs.readFileSync(watchlistPath, "utf-8"));

    if (watchlist.annualDeadlines?.length > 0) {
      lines.push(`---`);
      lines.push(``);
      lines.push(`## Annual Deadlines`);
      lines.push(``);

      const now = new Date();
      const year = now.getFullYear();

      lines.push(`| Deadline | Date | Days Away | Status |`);
      lines.push(`|:---|:---|:---|:---|`);

      for (const dl of watchlist.annualDeadlines) {
        const [month, day] = dl.date.split("-").map(Number);
        const dlDate = new Date(year, month - 1, day);
        const daysUntil = Math.floor(
          (dlDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
        );
        const icon =
          daysUntil <= 0
            ? "🔴 Past"
            : daysUntil <= dl.reminderDaysBefore
            ? "⚠️ Approaching"
            : "✅ On track";

        lines.push(
          `| ${dl.name} | ${month}/${day}/${year} | ${daysUntil > 0 ? daysUntil : "PASSED"} | ${icon} |`
        );
      }

      lines.push(``);
    }
  }

  // ── Footer ────────────────────────────────────────────────────────────

  lines.push(`---`);
  lines.push(``);
  lines.push(`*This report is auto-generated by \`scripts/generate-freshness-report.ts\`.*`);
  lines.push(`*To re-verify an entry, update its \`lastVerified\` field and commit.*`);
  lines.push(``);

  // ── Write output ──────────────────────────────────────────────────────

  const outDir = path.resolve(__dirname, "../docs");
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const outPath = path.join(outDir, "freshness-report.md");
  fs.writeFileSync(outPath, lines.join("\n"), "utf-8");

  console.log(`✅ Freshness report generated: docs/freshness-report.md`);
  console.log(`   Content health: ${healthIcon} ${healthPct}% (${withinSla}/${totalEntries} within SLA)`);
}

main();
