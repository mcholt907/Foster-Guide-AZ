import { Phone, MessageSquare } from "lucide-react";
import {
  CRISIS_CONTACTS,
  CRISIS_CONTACTS_COMPACT,
  crisisActions,
  type CrisisAction,
  type CrisisContact,
} from "../data/constants";
import { th, type HelpStringKey } from "../lib/i18n-help";

type Lang = "en" | "es";

function actionLabel(a: CrisisAction, lang: Lang): string {
  if (a.kind === "tel") return th("help.call", lang, { n: a.display });
  if (a.keyword) return th("help.text_keyword", lang, { k: a.keyword, n: a.display });
  return th("help.text", lang, { n: a.display });
}

const COMPACT_LABELS: Partial<Record<CrisisContact["id"], HelpStringKey>> = {
  "911": "help.compact.911",
  "988": "help.compact.988",
  dcs: "help.compact.dcs",
};

const FOCUS =
  "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[#D97706] focus-visible:ring-offset-2";

function ActionLink({ action, lang }: { action: CrisisAction; lang: Lang }) {
  const Icon = action.kind === "tel" ? Phone : MessageSquare;
  const tone =
    action.kind === "tel"
      ? "bg-[#1B3A5C] text-white hover:bg-[#14304d]"
      : "bg-[#E3F1F3] text-[#1B3A5C] ring-1 ring-inset ring-[#2A7F8E]/40 hover:bg-[#d2e8eb]";
  return (
    <a
      href={action.href}
      className={`inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full px-4 py-2 text-[15px] font-bold leading-tight transition-colors ${tone} ${FOCUS}`}
    >
      <Icon size={18} strokeWidth={2.25} aria-hidden="true" className="shrink-0" />
      <span>{actionLabel(action, lang)}</span>
    </a>
  );
}

/**
 * Tap-to-call / tap-to-text buttons for crisis lines.
 * All numbers come from CRISIS_PINS in data/constants.ts.
 *
 *   variant="compact" — 911, 988, DCS hotline (for empty states, tight spots)
 *   variant="full"    — every crisis contact with a one-line description
 */
export function CrisisQuickLinks({ lang, variant }: { lang: "en" | "es"; variant?: "full" | "compact" }) {
  const es = lang === "es";

  if (variant === "compact") {
    return (
      <ul
        aria-label={th("help.list_label", lang)}
        className="grid w-full grid-cols-[repeat(auto-fit,minmax(11.5rem,1fr))] gap-2 text-left"
      >
        {CRISIS_CONTACTS_COMPACT.map((c) => {
          const call = crisisActions(c, lang).find((a) => a.kind === "tel");
          if (!call) return null;
          const labelKey = COMPACT_LABELS[c.id];
          return (
            <li key={c.id} className="min-w-0">
              <a
                href={call.href}
                className={`flex min-h-[52px] h-full items-center gap-3 rounded-2xl bg-white px-3.5 py-2 text-[#1B3A5C] shadow-sm ring-1 ring-inset ring-[#1B3A5C]/15 transition-colors hover:bg-[#F1F7F8] ${FOCUS}`}
              >
                <span
                  aria-hidden="true"
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                    c.id === "911" ? "bg-[#FDECD2] text-[#9A5505]" : "bg-[#E3F1F3] text-[#1F6470]"
                  }`}
                >
                  <Phone size={17} strokeWidth={2.25} />
                </span>
                <span className="min-w-0 leading-tight">
                  <span className="block text-[12px] font-semibold text-slate-600">
                    {labelKey ? th(labelKey, lang) : es ? c.name_es : c.name}
                  </span>
                  <span className="block text-[15px] font-extrabold">
                    {th("help.call", lang, { n: call.display })}
                  </span>
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <ul aria-label={th("help.list_label", lang)} className="grid w-full gap-3 text-left">
      {CRISIS_CONTACTS.map((c) => (
        <li
          key={c.id}
          className={`rounded-2xl bg-white p-4 shadow-sm ring-1 ring-inset ring-slate-200 ${
            c.id === "911" ? "border-l-4 border-[#D97706]" : "border-l-4 border-[#2A7F8E]"
          }`}
        >
          <div className="text-[16px] font-extrabold leading-snug text-[#1B3A5C]">
            {es ? c.name_es : c.name}
          </div>
          <p className="mt-0.5 text-[14px] font-medium leading-snug text-slate-600">
            {es ? c.desc_es : c.desc}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {crisisActions(c, lang).map((a) => (
              <ActionLink key={a.href} action={a} lang={lang} />
            ))}
          </div>
        </li>
      ))}
    </ul>
  );
}
