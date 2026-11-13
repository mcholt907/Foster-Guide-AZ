"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import type { Lang } from "../../../lib/i18n";
import { useOnboardingGate } from "../../../lib/useOnboardingGate";
import { usePrefs } from "../../../lib/prefs";
import type { AgeBandKey } from "../../../lib/prefs";
import { ResourcesTeen } from "../../../components/teen/ResourcesTeen";

export default function ResourcesPage() {
  const router = useRouter();
  const { lang: rawLang } = useParams<{ lang: string }>();
  const lang: Lang = rawLang === "es" ? "es" : "en";
  const prefs = useOnboardingGate(lang);
  const [, loaded] = usePrefs();

  // 10-12 users don't get a resources page — bounce them home once their
  // prefs hydrate. Visitors with no saved age see every listing, so search
  // engines and shared links get real content.
  useEffect(() => {
    if (loaded && prefs.ageBand === "10-12") router.replace(`/${lang}`);
  }, [loaded, prefs.ageBand, lang, router]);

  // No saved age means "show help for all ages" here. A visitor who followed
  // a shared link must not have adult programs hidden by an assumed age.
  const band: AgeBandKey | null = prefs.ageBand;
  if (band === "10-12") return null;

  return <ResourcesTeen lang={lang} band={band} county={prefs.county ?? "Unknown"} />;
}
