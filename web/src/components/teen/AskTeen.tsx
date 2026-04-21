"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronDown, ChevronUp, X } from "lucide-react";
import Fuse from "fuse.js";
import type { Lang } from "../../lib/i18n";
import type { AgeBandKey } from "../../lib/prefs";
import { tt } from "../../lib/i18n-teen";
import { QUESTIONS, TOPIC_CONFIG, type QAEntry, type QACategory } from "../../data/questions";

interface AskTeenProps {
  lang: Lang;
  band: AgeBandKey;
}

export function AskTeen({ lang, band }: AskTeenProps) {
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState<QACategory | "all">("all");
  const [openId, setOpenId] = useState<string | null>(null);

  const bandQuestions = useMemo(
    () => QUESTIONS.filter((q) => q.ageBands.includes(band)),
    [band]
  );

  const fuse = useMemo(
    () => new Fuse(bandQuestions, {
      keys: [`question.${lang}`, `answer.${lang}`],
      threshold: 0.35,
      includeScore: false,
    }),
    [bandQuestions, lang]
  );

  const results = useMemo(() => {
    const base = query.trim()
      ? fuse.search(query).map((r) => r.item)
      : bandQuestions;
    return activeCat === "all" ? base : base.filter((q) => q.category === activeCat);
  }, [query, activeCat, bandQuestions, fuse]);

  const cats: QACategory[] = Array.from(new Set(bandQuestions.map((q) => q.category)));

  return (
    <div className="max-w-[1100px] mx-auto px-6 sm:px-12 py-10 sm:py-20 space-y-10">
      {/* Hero */}
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-600 mb-4">{tt("ask.hero.tag", lang)}</p>
        <h1 className="text-4xl sm:text-6xl font-black text-[#1e293b] mb-4 tracking-[-0.05em] leading-[0.95]">{tt("ask.hero.title", lang)}</h1>
        <p className="text-slate-500 text-lg font-bold max-w-2xl leading-relaxed">{tt("ask.hero.subtitle", lang)}</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={tt("ask.search.placeholder", lang)}
          className="w-full pl-14 pr-12 py-5 rounded-2xl bg-white border border-slate-100 shadow-sm text-base font-semibold text-[#1e293b] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            aria-label="Clear"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Category chips */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setActiveCat("all")}
          className={`px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-widest transition-colors ${
            activeCat === "all" ? "bg-[#1a2f44] text-white" : "bg-white border border-slate-200 text-slate-500 hover:bg-slate-50"
          }`}
        >
          {tt("ask.chip.all", lang)}
        </button>
        {cats.map((c) => {
          const cfg = TOPIC_CONFIG.find((t) => t.category === c);
          const label = cfg ? cfg.label[lang] : c;
          const isActive = activeCat === c;
          return (
            <button
              key={c}
              type="button"
              onClick={() => setActiveCat(c)}
              className={`px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-widest transition-colors ${
                isActive ? "bg-[#1a2f44] text-white" : "bg-white border border-slate-200 text-slate-500 hover:bg-slate-50"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Results */}
      {results.length === 0 ? (
        <div className="rounded-2xl bg-white border border-slate-100 p-8 text-center text-slate-500 font-medium">
          {tt("ask.no_results", lang)}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {results.map((q: QAEntry, idx) => {
            const isOpen = openId === q.id;
            return (
              <motion.div
                key={q.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(idx, 12) * 0.03, duration: 0.3 }}
                className="rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenId(isOpen ? null : q.id)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-slate-50 transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="font-black text-[#1e293b] text-base pr-4">{q.question[lang]}</span>
                  {isOpen ? <ChevronUp size={18} className="text-slate-400 shrink-0" /> : <ChevronDown size={18} className="text-slate-400 shrink-0" />}
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 text-slate-700 font-medium leading-relaxed whitespace-pre-line">
                        {q.answer[lang]}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
