"use client";
import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { Search, X, ChevronRight, BookOpen } from "lucide-react";
import Fuse from "fuse.js";
import type { Lang } from "../../../lib/i18n";
import { t } from "../../../lib/i18n";
import { useOnboardingGate } from "../../../lib/useOnboardingGate";
import { ScreenHero, Modal, SafeNotice } from "../../../components/ui";
import {
  QUESTIONS,
  TOPIC_CONFIG,
  RESOURCE_LINK_CATEGORIES,
  type QAEntry,
  type QACategory,
} from "../../../data/questions";

// ── Age-band-specific copy ────────────────────────────────────────────────────

const HERO_SUBTITLE: Record<string, { en: string; es: string }> = {
  "10-12": {
    en: "You have rights. Here's what they mean for you.",
    es: "Tienes derechos. Aquí está lo que significan para ti.",
  },
  "13-15": {
    en: "Your rights, your case, your voice — find real answers.",
    es: "Tus derechos, tu caso, tu voz — encuentra respuestas reales.",
  },
  "16-17": {
    en: "Get answers about your rights, your case, and what comes next.",
    es: "Encuentra respuestas sobre tus derechos, tu caso y lo que viene.",
  },
  "18-21": {
    en: "You've got questions about life after care. Here are real answers.",
    es: "Tienes preguntas sobre la vida después del cuidado. Aquí hay respuestas reales.",
  },
};

const COMPASS_GREETING: Record<string, { en: string; es: string }> = {
  "10-12": {
    en: "Being in foster care can feel really confusing. I'm here to explain things in plain language — just tap a topic or search for what's on your mind.",
    es: "El cuidado adoptivo puede sentirse muy confuso. Estoy aquí para explicarte las cosas en palabras simples — solo toca un tema o busca lo que tienes en mente.",
  },
  "13-15": {
    en: "You deserve to know what's happening in your case and what rights you have. Pick a topic or search for anything — I'll give you straight answers.",
    es: "Mereces saber qué está pasando en tu caso y qué derechos tienes. Elige un tema o busca lo que quieras — te daré respuestas claras.",
  },
  "16-17": {
    en: "There's a lot happening right now — court, turning 18, figuring out what's next. Pick a topic below or search for what's on your mind.",
    es: "Hay mucho pasando ahora mismo — el tribunal, cumplir 18, descubrir qué sigue. Elige un tema o busca lo que tienes en mente.",
  },
  "18-21": {
    en: "You're navigating a lot right now. Whether it's housing, benefits, or just figuring out your options — you're not alone. Search or browse below.",
    es: "Estás manejando mucho ahora mismo. Ya sea vivienda, beneficios, o simplemente descubrir tus opciones — no estás solo/a. Busca o navega abajo.",
  },
};

// ── Component ────────────────────────────────────────────────────────────────

export default function FindAnswersPage() {
  const { lang: rawLang } = useParams<{ lang: string }>();
  const lang: Lang = rawLang === "es" ? "es" : "en";
  const prefs = useOnboardingGate(lang);

  const ageBand = prefs?.ageBand ?? "13-15";

  // Visible topics for this age band
  const visibleTopics = useMemo(
    () => TOPIC_CONFIG.filter((tc) => tc.bands.includes(ageBand)),
    [ageBand]
  );

  // State
  const [query, setQuery] = useState("");
  const [activeTopic, setActiveTopic] = useState<QACategory | null>(
    () => visibleTopics[0]?.category ?? null
  );
  const [selectedEntry, setSelectedEntry] = useState<QAEntry | null>(null);

  const isSearching = query.trim().length > 0;

  // Band-filtered entry pool
  const bandEntries = useMemo(
    () => QUESTIONS.filter((q) => q.ageBands.includes(ageBand)),
    [ageBand]
  );

  // Fuse search index (rebuilt when band or lang changes)
  const fuse = useMemo(
    () =>
      new Fuse(bandEntries, {
        keys: [
          { name: `question.${lang}`, weight: 2 },
          { name: `answer.${lang}`, weight: 1 },
        ],
        threshold: 0.4,
        includeScore: true,
      }),
    [bandEntries, lang]
  );

  // Displayed entries: search results OR topic-filtered browse
  const displayedEntries = useMemo(() => {
    if (isSearching) {
      return fuse.search(query.trim(), { limit: 8 }).map((r) => r.item);
    }
    if (activeTopic) {
      return bandEntries.filter((q) => q.category === activeTopic);
    }
    return [];
  }, [isSearching, query, fuse, activeTopic, bandEntries]);

  // Related entries for answer modal
  const relatedEntries = useMemo(() => {
    if (!selectedEntry?.relatedIds) return [];
    return selectedEntry.relatedIds
      .map((id) => bandEntries.find((q) => q.id === id))
      .filter((q): q is QAEntry => q !== undefined)
      .slice(0, 3);
  }, [selectedEntry, bandEntries]);

  function handleClearSearch() {
    setQuery("");
  }

  function handleTopicSelect(category: QACategory) {
    setActiveTopic(category);
    setQuery("");
  }

  const heroSubtitle =
    HERO_SUBTITLE[ageBand]?.[lang] ?? HERO_SUBTITLE["13-15"][lang];
  const compassGreeting =
    COMPASS_GREETING[ageBand]?.[lang] ?? COMPASS_GREETING["13-15"][lang];

  return (
    <div className="flex flex-col gap-4 pb-6">
      {/* Hero */}
      <ScreenHero
        icon={BookOpen}
        title={t("ask_title", lang)}
        subtitle={heroSubtitle}
        gradient="from-[#2A7F8E] via-[#1a5f7e] to-[#1B3A5C]"
        lang={lang}
      />

      {/* Compass intro card */}
      <div className="rounded-3xl bg-white/95 p-5 shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
        <div className="flex items-center gap-3 mb-3">
          <img
            src="/icons/icon-192.svg"
            className="h-11 w-11 shrink-0 rounded-2xl shadow-md"
            alt=""
            aria-hidden="true"
          />
          <div>
            <div className="text-sm font-semibold text-[#1B3A5C]">
              {lang === "es" ? "Hola, soy Compass" : "Hi, I'm Compass"}
            </div>
            <div className="text-xs text-slate-500">
              {lang === "es"
                ? "Aquí para ayudarte a encontrar respuestas"
                : "Here to help you find real answers"}
            </div>
          </div>
        </div>
        <p className="text-sm text-slate-600 leading-relaxed">
          {compassGreeting}
        </p>
      </div>

      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("ask_search_placeholder", lang)}
          className="w-full rounded-2xl bg-white/95 py-3 pl-10 pr-10 text-sm ring-1 ring-black/10 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2A7F8E] placeholder:text-slate-400"
        />
        {isSearching && (
          <button
            onClick={handleClearSearch}
            aria-label={t("ask_search_clear", lang)}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:text-slate-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Topic chips — hidden while searching */}
      {!isSearching && (
        <div>
          <div className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-slate-400">
            {t("ask_browse_label", lang)}
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {visibleTopics.map((tc) => {
              const isActive = tc.category === activeTopic;
              return (
                <button
                  key={tc.category}
                  onClick={() => handleTopicSelect(tc.category)}
                  className={
                    "shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition-all " +
                    (isActive
                      ? "bg-[#2A7F8E] text-white shadow-md"
                      : "bg-white/95 text-[#1B3A5C] ring-1 ring-black/10 hover:ring-[#2A7F8E]/40")
                  }
                >
                  {tc.label[lang]}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Results / question list */}
      <div className="flex flex-col gap-2">
        {isSearching && (
          <div className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-1">
            {displayedEntries.length} {t("ask_results_label", lang)}
          </div>
        )}

        {isSearching && displayedEntries.length === 0 && (
          <div className="rounded-2xl bg-white/80 px-4 py-5 text-center text-sm text-slate-500 ring-1 ring-slate-200/80">
            {t("ask_no_results_pre", lang)} &ldquo;{query}&rdquo;{" "}
            {t("ask_no_results_post", lang)}
          </div>
        )}

        {displayedEntries.map((entry) => (
          <button
            key={entry.id}
            onClick={() => setSelectedEntry(entry)}
            className="flex w-full items-center justify-between rounded-2xl bg-white/95 px-4 py-3.5 text-left shadow-[0_2px_8px_rgb(0,0,0,0.05)] ring-1 ring-black/5 hover:ring-[#2A7F8E]/30 hover:shadow-md active:scale-[0.99] transition-all"
          >
            <span className="text-sm font-medium text-[#1B3A5C] pr-3 leading-snug">
              {entry.question[lang]}
            </span>
            <ChevronRight className="h-4 w-4 shrink-0 text-[#2A7F8E]" />
          </button>
        ))}
      </div>

      {/* Safe notice */}
      <SafeNotice lang={lang} />

      {/* Answer modal */}
      <Modal
        open={selectedEntry !== null}
        onClose={() => setSelectedEntry(null)}
        title={selectedEntry?.question[lang] ?? ""}
      >
        {selectedEntry && (
          <div className="flex flex-col gap-4">
            {/* Answer text */}
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
              {selectedEntry.answer[lang]}
            </p>

            {/* Citation chips */}
            {selectedEntry.citations && selectedEntry.citations.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {selectedEntry.citations.map((c) => (
                  <span
                    key={c}
                    className="inline-flex items-center rounded-full bg-[#2A7F8E]/10 px-2.5 py-1 text-[10px] font-medium text-[#1B3A5C]"
                  >
                    {c}
                  </span>
                ))}
              </div>
            )}

            {/* Resources CTA */}
            {RESOURCE_LINK_CATEGORIES.has(selectedEntry.category) && (
              <a
                href={`/${lang}/resources`}
                className="block rounded-2xl bg-[#2A7F8E] px-4 py-3 text-center text-sm font-semibold text-white hover:bg-[#236d7a] transition-colors"
              >
                {t("ask_resources_cta", lang)}
              </a>
            )}

            {/* Related questions */}
            {relatedEntries.length > 0 && (
              <div>
                <div className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-slate-400">
                  {t("ask_related_label", lang)}
                </div>
                <div className="flex flex-col gap-2">
                  {relatedEntries.map((rel) => (
                    <button
                      key={rel.id}
                      onClick={() => setSelectedEntry(rel)}
                      className="flex w-full items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-left ring-1 ring-slate-200/80 hover:ring-[#2A7F8E]/30 transition-all"
                    >
                      <span className="text-sm text-[#1B3A5C] pr-2 leading-snug">
                        {rel.question[lang]}
                      </span>
                      <ChevronRight className="h-4 w-4 shrink-0 text-[#2A7F8E]" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
