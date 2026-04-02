import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (lang === "es") {
    return {
      title: "¿Qué pasa cuando cumples 18 en el cuidado adoptivo?",
      description: "No tienes que resolverlo solo/a. Aprende cómo quedarte en el cuidado después de los 18, conseguir dinero para estudios, encontrar vivienda y obtener tus documentos.",
      alternates: { canonical: "https://www.fosterhubaz.com/es/future", languages: { "en": "https://www.fosterhubaz.com/en/future", "es": "https://www.fosterhubaz.com/es/future" } },
    };
  }
  return {
    title: "What Happens When You Turn 18 in Foster Care",
    description: "You don't have to figure it out alone. Find out how to stay in care past 18, get money for school, find housing, and get the documents you'll need.",
    alternates: { canonical: "https://www.fosterhubaz.com/en/future", languages: { "en": "https://www.fosterhubaz.com/en/future", "es": "https://www.fosterhubaz.com/es/future" } },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
