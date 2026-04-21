"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import type { Lang } from "../../../lib/i18n";
import { useOnboardingGate } from "../../../lib/useOnboardingGate";
import { usePrefs } from "../../../lib/prefs";
import { TeenShell } from "../../../components/TeenShell";
import { ResourcesTeen } from "../../../components/teen/ResourcesTeen";

export default function ResourcesPage() {
  const router = useRouter();
  const { lang: rawLang } = useParams<{ lang: string }>();
  const lang: Lang = rawLang === "es" ? "es" : "en";
  const prefs = useOnboardingGate(lang);
  const [, loaded] = usePrefs();

  useEffect(() => {
    if (loaded && prefs.ageBand === "10-12") router.replace(`/${lang}`);
  }, [loaded, prefs.ageBand, lang, router]);

  if (!loaded) return null;
  if (!prefs.ageBand) return null;
  if (prefs.ageBand === "10-12") return null;

  return (
    <TeenShell active="resources" lang={lang}>
      <ResourcesTeen lang={lang} band={prefs.ageBand} county={prefs.county ?? "Unknown"} />
    </TeenShell>
  );
}
