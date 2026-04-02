import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (lang === "es") {
    return {
      title: "¿Qué pasa en mis audiencias?",
      description: "¿Nervioso por el tribunal? Aprende qué significa cada audiencia, quién estará en la sala y qué puedes decir. Una guía sencilla de lo que está pasando en tu caso.",
      alternates: { canonical: "https://www.fosterhubaz.com/es/case", languages: { "en": "https://www.fosterhubaz.com/en/case", "es": "https://www.fosterhubaz.com/es/case" } },
    };
  }
  return {
    title: "What Happens at Your Court Hearings",
    description: "Scared about court? Learn what each hearing means, who will be in the room, and what you can say. A simple guide to what's happening in your foster care case.",
    alternates: { canonical: "https://www.fosterhubaz.com/en/case", languages: { "en": "https://www.fosterhubaz.com/en/case", "es": "https://www.fosterhubaz.com/es/case" } },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
