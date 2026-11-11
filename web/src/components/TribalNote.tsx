"use client";

import { Users } from "lucide-react";
import { usePrefs, getTribalStatus, type TribalStatus } from "../lib/prefs";
import { tc } from "../lib/i18n-case";

interface TribalNoteProps {
  lang: "en" | "es";
  /** "kid" = shorter copy + 10-12 card style. "teen" = teen card style. */
  variant?: "kid" | "teen";
  /** Skip reading prefs and show this status instead. */
  status?: TribalStatus;
  className?: string;
}

/**
 * Short note about the Indian Child Welfare Act (ICWA), based on the
 * "Are you part of a tribal nation?" answer from setup.
 *
 *   yes               → what ICWA means + a question to ask your lawyer
 *   unsure / unknown  → "Not sure? Ask your lawyer or caseworker."
 *   no                → nothing
 *
 * "unknown" covers youth who were never asked (10-12 skip the question) and
 * older saved prefs where "No / Not sure" was a single button.
 */
export function TribalNote({ lang, variant = "teen", status, className = "" }: TribalNoteProps) {
  const [prefs, loaded] = usePrefs();
  // Wait for saved prefs so the note does not flash for youth who said "no".
  if (!status && !loaded) return null;
  const s = status ?? getTribalStatus(prefs);
  if (s === "no") return null;

  const kid = variant === "kid";
  const isYes = s === "yes";

  const title = isYes
    ? tc(kid ? "tribal.yes.title.kid" : "tribal.yes.title", lang)
    : tc("tribal.unsure.title", lang);
  const body = isYes
    ? tc(kid ? "tribal.yes.body.kid" : "tribal.yes.body", lang)
    : tc(kid ? "tribal.unsure.body.kid" : "tribal.unsure.body", lang);
  const ask = isYes ? tc(kid ? "tribal.yes.ask.kid" : "tribal.yes.ask", lang) : null;

  if (kid) {
    return (
      <aside
        aria-label={tc("tribal.kicker", lang)}
        className={`rounded-3xl bg-teal-50 border-2 border-teal-100 px-6 py-5 flex items-start gap-4 ${className}`}
      >
        <div className="shrink-0 w-11 h-11 rounded-full bg-white flex items-center justify-center text-[#2A7F8E] shadow-sm" aria-hidden="true">
          <Users size={22} strokeWidth={2.25} />
        </div>
        <div className="min-w-0">
          <h3 className="text-lg font-extrabold text-[#115e59] mb-1 leading-snug">{title}</h3>
          <p className="text-[16px] font-medium text-slate-700 leading-relaxed">{body}</p>
          {ask && <p className="mt-2 text-[16px] font-bold text-[#115e59] leading-relaxed">{ask}</p>}
        </div>
      </aside>
    );
  }

  return (
    <aside
      aria-label={tc("tribal.kicker", lang)}
      className={`relative overflow-hidden rounded-[2rem] bg-white border border-[#115e59]/10 shadow-[0_12px_44px_rgba(17,94,89,0.08)] p-6 sm:p-8 ${className}`}
    >
      <div
        className="absolute left-0 top-0 bottom-0 w-[6px] rounded-r-full"
        style={{ background: "linear-gradient(to bottom, #34d399, #115e59)" }}
        aria-hidden="true"
      />
      <div className="flex gap-5 items-start">
        <div className="mt-1 shrink-0 w-10 h-10 rounded-xl flex items-center justify-center bg-emerald-50 text-[#115e59]" aria-hidden="true">
          <Users size={20} strokeWidth={2.25} />
        </div>
        <div className="min-w-0">
          <span className="block text-[10px] font-black uppercase tracking-[0.25em] text-emerald-600 mb-1.5">
            {tc("tribal.kicker", lang)}
          </span>
          <h3 className="text-lg sm:text-xl font-black text-[#1e293b] tracking-tight leading-tight mb-2">{title}</h3>
          <p className="text-slate-600 text-[15px] sm:text-base font-medium leading-[1.7] tracking-tight max-w-2xl">{body}</p>
          {ask && (
            <p className="mt-3 text-[15px] sm:text-base font-black leading-snug tracking-tight text-[#115e59]">{ask}</p>
          )}
        </div>
      </div>
    </aside>
  );
}
