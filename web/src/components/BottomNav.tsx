"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Shield, Gavel, MapPin, HeartPulse, MessageCircle } from "lucide-react";
import type { Lang } from "../lib/i18n";
import { usePrefs } from "../lib/prefs";

const NAV_ITEMS = [
  { id: "home",      icon: Home,         href: "",           en: "Home",     es: "Inicio" },
  { id: "case",      icon: Gavel,        href: "/case",      en: "My Case",  es: "Mi Caso" },
  { id: "rights",    icon: Shield,       href: "/rights",    en: "Your Rights",   es: "Tus Derechos" },
  { id: "resources", icon: MapPin,       href: "/resources", en: "Resources",es: "Recursos" },
  { id: "wellness",  icon: HeartPulse,   href: "/wellness",  en: "Wellness", es: "Bienestar" },
  { id: "ask",       icon: MessageCircle,href: "/ask",       en: "Ask",      es: "Preguntar" },
] as const;

export function BottomNav({ lang }: { lang: Lang }) {
  const pathname = usePathname();
  const [prefs] = usePrefs();
  const visibleItems = NAV_ITEMS.filter(
    (item) => !(item.id === "resources" && prefs.ageBand === "10-12")
  );

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 safe-bottom">
      <div className="max-w-lg mx-auto flex items-stretch">
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
              className={`flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[10px] font-medium transition-colors ${
                isActive
                  ? "text-[#2A7F8E]"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <Icon
                className={`h-5 w-5 ${isActive ? "stroke-[2.5]" : "stroke-2"}`}
              />
              <span>{lang === "es" ? es : en}</span>
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
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 shadow-md shadow-black/20">
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
              <circle cx="12" cy="12" r="4" fill="white" />
              <path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.93 4.93l1.77 1.77M17.3 17.3l1.77 1.77M4.93 19.07l1.77-1.77M17.3 6.7l1.77-1.77" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
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
