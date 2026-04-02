import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (lang === "es") {
    return {
      title: "Pregunta Lo Que Quieras Sobre Tu Caso",
      description: "¿Tienes una pregunta sobre tus derechos, tu audiencia o qué pasa después? Pregúntale a Compass y obtén una respuesta real — privado, gratis, sin registro.",
      alternates: { canonical: "https://www.fosterhubaz.com/es/ask", languages: { "en": "https://www.fosterhubaz.com/en/ask", "es": "https://www.fosterhubaz.com/es/ask" } },
    };
  }
  return {
    title: "Ask Anything About Your Foster Care Case",
    description: "Have a question about your rights, your hearing, or what happens next? Ask Compass and get a real answer — private, free, no sign-up needed.",
    alternates: { canonical: "https://www.fosterhubaz.com/en/ask", languages: { "en": "https://www.fosterhubaz.com/en/ask", "es": "https://www.fosterhubaz.com/es/ask" } },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
