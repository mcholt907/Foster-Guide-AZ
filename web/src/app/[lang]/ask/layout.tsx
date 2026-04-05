import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (lang === "es") {
    return {
      title: "Encuentra Respuestas Sobre Tu Caso y Tus Derechos",
      description: "Explora temas o busca cualquier pregunta sobre tus derechos, el tribunal, la vivienda y más — respuestas reales en palabras simples, sin registro.",
      alternates: {
        canonical: "https://www.fosterhubaz.com/es/ask",
        languages: { en: "https://www.fosterhubaz.com/en/ask", es: "https://www.fosterhubaz.com/es/ask" },
      },
    };
  }
  return {
    title: "Find Answers About Your Rights and Foster Care Case",
    description: "Browse topics or search any question about your rights, court, housing, and more — real answers in plain language, no sign-up needed.",
    alternates: {
      canonical: "https://www.fosterhubaz.com/en/ask",
      languages: { en: "https://www.fosterhubaz.com/en/ask", es: "https://www.fosterhubaz.com/es/ask" },
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
