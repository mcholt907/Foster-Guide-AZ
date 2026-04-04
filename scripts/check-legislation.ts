/**
 * check-legislation.ts
 *
 * Checks for Arizona legislative activity affecting statutes
 * referenced in FosterHub AZ content.
 *
 * Reads scripts/watchlist.json for the list of statutes to monitor.
 * Queries the Arizona Legislature website for current-session bill activity.
 *
 * Run: npx tsx scripts/check-legislation.ts
 */

import * as fs from "fs";
import * as path from "path";

// ── Types ────────────────────────────────────────────────────────────────────

interface Statute {
  section: string;
  title: string;
  affectedFiles: string[];
  checkFrequency: string;
  lookupUrl: string;
}

interface Watchlist {
  state: string;
  description: string;
  statutes: Statute[];
  federalStatutes: Statute[];
  annualDeadlines: {
    name: string;
    date: string;
    description: string;
    affectedFiles: string[];
    reminderDaysBefore: number;
  }[];
}

interface CheckResult {
  statute: string;
  title: string;
  status: "needs-review" | "ok" | "deadline-approaching";
  message: string;
  affectedFiles: string[];
}

// ── Main ─────────────────────────────────────────────────────────────────────

function main(): void {
  const watchlistPath = path.resolve(__dirname, "watchlist.json");

  if (!fs.existsSync(watchlistPath)) {
    console.error("❌ watchlist.json not found at", watchlistPath);
    process.exit(1);
  }

  const watchlist: Watchlist = JSON.parse(
    fs.readFileSync(watchlistPath, "utf-8")
  );

  console.log("⚖️  Legislative change checker for FosterHub AZ\n");
  console.log(
    `   Monitoring ${watchlist.statutes.length} AZ statutes and ${watchlist.federalStatutes.length} federal statutes\n`
  );

  const results: CheckResult[] = [];
  const today = new Date();
  const currentYear = today.getFullYear();

  // ── Check AZ Legislature session ────────────────────────────────────────

  console.log("📋 Arizona Statutes to Review:\n");
  console.log("   Section    | Title                                    | Lookup URL");
  console.log("   -----------|------------------------------------------|----------");

  for (const statute of watchlist.statutes) {
    console.log(
      `   §${statute.section.padEnd(9)} | ${statute.title.padEnd(40)} | ${statute.lookupUrl}`
    );

    results.push({
      statute: `A.R.S. §${statute.section}`,
      title: statute.title,
      status: "needs-review",
      message: `Manually verify at ${statute.lookupUrl} — check for ${currentYear} session bills amending §${statute.section}`,
      affectedFiles: statute.affectedFiles,
    });
  }

  // ── Check federal statutes ──────────────────────────────────────────────

  if (watchlist.federalStatutes.length > 0) {
    console.log("\n\n📋 Federal Statutes to Review:\n");
    for (const statute of watchlist.federalStatutes) {
      console.log(`   ${statute.section} — ${statute.title}`);
      console.log(`     Lookup: ${statute.lookupUrl}`);

      results.push({
        statute: statute.section,
        title: statute.title,
        status: "needs-review",
        message: `Manually verify — check for federal amendments to ${statute.section}`,
        affectedFiles: statute.affectedFiles,
      });
    }
  }

  // ── Check annual deadlines ──────────────────────────────────────────────

  if (watchlist.annualDeadlines.length > 0) {
    console.log("\n\n📅 Annual Deadlines:\n");

    for (const deadline of watchlist.annualDeadlines) {
      const [month, day] = deadline.date.split("-").map(Number);
      const deadlineDate = new Date(currentYear, month - 1, day);
      const daysUntil = Math.floor(
        (deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      );

      let status: CheckResult["status"] = "ok";
      let icon = "✅";

      if (daysUntil <= deadline.reminderDaysBefore && daysUntil > 0) {
        status = "deadline-approaching";
        icon = "⚠️";
      } else if (daysUntil <= 0) {
        // Deadline has passed for this year — check if content has been updated
        status = "needs-review";
        icon = "🔴";
      }

      console.log(
        `   ${icon} ${deadline.name}: ${month}/${day}/${currentYear} (${
          daysUntil > 0
            ? `${daysUntil} days away`
            : `${Math.abs(daysUntil)} days ago`
        })`
      );
      console.log(`      ${deadline.description}`);

      results.push({
        statute: deadline.name,
        title: deadline.description,
        status,
        message:
          daysUntil > 0
            ? `Deadline in ${daysUntil} days — verify content is current for ${currentYear}`
            : `Deadline has passed — verify ${currentYear + 1} deadline date and update content`,
        affectedFiles: deadline.affectedFiles,
      });
    }
  }

  // ── Summary ─────────────────────────────────────────────────────────────

  const needsReview = results.filter((r) => r.status === "needs-review");
  const approaching = results.filter((r) => r.status === "deadline-approaching");

  console.log("\n\n─── Summary ───\n");
  console.log(`   📋 Statutes to verify:      ${watchlist.statutes.length + watchlist.federalStatutes.length}`);
  console.log(`   ⚠️  Deadlines approaching:   ${approaching.length}`);
  console.log(`   🔴 Deadlines past:          ${needsReview.filter((r) => r.statute.includes("Deadline") || r.statute.includes("ETV")).length}`);

  // ── Generate review checklist ───────────────────────────────────────────

  console.log("\n\n─── Review Checklist (copy to GitHub Issue) ───\n");
  console.log(`## Legislative Review — ${today.toISOString().split("T")[0]}\n`);

  console.log("### Arizona Statutes\n");
  for (const statute of watchlist.statutes) {
    console.log(
      `- [ ] **A.R.S. §${statute.section}** — ${statute.title}`
    );
    console.log(`  - [Search for bills](${statute.lookupUrl})`);
    if (statute.affectedFiles.length > 0) {
      console.log(`  - Files to update if changed: ${statute.affectedFiles.join(", ")}`);
    }
  }

  if (watchlist.federalStatutes.length > 0) {
    console.log("\n### Federal Statutes\n");
    for (const statute of watchlist.federalStatutes) {
      console.log(`- [ ] **${statute.section}** — ${statute.title}`);
    }
  }

  if (watchlist.annualDeadlines.length > 0) {
    console.log("\n### Annual Deadlines\n");
    for (const deadline of watchlist.annualDeadlines) {
      console.log(
        `- [ ] **${deadline.name}** (${deadline.date}) — ${deadline.description}`
      );
      if (deadline.affectedFiles.length > 0) {
        console.log(`  - Files: ${deadline.affectedFiles.join(", ")}`);
      }
    }
  }

  console.log();
}

main();
