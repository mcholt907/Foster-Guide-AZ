"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, ChevronDown, X, Scale, FileText, ShieldCheck, Users,
  CreditCard, Building2, Sparkles, Home as HomeIcon, GraduationCap,
  Compass, Info,
} from "lucide-react";
import Fuse from "fuse.js";
import type { LucideIcon } from "lucide-react";
import type { Lang } from "../../lib/i18n";
import type { AgeBandKey } from "../../lib/prefs";
import { tt } from "../../lib/i18n-teen";
import { QUESTIONS, TOPIC_CONFIG, type QAEntry, type QACategory } from "../../data/questions";

const CATEGORY_ICONS: Record<QACategory, LucideIcon> = {
  rights: Scale,
  case: FileText,
  court: Scale,
  safety: ShieldCheck,
  corner: Users,
  documents: CreditCard,
  housing: Building2,
  turning18: Sparkles,
  benefits: HomeIcon,
  school: GraduationCap,
};

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
    () =>
      new Fuse(bandQuestions, {
        keys: [`question.${lang}`, `answer.${lang}`],
        threshold: 0.35,
      }),
    [bandQuestions, lang]
  );

  const results = useMemo(() => {
    const base = query.trim() ? fuse.search(query).map((r) => r.item) : bandQuestions;
    return activeCat === "all" ? base : base.filter((q) => q.category === activeCat);
  }, [query, activeCat, bandQuestions, fuse]);

  const visibleTopics = useMemo(
    () => TOPIC_CONFIG.filter((t) => t.bands.includes(band)),
    [band]
  );

  return (
    <div className="max-w-[1240px] mx-auto px-4 pt-6 pb-12 sm:px-12 sm:py-20">
      {/* Background blob */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-50/40 rounded-full blur-[140px] -z-10 translate-x-1/4 -translate-y-1/4 shadow-inner" />

      {/* Hero + search */}
      <div className="mb-10 sm:mb-20">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-600 mb-4 sm:mb-6">
          {tt("ask.hero.tag", lang)}
        </p>
        <h1 className="text-4xl sm:text-6xl font-black text-[#1e293b] mb-6 sm:mb-10 tracking-[-0.05em] leading-[0.9]">
          {tt("ask.hero.title", lang)}
        </h1>

        <div className="relative group max-w-3xl">
          <div className="absolute inset-x-0 bottom-[-20px] h-10 bg-black/5 blur-2xl rounded-full scale-95 opacity-50 group-hover:opacity-70 transition-opacity" />
          <div className="relative flex items-center">
            <Search size={22} className="absolute left-5 sm:left-7 text-emerald-500" strokeWidth={3} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={tt("ask.search.placeholder", lang)}
              className="w-full bg-white rounded-[1.5rem] sm:rounded-[2rem] py-4 sm:py-8 pl-14 sm:pl-18 pr-14 sm:pr-16 text-base sm:text-xl font-bold text-slate-800 shadow-[0_12px_32px_rgba(0,0,0,0.06)] border border-white focus:outline-none focus:ring-4 focus:ring-emerald-400/10 transition-all placeholder:text-slate-400 placeholder:font-medium text-ellipsis"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear"
                className="absolute right-4 sm:right-5 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 hover:text-slate-700 transition-colors"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Quick Topics */}
      <div className="mb-10 sm:mb-20 overflow-visible">
        <div className="flex items-center justify-between mb-6 px-1">
          <h3 className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.3em] sm:tracking-[0.4em] text-slate-400">
            {tt("ask.topics.kicker", lang)}
          </h3>
          <button
            type="button"
            onClick={() => setActiveCat("all")}
            className={`text-[10px] sm:text-xs font-black uppercase tracking-widest transition-colors ${
              activeCat === "all" ? "text-emerald-500" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {tt("ask.topics.clear", lang)}
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-4">
          {visibleTopics.map((topic) => {
            const Icon = CATEGORY_ICONS[topic.category] ?? FileText;
            const isActive = activeCat === topic.category;
            return (
              <button
                key={topic.category}
                type="button"
                onClick={() => setActiveCat(topic.category)}
                className={`relative px-3 py-4 sm:p-6 rounded-2xl sm:rounded-[2rem] border transition-all duration-300 flex flex-col items-center justify-center text-center group ${
                  isActive
                    ? "bg-white shadow-[0_8px_24px_rgba(0,0,0,0.08)] border-emerald-200 scale-105 z-10"
                    : "bg-white/50 border-slate-200 hover:bg-white hover:border-slate-300 hover:shadow-sm"
                }`}
              >
                <div
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center mb-2 sm:mb-4 transition-all duration-300 ${
                    isActive
                      ? "bg-[#1a2f44] text-white shadow-md rotate-6"
                      : "bg-slate-100 text-slate-500 group-hover:bg-[#1a2f44] group-hover:text-white"
                  }`}
                >
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <span className={`text-[12px] sm:text-[13px] font-black tracking-tight leading-tight ${isActive ? "text-slate-900" : "text-slate-600 group-hover:text-slate-800"}`}>
                  {topic.label[lang]}
                </span>
                {isActive && <motion.div layoutId="topic-dot" className="mt-2 w-1.5 h-1.5 bg-emerald-500 rounded-full" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results + sidebar */}
      <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
        {/* Question list */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          {results.length === 0 ? (
            <div className="py-20 text-center bg-white rounded-[2.5rem] border border-dashed border-slate-200">
              <p className="text-slate-400 font-bold">{tt("ask.no_results", lang)}</p>
            </div>
          ) : (
            results.map((q: QAEntry) => {
              const isOpen = openId === q.id;
              const Icon = CATEGORY_ICONS[q.category] ?? FileText;
              const answerSource = band === "10-12" && q.answer1012 ? q.answer1012 : q.answer;
              const topicLabel = TOPIC_CONFIG.find((t) => t.category === q.category)?.label[lang];
              return (
                <div
                  key={q.id}
                  className={`transition-all duration-500 rounded-[2rem] border overflow-hidden ${
                    isOpen
                      ? "bg-white shadow-[0_24px_64px_rgba(0,0,0,0.03)] border-slate-100"
                      : "bg-transparent border-transparent hover:bg-white/60 hover:border-slate-100"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenId(isOpen ? null : q.id)}
                    aria-expanded={isOpen}
                    className="w-full flex items-center justify-between p-6 sm:p-7 text-left group"
                  >
                    <div className="flex items-center gap-5 sm:gap-6">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                          isOpen
                            ? "bg-emerald-500 text-white"
                            : "bg-slate-50 text-slate-300 group-hover:bg-white shadow-sm"
                        }`}
                      >
                        <Icon size={18} />
                      </div>
                      <span className={`text-base sm:text-lg font-bold tracking-tight pr-4 sm:pr-6 transition-colors ${isOpen ? "text-slate-900" : "text-slate-600"}`}>
                        {q.question[lang]}
                      </span>
                    </div>
                    <div
                      className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-slate-50 text-slate-400 transition-transform ${
                        isOpen ? "rotate-180 bg-slate-900 text-white" : ""
                      }`}
                    >
                      <ChevronDown size={14} strokeWidth={3} />
                    </div>
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
                        <div className="px-6 sm:px-7 pb-8 sm:pb-10 pt-2 pl-[76px] sm:pl-[84px] pr-6 sm:pr-10">
                          <p className="text-[#334155] text-base sm:text-lg font-medium leading-[1.8] tracking-tight mb-8 whitespace-pre-line">
                            {answerSource[lang]}
                          </p>

                          <div className="flex flex-wrap items-center gap-3">
                            {q.citations?.map((c, i) => (
                              <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 border border-slate-100 text-[10px] font-black text-slate-400 tracking-wider">
                                <Scale size={12} /> {c}
                              </div>
                            ))}
                            {topicLabel && (
                              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-[10px] font-black text-emerald-600 tracking-wider uppercase">
                                {topicLabel}
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })
          )}
        </div>

        {/* Strategic Advisor sidebar */}
        <div className="lg:col-span-4 lg:sticky lg:top-10 flex flex-col gap-6">
          <div className="bg-[#1a2f44] text-white p-8 sm:p-10 rounded-[2.5rem] shadow-[0_24px_80px_rgba(0,0,0,0.15)] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-400/5 blur-3xl rounded-full" />
            <div className="flex items-center gap-4 mb-8">
              <div className="w-10 h-10 bg-white shadow-[0_12px_24px_rgba(255,255,255,0.1)] rounded-2xl flex items-center justify-center shrink-0">
                <Compass size={20} className="text-[#1a2f44]" strokeWidth={3} />
              </div>
              <h4 className="font-black text-lg tracking-tight">{tt("ask.advisor.heading", lang)}</h4>
            </div>

            <p className="text-slate-300 text-sm font-bold leading-relaxed mb-10 pl-4 border-l-2 border-emerald-400">
              &ldquo;{tt("ask.advisor.quote", lang)}&rdquo;
            </p>

            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-white/5 border border-white/5 group-hover:border-white/10 transition-colors">
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 block mb-2">
                  {tt("ask.advisor.tip1.label", lang)}
                </span>
                <p className="text-xs font-bold leading-relaxed text-slate-100 opacity-90">
                  {tt("ask.advisor.tip1.body", lang)}
                </p>
              </div>
              <div className="p-5 rounded-2xl bg-white/5 border border-white/5 group-hover:border-white/10 transition-colors">
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 block mb-2">
                  {tt("ask.advisor.tip2.label", lang)}
                </span>
                <p className="text-xs font-bold leading-relaxed text-slate-100 opacity-90">
                  {tt("ask.advisor.tip2.body", lang)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/40 backdrop-blur-md rounded-[2.5rem] p-8 sm:p-10 border border-white shadow-sm flex flex-col items-center text-center">
            <Info size={30} className="text-slate-400 mb-6" />
            <h5 className="font-black text-[#1e293b] mb-4 tracking-tight">{tt("ask.callout.heading", lang)}</h5>
            <p className="text-slate-400 text-sm font-medium leading-relaxed mb-8">
              {tt("ask.callout.body", lang)}
            </p>
            <Link
              href={`/${lang}/team`}
              className="w-full py-4 rounded-xl bg-slate-900 text-white font-black text-xs uppercase tracking-widest hover:bg-emerald-500 transition-all hover:scale-105 text-center"
            >
              {tt("ask.callout.cta", lang)}
            </Link>
          </div>
        </div>
      </div>

      {/* Footer quote */}
      <div className="mt-32 sm:mt-40 text-center py-16 sm:py-20 border-t border-slate-100">
        <div className="max-w-xl mx-auto">
          <span className="text-3xl italic font-black text-slate-200 block mb-6 sm:mb-8">&ldquo;</span>
          <p className="text-xl sm:text-2xl font-black text-[#1e293b] tracking-tight leading-tight mb-6 sm:mb-8">
            {tt("ask.footer.quote", lang)}
          </p>
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">
            {tt("ask.footer.tag", lang)}
          </span>
        </div>
      </div>
    </div>
  );
}
