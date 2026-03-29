"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Shield, Gavel, MapPin, HeartPulse, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import type { Lang } from "../lib/i18n";
import { usePrefs } from "../lib/prefs";

const NAV_ITEMS = [
  { id: "home",      icon: Home,         href: "",           en: "Home",      es: "Inicio",    labelEn: "Home",      labelEs: "Inicio" },
  { id: "case",      icon: Gavel,        href: "/case",      en: "My Case",   es: "Mi Caso",   labelEn: "My Case",   labelEs: "Mi Caso" },
  { id: "rights",    icon: Shield,       href: "/rights",    en: "Your Rights", es: "Tus Derechos", labelEn: "Rights", labelEs: "Derechos" },
  { id: "resources", icon: MapPin,       href: "/resources", en: "Resources", es: "Recursos",  labelEn: "Resources", labelEs: "Recursos" },
  { id: "wellness",  icon: HeartPulse,   href: "/wellness",  en: "Wellness",  es: "Bienestar", labelEn: "Wellness",  labelEs: "Bienestar" },
  { id: "ask",       icon: MessageCircle,href: "/ask",       en: "Ask",       es: "Preguntar", labelEn: "Ask",       labelEs: "Ask" },
] as const;

export function BottomNav({ lang }: { lang: Lang }) {
  const pathname = usePathname();
  const [prefs] = usePrefs();
  const visibleItems = NAV_ITEMS.filter(
    (item) => !(item.id === "resources" && prefs.ageBand === "10-12")
  );

  return (
    <nav className="md:hidden fixed bottom-6 inset-x-4 z-40 pointer-events-none">
      <div className="mx-auto flex max-w-[400px] items-center justify-between overflow-hidden rounded-[32px] bg-white/95 p-2 shadow-[0_20px_60px_-5px_rgb(0,0,0,0.25),0_8px_20px_-8px_rgb(42,127,142,0.3)] backdrop-blur-xl ring-1 ring-black/5 pointer-events-auto">
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
              className={`relative flex flex-col items-center justify-center rounded-2xl px-2.5 py-1.5 transition-colors ${
                isActive ? "text-white" : "text-stone-400 hover:text-stone-600"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeNavPill"
                  className="absolute inset-0 rounded-2xl bg-[#2A7F8E] shadow-md shadow-[#2A7F8E]/40"
                  transition={{ type: "spring", stiffness: 450, damping: 30 }}
                />
              )}
              <div className="relative z-10 flex flex-col items-center gap-0.5">
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
  const [prefs] = usePrefs();
  const visibleItems = NAV_ITEMS.filter(
    (item) => !(item.id === "resources" && prefs.ageBand === "10-12")
  );

  return (
    <aside className="hidden md:flex flex-col fixed left-0 top-0 h-screen w-56 z-40 bg-gradient-to-b from-[#1B3A5C] via-[#1e4a6e] to-[#2A7F8E] shadow-xl">
      {/* Brand */}
      <div className="px-5 pt-6 pb-5">
        <div className="flex items-center gap-3">
          <img src="/icons/icon-192.svg" className="h-9 w-9 rounded-2xl shadow-md shadow-black/20" alt="FosterHub AZ" />
          <div>
            <div className="text-sm font-bold text-white leading-none tracking-wide">FosterHub AZ</div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-5 h-px bg-white/10 mb-3" />

      {/* Nav items */}
      <nav className="flex-1 px-3 flex flex-col gap-0.5">
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
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-white/15 text-white shadow-sm"
                  : "text-white/60 hover:bg-white/8 hover:text-white/90"
              }`}
            >
              <Icon className={`h-[18px] w-[18px] shrink-0 ${isActive ? "stroke-[2.5]" : "stroke-[1.75]"}`} />
              <span className="tracking-wide">{lang === "es" ? es : en}</span>
              {isActive && (
                <div className="ml-auto h-1.5 w-1.5 rounded-full bg-amber-400 shadow-sm shadow-amber-400/50" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="mx-5 h-px bg-white/10 mb-4" />
      <div className="px-5 pb-6">
        <div className="text-[10px] text-white/35 leading-relaxed tracking-wide">
          {lang === "es"
            ? "Sin registro · Nada guardado"
            : "No sign-up · Nothing stored"}
        </div>
      </div>
    </aside>
  );
}
