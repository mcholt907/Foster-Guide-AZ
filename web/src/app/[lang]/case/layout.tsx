import type { Metadata } from "next";
import { baseMetadata } from "../../../lib/siteMetadata";

// Metadata only: this route's page is a client component, so its title,
// description, canonical and hreflang links live here.
const SITE = "https://www.fosterhubaz.com";
const PATH = "/case";

const COPY = {
  en: {
    title: "What Happens at Your Court Hearings",
    description:
      "Scared about court? Learn what each hearing means, who will be in the room, and what you can say. A simple guide to what's happening in your foster care case.",
  },
  es: {
    title: "¿Qué pasa en tus audiencias en la corte?",
    description:
      "¿Te da miedo la corte? Aprende qué significa cada audiencia, quién estará en la sala y qué puedes decir. Una guía sencilla de tu caso de cuidado de crianza.",
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
