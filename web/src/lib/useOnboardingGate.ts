"use client";

import { usePrefs } from "./prefs";
import type { Lang } from "./i18n";

/**
 * Returns the user's prefs. Pages that call this hook fall back to a default
 * age band when none is set, so search engines and first-time visitors get
 * indexable content. Onboarding is reached via the root language picker
 * (`/` → `/[lang]/setup`), not by gating individual pages — gating with a
 * client-side redirect produced "Page with redirect" reports in Google Search
 * Console and shipped blank HTML to crawlers that didn't run the redirect.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function useOnboardingGate(_lang: Lang) {
  const [prefs] = usePrefs();
  return prefs;
}
