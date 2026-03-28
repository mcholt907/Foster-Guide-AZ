"use client";

import { useState, useMemo, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { MapPin, Search, ExternalLink, Phone } from "lucide-react";
import type { Lang } from "../../../lib/i18n";
import { t } from "../../../lib/i18n";
import { useOnboardingGate } from "../../../lib/useOnboardingGate";
import { RESOURCES, CATEGORY_LABELS_ES } from "../../../data/resources";
import { ScreenHero, Chip } from "../../../components/ui";

const CATEGORY_LABELS_EN: Record<string, string> = {
  emergency: "emergency",
  housing: "housing",
  food: "food",
  legal: "legal",
  health: "health",
  employment: "jobs",
  transition: "transition",
  rights: "rights",
  money: "money",
  education: "education",
  community: "community",
};

const ALL_CATEGORIES = ["legal", "housing", "health", "employment", "transition", "rights", "money", "education", "emergency", "food", "community"];

export default function ResourcesPage() {
  const { lang: rawLang } = useParams<{ lang: string }>();
  const lang: Lang = rawLang === "es" ? "es" : "en";
  const prefs = useOnboardingGate(lang);
  const router = useRouter();

  useEffect(() => {
    if (prefs.ageBand === "10-12") router.replace(`/${lang}`);
  }, [prefs.ageBand, lang, router]);

  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const ageMid = prefs.ageBand === "10-12" ? 11 : prefs.ageBand === "13-15" ? 14 : prefs.ageBand === "16-17" ? 17 : 20;
  const county = prefs.county ?? "Statewide";

  const filtered = useMemo(() => {
    return RESOURCES.filter((r) => {
      // Age filter
      if (r.ages[0] > ageMid || r.ages[1] < ageMid) return false;
      // County filter
      const counties = r.counties as readonly string[];
      if (!counties.includes("Statewide") && county !== "Unknown" && !counties.includes(county)) return false;
      // Category filter
      if (activeCategory && !(r.categories as readonly string[]).includes(activeCategory)) return false;
      // Query filter
      if (query.trim()) {
        const q = query.toLowerCase();
        const desc = lang === "es" ? r.description_es : r.description;
        if (!r.name.toLowerCase().includes(q) && !desc.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [query, activeCategory, ageMid, county, lang]);

  return (
    <div className="pb-8">
      <ScreenHero
        icon={MapPin}
        title={lang === "es" ? "Encuentra recursos" : "Find Resources"}
        subtitle={
          lang === "es"
            ? `Organizaciones reales${county !== "Unknown" ? ` en ${county}` : ""} — filtradas para tu edad.`
            : `Real organizations${county !== "Unknown" ? ` in ${county}` : ""} — filtered for your age.`
        }
        gradient="from-emerald-600 to-[#2A7F8E]"
        lang={lang}
      />

      {/* Search */}
      <div className="mt-4 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="search"
          placeholder={t("resources_search_placeholder", lang)}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-2xl bg-white/85 pl-9 pr-4 py-3 text-sm ring-1 ring-black/10 focus:outline-none focus:ring-2 focus:ring-[#2A7F8E] placeholder:text-slate-400"
        />
      </div>

      {/* Category chips */}
      <div className="mt-3 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setActiveCategory(null)}
          className={
            "shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold ring-1 transition-colors " +
            (activeCategory === null
              ? "bg-[#1B3A5C] text-white ring-[#1B3A5C]"
              : "bg-white text-slate-600 ring-black/10 hover:ring-black/20")
          }
        >
          {lang === "es" ? "Todos" : "All"}
        </button>
        {ALL_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat === activeCategory ? null : cat)}
            className={
              "shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold ring-1 transition-colors " +
              (activeCategory === cat
                ? "bg-[#2A7F8E] text-white ring-[#2A7F8E]"
                : "bg-white text-slate-600 ring-black/10 hover:ring-black/20")
            }
          >
            {lang === "es" ? CATEGORY_LABELS_ES[cat] : CATEGORY_LABELS_EN[cat]}
          </button>
        ))}
      </div>

      {/* Results */}
      <div className="mt-4 grid gap-3">
        {filtered.length === 0 && (
          <div className="rounded-3xl bg-white/85 p-6 ring-1 ring-black/5 text-center">
            <p className="text-sm text-slate-500">
              {lang === "es" ? "No se encontraron recursos." : "No resources found."}
            </p>
          </div>
        )}
        {filtered.map((r) => (
          <div
            key={r.id}
            className="rounded-3xl bg-white/85 p-4 ring-1 ring-black/5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-[#1B3A5C] leading-snug">{r.name}</div>
                <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                  {lang === "es" ? r.description_es : r.description}
                </p>
              </div>
              {r.spanish && (
                <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 ring-1 ring-emerald-200">
                  ES
                </span>
              )}
            </div>

            {/* Category pills */}
            <div className="mt-2 flex flex-wrap gap-1.5">
              {(r.categories as readonly string[]).map((cat) => (
                <Chip key={cat}>
                  {lang === "es" ? CATEGORY_LABELS_ES[cat] ?? cat : CATEGORY_LABELS_EN[cat] ?? cat}
                </Chip>
              ))}
              {(r.counties as readonly string[]).filter((c) => c !== "Statewide").map((c) => (
                <Chip key={c}>{c}</Chip>
              ))}
              {(r.counties as readonly string[]).includes("Statewide") && (
                <Chip>{lang === "es" ? "Todo AZ" : "Statewide"}</Chip>
              )}
            </div>

            {/* Contact buttons */}
            <div className="mt-3 flex gap-2">
              {r.phone && (
                <a
                  href={`tel:${r.phone.replace(/\D/g, "")}`}
                  className="flex items-center gap-1.5 rounded-xl bg-[#2A7F8E]/10 px-3 py-2 text-xs font-semibold text-[#2A7F8E]"
                >
                  <Phone className="h-3.5 w-3.5" />
                  {r.phone}
                </a>
              )}
              {r.url && (
                <a
                  href={r.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 rounded-xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-600"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  {t("common_website", lang)}
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Spanish-speaking note */}
      <div className="mt-4 rounded-2xl bg-white/60 p-3 text-xs text-slate-500 ring-1 ring-slate-200/80">
        <span className="font-semibold text-slate-700">ES </span>
        {t("resources_spanish_label", lang)}
      </div>
    </div>
  );
}
