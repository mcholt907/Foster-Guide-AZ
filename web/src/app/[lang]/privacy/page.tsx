import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalPage, LegalSection } from "../../../components/LegalPage";
import type { Lang } from "../../../lib/i18n";

const LAST_UPDATED = "2026-04-22";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const isEs = lang === "es";
  return {
    title: isEs ? "Tu Privacidad" : "Your Privacy",
    description: isEs
      ? "FosterHub AZ no recopila información personal. Esto explica qué se guarda en tu dispositivo y qué no se guarda en ninguna parte."
      : "FosterHub AZ doesn't collect personal information. Here's what stays on your device and what isn't stored anywhere.",
    alternates: {
      canonical: `https://www.fosterhubaz.com/${lang}/privacy`,
      languages: {
        en: "https://www.fosterhubaz.com/en/privacy",
        es: "https://www.fosterhubaz.com/es/privacy",
      },
    },
  };
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (lang !== "en" && lang !== "es") notFound();
  const L = lang as Lang;
  const isEs = L === "es";

  return (
    <LegalPage
      lang={L}
      title={isEs ? "Tu Privacidad" : "Your Privacy"}
      lead={
        isEs
          ? "Este sitio está hecho para ti. No recopilamos tu nombre, tu historial, ni ninguna información que te identifique."
          : "This site is built for you. We don't collect your name, your case history, or anything that identifies you."
      }
      lastUpdated={LAST_UPDATED}
    >
      <LegalSection heading={isEs ? "Lo que NO recopilamos" : "What we don't collect"}>
        <ul className="list-disc pl-5 space-y-1">
          <li>{isEs ? "Tu nombre, dirección, ni fecha de nacimiento" : "Your name, address, or date of birth"}</li>
          <li>{isEs ? "Tu número de caso ni nombres de personas en tu vida" : "Your case number or the names of anyone in your life"}</li>
          <li>{isEs ? "Respuestas a preguntas de bienestar ni diarios" : "Answers to wellness questions or journal entries"}</li>
          <li>{isEs ? "Tu ubicación exacta (solo usamos el condado)" : "Your exact location (we only use the county)"}</li>
          <li>{isEs ? "Nada a través de Google Analytics, Meta u otros rastreadores — no los usamos" : "Anything through Google Analytics, Meta, or any other trackers — we don't use them"}</li>
        </ul>
      </LegalSection>

      <LegalSection heading={isEs ? "Lo que se queda en TU dispositivo" : "What stays on YOUR device"}>
        <p>
          {isEs
            ? "Para personalizar lo que ves, guardamos cuatro cosas pequeñas en tu navegador (no en un servidor):"
            : "To personalize what you see, we save four small things in your browser (not on a server):"}
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>{isEs ? "Tu grupo de edad (10–12, 13–15, 16–17, 18–21)" : "Your age group (10–12, 13–15, 16–17, 18–21)"}</li>
          <li>{isEs ? "Tu condado en Arizona" : "Your Arizona county"}</li>
          <li>{isEs ? 'Si marcaste "Sí" en la pregunta sobre naciones tribales' : 'Whether you checked "yes" on the tribal nations question'}</li>
          <li>{isEs ? "Si ya completaste la introducción" : "Whether you've completed the intro"}</li>
        </ul>
        <p>
          {isEs
            ? "Esto vive solo en tu navegador. Si cierras la pestaña, sigue ahí. Si limpias los datos del navegador o usas modo privado, se va."
            : "This lives in your browser only. If you close the tab, it stays. If you clear your browser data or use private mode, it goes away."}
        </p>
      </LegalSection>

      <LegalSection heading={isEs ? "Cómo borrar todo" : "How to clear everything"}>
        <p>
          {isEs
            ? 'Toca "Empezar de nuevo" en la parte inferior del menú lateral. Eso borra todo lo que está guardado en este sitio.'
            : 'Tap "Start over" at the bottom of the side menu. That clears everything this site has saved.'}
        </p>
      </LegalSection>

      <LegalSection heading={isEs ? "Cookies" : "Cookies"}>
        <p>
          {isEs
            ? "No usamos cookies de seguimiento. El sitio guarda tus preferencias en un espacio del navegador llamado localStorage, no en cookies."
            : "We don't use tracking cookies. The site stores your preferences in a browser area called localStorage, not cookies."}
        </p>
      </LegalSection>

      <LegalSection heading={isEs ? "Si tienes dudas" : "If you have questions"}>
        <p>
          {isEs
            ? "Habla con un adulto de confianza — un/a trabajador/a de casos, un/a CASA, o un familiar. También puedes llamar al 211 en Arizona para orientación general."
            : "Talk with a trusted adult — a caseworker, CASA, or family member. You can also call 211 in Arizona for general guidance."}
        </p>
      </LegalSection>
    </LegalPage>
  );
}
