"use client";

import { useState, useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Search, Phone, ExternalLink, X } from "lucide-react";
import Fuse from "fuse.js";
import type { Lang } from "../../lib/i18n";
import type { AgeBandKey } from "../../lib/prefs";
import { tt } from "../../lib/i18n-teen";
import { RESOURCES, CATEGORY_LABELS_ES } from "../../data/resources";
import { CrisisQuickLinks } from "../CrisisQuickLinks";

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

interface ResourcesTeenProps {
  lang: Lang;
  band: AgeBandKey;
  county: string;
}

export function ResourcesTeen({ lang, band, county }: ResourcesTeenProps) {
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState<string | "all">("all");
  const reduce = useReducedMotion();
  const es = lang === "es";

  const ageMid = band === "13-15" ? 14 : band === "16-17" ? 17 : 20;

  const ageCountyFiltered = useMemo(
    () =>
      RESOURCES.filter((r) => {
        if (r.ages[0] > ageMid || r.ages[1] < ageMid) return false;
        const counties = r.counties as readonly string[];
        if (!counties.includes("Statewide") && county !== "Unknown" && !counties.includes(county)) return false;
        return true;
      }),
    [ageMid, county]
  );

  const cats = useMemo(
    () => Array.from(new Set(ageCountyFiltered.flatMap((r) => r.categories as readonly string[]))),
    [ageCountyFiltered]
  );

  const fuse = useMemo(
    () =>
      new Fuse(ageCountyFiltered, {
        keys: ["name", "description", "description_es", "categories"],
        threshold: 0.35,
      }),
    [ageCountyFiltered]
  );

  const results = useMemo(() => {
    const base = query.trim() ? fuse.search(query).map((r) => r.item) : ageCountyFiltered;
    return activeCat === "all" ? base : base.filter((r) => (r.categories as readonly string[]).includes(activeCat));
  }, [query, activeCat, ageCountyFiltered, fuse]);

  return (
    <div className="max-w-[1100px] mx-auto px-6 sm:px-12 py-10 sm:py-20 space-y-10">
      {/* Hero */}
      <div>
        <p className="text-xs font-black uppercase tracking-[0.4em] text-emerald-700 mb-4">{tt("resources.hero.tag", lang)}</p>
        <h1 className="text-4xl sm:text-6xl font-black text-[#1e293b] mb-4 tracking-[-0.05em] leading-[0.95]">{tt("resources.hero.title", lang)}</h1>
        <p className="text-slate-500 text-lg font-bold max-w-2xl leading-relaxed">{tt("resources.hero.subtitle", lang)}</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={20} aria-hidden="true" className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none" />
        <input
          type="text"
          aria-label={es ? "Buscar recursos" : "Search resources"}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={tt("resources.search.placeholder", lang)}
          className="w-full pl-14 pr-12 py-5 rounded-2xl bg-white border border-slate-100 shadow-sm text-base font-semibold text-[#1e293b] placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-600"
        />
        {query && (
          <button type="button" onClick={() => setQuery("")} aria-label={es ? "Borrar búsqueda" : "Clear search"} className="absolute right-1.5 top-1/2 -translate-y-1/2 w-11 h-11 inline-flex items-center justify-center rounded-xl text-slate-600 hover:text-slate-800">
            <X size={18} aria-hidden="true" />
          </button>
        )}
      </div>

      {/* Chips */}
      <div role="group" aria-label={es ? "Filtrar por categoría" : "Filter by category"} className="flex flex-wrap gap-2">
        <button
          type="button"
          aria-pressed={activeCat === "all"}
          onClick={() => setActiveCat("all")}
          className={`inline-flex items-center min-h-11 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-colors ${
            activeCat === "all" ? "bg-[#1a2f44] text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
          }`}
        >
          {tt("resources.chip.all", lang)}
        </button>
        {cats.map((c) => {
          const isActive = activeCat === c;
          const label = lang === "es" ? CATEGORY_LABELS_ES[c] ?? c : CATEGORY_LABELS_EN[c] ?? c;
          return (
            <button
              key={c}
              type="button"
              aria-pressed={isActive}
              onClick={() => setActiveCat(c)}
              className={`inline-flex items-center min-h-11 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-colors ${
                isActive ? "bg-[#1a2f44] text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Results */}
      {results.length === 0 ? (
        <div className="rounded-2xl bg-white border border-slate-100 p-8 text-center">
          <p className="text-slate-600 font-medium mb-6">{tt("resources.no_results", lang)}</p>
          <p className="text-[#1B3A5C] text-lg font-black tracking-tight mb-4">{tt("help.person_now", lang)}</p>
          <div className="flex justify-center mb-5">
            <CrisisQuickLinks lang={lang} variant="compact" />
          </div>
          <p className="text-slate-600 text-sm font-medium">{tt("help.everyday_211", lang)}</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-5">
          {results.map((r, idx) => {
            const desc = lang === "es" ? r.description_es : r.description;
            const primaryCat = (r.categories as readonly string[])[0];
            const primaryLabel = lang === "es" ? CATEGORY_LABELS_ES[primaryCat] ?? primaryCat : CATEGORY_LABELS_EN[primaryCat] ?? primaryCat;
            return (
              <motion.div
                key={r.id}
                initial={{ y: 12 }}
                animate={{ y: 0 }}
                transition={{ delay: reduce ? 0 : Math.min(idx, 12) * 0.03, duration: reduce ? 0 : 0.3 }}
                className="rounded-[1.75rem] bg-white border border-slate-100 p-6 shadow-sm flex flex-col"
              >
                <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-700 mb-2">{primaryLabel}</p>
                <h2 className="font-black text-[#1e293b] text-lg tracking-tight mb-2">{r.name}</h2>
                <p className="text-slate-600 text-sm font-medium leading-relaxed mb-5 flex-1">{desc}</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {r.phone && (
                    <a href={`tel:${r.phone.replace(/\D/g, "")}`} aria-label={`${tt("resources.call", lang)} ${r.phone} — ${r.name}`} className="inline-flex items-center gap-2 px-4 py-2.5 min-h-11 rounded-xl bg-[#2A7F8E] text-white font-bold text-sm hover:bg-[#236b78] transition">
                      <Phone size={14} aria-hidden="true" /> {tt("resources.call", lang)} <span className="tabular-nums">{r.phone}</span>
                    </a>
                  )}
                  {r.url && (
                    <a href={r.url} target="_blank" rel="noreferrer" aria-label={`${tt("resources.visit", lang)}: ${r.name} (${es ? "se abre en una pestaña nueva" : "opens in a new tab"})`} className="inline-flex items-center gap-2 px-4 py-2.5 min-h-11 rounded-xl bg-[#1a2f44] text-white font-bold text-sm hover:opacity-90 transition">
                      <ExternalLink size={14} aria-hidden="true" /> {tt("resources.visit", lang)}
                    </a>
                  )}
                </div>
                <p className="text-xs text-slate-600 uppercase tracking-widest font-bold">{tt("resources.verified", lang)}: {r.lastVerified}</p>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
