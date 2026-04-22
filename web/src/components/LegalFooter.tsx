import Link from "next/link";
import type { Lang } from "../lib/i18n";

export function LegalFooter({ lang }: { lang: Lang }) {
  const isEs = lang === "es";
  return (
    <footer className="mt-12 border-t border-slate-200/70 pt-6 pb-10 text-center">
      <nav
        aria-label={isEs ? "Enlaces legales" : "Legal links"}
        className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-[12px] text-slate-500"
      >
        <Link href={`/${lang}/privacy`} className="hover:text-slate-700 hover:underline">
          {isEs ? "Privacidad" : "Privacy"}
        </Link>
        <Link href={`/${lang}/terms`} className="hover:text-slate-700 hover:underline">
          {isEs ? "Términos" : "Terms"}
        </Link>
        <Link href={`/${lang}/accessibility`} className="hover:text-slate-700 hover:underline">
          {isEs ? "Accesibilidad" : "Accessibility"}
        </Link>
      </nav>
      <p className="mt-3 text-[11px] text-slate-400">
        {isEs ? "Sin registro · Nada se guarda" : "No sign-up · Nothing stored"}
      </p>
    </footer>
  );
}
