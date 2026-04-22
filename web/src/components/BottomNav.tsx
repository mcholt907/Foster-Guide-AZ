"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Home, Shield, FolderOpen, MapPin, HeartHandshake, HelpCircle, Users } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import type { Lang } from "../lib/i18n";
import { usePrefs } from "../lib/prefs";

const NAV_ITEMS_BASE = [
  { id: "home",      icon: Home,           href: "",           en: "Home",        es: "Inicio",          labelEn: "Home",      labelEs: "Inicio" },
  { id: "team",      icon: Users,          href: "/team",      en: "My Team",     es: "Mi Equipo",       labelEn: "My Team",   labelEs: "Mi Equipo" },
  { id: "case",      icon: FolderOpen,     href: "/case",      en: "My Case",     es: "Mi Caso",         labelEn: "My Case",   labelEs: "Mi Caso" },
  { id: "rights",    icon: Shield,         href: "/rights",    en: "My Rights",   es: "Mis Derechos",    labelEn: "Rights",    labelEs: "Derechos" },
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
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/50 backdrop-blur-2xl backdrop-saturate-[180%] border-t border-white/50 shadow-[0_-4px_24px_-4px_rgba(0,0,0,0.05)]">
      <div className="mx-auto flex max-w-[400px] w-full items-center justify-between px-4 pt-2 pb-[calc(env(safe-area-inset-bottom)+0.75rem)]">
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
              className={`relative flex flex-col items-center justify-center rounded-[14px] px-2.5 py-1.5 transition-colors ${
                isActive ? "text-white" : "text-stone-500 hover:text-stone-700"
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
                <Icon className={`h-5 w-5 shrink-0 ${isActive ? "stroke-[2.5]" : "stroke-[1.75]"}`} />
                <span className="text-[9px] font-semibold leading-none tracking-wide whitespace-nowrap">
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
      <nav className="flex-1 px-2 flex flex-col gap-0.5">
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
              className={`inline-flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
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
        <div className="text-[10px] text-white/35 leading-relaxed tracking-wide mb-3">
          {lang === "es"
            ? "Sin registro · Nada guardado"
            : "No sign-up · Nothing stored"}
        </div>
        {!confirmOpen ? (
          <button
            type="button"
            onClick={() => setConfirmOpen(true)}
            className="text-[10px] text-white/35 hover:text-white/60 transition-colors tracking-wide"
          >
            ↩ {lang === "es" ? "Empezar de nuevo" : "Start over"}
          </button>
        ) : (
          <div className="text-[10px] text-white/50 tracking-wide flex items-center gap-2">
            <span>{lang === "es" ? "¿Resetear?" : "Reset?"}</span>
            <button
              type="button"
              onClick={() => { reset(); router.push('/'); }}
              className="text-white/70 hover:text-white font-bold transition-colors"
            >
              {lang === "es" ? "Sí" : "Yes"}
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => setConfirmOpen(false)}
              className="text-white/35 hover:text-white/60 transition-colors"
            >
              {lang === "es" ? "No" : "No"}
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
