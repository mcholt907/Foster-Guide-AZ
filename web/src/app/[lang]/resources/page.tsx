"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import type { Lang } from "../../../lib/i18n";
import { useOnboardingGate } from "../../../lib/useOnboardingGate";
import { usePrefs } from "../../../lib/prefs";
import type { AgeBandKey } from "../../../lib/prefs";
import { TeenShell } from "../../../components/TeenShell";
import { ResourcesTeen } from "../../../components/teen/ResourcesTeen";

export default function ResourcesPage() {
  const router = useRouter();
  const { lang: rawLang } = useParams<{ lang: string }>();
  const lang: Lang = rawLang === "es" ? "es" : "en";
  const prefs = useOnboardingGate(lang);
  const [, loaded] = usePrefs();

  // 10-12 users don't get a resources page — bounce them home once their
  // prefs hydrate. Un-onboarded visitors (no localStorage yet) fall through
  // to the 13-15 teen variant so search engines see real content.
  useEffect(() => {
    if (loaded && prefs.ageBand === "10-12") router.replace(`/${lang}`);
  }, [loaded, prefs.ageBand, lang, router]);

  const band: AgeBandKey = prefs.ageBand ?? "13-15";
  if (band === "10-12") return null;

  return (
    <TeenShell lang={lang}>
      <ResourcesTeen lang={lang} band={band} county={prefs.county ?? "Unknown"} />
    </TeenShell>
  );
}
