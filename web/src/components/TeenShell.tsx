"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import {
  Home as HomeIcon, FolderOpen, Users, HeartPulse, HelpCircle,
  Shield, MapPin, Sparkles, Menu, X,
} from "lucide-react";
import type { Lang } from "../lib/i18n";
import { tt, type TeenStringKey } from "../lib/i18n-teen";
import { tho } from "../lib/i18n-home";
import { HelpNow } from "./HelpNow";
import { ts } from "../lib/i18n-shell";
import { usePrefs } from "../lib/prefs";
import { useSwipeNav } from "../lib/useSwipeNav";
import { activeFromPathname } from "../lib/teenNav";

export type TeenNavId =
  | "dashboard" | "case" | "team" | "wellness" | "answers"
  | "rights" | "resources" | "future";

interface TeenShellProps {
  lang: Lang;
  children: React.ReactNode;
}

interface NavItem {
  id: TeenNavId;
  icon: typeof HomeIcon;
  href: string;
  labelKey: TeenStringKey;
}

const NAV_ITEMS: NavItem[] = [
  { id: "dashboard", icon: HomeIcon,    href: "",            labelKey: "nav.dashboard" },
  { id: "case",      icon: FolderOpen,  href: "/case",       labelKey: "nav.case" },
  { id: "team",      icon: Users,       href: "/team",       labelKey: "nav.team" },
  { id: "wellness",  icon: HeartPulse,  href: "/wellness",   labelKey: "nav.wellness" },
  { id: "answers",   icon: HelpCircle,  href: "/ask",        labelKey: "nav.answers" },
  { id: "rights",    icon: Shield,      href: "/rights",     labelKey: "nav.rights" },
  { id: "resources", icon: MapPin,      href: "/resources",  labelKey: "nav.resources" },
  { id: "future",    icon: Sparkles,    href: "/future",     labelKey: "nav.future" },
];

// The four places kept on the phone's bottom bar. Everything else is one tap
// away under "More", which opens the full menu.
const BOTTOM_NAV_IDS = ["dashboard", "answers", "rights", "resources"];
const BOTTOM_NAV_ITEMS = BOTTOM_NAV_IDS.map((id) => NAV_ITEMS.find((n) => n.id === id)).filter((n): n is (typeof NAV_ITEMS)[number] => !!n);
const BOTTOM_ITEM = "min-h-[52px] flex flex-col items-center justify-center gap-1 px-0.5 py-1.5 rounded-2xl transition-colors";
const BOTTOM_ITEM_ON = "text-emerald-300 font-bold bg-white/10";
const BOTTOM_ITEM_OFF = "text-slate-300 hover:text-white font-medium";

const DRAWER_ID = "teen-menu-drawer";
const DRAWER_TITLE_ID = "teen-menu-title";

export function TeenShell({ lang, children }: TeenShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const active = activeFromPathname(pathname, lang);
  const inMore = !BOTTOM_NAV_IDS.includes(active);
  const [, , , reset] = usePrefs();
  const [confirmReset, setConfirmReset] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const swipeRef = useSwipeNav({ items: NAV_ITEMS, currentId: active, lang });
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDialogElement>(null);

  useLayoutEffect(() => {
    const main = swipeRef.current;
    if (!main) return;
    main.scrollLeft = 0;
  }, [pathname, swipeRef]);

  // Mobile menu: a native modal <dialog>. The browser makes the page inert,
  // keeps focus inside, closes on Esc and the back gesture, and returns focus
  // to the menu button. It is opened after its contents render so focus can
  // land on the Close button.
  useEffect(() => {
    const drawer = drawerRef.current;
    if (!drawerOpen || !drawer) return;
    if (!drawer.open) drawer.showModal();

    // The menu only exists below the md breakpoint. If the screen grows
    // (rotate, resize) close it so the page behind is not left blocked.
    const desktop = window.matchMedia("(min-width: 768px)");
    function onBreakpoint() {
      if (desktop.matches) drawer?.close();
    }
    desktop.addEventListener("change", onBreakpoint);
    return () => desktop.removeEventListener("change", onBreakpoint);
  }, [drawerOpen]);

  function closeDrawer() {
    drawerRef.current?.close();
  }

  function handleStartOver() {
    reset();
    router.push("/");
  }

  return (
    <div
      className="fixed inset-0 z-50 flex w-full bg-[#FDFBF7] text-[#2d3748] overflow-x-clip selection:bg-emerald-100/80"
      style={{ fontFamily: "var(--font-inter), Inter, system-ui, sans-serif" }}
    >
      {/* Desktop sidebar */}
      <aside className="w-[300px] bg-[#1a2f44] text-white flex-shrink-0 hidden md:flex flex-col relative z-30 shadow-[4px_0_24px_rgba(0,0,0,0.05)]">
        <div className="p-10 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white shadow-[0_8px_20px_rgba(255,255,255,0.15)] rounded-2xl flex items-center justify-center overflow-hidden">
              <Image src="/onboarding/welcome_icon.png" alt="" width={192} height={192} className="w-full h-full object-cover scale-[1.1] translate-y-1" />
            </div>
            <div className="flex flex-col text-left">
              <span className="font-black text-xl leading-tight tracking-tight">{tt("shell.brand", lang)}</span>
              <span className="text-[10px] uppercase tracking-[0.3em] text-emerald-400 font-black">{tt("shell.brand_sub", lang)}</span>
            </div>
          </div>
        </div>

        <nav aria-label={ts("nav.side", lang)} className="flex flex-col px-6 gap-2 flex-1 min-h-0 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {NAV_ITEMS.map((item) => {
            const isActive = item.id === active;
            const Icon = item.icon;
            return (
              <Link
                key={item.id}
                href={`/${lang}${item.href}`}
                aria-current={isActive ? "page" : undefined}
                className={`flex items-center gap-4 px-5 py-4 rounded-[1.25rem] transition-all duration-500 group relative ${
                  isActive
                    ? "bg-gradient-to-r from-white/15 to-transparent text-white font-bold shadow-[0_4px_12px_rgba(0,0,0,0.1)]"
                    : "text-slate-400 hover:bg-white/5 hover:text-white font-medium"
                }`}
              >
                <Icon size={20} className={`shrink-0 transition-all duration-300 motion-safe:group-hover:scale-110 ${isActive ? "text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.6)]" : ""}`} />
                <span className="text-[15.5px] tracking-tight">{tt(item.labelKey, lang)}</span>
                {isActive &&
                  (reduceMotion ? (
                    <div className="absolute left-0 w-1.5 h-8 bg-emerald-400 rounded-r-full shadow-[0_0_12px_rgba(52,211,153,0.8)]" />
                  ) : (
                    <motion.div layoutId="nav-pill" className="absolute left-0 w-1.5 h-8 bg-emerald-400 rounded-r-full shadow-[0_0_12px_rgba(52,211,153,0.8)]" />
                  ))}
              </Link>
            );
          })}
        </nav>

        {/* Footer: band+lang badge + start-over */}
        <div className="p-8 flex-shrink-0">
          <TeenShellFooter lang={lang} confirmReset={confirmReset} setConfirmReset={setConfirmReset} handleStartOver={handleStartOver} />
        </div>
      </aside>

      {/* Mobile top header */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-xl border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center overflow-hidden shadow-lg border border-white/20">
            <Image src="/onboarding/welcome_icon.png" alt="" width={192} height={192} className="w-full h-full object-cover scale-[1.1] translate-y-1" />
          </div>
          <span className="font-black text-[#1e293b] tracking-tight text-lg">{tt("shell.brand", lang)} AZ</span>
        </div>
        <button
          ref={menuButtonRef}
          type="button"
          onClick={() => setDrawerOpen(true)}
          aria-label={ts("menu.open", lang)}
          aria-haspopup="dialog"
          aria-expanded={drawerOpen}
          aria-controls={DRAWER_ID}
          className="w-11 h-11 flex items-center justify-center bg-slate-100 text-slate-700 rounded-xl"
        >
          <Menu size={22} aria-hidden="true" />
        </button>
      </header>

      {/* Mobile menu. No role, aria-modal, focus trap or Esc handler: the
          native modal provides them. */}
      <dialog
        ref={drawerRef}
        id={DRAWER_ID}
        aria-labelledby={DRAWER_TITLE_ID}
        onClose={(e) => {
          // The help sheet is a dialog inside this one; ignore its close event.
          if (e.target !== e.currentTarget) return;
          setDrawerOpen(false);
          setConfirmReset(false);
        }}
        className="sheet-dialog m-0 h-dvh max-h-none w-screen max-w-none flex-col bg-[#1a2f44] p-0 text-white open:flex"
      >
        {drawerOpen && (
          <>
          <h2 id={DRAWER_TITLE_ID} className="sr-only">{ts("menu.title", lang)}</h2>
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center overflow-hidden">
                <Image src="/onboarding/welcome_icon.png" alt="" width={192} height={192} className="w-full h-full object-cover scale-[1.1] translate-y-1" />
              </div>
              <div className="flex flex-col">
                <span className="font-black text-lg tracking-tight">{tt("shell.brand", lang)}</span>
                <span className="text-[10px] uppercase tracking-[0.3em] text-emerald-400 font-black">{tt("shell.brand_sub", lang)}</span>
              </div>
            </div>
            <button
              type="button"
              autoFocus
              onClick={closeDrawer}
              aria-label={ts("menu.close", lang)}
              className="w-11 h-11 flex items-center justify-center rounded-xl text-white/80 hover:text-white focus-visible:outline-white"
            >
              <X size={22} aria-hidden="true" />
            </button>
          </div>
          {/* One scroller for the sections and the card below them. A
              separate scroller for the list (with a hidden scrollbar) hid
              the last sections on phones, with nothing to say they were there. */}
          <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain [scrollbar-width:thin]">
          <nav aria-label={ts("nav.drawer", lang)} className="flex flex-col px-4 gap-2 pt-4">
            {NAV_ITEMS.map((item) => {
              const isActive = item.id === active;
              const Icon = item.icon;
              return (
                <Link
                  key={item.id}
                  href={`/${lang}${item.href}`}
                  onClick={closeDrawer}
                  aria-current={isActive ? "page" : undefined}
                  className={`flex items-center gap-4 px-5 py-4 rounded-[1.25rem] transition-all ${
                    isActive
                      ? "bg-white/15 text-white font-bold"
                      : "text-slate-300 hover:bg-white/5 hover:text-white font-medium"
                  }`}
                >
                  <Icon size={22} className={isActive ? "text-emerald-400" : ""} />
                  <span className="text-base tracking-tight">{tt(item.labelKey, lang)}</span>
                </Link>
              );
            })}
          </nav>
          {/* Bottom padding keeps this card clear of the floating
              "Need help now?" button. */}
          <div className="px-6 pt-4 pb-[calc(env(safe-area-inset-bottom)+9rem)]">
            <TeenShellFooter lang={lang} confirmReset={confirmReset} setConfirmReset={setConfirmReset} handleStartOver={handleStartOver} />
          </div>
          </div>
          {/* The page's own help button is blocked while the menu is open,
              so the menu carries one. Help stays one tap away. */}
          <HelpNow lang={lang} />
          </>
        )}
      </dialog>

      {/* Main content area — also the skip-link target */}
      <main
        id="main-content"
        tabIndex={0}
        ref={swipeRef}
       
        className="flex-1 min-w-0 overflow-y-auto overflow-x-clip relative pt-20 md:pt-0 pb-40 md:pb-20 motion-safe:scroll-smooth outline-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#2A7F8E]"
      >
        {children}
      </main>

      {/* Mobile bottom nav: four fixed places plus "More", which opens the
          full menu. Nothing is hidden off-screen. */}
      <nav
        aria-label={ts("nav.bottom", lang)}
        className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-[rgba(26,47,68,0.92)] backdrop-blur-xl backdrop-saturate-150 border-t border-white/5 shadow-[0_-8px_30px_rgba(26,47,68,0.3)] pt-1.5 pb-[calc(env(safe-area-inset-bottom)+0.5rem)]"
      >
        <ul className="grid grid-cols-5 px-1">
          {BOTTOM_NAV_ITEMS.map((item) => {
            const isActive = item.id === active;
            const Icon = item.icon;
            return (
              <li key={item.id} className="min-w-0">
                <Link
                  href={`/${lang}${item.href}`}
                  aria-current={isActive ? "page" : undefined}
                  className={`${BOTTOM_ITEM} ${isActive ? BOTTOM_ITEM_ON : BOTTOM_ITEM_OFF}`}
                >
                  <Icon size={22} aria-hidden="true" className={isActive ? "drop-shadow-[0_0_8px_rgba(52,211,153,0.4)]" : "opacity-90"} />
                  <span className="max-w-full truncate text-[12px] leading-none tracking-tighter">{ts(`nav.bottom.${item.id}` as Parameters<typeof ts>[0], lang)}</span>
                </Link>
              </li>
            );
          })}
          <li className="min-w-0">
            {/* Lit when the current page is one of the sections kept in the menu. */}
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              aria-haspopup="dialog"
              aria-expanded={drawerOpen}
              aria-controls={DRAWER_ID}
              className={`w-full ${BOTTOM_ITEM} ${inMore ? BOTTOM_ITEM_ON : BOTTOM_ITEM_OFF}`}
            >
              <Menu size={22} aria-hidden="true" className={inMore ? "drop-shadow-[0_0_8px_rgba(52,211,153,0.4)]" : "opacity-90"} />
              <span className="max-w-full truncate text-[12px] leading-none tracking-tighter">{ts("nav.more.button", lang)}</span>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}

function TeenShellFooter({
  lang, confirmReset, setConfirmReset, handleStartOver,
}: {
  lang: Lang;
  confirmReset: boolean;
  setConfirmReset: (v: boolean) => void;
  handleStartOver: () => void;
}) {
  const [prefs] = usePrefs();
  // No saved age: say so and offer the age screen, never show an assumed band.
  const band = prefs.ageBand;
  const langKey: TeenStringKey = lang === "es" ? "shell.band_language.es" : "shell.band_language.en";

  return (
    <div className="w-full p-6 rounded-[2rem] bg-gradient-to-br from-white/5 to-transparent border border-white/10 relative overflow-hidden group">
      <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-emerald-500/10 blur-2xl rounded-full" />
      <Shield size={20} className="text-emerald-400 mb-3" />
      <p className="text-white text-[13px] font-black leading-relaxed mb-1 tracking-tight">{tt("shell.command_center", lang)}</p>
      {band ? (
        <p className="text-slate-400 text-[10px] leading-relaxed font-bold opacity-80 uppercase tracking-widest">
          {tt(langKey, lang, { band })}
        </p>
      ) : (
        <Link
          href={`/${lang}/setup`}
          className="relative -ml-2 inline-flex min-h-[44px] items-center rounded-xl px-2 text-[13px] font-bold text-emerald-300 underline underline-offset-2 hover:text-white transition-colors"
        >
          {tho("shell.pick_age", lang)}
        </Link>
      )}

      {/* Start over wipes the saved age + county, so it always asks first. */}
      {!confirmReset ? (
        <button
          type="button"
          onClick={() => setConfirmReset(true)}
          className="relative mt-3 -ml-2 inline-flex min-h-[44px] items-center rounded-xl px-2 text-[13px] font-semibold text-slate-200 underline underline-offset-2 hover:text-white transition-colors"
        >
          {tt("shell.start_over", lang)}
        </button>
      ) : (
        <div className="relative mt-3 space-y-2" role="group" aria-label={ts("reset.button", lang)}>
          <p role="status" className="text-[13px] font-semibold text-white leading-snug">{ts("reset.confirm", lang)}</p>
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={handleStartOver}
              className="min-h-[44px] px-3 text-[13px] font-bold bg-emerald-400 text-[#10241a] rounded-xl hover:bg-emerald-300 transition"
            >
              {ts("reset.yes", lang)}
            </button>
            <button
              type="button"
              onClick={() => setConfirmReset(false)}
              className="min-h-[44px] px-3 text-[13px] font-bold bg-white/10 text-white rounded-xl hover:bg-white/20 transition"
            >
              {ts("reset.no", lang)}
            </button>
          </div>
        </div>
      )}

      <nav
        aria-label={ts("nav.legal", lang)}
        className="relative mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[12px] text-slate-300"
      >
        <Link href={`/${lang}/about`} className="inline-flex min-h-[32px] items-center underline-offset-2 hover:text-white hover:underline transition-colors">
          {lang === "es" ? "Acerca de" : "About"}
        </Link>
        <Link href={`/${lang}/privacy`} className="inline-flex min-h-[32px] items-center underline-offset-2 hover:text-white hover:underline transition-colors">
          {lang === "es" ? "Privacidad" : "Privacy"}
        </Link>
        <Link href={`/${lang}/terms`} className="inline-flex min-h-[32px] items-center underline-offset-2 hover:text-white hover:underline transition-colors">
          {lang === "es" ? "Términos" : "Terms"}
        </Link>
        <Link href={`/${lang}/accessibility`} className="inline-flex min-h-[32px] items-center underline-offset-2 hover:text-white hover:underline transition-colors">
          {lang === "es" ? "Accesibilidad" : "Accessibility"}
        </Link>
        <Link href={`/${lang}/about#report`} className="inline-flex min-h-[32px] items-center underline-offset-2 hover:text-white hover:underline transition-colors">
          {lang === "es" ? "Reportar un error" : "Report a mistake"}
        </Link>
      </nav>
    </div>
  );
}
