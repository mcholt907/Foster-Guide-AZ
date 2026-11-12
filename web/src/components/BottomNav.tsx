"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Home, Shield, FolderOpen, MapPin, HeartHandshake, HelpCircle, Users } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import type { Lang } from "../lib/i18n";
import { usePrefs } from "../lib/prefs";
import { ts } from "../lib/i18n-shell";

const NAV_ITEMS_BASE = [
  { id: "home",      icon: Home,           href: "",           en: "Home",        es: "Inicio",          labelEn: "Home",      labelEs: "Inicio" },
  { id: "team",      icon: Users,          href: "/team",      en: "Your Team",   es: "Tu Equipo",       labelEn: "Your Team", labelEs: "Tu Equipo" },
  { id: "case",      icon: FolderOpen,     href: "/case",      en: "Your Case",   es: "Tu Caso",         labelEn: "Your Case", labelEs: "Tu Caso" },
  { id: "rights",    icon: Shield,         href: "/rights",    en: "Your Rights", es: "Tus Derechos",    labelEn: "Rights",    labelEs: "Derechos" },
  { id: "resources", icon: MapPin,         href: "/resources", en: "Resources",   es: "Recursos",        labelEn: "Resources", labelEs: "Recursos" },
  { id: "wellness",  icon: HeartHandshake, href: "/wellness",  en: "Wellness",    es: "Bienestar",       labelEn: "Wellness",  labelEs: "Bienestar" },
  { id: "ask",       icon: HelpCircle,     href: "/ask",       en: "Find Answers",es: "Buscar",          labelEn: "Answers",   labelEs: "Buscar" },
] as const;

export function BottomNav({ lang }: { lang: Lang }) {
  const pathname = usePathname();
  const [prefs] = usePrefs();
  const reduceMotion = useReducedMotion();
  const is1012 = prefs.ageBand === "10-12";
  const visibleItems = NAV_ITEMS_BASE.filter((item) => {
    if (item.id === "resources" && is1012) return false;
    if (item.id === "rights" && is1012) return false;
    if (item.id === "team" && !is1012) return false;
    return true;
  });

  return (
    <nav
      aria-label={ts("nav.bottom", lang)}
      className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/80 backdrop-blur-2xl backdrop-saturate-[180%] border-t border-white/50 shadow-[0_-4px_24px_-4px_rgba(0,0,0,0.05)]"
    >
      <div className="mx-auto flex max-w-[440px] w-full items-stretch justify-between gap-0.5 overflow-x-auto px-1.5 pt-1.5 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {visibleItems.map(({ id, icon: Icon, href, labelEn, labelEs }) => {
          const fullHref = `/${lang}${href}`;
          const isActive =
            href === ""
              ? pathname === `/${lang}` || pathname === `/${lang}/`
              : pathname.startsWith(`/${lang}${href}`);

          return (
            <Link
              key={id}
              href={fullHref}
              aria-current={isActive ? "page" : undefined}
              className={`relative flex min-h-[52px] min-w-[48px] flex-auto shrink-0 flex-col items-center justify-center rounded-[14px] px-1 py-1.5 transition-colors ${
                isActive ? "text-white" : "text-stone-600 hover:text-stone-800"
              }`}
            >
              {isActive &&
                (reduceMotion ? (
                  <div className="absolute inset-0 rounded-[14px] bg-[#2A7F8E] shadow-sm shadow-[#2A7F8E]/40" />
                ) : (
                  <motion.div
                    layoutId="activeNavPill"
                    className="absolute inset-0 rounded-[14px] bg-[#2A7F8E] shadow-sm shadow-[#2A7F8E]/40"
                    transition={{ type: "spring", stiffness: 450, damping: 30 }}
                  />
                ))}
              <div className="relative z-10 flex flex-col items-center gap-1">
                <Icon aria-hidden="true" className={`h-5 w-5 shrink-0 ${isActive ? "stroke-[2.5]" : "stroke-[2]"}`} />
                <span className="whitespace-nowrap text-[12px] font-semibold leading-none tracking-tight">
                  {lang === "es" ? labelEs : labelEn}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function SideNav({ lang }: { lang: Lang }) {
  const pathname = usePathname();
  const router = useRouter();
  const [prefs,,, reset] = usePrefs();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const is1012 = prefs.ageBand === "10-12";
  const visibleItems = NAV_ITEMS_BASE.filter((item) => {
    if (item.id === "resources" && is1012) return false;
    if (item.id === "rights" && is1012) return false;
    if (item.id === "team" && !is1012) return false;
    return true;
  });

  return (
    <aside className="hidden md:flex flex-col fixed left-0 top-0 h-screen w-40 z-40 bg-gradient-to-b from-[#1B3A5C] via-[#1e4a6e] to-[#2A7F8E] shadow-xl">
      {/* Brand */}
      <div className="px-3 pt-5 pb-4 flex flex-col items-center">
        <div className="w-14 h-14 rounded-full bg-white shadow-lg border-4 border-white flex justify-center items-center overflow-hidden mb-2">
          <Image
            src="/onboarding/welcome_icon.png"
            alt="FosterHub AZ"
            width={192}
            height={192}
            priority
            className="w-full h-full object-cover scale-[1.15] translate-y-1"
          />
        </div>
        <div className="text-[#c8e6c9] font-bold text-[12px] uppercase tracking-[0.12em] bg-white/10 px-3 py-1 rounded-full whitespace-nowrap">
          FosterHub AZ
        </div>
      </div>

      {/* Divider */}
      <div className="mx-3 h-px bg-white/10 mb-2" />

      {/* Nav items */}
      <nav aria-label={ts("nav.side", lang)} className="flex-1 px-2 flex flex-col gap-0.5">
        {visibleItems.map(({ id, icon: Icon, href, en, es }) => {
          const fullHref = `/${lang}${href}`;
          const isActive =
            href === ""
              ? pathname === `/${lang}` || pathname === `/${lang}/`
              : pathname.startsWith(`/${lang}${href}`);

          return (
            <Link
              key={id}
              href={fullHref}
              aria-current={isActive ? "page" : undefined}
              className={`inline-flex min-h-[44px] items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-white/15 text-white shadow-sm"
                  : "text-white/60 hover:bg-white/8 hover:text-white/90"
              }`}
            >
              <Icon
                className="h-[19px] w-[19px] shrink-0 transition-all duration-300"
                strokeWidth={isActive ? 3 : 2.5}
              />
              <span className="tracking-wide text-[15px] whitespace-nowrap">{lang === "es" ? es : en}</span>
              {isActive && (
                <div className="ml-1 h-1.5 w-1.5 rounded-full bg-amber-400 shadow-sm shadow-amber-400/50" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="mx-3 h-px bg-white/10 mb-3" />
      <div className="px-3 pb-5">
        <div className="text-[11px] text-white/70 leading-relaxed tracking-wide mb-1">
          {lang === "es"
            ? "Sin registro · Nada sale de tu dispositivo"
            : "No sign-up · Nothing leaves your device"}
        </div>
        {/* Start over wipes the saved age + county, so it always asks first. */}
        {!confirmOpen ? (
          <button
            type="button"
            onClick={() => setConfirmOpen(true)}
            className="-ml-1 inline-flex min-h-[44px] items-center rounded-lg px-1 text-[13px] font-semibold text-white/85 underline underline-offset-2 hover:text-white transition-colors"
          >
            {ts("reset.button", lang)}
          </button>
        ) : (
          <div className="flex flex-col gap-1.5" role="group" aria-label={ts("reset.button", lang)}>
            <p role="status" className="text-[12px] font-semibold leading-snug text-white">
              {ts("reset.confirm", lang)}
            </p>
            <button
              type="button"
              onClick={() => { reset(); router.push("/"); }}
              className="min-h-[44px] rounded-xl bg-white px-2 text-[13px] font-bold leading-tight text-[#1B3A5C] hover:bg-white/90 transition-colors"
            >
              {ts("reset.yes", lang)}
            </button>
            <button
              type="button"
              onClick={() => setConfirmOpen(false)}
              className="min-h-[44px] rounded-xl bg-white/15 px-2 text-[13px] font-bold text-white hover:bg-white/25 transition-colors"
            >
              {ts("reset.no", lang)}
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
