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
    <div className="max-w-[1240px] mx-auto px-6 sm:px-12 py-10 sm:py-20">
      {/* Background blob */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-50/40 rounded-full blur-[140px] -z-10 translate-x-1/4 -translate-y-1/4 shadow-inner" />

      {/* Hero + search */}
      <div className="mb-16 sm:mb-20">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-600 mb-6">
          {tt("ask.hero.tag", lang)}
        </p>
        <h1 className="text-4xl sm:text-6xl font-black text-[#1e293b] mb-10 tracking-[-0.05em] leading-[0.9]">
          {tt("ask.hero.title", lang)}
        </h1>

        <div className="relative group max-w-3xl">
          <div className="absolute inset-x-0 bottom-[-20px] h-10 bg-black/5 blur-2xl rounded-full scale-95 opacity-50 group-hover:opacity-70 transition-opacity" />
          <div className="relative flex items-center">
            <Search size={22} className="absolute left-7 text-emerald-500" strokeWidth={3} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={tt("ask.search.placeholder", lang)}
              className="w-full bg-white rounded-[2rem] py-6 sm:py-8 pl-16 sm:pl-18 pr-16 text-lg sm:text-xl font-bold text-slate-800 shadow-[0_24px_48px_rgba(0,0,0,0.06)] border border-white focus:outline-none focus:ring-4 focus:ring-emerald-400/10 transition-all placeholder:text-slate-300 placeholder:font-medium"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear"
                className="absolute right-5 w-9 h-9 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Quick Topics */}
      <div className="mb-16 sm:mb-20 overflow-visible">
        <div className="flex items-center justify-between mb-8 px-2">
          <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">
            {tt("ask.topics.kicker", lang)}
          </h3>
          <button
            type="button"
            onClick={() => setActiveCat("all")}
            className={`text-xs font-black uppercase tracking-widest transition-colors ${
              activeCat === "all" ? "text-emerald-500" : "text-slate-400 hover:text-slate-600"
            }`}
          >
            {tt("ask.topics.clear", lang)}
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {visibleTopics.map((topic) => {
            const Icon = CATEGORY_ICONS[topic.category] ?? FileText;
            const isActive = activeCat === topic.category;
            return (
              <button
                key={topic.category}
                type="button"
                onClick={() => setActiveCat(topic.category)}
                className={`relative p-6 rounded-[2rem] border transition-all duration-500 flex flex-col items-center text-center group ${
                  isActive
                    ? "bg-white shadow-[0_12px_32px_rgba(0,0,0,0.05)] border-emerald-100 scale-105 z-10"
                    : "bg-transparent border-transparent text-slate-400 hover:bg-white/60 hover:border-slate-100"
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-all duration-500 ${
                    isActive
                      ? "bg-[#1a2f44] text-white shadow-lg rotate-12"
                      : "bg-slate-50 text-slate-300 group-hover:bg-white group-hover:text-slate-500"
                  }`}
                >
                  <Icon size={20} />
                </div>
                <span className={`text-[13px] font-black tracking-tight leading-none ${isActive ? "text-slate-900" : ""}`}>
                  {topic.label[lang]}
                </span>
                {isActive && <motion.div layoutId="topic-dot" className="mt-2 w-1 h-1 bg-emerald-500 rounded-full" />}
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
