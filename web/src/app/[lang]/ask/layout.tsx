import type { Metadata } from "next";
import { baseMetadata } from "../../../lib/siteMetadata";

// Metadata only: this route's page is a client component, so its title,
// description, canonical and hreflang links live here.
const SITE = "https://www.fosterhubaz.com";
const PATH = "/ask";

const COPY = {
  en: {
    title: "Find Answers About Your Rights and Foster Care Case",
    description:
      "Browse topics or search any question about your rights, court, housing, and more — real answers in plain language, no sign-up needed.",
  },
  es: {
    title: "Encuentra respuestas sobre tus derechos y tu caso de cuidado de crianza",
    description:
      "Explora temas o busca cualquier pregunta sobre tus derechos, la corte, la vivienda y más — respuestas reales en palabras sencillas, sin registrarte.",
  },
} as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const l = lang === "es" ? "es" : "en";
  const { title, description } = COPY[l];
  const url = `${SITE}/${l}${PATH}`;
  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: { en: `${SITE}/en${PATH}`, es: `${SITE}/es${PATH}`, "x-default": `${SITE}/en${PATH}` },
    },
    // Set in full: a child `openGraph` replaces the parent's, image included.
    openGraph: {
      ...baseMetadata.openGraph,
      title,
      description,
      url,
      locale: l === "es" ? "es_MX" : "en_US",
      alternateLocale: l === "es" ? "en_US" : "es_MX",
    },
    twitter: { ...baseMetadata.twitter, title, description },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
