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
    title: isEs ? "Accesibilidad" : "Accessibility",
    description: isEs
      ? "FosterHub AZ está diseñado para funcionar para todas las personas jóvenes, sin importar cómo usen su dispositivo."
      : "FosterHub AZ is built to work for every young person, no matter how they use their device.",
    alternates: {
      canonical: `https://www.fosterhubaz.com/${lang}/accessibility`,
      languages: {
        en: "https://www.fosterhubaz.com/en/accessibility",
        es: "https://www.fosterhubaz.com/es/accessibility",
      },
    },
  };
}

export default async function AccessibilityPage({
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
      title={isEs ? "Accesibilidad" : "Accessibility"}
      lead={
        isEs
          ? "Trabajamos para que este sitio sea fácil de usar para todos — con o sin mouse, con lector de pantalla, con pantalla pequeña, o con preferencia por menos animación."
          : "We're working to make this site easy to use for everyone — with or without a mouse, with a screen reader, on a small screen, or with reduced-motion preferences."}
      lastUpdated={LAST_UPDATED}
    >
      <LegalSection heading={isEs ? "Nuestra meta" : "Our goal"}>
        <p>
          {isEs
            ? "Apuntamos a cumplir con WCAG 2.1 Nivel AA — el estándar reconocido para accesibilidad en la web."
            : "We aim to meet WCAG 2.1 Level AA — the recognized standard for web accessibility."}
        </p>
      </LegalSection>

      <LegalSection heading={isEs ? "Lo que ya está hecho" : "What's already in place"}>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            {isEs
              ? "Navegación completa con el teclado (Tab, Enter, Escape)"
              : "Full keyboard navigation (Tab, Enter, Escape)"}
          </li>
          <li>
            {isEs
              ? 'Un enlace "Saltar al contenido" para usuarios de teclado y lector de pantalla'
              : 'A "Skip to content" link for keyboard and screen-reader users'}
          </li>
          <li>
            {isEs
              ? 'Marca clara de la página actual en el menú (aria-current="page")'
              : 'Clear marking of the current page in the menu (aria-current="page")'}
          </li>
          <li>
            {isEs
              ? "Respeta tu configuración de 'reducir movimiento' del sistema"
              : "Respects your system's 'reduce motion' setting"}
          </li>
          <li>
            {isEs
              ? "Etiquetas de idioma correctas para lectores de pantalla"
              : "Correct language labels for screen readers"}
          </li>
          <li>
            {isEs
              ? "Lenguaje sencillo — sin jerga legal innecesaria"
              : "Plain language — no unnecessary legal jargon"}
          </li>
          <li>
            {isEs
              ? "Contraste de color adecuado para lectura cómoda"
              : "Color contrast chosen for comfortable reading"}
          </li>
          <li>
            {isEs
              ? "Imágenes con texto alternativo cuando comunican información"
              : "Alt text on images that carry information"}
          </li>
          <li>
            {isEs
              ? "Funciona sin conexión como aplicación instalable (PWA)"
              : "Works offline as an installable app (PWA)"}
          </li>
        </ul>
      </LegalSection>

      <LegalSection heading={isEs ? "En lo que seguimos trabajando" : "What we're still improving"}>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            {isEs
              ? "Auditorías de contraste en páginas más nuevas"
              : "Contrast audits on newer pages"}
          </li>
          <li>
            {isEs
              ? "Rutas de lector de pantalla más claras para páginas largas"
              : "Clearer screen-reader paths on longer pages"}
          </li>
          <li>
            {isEs
              ? "Más contenido en español revisado por hablantes nativos"
              : "More Spanish content reviewed by native speakers"}
          </li>
        </ul>
      </LegalSection>

      <LegalSection heading={isEs ? "Encontraste algo que no funciona" : "Found something that doesn't work"}>
        <p>
          {isEs
            ? "Cuéntale a un adulto de confianza o a tu trabajador/a de casos. Si conoces a alguien que trabaja con FosterHub AZ, pídele que nos comparta el problema — así podemos arreglarlo."
            : "Tell a trusted adult or your caseworker. If you know someone connected to FosterHub AZ, ask them to pass the issue along — that's how we fix it."}
        </p>
      </LegalSection>
    </LegalPage>
  );
}
