"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { LifeBuoy, X } from "lucide-react";
import { th, type HelpLang } from "../lib/i18n-help";
import { ts } from "../lib/i18n-shell";
import { CrisisQuickLinks } from "./CrisisQuickLinks";
import { QuickExitButton, useTripleEscapeExit } from "./QuickExit";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

interface HelpNowProps {
  lang: HelpLang;
  /**
   * "bottom" (default) floats above the mobile bottom nav / in the desktop
   * bottom-right corner. "top" is for full-screen flows (language picker,
   * setup) whose main button sits at the bottom of the screen.
   */
  placement?: "bottom" | "top";
}

/**
 * The always-there safety buttons: "Need help now?" (opens a sheet with
 * tap-to-call / tap-to-text crisis lines) and "Leave fast" (quick exit).
 * Mount once per screen — BandShell does it for every /[lang]/ page.
 */
export function HelpNow({ lang, placement = "bottom" }: HelpNowProps) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  useTripleEscapeExit();

  const close = useCallback(() => {
    setOpen(false);
    // Hand focus back to the button that opened the sheet.
    requestAnimationFrame(() => triggerRef.current?.focus());
  }, []);

  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    panel?.focus();

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        close();
        return;
      }
      if (e.key !== "Tab" || !panel) return;
      const items = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (items.length === 0) {
        e.preventDefault();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      const current = document.activeElement;
      if (e.shiftKey) {
        if (current === first || current === panel || !panel.contains(current)) {
          e.preventDefault();
          last.focus();
        }
      } else if (current === last || !panel.contains(current)) {
        e.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, close]);

  const position =
    placement === "top"
      ? "top-[calc(env(safe-area-inset-top)+0.5rem)]"
      : "bottom-[calc(env(safe-area-inset-bottom)+5.5rem)] md:bottom-6";

  return (
    <>
      <div
        className={`pointer-events-none fixed z-[60] right-[calc(env(safe-area-inset-right)+0.75rem)] md:right-[calc(env(safe-area-inset-right)+1.5rem)] flex max-w-[calc(100vw-1.5rem)] flex-wrap-reverse items-center justify-end gap-1.5 sm:gap-2 font-sans print:hidden ${position}`}
      >
        <QuickExitButton lang={lang} className="pointer-events-auto" />
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setOpen(true)}
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-label={th("help.button", lang)}
          className="pointer-events-auto inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-full bg-[#1B3A5C] px-3 sm:px-4 text-[13px] font-extrabold text-white shadow-[0_6px_20px_rgba(27,58,92,0.35)] ring-2 ring-inset ring-[#F5B04C] transition-colors hover:bg-[#14304d] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-white"
        >
          <LifeBuoy size={17} strokeWidth={2.5} aria-hidden="true" className="shrink-0 text-[#F5B04C]" />
          {/* Small phones get a shorter label so the pair covers less of the page. */}
          <span className="whitespace-nowrap sm:hidden">{ts("help.short", lang)}</span>
          <span className="hidden whitespace-nowrap sm:inline">{th("help.button", lang)}</span>
        </button>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-[70] flex items-end justify-center bg-[#1B3A5C]/60 font-sans md:items-center md:p-6"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="help-now-title"
            aria-describedby="help-now-reassure"
            tabIndex={-1}
            initial={reduceMotion ? false : { opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.2, ease: "easeOut" }}
            className="flex max-h-[92svh] w-full max-w-md flex-col overflow-hidden rounded-t-[1.75rem] bg-[#F5F2EE] text-[#1B3A5C] shadow-2xl focus:outline-none md:rounded-[1.75rem]"
          >
            <div className="flex items-start justify-between gap-3 px-5 pt-5 pb-3">
              <div className="min-w-0">
                <h2 id="help-now-title" className="text-[22px] font-extrabold leading-tight tracking-tight">
                  {th("help.title", lang)}
                </h2>
                <p id="help-now-reassure" className="mt-1 text-[15px] font-bold leading-snug text-[#1F6470]">
                  {th("help.reassure", lang)}
                </p>
              </div>
              <button
                type="button"
                onClick={close}
                aria-label={th("help.close", lang)}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-[#1B3A5C] ring-1 ring-inset ring-slate-300 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[#D97706]"
              >
                <X size={20} strokeWidth={2.5} aria-hidden="true" />
              </button>
            </div>

            <div className="overflow-y-auto overscroll-contain px-5 pb-[calc(env(safe-area-inset-bottom)+1.25rem)]">
              <p className="mb-3 text-[14px] font-medium leading-snug text-slate-600">
                {th("help.intro", lang)}
              </p>

              <CrisisQuickLinks lang={lang} variant="full" />

              <div className="mt-5 rounded-2xl bg-white p-4 ring-1 ring-inset ring-slate-200">
                <h3 className="text-[15px] font-extrabold leading-snug">{th("exit.heading", lang)}</h3>
                <p className="mt-1 text-[14px] font-medium leading-snug text-slate-600">
                  {th("exit.hint", lang)}
                </p>
                <QuickExitButton lang={lang} className="mt-3 shadow-none" />
                <p className="mt-3 text-[12px] font-medium leading-snug text-slate-500">
                  {th("exit.history", lang)}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}
