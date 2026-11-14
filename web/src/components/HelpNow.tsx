"use client";

import { useEffect, useRef, useState } from "react";
import { LifeBuoy, X } from "lucide-react";
import { th, type HelpLang } from "../lib/i18n-help";
import { ts } from "../lib/i18n-shell";
import { CrisisQuickLinks } from "./CrisisQuickLinks";
import { QuickExitButton, useTripleEscapeExit } from "./QuickExit";
import { QUICK_EXIT_ENABLED } from "../lib/features";

// Browsers without <dialog closedby> (Safari, at the time of writing) still
// close the sheet with Esc and the back gesture; this adds tap-outside for them.
const hasClosedBy = () => typeof HTMLDialogElement !== "undefined" && "closedBy" in HTMLDialogElement.prototype;
// Test the pointer position, not event.target: the <dialog> is also the target
// for its own padding and the gaps between its children.
function isOutside(e: React.PointerEvent<HTMLDialogElement>): boolean {
  const r = e.currentTarget.getBoundingClientRect();
  return e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
}

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
  // `open` only mirrors the dialog so the sheet's contents are rendered while
  // it is showing. The native modal <dialog> does the rest: it makes the page
  // inert, keeps focus inside, closes on Esc and the Android back gesture, and
  // returns focus to the button that opened it.
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const pressedOutside = useRef(false);

  useTripleEscapeExit();

  // Open after the contents have rendered, so the browser can put focus on
  // the first control inside the sheet instead of on the empty dialog.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (open && dialog && !dialog.open) dialog.showModal();
  }, [open]);

  const position =
    placement === "top"
      ? "top-[calc(env(safe-area-inset-top)+0.5rem)]"
      : "bottom-[calc(env(safe-area-inset-bottom)+5.5rem)] md:bottom-6";

  return (
    <>
      <div
        className={`pointer-events-none fixed z-[60] right-[calc(env(safe-area-inset-right)+0.75rem)] md:right-[calc(env(safe-area-inset-right)+1.5rem)] flex max-w-[calc(100vw-1.5rem)] flex-wrap-reverse items-center justify-end gap-1.5 sm:gap-2 font-sans print:hidden ${position}`}
      >
        {QUICK_EXIT_ENABLED && <QuickExitButton lang={lang} className="pointer-events-auto" />}
        <button
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

      {/* No role, aria-modal, focus trap or Esc handler: the native modal provides them. */}
      <dialog
        ref={dialogRef}
        aria-labelledby="help-now-title"
        aria-describedby="help-now-reassure"
        {...({ closedby: "any" } as object)}
        onClose={() => setOpen(false)}
        onPointerDown={(e) => {
          pressedOutside.current = !hasClosedBy() && isOutside(e);
        }}
        onPointerUp={(e) => {
          // Press and release must both be outside, so dragging a text
          // selection onto the backdrop does not close the sheet.
          if (pressedOutside.current && isOutside(e)) e.currentTarget.close();
          pressedOutside.current = false;
        }}
        className="help-sheet m-0 mx-auto mt-auto max-h-[92svh] w-full max-w-md flex-col overflow-hidden rounded-t-[1.75rem] bg-[#F5F2EE] p-0 font-sans text-[#1B3A5C] shadow-2xl open:flex md:my-auto md:rounded-[1.75rem]"
      >
        {open && (
          <>
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
                onClick={() => dialogRef.current?.close()}
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

              {QUICK_EXIT_ENABLED && (
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
              )}
            </div>
          </>
        )}
      </dialog>
    </>
  );
}
