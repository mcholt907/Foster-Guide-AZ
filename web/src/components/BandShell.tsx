"use client";

import { usePathname } from "next/navigation";
import type { Lang } from "../lib/i18n";
import { useOnboardingGate } from "../lib/useOnboardingGate";
import { BottomNav, SideNav } from "./BottomNav";
import { LegalFooter } from "./LegalFooter";
import { TeenShell } from "./TeenShell";

const INFORMATIONAL_ROUTES = new Set([
  "setup",
  "privacy",
  "terms",
  "accessibility",
]);

function isInformationalRoute(pathname: string, lang: Lang): boolean {
  const tail =
    pathname.replace(`/${lang}`, "").replace(/^\/+/, "").split("/")[0] ?? "";
  return INFORMATIONAL_ROUTES.has(tail);
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
          className="pb-32 md:pb-8 md:pl-40 focus:outline-none"
        >
          <div className="w-full max-w-lg mx-auto px-4 pt-4">
            {children}
            <LegalFooter lang={lang} />
          </div>
        </main>
        <BottomNav lang={lang} />
      </>
    );
  }

  return <TeenShell lang={lang}>{children}</TeenShell>;
}
