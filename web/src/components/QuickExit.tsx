"use client";

import { useEffect } from "react";
import { LogOut } from "lucide-react";
import { th, type HelpLang } from "../lib/i18n-help";

const PREFS_KEY = "fgaz_prefs_v2";
const EXIT_URL = "https://www.google.com";

/**
 * Leave the site right now: forget the saved prefs, blank the page, and swap
 * this tab over to Google. `replace` keeps this page out of the Back button,
 * but it cannot erase earlier pages from the browser history.
 */
export function quickExit(): void {
  try {
    localStorage.removeItem(PREFS_KEY);
  } catch {
    /* storage blocked — still leave */
  }
  try {
    // Hide everything at once so nothing stays on screen while Google loads.
    document.documentElement.style.visibility = "hidden";
  } catch {
    /* ignore */
  }
  window.location.replace(EXIT_URL);
}

const ESC_COUNT = 3;
const ESC_WINDOW_MS = 1200;

/**
 * Keyboard shortcut: press Escape three times quickly to leave the site.
 * It only listens — it never cancels the event — so a single Escape still
 * closes whatever dialog is open.
 */
export function useTripleEscapeExit(): void {
  useEffect(() => {
    let presses: number[] = [];
    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== "Escape") {
        presses = [];
        return;
      }
      if (e.repeat) return; // holding the key down is not three presses
      const now = Date.now();
      presses = [...presses.filter((t) => now - t < ESC_WINDOW_MS), now];
      if (presses.length >= ESC_COUNT) {
        presses = [];
        quickExit();
      }
    }
    window.addEventListener("keydown", onKeyDown, true);
    return () => window.removeEventListener("keydown", onKeyDown, true);
  }, []);
}

export function QuickExitButton({
  lang,
  className = "",
}: {
  lang: HelpLang;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={quickExit}
      aria-label={th("exit.aria", lang)}
      title={th("exit.aria", lang)}
      className={`inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-full bg-white px-3.5 text-[13px] font-extrabold text-[#1B3A5C] shadow-[0_6px_20px_rgba(27,58,92,0.22)] ring-2 ring-inset ring-[#1B3A5C] transition-colors hover:bg-[#EEF3F8] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[#D97706] ${className}`}
    >
      <LogOut size={16} strokeWidth={2.5} aria-hidden="true" className="shrink-0" />
      <span className="whitespace-nowrap">{th("exit.button", lang)}</span>
    </button>
  );
}
