"use client";

import { usePathname } from "next/navigation";
import type { Lang } from "../lib/i18n";
import { useOnboardingGate } from "../lib/useOnboardingGate";
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
  const prefs = useOnboardingGate(lang);
  const band = prefs.ageBand ?? "13-15";

  const useTier1012Chrome =
    band === "10-12" || isInformationalRoute(pathname, lang);

  if (useTier1012Chrome) {
    return (
      <>
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
        {/* Setup is a full-screen flow with its main button at the bottom,
            so the safety buttons sit at the top there. */}
        <HelpNow
          lang={lang}
          placement={routeTail(pathname, lang) === "setup" ? "top" : "bottom"}
        />
      </>
    );
  }

  return (
    <>
      <TeenShell lang={lang}>{children}</TeenShell>
      {/* Sibling of TeenShell (which is fixed, z-50) so it floats above it. */}
      <HelpNow lang={lang} />
    </>
  );
}
