"use client";

import { useId, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Laugh,
  Smile,
  Meh,
  Frown,
  CloudRain,
  Wind,
  Eye,
  HandHeart,
  Lightbulb,
  type LucideIcon,
} from "lucide-react";
import type { AgeBandKey } from "../lib/prefs";
import { tw, twBand, type WellnessStringKey } from "../lib/i18n-wellness";
import { CrisisQuickLinks } from "./CrisisQuickLinks";

type Lang = "en" | "es";
type Mood = "great" | "okay" | "unsure" | "sad" | "bad";
type DangerAnswer = "yes" | "no";

const MOODS: { id: Mood; Icon: LucideIcon; labelKey: WellnessStringKey }[] = [
  { id: "great",  Icon: Laugh,     labelKey: "checkin.mood.great" },
  { id: "okay",   Icon: Smile,     labelKey: "checkin.mood.okay" },
  { id: "unsure", Icon: Meh,       labelKey: "checkin.mood.unsure" },
  { id: "sad",    Icon: Frown,     labelKey: "checkin.mood.sad" },
  { id: "bad",    Icon: CloudRain, labelKey: "checkin.mood.bad" },
];

const FOCUS =
  "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[#D97706] focus-visible:ring-offset-2";

/**
 * Fades a response in. Teen pages use framer-motion (honoring
 * prefers-reduced-motion via useReducedMotion); the 10-12 page stays pure CSS
 * (`starting:` + `motion-reduce:`), matching the rest of that layout.
 */
function Reveal({
  teen,
  reduce,
  className,
  children,
}: {
  teen: boolean;
  reduce: boolean;
  className?: string;
  children: ReactNode;
}) {
  if (teen) {
    return (
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduce ? 0 : 0.25 }}
        className={className}
      >
        {children}
      </motion.div>
    );
  }
  return (
    <div
      className={`transition-opacity duration-300 starting:opacity-0 motion-reduce:transition-none ${className ?? ""}`}
    >
      {children}
    </div>
  );
}

function CopingIdeas({ lang, band }: { lang: Lang; band: AgeBandKey }) {
  const steps: { Icon: LucideIcon; text: string }[] = [
    { Icon: Wind,      text: tw("checkin.try.breathe", lang) },
    { Icon: Eye,       text: tw("checkin.try.see", lang) },
    { Icon: HandHeart, text: twBand("checkin.try.tell", band, lang) },
  ];
  return (
    <div>
      <h3 className="text-[15px] font-bold text-[#1B3A5C]">{tw("checkin.try.heading", lang)}</h3>
      <ul className="mt-2 grid gap-2">
        {steps.map(({ Icon, text }) => (
          <li key={text} className="flex items-start gap-3 rounded-2xl bg-white p-3 ring-1 ring-inset ring-slate-200">
            <span
              aria-hidden="true"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#E3F1F3] text-[#1F6470]"
            >
              <Icon size={18} strokeWidth={2.25} />
            </span>
            <span className="min-w-0 pt-1.5 text-[15px] font-medium leading-snug text-slate-700">{text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function TalkOffer({ lang }: { lang: Lang }) {
  return (
    <div>
      <h3 className="text-[15px] font-bold text-[#1B3A5C]">{tw("checkin.offer.heading", lang)}</h3>
      <p className="mt-1 mb-3 text-[14px] font-medium leading-snug text-slate-600">
        {tw("checkin.offer.body", lang)}
      </p>
      <CrisisQuickLinks lang={lang} variant="compact" />
    </div>
  );
}

export interface FeelingCheckInProps {
  lang: Lang;
  /** Age band; picks wording (simpler for 10-12, more direct for 16-21) and look. */
  band: AgeBandKey;
  /** Extra classes for the outer card (spacing from the page). */
  className?: string;
}

/**
 * "How are you feeling right now?" — one question, five choices, and a kind
 * response shown right below.
 *
 * PRIVACY: nothing here is stored or sent. The answer lives only in React
 * state and is gone on reload. Do not add localStorage, network calls, or
 * analytics to this component — the on-screen note promises "Nothing is saved."
 */
export function FeelingCheckIn({ lang, band, className }: FeelingCheckInProps) {
  const [mood, setMood] = useState<Mood | null>(null);
  const [danger, setDanger] = useState<DangerAnswer | null>(null);
  const reduce = useReducedMotion() ?? false;
  const uid = useId();
  const questionId = `${uid}-q`;
  const noteId = `${uid}-note`;
  const dangerId = `${uid}-danger`;
  const dangerHintId = `${uid}-danger-hint`;

  const teen = band !== "10-12";

  function pick(next: Mood) {
    setMood(next);
    setDanger(null);
  }

  const shell = teen
    ? "relative overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] border border-slate-100 bg-white p-6 sm:p-10 shadow-[0_12px_44px_rgba(0,0,0,0.04)]"
    : "rounded-[24px] bg-white p-5 shadow-[0_4px_24px_rgba(0,0,0,0.04)]";

  const panel = "mt-5 grid gap-5 rounded-[20px] bg-[#F1F7F8] p-4 sm:p-5 min-w-0";
  const lead = "text-[16px] font-semibold leading-relaxed text-[#1B3A5C]";

  return (
    <section aria-labelledby={questionId} className={`@container min-w-0 ${shell} ${className ?? ""}`}>
      {teen && (
        <>
          <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-emerald-400 to-[#2A7F8E]" />
          <p className="mb-3 text-[10px] font-black uppercase tracking-[0.4em] text-emerald-700">
            {tw("checkin.kicker", lang)}
          </p>
        </>
      )}

      <h2
        id={questionId}
        className={
          teen
            ? "text-2xl sm:text-3xl font-black tracking-tight text-[#1e293b]"
            : "text-xl font-bold tracking-tight text-[#1B3A5C]"
        }
      >
        {tw("checkin.question", lang)}
      </h2>
      <p id={noteId} className="mt-1.5 text-[14px] font-medium leading-snug text-slate-600">
        {tw("checkin.note", lang)}
      </p>

      {/* Choices */}
      <div
        role="group"
        aria-labelledby={questionId}
        aria-describedby={noteId}
        className="mt-4 grid grid-cols-2 gap-2 @2xl:grid-cols-5"
      >
        {MOODS.map(({ id, Icon, labelKey }, i) => {
          const selected = mood === id;
          return (
            <button
              key={id}
              type="button"
              aria-pressed={selected}
              onClick={() => pick(id)}
              className={`flex min-h-[76px] min-w-0 flex-col items-center justify-center gap-1.5 rounded-2xl px-2 py-3 text-center text-[14px] font-bold leading-tight transition-colors motion-reduce:transition-none ${FOCUS} ${
                i === MOODS.length - 1 ? "col-span-2 @2xl:col-span-1" : ""
              } ${
                selected
                  ? "bg-[#1B3A5C] text-white shadow-md"
                  : "bg-[#F5F2EE] text-[#1B3A5C] ring-1 ring-inset ring-[#1B3A5C]/15 hover:bg-[#E3F1F3]"
              }`}
            >
              <Icon size={30} strokeWidth={2.25} aria-hidden="true" className="shrink-0" />
              <span className="max-w-full break-words">{tw(labelKey, lang)}</span>
            </button>
          );
        })}
      </div>

      {/* Response — always-mounted live region so screen readers hear changes */}
      <div aria-live="polite" className="min-w-0">
        {(mood === "great" || mood === "okay") && (
          <Reveal key={mood} teen={teen} reduce={reduce} className={panel}>
            <p className={lead}>{twBand(`checkin.${mood}.line`, band, lang)}</p>
            <div className="flex items-start gap-3 rounded-2xl bg-white p-3 ring-1 ring-inset ring-slate-200">
              <span
                aria-hidden="true"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FDECD2] text-[#9A5505]"
              >
                <Lightbulb size={18} strokeWidth={2.25} />
              </span>
              <p className="min-w-0 text-[15px] font-medium leading-snug text-slate-700">
                <span className="block text-[13px] font-bold text-[#1B3A5C]">{tw("checkin.idea.label", lang)}</span>
                {twBand(`checkin.${mood}.idea`, band, lang)}
              </p>
            </div>
          </Reveal>
        )}

        {(mood === "unsure" || mood === "sad") && (
          <Reveal key={mood} teen={teen} reduce={reduce} className={panel}>
            <p className={lead}>{twBand(`checkin.${mood}.line`, band, lang)}</p>
            <CopingIdeas lang={lang} band={band} />
            <TalkOffer lang={lang} />
          </Reveal>
        )}

        {mood === "bad" && (
          <Reveal key="bad" teen={teen} reduce={reduce} className={panel}>
            <div>
              <p className="text-[18px] font-bold leading-snug text-[#1B3A5C]">{tw("checkin.bad.lead", lang)}</p>
              <p className="mt-1 text-[15px] font-medium leading-relaxed text-slate-700">
                {twBand("checkin.bad.sub", band, lang)}
              </p>
            </div>

            <div role="group" aria-labelledby={dangerId} aria-describedby={dangerHintId}>
              <h3 id={dangerId} className="text-[16px] font-bold leading-snug text-[#1B3A5C]">
                {tw("checkin.bad.question", lang)}
              </h3>
              <p id={dangerHintId} className="mt-1 text-[14px] font-medium leading-snug text-slate-600">
                {tw("checkin.bad.question.hint", lang)}
              </p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {(["yes", "no"] as const).map((a) => {
                  const selected = danger === a;
                  return (
                    <button
                      key={a}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => setDanger(a)}
                      className={`min-h-[52px] min-w-0 rounded-full px-4 py-3 text-[16px] font-bold transition-colors motion-reduce:transition-none ${FOCUS} ${
                        selected
                          ? "bg-[#1B3A5C] text-white shadow-md"
                          : "bg-white text-[#1B3A5C] ring-1 ring-inset ring-[#1B3A5C]/25 hover:bg-[#E3F1F3]"
                      }`}
                    >
                      {tw(a === "yes" ? "checkin.bad.yes" : "checkin.bad.no", lang)}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Help is visible right away, before the question is answered. */}
            {danger === null && <CrisisQuickLinks lang={lang} variant="compact" />}

            {danger === "yes" && (
              <Reveal key="yes" teen={teen} reduce={reduce} className="grid gap-3 min-w-0">
                <p className={lead}>{tw("checkin.bad.yes.line", lang)}</p>
                <CrisisQuickLinks lang={lang} variant="full" />
              </Reveal>
            )}

            {danger === "no" && (
              <Reveal key="no" teen={teen} reduce={reduce} className="grid gap-5 min-w-0">
                <div>
                  <p className={`${lead} mb-3`}>{tw("checkin.bad.no.line", lang)}</p>
                  <CrisisQuickLinks lang={lang} variant="compact" />
                </div>
                <CopingIdeas lang={lang} band={band} />
              </Reveal>
            )}
          </Reveal>
        )}
      </div>
    </section>
  );
}
