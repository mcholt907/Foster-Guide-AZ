import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (lang === "es") {
    return {
      title: "Haz una Pregunta",
      description: "Obtén respuestas reales sobre el cuidado adoptivo, tus derechos, el tribunal, documentos y vivienda — con IA, privado y gratis.",
      alternates: { canonical: "https://fosterhubaz.com/es/ask", languages: { "en": "https://fosterhubaz.com/en/ask", "es": "https://fosterhubaz.com/es/ask" } },
    };
  }
  return {
    title: "Ask a Question",
    description: "Get real answers about foster care, your rights, court hearings, documents, and housing in Arizona — AI-powered, private, and free.",
    alternates: { canonical: "https://fosterhubaz.com/en/ask", languages: { "en": "https://fosterhubaz.com/en/ask", "es": "https://fosterhubaz.com/es/ask" } },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
