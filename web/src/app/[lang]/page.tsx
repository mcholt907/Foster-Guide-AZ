"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMemo } from "react";
import { Home, Shield, Gavel, MapPin, HeartPulse, FileText, MessageCircle, AlertTriangle, ChevronRight, ExternalLink } from "lucide-react";
import type { Lang } from "../../lib/i18n";
import { t } from "../../lib/i18n";
import { useOnboardingGate } from "../../lib/useOnboardingGate";
import { AGE_BANDS, CRISIS_PINS } from "../../data/constants";
import { ScreenHero } from "../../components/ui";
import type { AgeBandKey } from "../../lib/prefs";

const FEATURE_CARDS = [
  {
    id: "case",
    emoji: "⚖️",
    icon: Gavel,
    gradient: "from-[#1B3A5C]/8 to-transparent",
    iconBg: "bg-[#1B3A5C]/10",
    iconColor: "text-[#1B3A5C]",
    pillCls: "bg-[#1B3A5C]/10 text-[#1B3A5C] ring-1 ring-[#1B3A5C]/20",
    chevronColor: "text-[#1B3A5C]/40",
    href: "case",
  },
  {
    id: "rights",
    emoji: "🛡️",
    icon: Shield,
    gradient: "from-[#2A7F8E]/10 to-transparent",
    iconBg: "bg-[#2A7F8E]/10",
    iconColor: "text-[#2A7F8E]",
    pillCls: "",
    chevronColor: "text-[#2A7F8E]/50",
    href: "rights",
  },
  {
    id: "future",
    emoji: "✨",
    icon: FileText,
    gradient: "from-[#D97706]/10 to-transparent",
    iconBg: "bg-[#D97706]/10",
    iconColor: "text-[#D97706]",
    pillCls: "",
    chevronColor: "text-[#D97706]/50",
    href: "future",
  },
  {
    id: "resources",
    emoji: "📍",
    icon: MapPin,
    gradient: "from-emerald-500/8 to-transparent",
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-700",
    pillCls: "",
    chevronColor: "text-emerald-600/40",
    href: "resources",
  },
  {
    id: "wellness",
    emoji: "💚",
    icon: HeartPulse,
    gradient: "from-[#2A7F8E]/8 to-transparent",
    iconBg: "bg-[#2A7F8E]/10",
    iconColor: "text-[#2A7F8E]",
    pillCls: "",
    chevronColor: "text-[#2A7F8E]/40",
    href: "wellness",
  },
];

const CARD_TITLES_EN: Record<string, string> = {
  case: "My case explained",
  rights: "Know your rights",
  future: "My future plan",
  resources: "Find resources",
  wellness: "Wellness check-in",
};

const CARD_TITLES_ES: Record<string, string> = {
  case: "Mi caso explicado",
  rights: "Conoce tus derechos",
  future: "Mi plan de futuro",
  resources: "Encuentra recursos",
  wellness: "Chequeo de bienestar",
};

const CARD_SUBTITLES_EN: Record<string, Record<AgeBandKey, string>> = {
  case: {
    "10-12": "What's happening in court and who all those people are.",
    "13-15": "What your hearings mean, who's there, and how to prepare.",
    "16-17": "What your hearings actually mean, who will be there, and how to show up ready.",
    "18-21": "Understanding your hearings and what each one could mean for your future.",
  },
  rights: {
    "10-12": "Find out what you're allowed to do and who has to listen to you.",
    "13-15": "Your rights — plain words, real examples, and what to do if they're ignored.",
    "16-17": "Your rights, in plain words — and what to do if they're not being respected.",
    "18-21": "Arizona law protects you even after 18. Know your rights and how to use them.",
  },
  future: {
    "10-12": "Learn what turning 18 means — you don't have to figure it out alone.",
    "13-15": "Start learning about what happens when you turn 18 — it's closer than it seems.",
    "16-17": "Turning 18 is a lot. Here's your checklist — options, deadlines, and documents.",
    "18-21": "EFC, school money, housing, and documents — your step-by-step plan.",
  },
  resources: {
    "10-12": "Find real people and places near you that can help.",
    "13-15": "Real organizations near you — filtered for your county and what you need.",
    "16-17": "Real organizations near you that can help — filtered for your county and age.",
    "18-21": "Housing, jobs, health, legal help — organizations filtered for you.",
  },
  wellness: {
    "10-12": "It's okay to feel a lot of feelings. Here are some things that can help.",
    "13-15": "Tools to help when things feel overwhelming — and how to reach a real person.",
    "16-17": "Tools to help you feel calmer — and how to reach a real person when you need one.",
    "18-21": "Support tools and real contacts for when things get heavy.",
  },
};

const CARD_SUBTITLES_ES: Record<string, Record<AgeBandKey, string>> = {
  case: {
    "10-12": "Qué está pasando en el tribunal y quiénes son todas esas personas.",
    "13-15": "Qué significan tus audiencias, quién está ahí y cómo prepararte.",
    "16-17": "Qué significan realmente tus audiencias, quién estará ahí y cómo llegar listo.",
    "18-21": "Entiende tus audiencias y lo que cada una podría significar para tu futuro.",
  },
  rights: {
    "10-12": "Descubre lo que tienes permitido hacer y quién tiene que escucharte.",
    "13-15": "Tus derechos — palabras sencillas, ejemplos reales, y qué hacer si los ignoran.",
    "16-17": "Tus derechos, en palabras sencillas — y qué hacer si no los están respetando.",
    "18-21": "La ley de Arizona te protege incluso después de los 18. Conoce tus derechos y cómo usarlos.",
  },
  future: {
    "10-12": "Aprende qué significa cumplir 18 — no tienes que resolverlo solo.",
    "13-15": "Empieza a aprender qué pasa cuando cumples 18 — está más cerca de lo que crees.",
    "16-17": "Cumplir 18 es mucho. Aquí está tu lista — opciones, plazos y documentos.",
    "18-21": "EFC, dinero para estudios, vivienda y documentos — tu plan paso a paso.",
  },
  resources: {
    "10-12": "Encuentra personas y lugares reales cerca de ti que pueden ayudar.",
    "13-15": "Organizaciones reales cerca de ti — filtradas para tu condado y lo que necesitas.",
    "16-17": "Organizaciones reales cerca de ti — filtradas para tu condado y edad.",
    "18-21": "Vivienda, empleos, salud, ayuda legal — organizaciones filtradas para ti.",
  },
  wellness: {
    "10-12": "Está bien sentir muchas cosas. Aquí hay cosas que pueden ayudar.",
    "13-15": "Herramientas para cuando todo se siente abrumador — y cómo contactar a una persona real.",
    "16-17": "Herramientas para sentirte más tranquilo — y cómo contactar a una persona real cuando lo necesites.",
    "18-21": "Herramientas de apoyo y contactos reales para cuando las cosas se ponen difíciles.",
  },
};

export default function HomePage() {
  const { lang: rawLang } = useParams<{ lang: string }>();
  const lang: Lang = rawLang === "es" ? "es" : "en";
  const router = useRouter();
  const prefs = useOnboardingGate(lang);

  const visibleCards = useMemo(() => {
    if (prefs.ageBand === "10-12" || prefs.ageBand === "13-15") return FEATURE_CARDS.filter((fc) => fc.id !== "future");
    if (prefs.ageBand === "18-21") {
      const order = ["future", "resources", "rights", "case", "wellness"];
      return order.map((id) => FEATURE_CARDS.find((fc) => fc.id === id)!);
    }
    return FEATURE_CARDS;
  }, [prefs.ageBand]);

  function onReset() {
    router.push(`/${lang}/setup`);
  }

  const band = prefs.ageBand as AgeBandKey;
  const countyLabel = prefs.county === "Unknown" ? (lang === "es" ? "condado desconocido" : "county unknown") : (prefs.county ?? "—");

  return (
    <div className="pb-8">
      <ScreenHero
        icon={Home}
        title={t("home_what_today", lang)}
        subtitle={`${countyLabel} · ${AGE_BANDS.find((a) => a.id === prefs.ageBand)?.label ?? "—"} · ${lang === "es" ? "Español" : "English"}`}
        gradient="from-[#2A7F8E] to-[#1B3A5C]"
        onStartOver={onReset}
        lang={lang}
      />

      {/* Feature cards */}
      <div className="mt-4 grid gap-3">
        {visibleCards.map((fc) => {
          const Icon = fc.icon;
          const title = lang === "es" ? CARD_TITLES_ES[fc.id] : CARD_TITLES_EN[fc.id];
          const subtitle = (lang === "es" ? CARD_SUBTITLES_ES : CARD_SUBTITLES_EN)[fc.id]?.[band] ?? "";
          return (
            <Link
              key={fc.id}
              href={`/${lang}/${fc.href}`}
              className={`block cursor-pointer rounded-3xl bg-gradient-to-br ${fc.gradient} bg-white/80 p-4 shadow-sm ring-1 ring-black/5 hover:shadow-md active:scale-[0.995] transition-all`}
            >
              <div className="flex items-start gap-3">
                <div className={`mt-0.5 rounded-2xl ${fc.iconBg} p-2.5 shadow-sm flex items-center justify-center`}>
                  <span className="text-lg leading-none">{fc.emoji}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-base font-semibold text-[#1B3A5C]">{title}</div>
                  <div className="mt-0.5 text-xs text-slate-500 leading-snug">{subtitle}</div>
                </div>
                <ChevronRight className={`mt-1 h-5 w-5 shrink-0 ${fc.chevronColor}`} />
              </div>
              {fc.id === "case" && (
                <div className="mt-3">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${fc.pillCls}`}>
                    {lang === "es" ? "Línea de tiempo + preparación" : "Timeline + hearing prep"}
                  </span>
                </div>
              )}
            </Link>
          );
        })}
      </div>

      {/* Ask Compass button */}
      <div className="mt-4">
        <Link
          href={`/${lang}/ask`}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#2A7F8E] px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#236d7a] active:scale-[0.99] transition-all"
        >
          <MessageCircle className="h-4 w-4" />
          {t("home_ask_compass_btn", lang)}
        </Link>
      </div>

      {/* Crisis strip */}
      <div className="mt-4 rounded-3xl bg-white/85 p-4 ring-1 ring-black/5 shadow-sm">
        <div className="flex items-start gap-3">
          <span className="text-2xl shrink-0 mt-0.5">💙</span>
          <div>
            <div className="text-sm font-semibold text-slate-900">{t("home_crisis_title", lang)}</div>
            <div className="mt-1 text-xs text-slate-500">
              <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 ring-1 ring-emerald-200">
                {t("home_crisis_always_open", lang)}
              </span>
            </div>
          </div>
        </div>
        <div className="mt-3 grid gap-2">
          {CRISIS_PINS.slice(0, 2).map((c) => (
            <a
              key={c.name}
              href={c.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between rounded-2xl bg-white px-3 py-3 text-sm font-semibold ring-1 ring-black/10 hover:bg-slate-50 transition-colors"
            >
              <span className="text-slate-800">
                {c.name}
                <span className="ml-2 text-xs font-normal text-slate-500">· {lang === "es" ? c.how_es : c.how}</span>
              </span>
              <ExternalLink className="h-4 w-4 text-slate-400" />
            </a>
          ))}
        </div>
      </div>

      {/* Language switcher */}
      <div className="mt-4 text-center text-xs text-slate-400">
        {lang === "es" ? (
          <a href="/en" className="underline hover:text-slate-600">Switch to English</a>
        ) : (
          <a href="/es" className="underline hover:text-slate-600">Cambiar a Español</a>
        )}
      </div>
    </div>
  );
}
