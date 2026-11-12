"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import {
  Home as HomeIcon, FolderOpen, Users, HeartPulse, HelpCircle,
  Shield, MapPin, Sparkles, Menu, X, ChevronLeft, ChevronRight,
} from "lucide-react";
import type { Lang } from "../lib/i18n";
import { tt, type TeenStringKey } from "../lib/i18n-teen";
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

const DRAWER_ID = "teen-menu-drawer";
const DRAWER_TITLE_ID = "teen-menu-title";
const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function TeenShell({ lang, children }: TeenShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const active = activeFromPathname(pathname, lang);
  const [, , , reset] = usePrefs();
  const [confirmReset, setConfirmReset] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const swipeRef = useSwipeNav({ items: NAV_ITEMS, currentId: active, lang });
  const bottomNavScrollRef = useRef<HTMLDivElement>(null);
  const activeBottomItemRef = useRef<HTMLAnchorElement>(null);
  const bottomNavRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useLayoutEffect(() => {
    const main = swipeRef.current;
    if (!main) return;
    main.scrollLeft = 0;
  }, [pathname, swipeRef]);

  // Bottom nav: show an edge fade + arrow on whichever side has more items
  // off-screen. Done with data attributes (not state) so scrolling never
  // re-renders the shell.
  useEffect(() => {
    const container = bottomNavScrollRef.current;
    const nav = bottomNavRef.current;
    if (!container || !nav) return;
    function updateFades() {
      if (!container || !nav) return;
      const max = container.scrollWidth - container.clientWidth;
      nav.dataset.moreLeft = container.scrollLeft > 4 ? "true" : "false";
      nav.dataset.moreRight = container.scrollLeft < max - 4 ? "true" : "false";
    }
    updateFades();
    container.addEventListener("scroll", updateFades, { passive: true });
    window.addEventListener("resize", updateFades);
    return () => {
      container.removeEventListener("scroll", updateFades);
      window.removeEventListener("resize", updateFades);
    };
  }, []);

  // Keep the active bottom-nav item in view (centered) on every route change.
  useEffect(() => {
    const item = activeBottomItemRef.current;
    const container = bottomNavScrollRef.current;
    if (!item || !container) return;
    const target = item.offsetLeft + item.offsetWidth / 2 - container.clientWidth / 2;
    container.scrollLeft = Math.max(0, target);
    // Some browsers skip the scroll event when the position is unchanged.
    container.dispatchEvent(new Event("scroll"));
  }, [active]);

  // Mobile menu drawer: move focus in, keep Tab inside, close on Escape, and
  // hand focus back to the menu button on close. A single Escape only closes
  // the drawer — QuickExit's "three quick Escapes" listener still counts the
  // press but never cancels it.
  useEffect(() => {
    if (!drawerOpen) return;
    const drawer = drawerRef.current;
    const menuButton = menuButtonRef.current;
    closeButtonRef.current?.focus();

    function onKeyDown(e: KeyboardEvent) {
      // The "Need help now?" sheet can open on top of the drawer and runs its
      // own Escape / Tab handling — stay out of its way.
      if (document.getElementById("help-now-title")) return;
      if (e.key === "Escape") {
        setDrawerOpen(false);
        return;
      }
      if (e.key !== "Tab" || !drawer) return;
      const items = Array.from(drawer.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (items.length === 0) {
        e.preventDefault();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      const current = document.activeElement;
      if (e.shiftKey) {
        if (current === first || !drawer.contains(current)) {
          e.preventDefault();
          last.focus();
        }
      } else if (current === last || !drawer.contains(current)) {
        e.preventDefault();
        first.focus();
      }
    }

    // The drawer only exists below the md breakpoint. If the screen grows
    // (rotate, resize) close it so the page behind is not left inert.
    const desktop = window.matchMedia("(min-width: 768px)");
    function onBreakpoint() {
      if (desktop.matches) setDrawerOpen(false);
    }

    document.addEventListener("keydown", onKeyDown);
    desktop.addEventListener("change", onBreakpoint);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      desktop.removeEventListener("change", onBreakpoint);
      // Runs after the drawer is gone and the page is no longer inert.
      menuButton?.focus();
    };
  }, [drawerOpen]);

  function closeDrawer() {
    setDrawerOpen(false);
    setConfirmReset(false);
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
      <aside inert={drawerOpen} className="w-[300px] bg-[#1a2f44] text-white flex-shrink-0 hidden md:flex flex-col relative z-30 shadow-[4px_0_24px_rgba(0,0,0,0.05)]">
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
                <Icon size={20} className={`shrink-0 transition-all duration-300 group-hover:scale-110 ${isActive ? "text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.6)]" : ""}`} />
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
      <header inert={drawerOpen} className="md:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-xl border-b border-slate-100">
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

      {/* Mobile drawer */}
      {drawerOpen && (
        <div
          ref={drawerRef}
          id={DRAWER_ID}
          role="dialog"
          aria-modal="true"
          aria-labelledby={DRAWER_TITLE_ID}
          className="md:hidden fixed inset-0 z-50 bg-[#1a2f44] text-white flex flex-col"
        >
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
              ref={closeButtonRef}
              type="button"
              onClick={closeDrawer}
              aria-label={ts("menu.close", lang)}
              className="w-11 h-11 flex items-center justify-center rounded-xl text-white/80 hover:text-white focus-visible:outline-white"
            >
              <X size={22} aria-hidden="true" />
            </button>
          </div>
          <nav aria-label={ts("nav.drawer", lang)} className="flex flex-col px-4 gap-2 flex-1 min-h-0 overflow-y-auto pt-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
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
              "Leave fast" / "Need help now?" buttons, which stay on top. */}
          <div className="px-6 pt-4 pb-[calc(env(safe-area-inset-bottom)+9rem)] flex-shrink-0">
            <TeenShellFooter lang={lang} confirmReset={confirmReset} setConfirmReset={setConfirmReset} handleStartOver={handleStartOver} />
          </div>
        </div>
      )}

      {/* Main content area — also the skip-link target */}
      <main
        id="main-content"
        tabIndex={0}
        ref={swipeRef}
        inert={drawerOpen}
        className="flex-1 min-w-0 overflow-y-auto overflow-x-clip relative pt-20 md:pt-0 pb-40 md:pb-20 scroll-smooth outline-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#2A7F8E]"
      >
        {children}
      </main>

      {/* Mobile floating bottom nav — scrolls sideways across all 8 sections.
          Edge fades + arrows (driven by data-more-left/right, see effect
          above) hint that there is more to swipe to. */}
      <nav
        ref={bottomNavRef}
        aria-label={ts("nav.bottom", lang)}
        inert={drawerOpen}
        data-more-left="false"
        data-more-right="true"
        className="group/bnav md:hidden fixed bottom-0 inset-x-0 z-40 bg-[rgba(26,47,68,0.92)] backdrop-blur-xl backdrop-saturate-150 border-t border-white/5 shadow-[0_-8px_30px_rgba(26,47,68,0.3)] pt-1.5 pb-[calc(env(safe-area-inset-bottom)+0.5rem)]"
      >
        <div ref={bottomNavScrollRef} className="flex overflow-x-auto px-3 gap-0.5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {NAV_ITEMS.map((item) => {
            const isActive = item.id === active;
            const Icon = item.icon;
            return (
              <Link
                key={item.id}
                ref={isActive ? activeBottomItemRef : null}
                href={`/${lang}${item.href}`}
                aria-current={isActive ? "page" : undefined}
                className={`shrink-0 min-w-[76px] min-h-[52px] flex flex-col items-center justify-center gap-1 px-2 py-1.5 rounded-2xl transition-colors ${
                  isActive ? "text-emerald-300 font-bold bg-white/10" : "text-slate-300 hover:text-white font-medium"
                }`}
              >
                <Icon size={22} aria-hidden="true" className={isActive ? "drop-shadow-[0_0_8px_rgba(52,211,153,0.4)]" : "opacity-90"} />
                <span className="text-[12px] leading-none tracking-tight whitespace-nowrap">
                  {tt(item.labelKey, lang)}
                </span>
              </Link>
            );
          })}
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 w-10 flex items-center justify-start pl-0.5 bg-gradient-to-r from-[#1a2f44] via-[#1a2f44]/80 to-transparent text-white opacity-0 transition-opacity group-data-[more-left=true]/bnav:opacity-100"
        >
          <ChevronLeft size={18} strokeWidth={2.75} />
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 w-10 flex items-center justify-end pr-0.5 bg-gradient-to-l from-[#1a2f44] via-[#1a2f44]/80 to-transparent text-white opacity-0 transition-opacity group-data-[more-right=true]/bnav:opacity-100"
        >
          <ChevronRight size={18} strokeWidth={2.75} />
        </div>
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
  const band = prefs.ageBand ?? "13-15";
  const langKey: TeenStringKey = lang === "es" ? "shell.band_language.es" : "shell.band_language.en";

  return (
    <div className="w-full p-6 rounded-[2rem] bg-gradient-to-br from-white/5 to-transparent border border-white/10 relative overflow-hidden group">
      <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-emerald-500/10 blur-2xl rounded-full" />
      <Shield size={20} className="text-emerald-400 mb-3" />
      <p className="text-white text-[13px] font-black leading-relaxed mb-1 tracking-tight">{tt("shell.command_center", lang)}</p>
      <p className="text-slate-400 text-[10px] leading-relaxed font-bold opacity-80 uppercase tracking-widest">
        {tt(langKey, lang, { band })}
      </p>

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
        <Link href={`/${lang}/privacy`} className="inline-flex min-h-[32px] items-center underline-offset-2 hover:text-white hover:underline transition-colors">
          {lang === "es" ? "Privacidad" : "Privacy"}
        </Link>
        <Link href={`/${lang}/terms`} className="inline-flex min-h-[32px] items-center underline-offset-2 hover:text-white hover:underline transition-colors">
          {lang === "es" ? "Términos" : "Terms"}
        </Link>
        <Link href={`/${lang}/accessibility`} className="inline-flex min-h-[32px] items-center underline-offset-2 hover:text-white hover:underline transition-colors">
          {lang === "es" ? "Accesibilidad" : "Accessibility"}
        </Link>
      </nav>
    </div>
  );
}
