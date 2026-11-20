import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Flag, Mail, PlusCircle, ShieldCheck } from "lucide-react";
import { LegalPage, LegalSection } from "../../../components/LegalPage";
import { CrisisQuickLinks } from "../../../components/CrisisQuickLinks";
import { CONTACT_EMAIL, contactHref } from "../../../lib/contact";
import type { Lang } from "../../../lib/i18n";

const LAST_UPDATED = "2026-11-20";
const SITE = "https://www.fosterhubaz.com";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const isEs = lang === "es";
  return {
    title: isEs ? "Acerca de FosterHub AZ" : "About FosterHub AZ",
    description: isEs
      ? "Quién hace FosterHub AZ, de dónde viene la información, cómo reportar un error y cómo compartir el sitio con jóvenes en cuidado de crianza."
      : "Who runs FosterHub AZ, where the information comes from, how to report a mistake, and how professionals can share the site with youth in foster care.",
    alternates: {
      canonical: `${SITE}/${lang}/about`,
      languages: {
        en: `${SITE}/en/about`,
        es: `${SITE}/es/about`,
      },
    },
  };
}

const BUTTON =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-[15px] font-bold leading-tight transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[#D97706] focus-visible:ring-offset-2";
const BUTTON_PRIMARY = `${BUTTON} bg-[#2A7F8E] text-white hover:bg-[#236b78]`;
const BUTTON_SECONDARY = `${BUTTON} bg-white text-[#1B3A5C] ring-1 ring-inset ring-[#2A7F8E]/50 hover:bg-[#E3F1F3]`;
const LINK = "font-semibold text-[#1f6874] underline underline-offset-2 hover:text-[#1B3A5C]";

export default async function AboutPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (lang !== "en" && lang !== "es") notFound();
  const L = lang as Lang;
  const isEs = L === "es";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    inLanguage: L,
    url: `${SITE}/${L}/about`,
    mainEntity: {
      "@type": "Organization",
      name: "FosterHub AZ",
      url: SITE,
      email: CONTACT_EMAIL,
      areaServed: { "@type": "State", name: "Arizona" },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <LegalPage
        lang={L}
        title={isEs ? "Acerca de FosterHub AZ" : "About FosterHub AZ"}
        lead={
          isEs
            ? "Una guía gratis para jóvenes en cuidado de crianza en Arizona, de 10 a 21 años. No tienes que registrarte, y nada de lo que haces aquí sale de tu dispositivo."
            : "A free guide for young people in Arizona foster care, ages 10 to 21. There's no sign-up, and nothing you do here leaves your device."
        }
        lastUpdated={LAST_UPDATED}
      >
        <LegalSection heading={isEs ? "Por qué existe este sitio" : "Why this site exists"}>
          <p>
            {isEs
              ? "El cuidado de crianza trae muchas palabras, personas y reglas nuevas, muchas veces todas a la vez. FosterHub AZ junta las respuestas en un solo lugar, en palabras sencillas, para que conozcas tus derechos, sepas lo que viene y encuentres ayuda cuando la necesites."
              : "Foster care comes with a lot of new words, people, and rules, often all at once. FosterHub AZ puts the answers in one place, in plain words, so you can learn your rights, know what's coming next, and find help when you need it."}
          </p>
          <p>
            {isEs
              ? "Está aquí para ayudarte a hablar por ti. No reemplaza a los adultos que te apoyan."
              : "It's here to help you speak up for yourself. It doesn't replace the adults on your side."}
          </p>
        </LegalSection>

        <LegalSection heading={isEs ? "Quién hace este sitio" : "Who runs this site"}>
          <p>
            {isEs
              ? "FosterHub AZ es un proyecto independiente. No es parte del Departamento de Seguridad Infantil de Arizona (DCS), de la corte, ni de ninguna agencia del gobierno."
              : "FosterHub AZ is an independent project. It is not part of the Arizona Department of Child Safety (DCS), the courts, or any government agency."}
          </p>
          <p>
            {isEs
              ? "Es gratis. No tiene anuncios, y no recopilamos ni vendemos nada sobre ti. Lee más en "
              : "It's free. There are no ads, and we don't collect or sell anything about you. Read more on "}
            <Link href={`/${L}/privacy`} className={LINK}>
              {isEs ? "Tu Privacidad" : "Your Privacy"}
            </Link>
            .
          </p>
        </LegalSection>

        <LegalSection heading={isEs ? "Lo que encontrarás aquí" : "What you'll find here"}>
          <p>
            {isEs
              ? "Tus derechos bajo la ley de Arizona, cómo funciona la corte, quién está en tu equipo, planes para después de los 18, lugares que ayudan, y respuestas a preguntas comunes. Todo en inglés y en español."
              : "Your rights under Arizona law, how court works, who's on your team, plans for after 18, places that help, and answers to common questions. All in English and Spanish."}
          </p>
        </LegalSection>

        <LegalSection heading={isEs ? "Cómo mantenemos la información correcta" : "How we keep it accurate"}>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              {isEs
                ? "Tus derechos vienen de la ley de Arizona, sobre todo A.R.S. §8-529, la ley que nombra los derechos de jóvenes en cuidado de crianza."
                : "Your rights come from Arizona law, mainly A.R.S. §8-529, the law that lists the rights of young people in foster care."}
            </li>
            <li>
              {isEs
                ? "Los programas y números de teléfono vienen de las mismas organizaciones y de DCS. Cada recurso muestra la fecha en que lo revisamos por última vez."
                : "Programs and phone numbers come from the organizations themselves and from DCS. Each resource shows the date we last checked it."}
            </li>
            <li>
              {isEs
                ? "Cada semana revisamos que los enlaces sigan funcionando. Cada pocos meses revisamos si cambiaron las leyes de Arizona que explicamos."
                : "Every week, we check that links still work. Every few months, we check for changes to the Arizona laws we explain."}
            </li>
          </ul>
          <p>
            {isEs
              ? "Esto es información general, no consejo legal. Para tu caso, habla con tu abogado/a o con un adulto que te conozca. Lee "
              : "This is general information, not legal advice. For your own case, talk with your lawyer or an adult who knows you. See "}
            <Link href={`/${L}/terms`} className={LINK}>
              {isEs ? "Usando FosterHub AZ" : "Using FosterHub AZ"}
            </Link>
            .
          </p>
        </LegalSection>

        <section id="report" aria-labelledby="report-heading" className="scroll-mt-6 rounded-2xl bg-white p-5 shadow-sm">
          <h2 id="report-heading" className="flex items-center gap-2 text-lg font-bold text-[#1B3A5C] mb-2">
            <Flag size={20} strokeWidth={2.25} aria-hidden="true" className="shrink-0 text-[#2A7F8E]" />
            {isEs ? "¿Ves un error? Dinos" : "See a mistake? Tell us"}
          </h2>
          <div className="space-y-3 text-slate-700">
            <p>
              {isEs
                ? "Si algo está mal o viejo — un número de teléfono, una regla, un enlace que no funciona — mándanos un correo. No tienes que decirnos quién eres."
                : "If something is wrong or out of date — a phone number, a rule, a link that doesn't work — send us an email. You don't have to tell us who you are."}
            </p>
            <a href={contactHref("mistake", L)} className={`${BUTTON_PRIMARY} w-full sm:w-auto`}>
              <Mail size={18} strokeWidth={2.25} aria-hidden="true" />
              {isEs ? "Reportar un error" : "Report a mistake"}
            </a>
            <p className="text-sm">
              {isEs ? "O escribe a " : "Or write to "}
              <a href={`mailto:${CONTACT_EMAIL}`} className={LINK}>
                {CONTACT_EMAIL}
              </a>
            </p>
            <div className="rounded-xl bg-[#FDF3E1] p-4 text-[#5b3d0c]">
              <p className="flex items-start gap-2 font-semibold">
                <ShieldCheck size={18} strokeWidth={2.25} aria-hidden="true" className="mt-0.5 shrink-0" />
                <span>
                  {isEs
                    ? "Por favor no mandes tu nombre, un número de caso, ni detalles de tu caso. Leemos cada correo, pero no podemos responder preguntas sobre tu caso, y nadie revisa este correo a todas horas."
                    : "Please don't send your name, a case number, or details about your case. We read every email, but we can't answer questions about your case, and no one checks this inbox around the clock."}
                </span>
              </p>
            </div>
            <p className="font-semibold text-[#1B3A5C]">
              {isEs ? "¿Necesitas ayuda ahora? Llama o envía un mensaje:" : "Need help now? Call or text:"}
            </p>
            <CrisisQuickLinks lang={L} variant="compact" />
            <p className="text-sm">
              {isEs
                ? "¿Preguntas sobre tu propio caso? Tu abogado/a, tu trabajador/a de casos, tu CASA, u otro adulto de confianza te puede ayudar."
                : "Questions about your own case? Your lawyer, caseworker, CASA, or another adult you trust can help."}
            </p>
          </div>
        </section>

        <LegalSection id="professionals" heading={isEs ? "Para profesionales" : "For professionals"}>
          <p>
            {isEs
              ? "Trabajadores/as de casos, CASAs, abogados/as, tutores ad litem, familias de crianza, personal de hogares grupales, maestros/as y proveedores de servicios: pueden compartir este sitio gratis con los jóvenes con quienes trabajan."
              : "Caseworkers, CASAs, attorneys, guardians ad litem, foster families, group home staff, teachers, and service providers: you're welcome to share this site with the young people you work with. It's free."}
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              {isEs
                ? "Es seguro compartirlo: sin registro, sin rastreo, y nada de lo que una persona joven escoge sale de su teléfono."
                : "Safe to share: no sign-up, no tracking, and nothing a young person picks leaves their phone."}
            </li>
            <li>
              {isEs
                ? "fosterhubaz.com empieza pidiendo el idioma. Después, cada joven escoge su edad, y el sitio muestra lo que corresponde a esa edad."
                : "fosterhubaz.com starts by asking for a language. Then each young person picks their age, and the site shows what fits that age."}
            </li>
            <li>
              {isEs ? "Cada sección tiene su propio enlace, por ejemplo " : "Every section has its own link, for example "}
              <Link href={`/${L}/rights`} className={LINK}>
                fosterhubaz.com/{L}/rights
              </Link>
              {isEs
                ? ". Las páginas en español empiezan con /es y las de inglés con /en."
                : ". English pages start with /en and Spanish pages with /es."}
            </li>
            <li>
              {isEs
                ? "Se puede agregar a la pantalla de inicio del teléfono. Después de una visita con internet, el Inicio, los derechos, bienestar y las respuestas abren sin internet."
                : "It can be added to a phone's home screen. After one visit with internet, Home, rights, wellness, and answers open without internet."}
            </li>
            <li>
              {isEs
                ? "Usa palabras sencillas, a un nivel de lectura de 6.º grado. No reemplaza el consejo legal, el trabajo de casos, ni la corte."
                : "It uses plain words, at about a 6th-grade reading level. It does not replace legal advice, casework, or the court."}
            </li>
          </ul>

          <h3 className="pt-2 text-base font-bold text-[#1B3A5C]">
            {isEs ? "Sugerir un recurso o reportar un cambio" : "Suggest a resource or report a change"}
          </h3>
          <p>
            {isEs
              ? "Si cambian los servicios, el horario o el teléfono de tu organización, o conoces un programa que los jóvenes deberían encontrar aquí, escríbenos. Incluye un enlace a la página de la organización para que podamos revisarlo."
              : "If your organization's services, hours, or phone number change, or you know a program young people should find here, email us. Include a link to the organization's own page so we can check it."}
          </p>
          <div className="flex flex-col gap-2 pt-1 sm:flex-row sm:flex-wrap">
            <a href={contactHref("resource", L)} className={BUTTON_SECONDARY}>
              <PlusCircle size={18} strokeWidth={2.25} aria-hidden="true" />
              {isEs ? "Sugerir un recurso" : "Suggest a resource"}
            </a>
            <a href={contactHref("general", L)} className={BUTTON_SECONDARY}>
              <Mail size={18} strokeWidth={2.25} aria-hidden="true" />
              {isEs ? "Otra pregunta" : "Ask something else"}
            </a>
          </div>
        </LegalSection>
      </LegalPage>
    </>
  );
}
