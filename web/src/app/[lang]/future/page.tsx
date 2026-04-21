"use client";

import { useParams } from "next/navigation";
import { FileText } from "lucide-react";
import type { Lang } from "../../../lib/i18n";
import { useOnboardingGate } from "../../../lib/useOnboardingGate";
import { usePrefs } from "../../../lib/prefs";
import type { AgeBandKey } from "../../../lib/prefs";
import { ScreenHero, SafeNotice } from "../../../components/ui";
import { TeenShell } from "../../../components/TeenShell";
import { FutureTeen } from "../../../components/teen/FutureTeen";

export default function FuturePage() {
  const { lang: rawLang } = useParams<{ lang: string }>();
  const lang: Lang = rawLang === "es" ? "es" : "en";
  const prefs = useOnboardingGate(lang);
  const [, loaded] = usePrefs();

  if (!loaded) return null;
  if (!prefs.ageBand) return null;
  if (prefs.ageBand === "10-12") return <Future1012 lang={lang} />;

  const band = prefs.ageBand as AgeBandKey;
  return (
    <TeenShell active="future" lang={lang}>
      <FutureTeen lang={lang} band={band} />
    </TeenShell>
  );
}

function Future1012({ lang }: { lang: Lang }) {
  return (
    <div className="pb-8">
      <ScreenHero
        icon={FileText}
        title={lang === "es" ? "Mi plan de futuro" : "My Future Plan"}
        subtitle={
          lang === "es"
            ? "Pasan cosas importantes cuando cumples 18. Vamos a prepararte."
            : "Big things happen when you turn 18. Let's get you ready."
        }
        gradient="from-[#D97706] to-[#b45309]"
        lang={lang}
      />

      <div className="mt-4 rounded-3xl bg-white/95 p-5 shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
        <p className="text-sm text-slate-700 leading-relaxed">
          {lang === "es"
            ? "Cuando cumplas 18, pasarán algunas cosas importantes. No tienes que resolverlo solo — hay personas que te pueden ayudar a planificar. Cuando seas mayor, esta sección tendrá más información para ti."
            : "When you turn 18, some important things will happen. You don't have to figure it out alone — there are people who can help you plan. When you're older, this section will have more for you."}
        </p>
      </div>

      <div className="mt-4">
        <SafeNotice lang={lang} />
      </div>
    </div>
  );
}
