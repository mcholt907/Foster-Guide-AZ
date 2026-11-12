import Link from "next/link";
import type { Lang } from "../lib/i18n";

export function LegalFooter({ lang }: { lang: Lang }) {
  const isEs = lang === "es";
  return (
    <footer className="mt-12 border-t border-slate-200/70 pt-6 pb-10 text-center">
      <nav
        aria-label={isEs ? "Enlaces legales" : "Legal links"}
        className="flex flex-wrap justify-center gap-x-2 gap-y-1 text-sm text-slate-600"
      >
        <Link href={`/${lang}/privacy`} className="inline-flex min-h-11 items-center px-3 hover:text-slate-900 hover:underline">
          {isEs ? "Privacidad" : "Privacy"}
        </Link>
        <Link href={`/${lang}/terms`} className="inline-flex min-h-11 items-center px-3 hover:text-slate-900 hover:underline">
          {isEs ? "Términos" : "Terms"}
        </Link>
        <Link href={`/${lang}/accessibility`} className="inline-flex min-h-11 items-center px-3 hover:text-slate-900 hover:underline">
          {isEs ? "Accesibilidad" : "Accessibility"}
        </Link>
      </nav>
      <p className="mt-2 text-xs text-slate-600">
        {isEs ? "Sin registro · Nada sale de tu dispositivo" : "No sign-up · Nothing leaves your device"}
      </p>
    </footer>
  );
}
