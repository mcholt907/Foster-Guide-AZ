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
    title: isEs ? "Usando FosterHub AZ" : "Using FosterHub AZ",
    description: isEs
      ? "Qué es y qué no es FosterHub AZ, de dónde viene la información, y qué hacer en una crisis."
      : "What FosterHub AZ is and isn't, where the information comes from, and what to do in a crisis.",
    alternates: {
      canonical: `https://www.fosterhubaz.com/${lang}/terms`,
      languages: {
        en: "https://www.fosterhubaz.com/en/terms",
        es: "https://www.fosterhubaz.com/es/terms",
      },
    },
  };
}

export default async function TermsPage({
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
      title={isEs ? "Usando FosterHub AZ" : "Using FosterHub AZ"}
      lead={
        isEs
          ? "Esto explica en palabras simples para qué sirve este sitio — y para qué no."
          : "This explains — in plain words — what this site is for and what it isn't."
      }
      lastUpdated={LAST_UPDATED}
    >
      <LegalSection heading={isEs ? "Para qué es" : "What it's for"}>
        <p>
          {isEs
            ? "FosterHub AZ es una guía para jóvenes de 10 a 21 años en el sistema de cuidado adoptivo de Arizona. Está hecho para ayudarte a:"
            : "FosterHub AZ is a guide for Arizona foster youth ages 10 to 21. It's here to help you:"}
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>{isEs ? "Entender tus derechos bajo la ley de Arizona" : "Understand your rights under Arizona law"}</li>
          <li>{isEs ? "Saber qué pasa en la corte de dependencia" : "Know what happens in dependency court"}</li>
          <li>{isEs ? "Encontrar programas, servicios y líneas de ayuda" : "Find programs, services, and help lines"}</li>
          <li>{isEs ? "Planificar los siguientes pasos — escuela, vivienda, documentos" : "Plan what's next — school, housing, documents"}</li>
        </ul>
      </LegalSection>

      <LegalSection heading={isEs ? "Para qué NO es" : "What it isn't"}>
        <p>
          {isEs
            ? "Este sitio NO es:"
            : "This site is NOT:"}
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>{isEs ? "Consejo legal — una guía general no reemplaza a un/a abogado/a" : "Legal advice — a general guide isn't a substitute for a lawyer"}</li>
          <li>{isEs ? "Consejo médico ni de salud mental" : "Medical or mental-health advice"}</li>
          <li>{isEs ? "Un reemplazo de tu trabajador/a de casos, CASA, o la corte" : "A replacement for your caseworker, CASA, or the court"}</li>
          <li>{isEs ? "Un lugar para emergencias" : "A place for emergencies"}</li>
        </ul>
        <p>
          {isEs
            ? "Para tu caso específico, habla siempre con un adulto que te conozca."
            : "For your specific situation, always talk with an adult who knows you."}
        </p>
      </LegalSection>

      <LegalSection heading={isEs ? "En una crisis" : "In a crisis"}>
        <p>
          {isEs
            ? "Si tú o alguien más está en peligro, llama al 911. Para apoyo emocional, llama o envía un mensaje al 988 (Línea de Crisis y Suicidio). Para reportar abuso o descuido, llama a la línea de DCS al 1-888-SOS-CHILD (1-888-767-2445)."
            : "If you or someone else is in danger, call 911. For emotional support, call or text 988 (Suicide & Crisis Lifeline). To report abuse or neglect, call the AZ DCS hotline at 1-888-SOS-CHILD (1-888-767-2445)."}
        </p>
      </LegalSection>

      <LegalSection heading={isEs ? "De dónde viene la información" : "Where the info comes from"}>
        <p>
          {isEs
            ? "Usamos leyes de Arizona (incluyendo A.R.S. §8-529 sobre los derechos de jóvenes en cuidado), publicaciones del Departamento de Seguridad Infantil de Arizona (DCS), y organizaciones sin fines de lucro en el estado. Intentamos mantener todo al día con fechas de verificación, pero las leyes y los programas cambian."
            : "We use Arizona laws (including A.R.S. §8-529 on youth-in-care rights), publications from the Arizona Department of Child Safety (DCS), and nonprofit organizations in the state. We try to keep things current with verification dates, but laws and programs change."}
        </p>
        <p>
          {isEs
            ? "Siempre confirma con tu trabajador/a de casos, abogado/a o CASA antes de tomar decisiones importantes."
            : "Always double-check with your caseworker, lawyer, or CASA before making big decisions."}
        </p>
      </LegalSection>

      <LegalSection heading={isEs ? "Puedes compartir" : "You can share"}>
        <p>
          {isEs
            ? "Si una página te ayuda, puedes compartirla con otra persona joven en cuidado. Todo en este sitio es gratis y público."
            : "If a page helps you, share it with another young person in care. Everything here is free and public."}
        </p>
      </LegalSection>
    </LegalPage>
  );
}
