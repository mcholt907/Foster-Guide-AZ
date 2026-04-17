"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import { Lock, Phone, HelpCircle, Home, Shield, Gavel, MapPin, HeartPulse, FileText, MessageCircle, ChevronRight, ExternalLink } from "lucide-react";
import type { Lang } from "../../lib/i18n";
import { t } from "../../lib/i18n";
import { useOnboardingGate } from "../../lib/useOnboardingGate";
import { usePrefs } from "../../lib/prefs";
import { AGE_BANDS, CRISIS_PINS } from "../../data/constants";
import { ScreenHero } from "../../components/ui";
import type { AgeBandKey } from "../../lib/prefs";

// ── 10-12 tile dashboard ──────────────────────────────────────────────────────

function Dashboard1012({ lang }: { lang: Lang }) {
  const router = useRouter();
  const [,,, reset] = usePrefs();
  const [chipOpen, setChipOpen] = useState(false);

  return (
    <div className="pb-8">
      {/* Header */}
      <div className="pt-8 pb-6">
        <h1 className="text-3xl sm:text-4xl font-bold text-[#136d41] leading-tight">
          {lang === "es" ? "¿Qué necesitas hoy?" : "What do you need today?"}
        </h1>
        <button
          type="button"
          onClick={() => setChipOpen((o) => !o)}
          className={`flex items-center gap-2 mt-3 w-fit px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm border transition-colors ${
            chipOpen
              ? "bg-[#136d41] text-white border-[#136d41]"
              : "bg-white/50 text-slate-500 border-slate-100 hover:bg-white/80"
          }`}
        >
          <span className={chipOpen ? "text-white/80" : "text-slate-400"}>📍</span>
          <span>{lang === "es" ? "10–12 años · Español" : "Ages 10–12 · English"}</span>
        </button>

        {chipOpen && (
          <div className="mt-3 bg-white rounded-[20px] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.08)] border-2 border-[#fbbf24]">
            <p className="text-sm font-semibold text-[#35322d] mb-1">
              {lang === "es" ? "¿Cambiar configuración?" : "Change your settings?"}
            </p>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              {lang === "es"
                ? "Esto borra tu grupo de edad e idioma. Empezarás de nuevo desde el principio."
                : "This clears your age group and language. You'll start fresh from the beginning."}
            </p>
            <button
              type="button"
              onClick={() => { reset(); router.push('/'); }}
              className="w-full rounded-full bg-[#136d41] px-4 py-3 text-sm font-bold text-white shadow-sm hover:bg-[#0f5c35] transition-colors mb-2"
            >
              ↩ {lang === "es" ? "Sí, empezar de nuevo" : "Yes, start over"}
            </button>
            <button
              type="button"
              onClick={() => setChipOpen(false)}
              className="w-full text-center text-xs font-semibold text-slate-400 hover:text-slate-600 py-1 transition-colors"
            >
              {lang === "es" ? "Cancelar" : "Never mind"}
            </button>
          </div>
        )}
      </div>

      {/* 2×2 tile grid */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {/* Meet Your Team */}
        <Link
          href={`/${lang}/team`}
          className="aspect-square bg-[#fff4cc] rounded-[2rem] p-5 flex flex-col justify-center gap-2 items-start text-left shadow-sm border border-black/5 hover:scale-[1.02] transition-transform active:scale-95"
        >
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-[1.5rem] flex items-center justify-center overflow-hidden mix-blend-multiply drop-shadow-sm">
            <img src="/avatars/group_avatar.png" alt="" className="w-full h-full object-cover scale-[1.3] pt-2" />
          </div>
          <span className="font-bold text-[#78350f] text-lg leading-none">
            {lang === "es" ? "Conoce tu equipo" : "Meet your team"}
          </span>
        </Link>

        {/* My Case Explained */}
        <Link
          href={`/${lang}/case`}
          className="aspect-square bg-[#e0f2fe] rounded-[2rem] p-5 flex flex-col justify-center gap-2 items-start text-left shadow-sm border border-black/5 hover:scale-[1.02] transition-transform active:scale-95"
        >
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center overflow-hidden drop-shadow-sm">
            <img src="/dashboard/case.png" alt="" className="w-full h-full object-cover scale-[1.2]" />
          </div>
          <span className="font-bold text-[#0c4a6e] text-lg leading-none">
            {lang === "es" ? "Mi caso explicado" : "My case explained"}
          </span>
        </Link>

        {/* Know Your Rights — coming soon */}
        <div className="aspect-square bg-[#dcfce7] rounded-[2rem] p-5 flex flex-col justify-center gap-2 items-start text-left shadow-sm border border-black/5 opacity-50 relative">
          <div className="absolute top-4 right-4 bg-white/90 rounded-full px-2 py-0.5 flex items-center gap-1 text-[10px] font-bold text-slate-400">
            <Lock size={9} /> {lang === "es" ? "Pronto" : "Soon"}
          </div>
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center overflow-hidden drop-shadow-sm">
            <img src="/dashboard/rights.png" alt="" className="w-full h-full object-cover scale-[1.2]" />
          </div>
          <span className="font-bold text-[#14532d] text-lg leading-none">
            {lang === "es" ? "Conoce tus derechos" : "Know your rights"}
          </span>
        </div>

        {/* Wellness Check-In */}
        <Link
          href={`/${lang}/wellness`}
          className="aspect-square bg-[#fce7f3] rounded-[2rem] p-5 flex flex-col justify-center gap-2 items-start text-left shadow-sm border border-black/5 hover:scale-[1.02] transition-transform active:scale-95"
        >
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center overflow-hidden drop-shadow-sm">
            <img src="/dashboard/wellness.png" alt="" className="w-full h-full object-cover scale-[1.2]" />
          </div>
          <span className="font-bold text-[#831843] text-lg leading-none">
            {lang === "es" ? "Bienestar" : "Wellness check-in"}
          </span>
        </Link>
      </div>

      {/* Find Answers CTA */}
      <div className="mb-10">
        <Link
          href={`/${lang}/ask`}
          className="block w-full bg-[#136d41] rounded-[2.5rem] p-8 text-center shadow-md relative overflow-hidden hover:brightness-110 transition-all"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#a1f5bc] rounded-full blur-3xl opacity-20 -mr-10 -mt-10 pointer-events-none" />
          <h2 className="text-xl font-bold text-white mb-4 relative z-10">
            {lang === "es" ? "¿Tienes una pregunta rápida?" : "Have a quick question?"}
          </h2>
          <div className="bg-[#a1f5bc] text-[#004a28] w-full py-4 rounded-full font-bold text-lg flex items-center justify-center gap-2 relative z-10 shadow-lg">
            <HelpCircle size={20} />
            {lang === "es" ? "Buscar respuestas" : "Find Answers"}
          </div>
        </Link>
      </div>

      {/* Divider */}
      <div className="flex items-center justify-center mb-6">
        <div className="h-px bg-slate-200 flex-1" />
        <span className="px-3 text-[10px] font-bold tracking-widest text-[#a09c98] uppercase">
          {lang === "es" ? "Apoyo y seguridad" : "Support & Safety"}
        </span>
        <div className="h-px bg-slate-200 flex-1" />
      </div>

      {/* Crisis line */}
      <a
        href="tel:988"
        className="bg-white rounded-[1.5rem] p-4 flex items-center gap-4 shadow-sm border border-black/5 hover:bg-slate-50 transition-colors"
      >
        <div className="w-12 h-12 rounded-full bg-[#fee2e2] flex shrink-0 items-center justify-center text-[#b91c1c]">
          <Phone size={20} />
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-[#35322d]">988 Suicide &amp; Crisis</h4>
          <p className="text-xs text-[#a09c98] mt-0.5">
            {lang === "es" ? "Llama o envía un mensaje en cualquier momento" : "Call or text anytime"}
          </p>
        </div>
        <div className="w-10 h-10 rounded-full bg-[#fee2e2] flex items-center justify-center text-[#b91c1c] shrink-0">
          <Phone size={16} />
        </div>
      </a>

      {/* Language switcher */}
      <div className="mt-6 text-center text-xs text-slate-400">
        {lang === "es" ? (
          <a href="/en" className="underline hover:text-slate-600">Switch to English</a>
        ) : (
          <a href="/es" className="underline hover:text-slate-600">Cambiar a Español</a>
        )}
      </div>
    </div>
  );
}

// ── Feature cards for 13-21 ───────────────────────────────────────────────────

const FEATURE_CARDS = [
  { id: "case",      emoji: "⚖️", icon: Gavel,      gradient: "from-[#1B3A5C]/8 to-transparent",    iconBg: "bg-[#1B3A5C]/10",    iconColor: "text-[#1B3A5C]",  pillCls: "bg-[#1B3A5C]/10 text-[#1B3A5C] ring-1 ring-[#1B3A5C]/20", chevronColor: "text-[#1B3A5C]/40", href: "case" },
  { id: "rights",    emoji: "🛡️", icon: Shield,     gradient: "from-[#2A7F8E]/10 to-transparent",   iconBg: "bg-[#2A7F8E]/10",    iconColor: "text-[#2A7F8E]",  pillCls: "", chevronColor: "text-[#2A7F8E]/50", href: "rights" },
  { id: "future",    emoji: "✨", icon: FileText,   gradient: "from-[#D97706]/10 to-transparent",   iconBg: "bg-[#D97706]/10",    iconColor: "text-[#D97706]",  pillCls: "", chevronColor: "text-[#D97706]/50", href: "future" },
  { id: "resources", emoji: "📍", icon: MapPin,     gradient: "from-emerald-500/8 to-transparent",  iconBg: "bg-emerald-500/10",  iconColor: "text-emerald-700",pillCls: "", chevronColor: "text-emerald-600/40", href: "resources" },
  { id: "wellness",  emoji: "💚", icon: HeartPulse, gradient: "from-[#2A7F8E]/8 to-transparent",    iconBg: "bg-[#2A7F8E]/10",    iconColor: "text-[#2A7F8E]",  pillCls: "", chevronColor: "text-[#2A7F8E]/40", href: "wellness" },
] as const;

const CARD_TITLES_EN: Record<string, string> = { case: "My case explained", rights: "Know your rights", future: "My future plan", resources: "Find resources", wellness: "Wellness check-in" };
const CARD_TITLES_ES: Record<string, string> = { case: "Mi caso explicado", rights: "Conoce tus derechos", future: "Mi plan de futuro", resources: "Encuentra recursos", wellness: "Chequeo de bienestar" };

const CARD_SUBTITLES_EN: Record<string, Record<AgeBandKey, string>> = {
  case:      { "10-12": "What's happening in court and who all those people are.", "13-15": "What your hearings mean, who's there, and how to prepare.", "16-17": "What your hearings actually mean, who will be there, and how to show up ready.", "18-21": "Understanding your hearings and what each one could mean for your future." },
  rights:    { "10-12": "Find out what you're allowed to do and who has to listen to you.", "13-15": "Your rights — plain words, real examples, and what to do if they're ignored.", "16-17": "Your rights, in plain words — and what to do if they're not being respected.", "18-21": "Arizona law protects you even after 18. Know your rights and how to use them." },
  future:    { "10-12": "Learn what turning 18 means — you don't have to figure it out alone.", "13-15": "Start learning about what happens when you turn 18 — it's closer than it seems.", "16-17": "Turning 18 is a lot. Here's your checklist — options, deadlines, and documents.", "18-21": "EFC, school money, housing, and documents — your step-by-step plan." },
  resources: { "10-12": "Find real people and places near you that can help.", "13-15": "Real organizations near you — filtered for your county and what you need.", "16-17": "Real organizations near you that can help — filtered for your county and age.", "18-21": "Housing, jobs, health, legal help — organizations filtered for you." },
  wellness:  { "10-12": "It's okay to feel a lot of feelings. Here are some things that can help.", "13-15": "Tools to help when things feel overwhelming — and how to reach a real person.", "16-17": "Tools to help you feel calmer — and how to reach a real person when you need one.", "18-21": "Support tools and real contacts for when things get heavy." },
};

const CARD_SUBTITLES_ES: Record<string, Record<AgeBandKey, string>> = {
  case:      { "10-12": "Qué está pasando en el tribunal y quiénes son todas esas personas.", "13-15": "Qué significan tus audiencias, quién está ahí y cómo prepararte.", "16-17": "Qué significan realmente tus audiencias, quién estará ahí y cómo llegar listo.", "18-21": "Entiende tus audiencias y lo que cada una podría significar para tu futuro." },
  rights:    { "10-12": "Descubre lo que tienes permitido hacer y quién tiene que escucharte.", "13-15": "Tus derechos — palabras sencillas, ejemplos reales, y qué hacer si los ignoran.", "16-17": "Tus derechos, en palabras sencillas — y qué hacer si no los están respetando.", "18-21": "La ley de Arizona te protege incluso después de los 18. Conoce tus derechos y cómo usarlos." },
  future:    { "10-12": "Aprende qué significa cumplir 18 — no tienes que resolverlo solo.", "13-15": "Empieza a aprender qué pasa cuando cumples 18 — está más cerca de lo que crees.", "16-17": "Cumplir 18 es mucho. Aquí está tu lista — opciones, plazos y documentos.", "18-21": "EFC, dinero para estudios, vivienda y documentos — tu plan paso a paso." },
  resources: { "10-12": "Encuentra personas y lugares reales cerca de ti que pueden ayudar.", "13-15": "Organizaciones reales cerca de ti — filtradas para tu condado y lo que necesitas.", "16-17": "Organizaciones reales cerca de ti — filtradas para tu condado y edad.", "18-21": "Vivienda, empleos, salud, ayuda legal — organizaciones filtradas para ti." },
  wellness:  { "10-12": "Está bien sentir muchas cosas. Aquí hay cosas que pueden ayudar.", "13-15": "Herramientas para cuando todo se siente abrumador — y cómo contactar a una persona real.", "16-17": "Herramientas para sentirte más tranquilo — y cómo contactar a una persona real cuando lo necesites.", "18-21": "Herramientas de apoyo y contactos reales para cuando las cosas se ponen difíciles." },
};

// ── Main export ───────────────────────────────────────────────────────────────

export default function HomePage() {
  const { lang: rawLang } = useParams<{ lang: string }>();
  const lang: Lang = rawLang === "es" ? "es" : "en";
  const router = useRouter();
  const prefs = useOnboardingGate(lang);
  const [,,, reset] = usePrefs();

  const visibleCards = useMemo(() => {
    if (prefs.ageBand === "13-15") return FEATURE_CARDS.filter((fc) => fc.id !== "future");
    if (prefs.ageBand === "18-21") {
      const order = ["future", "resources", "rights", "case", "wellness"];
      return order.map((id) => FEATURE_CARDS.find((fc) => fc.id === id)!);
    }
    return FEATURE_CARDS;
  }, [prefs.ageBand]);

  // 10-12 gets the prototype tile layout — must be after all hooks
  if (prefs.ageBand === "10-12") {
    return <Dashboard1012 lang={lang} />;
  }

  const band = prefs.ageBand as AgeBandKey;
  const countyLabel = prefs.county === "Unknown" ? (lang === "es" ? "condado desconocido" : "county unknown") : (prefs.county ?? "—");

  return (
    <div className="pb-8">
      <ScreenHero
        icon={Home}
        title={t("home_what_today", lang)}
        subtitle={`${countyLabel} · ${AGE_BANDS.find((a) => a.id === prefs.ageBand)?.label ?? "—"} · ${lang === "es" ? "Español" : "English"}`}
        gradient="from-[#2A7F8E] via-[#1a5f7e] to-[#1B3A5C]"
        onStartOver={() => { reset(); router.push('/'); }}
        lang={lang}
      />

      <div className="mt-4 grid gap-3">
        {visibleCards.map((fc) => {
          const Icon = fc.icon;
          const title = lang === "es" ? CARD_TITLES_ES[fc.id] : CARD_TITLES_EN[fc.id];
          const subtitle = (lang === "es" ? CARD_SUBTITLES_ES : CARD_SUBTITLES_EN)[fc.id]?.[band] ?? "";
          return (
            <Link
              key={fc.id}
              href={`/${lang}/${fc.href}`}
              className={`block cursor-pointer rounded-3xl bg-gradient-to-br ${fc.gradient} bg-white/90 p-4 shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.12)] active:scale-[0.995] transition-all`}
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

      <div className="mt-4">
        <Link
          href={`/${lang}/ask`}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#2A7F8E] px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#236d7a] active:scale-[0.99] transition-all"
        >
          <MessageCircle className="h-4 w-4" />
          {t("home_ask_compass_btn", lang)}
        </Link>
      </div>

      <div className="mt-4 rounded-3xl bg-white/95 p-4 shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
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
