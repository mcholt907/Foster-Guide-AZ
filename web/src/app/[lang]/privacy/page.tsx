import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalPage, LegalSection } from "../../../components/LegalPage";
import type { Lang } from "../../../lib/i18n";

const LAST_UPDATED = "2026-11-10";

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

      <LegalSection heading={isEs ? "Lo que se guarda en TU dispositivo" : "What is saved on YOUR device"}>
        <p>
          {isEs
            ? "Para mostrarte lo que te sirve, este sitio guarda cuatro cosas pequeñas en este teléfono o computadora:"
            : "To show you what fits you, this site saves four small things on this phone or computer:"}
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>{isEs ? "Tu grupo de edad (10–12, 13–15, 16–17 o 18–21)" : "Your age group (10–12, 13–15, 16–17, or 18–21)"}</li>
          <li>{isEs ? "Tu condado en Arizona" : "Your Arizona county"}</li>
          <li>{isEs ? "Tu respuesta a la pregunta sobre naciones tribales" : "Your answer to the tribal nation question"}</li>
          <li>{isEs ? "Si ya terminaste las preguntas del inicio" : "Whether you finished the starting questions"}</li>
        </ul>
        <p>
          {isEs
            ? "Tu idioma (inglés o español) no se guarda. Solo aparece en la dirección de la página, como /en o /es."
            : "Your language (English or Spanish) is not saved. It only shows in the page address, like /en or /es."}
        </p>
        <p>
          {isEs
            ? "Nada de esto sale de tu dispositivo. No se envía a nosotros ni a nadie más. Se queda ahí hasta que tú lo borres."
            : "None of this leaves your device. It is not sent to us or to anyone else. It stays there until you clear it."}
        </p>
      </LegalSection>

      <LegalSection heading={isEs ? "Cómo borrarlo" : "How to clear it"}>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            {isEs
              ? 'Toca "Salir rápido". Eso borra lo que este sitio guardó y te lleva a Google.'
              : 'Tap "Leave fast." That clears what this site saved and takes you to Google.'}
          </li>
          <li>
            {isEs
              ? 'O toca "Empezar de nuevo" en el menú. Eso borra lo guardado y te quedas en el sitio.'
              : 'Or tap "Start over" in the menu. That clears what was saved and you stay on the site.'}
          </li>
        </ul>
      </LegalSection>

      <LegalSection heading={isEs ? "Cómo borrar tu historial" : "How to clear your browser history"}>
        <p>
          {isEs
            ? '"Salir rápido" no borra tu historial. Alguien que use tu teléfono podría ver que visitaste este sitio. Para borrarlo:'
            : '"Leave fast" does not clear your history. Someone who uses your phone could still see that you visited this site. To clear it:'}
        </p>
        <ol className="list-decimal pl-5 space-y-1">
          <li>
            {isEs
              ? "iPhone (Safari): abre Ajustes, toca Apps y luego Safari (o solo Safari), y toca Borrar historial y datos de sitios web."
              : "iPhone (Safari): open Settings, tap Apps and then Safari (or just Safari), and tap Clear History and Website Data."}
          </li>
          <li>
            {isEs
              ? "Android (Chrome): abre Chrome, toca los tres puntos, toca Historial y luego Borrar datos de navegación."
              : "Android (Chrome): open Chrome, tap the three dots, tap History, and then tap Clear browsing data."}
          </li>
          <li>
            {isEs
              ? "La próxima vez, puedes usar una pestaña privada o de incógnito. Así no se guarda historial."
              : "Next time, you can use a private or incognito tab. Then no history is saved."}
          </li>
        </ol>
      </LegalSection>

      <LegalSection heading={isEs ? "Cookies" : "Cookies"}>
        <p>
          {isEs
            ? "No usamos cookies de seguimiento. El sitio guarda tus preferencias en un espacio de tu navegador (se llama localStorage), no en cookies."
            : "We don't use tracking cookies. The site stores your preferences in a part of your browser (called localStorage), not in cookies."}
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
