"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePrefs } from "./prefs";
import type { Lang } from "./i18n";

/**
 * Call this at the top of every screen page.
 * If onboarding hasn't been completed, redirects to /[lang]/setup.
 */
export function useOnboardingGate(lang: Lang) {
  const [prefs, loaded] = usePrefs();
  const router = useRouter();

  useEffect(() => {
    // Only redirect after localStorage has been read (loaded=true).
    // Without this guard the default prefs (onboardingDone: false) fire a
    // redirect on every page load before the saved values are hydrated.
    if (loaded && !prefs.onboardingDone) {
      router.replace(`/${lang}/setup`);
    }
  }, [loaded, prefs.onboardingDone, lang, router]);

  return prefs;
}
