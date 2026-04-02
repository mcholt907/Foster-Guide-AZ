import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (lang === "es") {
    return {
      title: "¿Te sientes abrumado/a? Apoyo para jóvenes en cuidado adoptivo",
      description: "Está bien no estar bien. Encuentra ejercicios de respiración, herramientas para calmarte y personas reales a las que puedes llamar ahora mismo. No estás solo/a.",
      alternates: { canonical: "https://www.fosterhubaz.com/es/wellness", languages: { "en": "https://www.fosterhubaz.com/en/wellness", "es": "https://www.fosterhubaz.com/es/wellness" } },
    };
  }
  return {
    title: "Feeling Overwhelmed? Support for Foster Youth",
    description: "It's okay to not be okay. Find breathing exercises, grounding tools, and real people you can call right now — because you don't have to go through this alone.",
    alternates: { canonical: "https://www.fosterhubaz.com/en/wellness", languages: { "en": "https://www.fosterhubaz.com/en/wellness", "es": "https://www.fosterhubaz.com/es/wellness" } },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
