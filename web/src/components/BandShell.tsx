"use client";

import { useLayoutEffect } from "react";
import { usePathname } from "next/navigation";
import { MotionConfig } from "framer-motion";
import type { Lang } from "../lib/i18n";
import { usePrefs } from "../lib/prefs";
import { BottomNav, SideNav } from "./BottomNav";
import { HelpNow } from "./HelpNow";
import { LegalFooter } from "./LegalFooter";
import { TeenShell } from "./TeenShell";

const INFORMATIONAL_ROUTES = new Set([
  "setup",
  "privacy",
  "terms",
  "accessibility",
]);

function routeTail(pathname: string, lang: Lang): string {
  return pathname.replace(`/${lang}`, "").replace(/^\/+/, "").split("/")[0] ?? "";
}

function isInformationalRoute(pathname: string, lang: Lang): boolean {
  return INFORMATIONAL_ROUTES.has(routeTail(pathname, lang));
}

interface BandShellProps {
  lang: Lang;
  children: React.ReactNode;
}

export function BandShell({ lang, children }: BandShellProps) {
  const pathname = usePathname();
  const [prefs, loaded] = usePrefs();
  const band = prefs.ageBand ?? "13-15";

  // Once the saved prefs are in React state, the right chrome is rendered in
  // this same commit — tell globals.css it can stop hiding the layout (see
  // "No layout flash for 10–12 users" there). Layout effect = before paint.
  useLayoutEffect(() => {
    if (loaded) document.documentElement.setAttribute("data-band-ready", "");
  }, [loaded]);

  const useTier1012Chrome =
    band === "10-12" || isInformationalRoute(pathname, lang);

  // reducedMotion="user": every framer-motion animation under the shell
  // (teen pages, nav pills, the help sheet) respects prefers-reduced-motion.
  // `data-band-shell` wraps only the band-specific chrome + page content; the
  // safety buttons (HelpNow) stay outside it so they are never hidden.
  if (useTier1012Chrome) {
    return (
      <MotionConfig reducedMotion="user">
        <div data-band-shell className="contents">
          <SideNav lang={lang} />
          <main
            id="main-content"
            tabIndex={-1}
            className="pb-40 md:pb-20 md:pl-40 focus:outline-none"
          >
            <div className="w-full max-w-lg mx-auto px-4 pt-4">
              {children}
              <LegalFooter lang={lang} />
            </div>
          </main>
          <BottomNav lang={lang} />
        </div>
        {/* Setup is a full-screen flow with its main button at the bottom,
            so the safety buttons sit at the top there. */}
        <HelpNow
          lang={lang}
          placement={routeTail(pathname, lang) === "setup" ? "top" : "bottom"}
        />
      </MotionConfig>
    );
  }

  return (
    <MotionConfig reducedMotion="user">
      <div data-band-shell className="contents">
        <TeenShell lang={lang}>{children}</TeenShell>
      </div>
      {/* Sibling of TeenShell (which is fixed, z-50) so it floats above it. */}
      <HelpNow lang={lang} />
    </MotionConfig>
  );
}
