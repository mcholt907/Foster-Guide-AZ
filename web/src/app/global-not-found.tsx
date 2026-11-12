import type { Metadata } from "next";
import Link from "next/link";
import { RootDocument } from "../components/RootDocument";

// Shown for any URL that matches no route. The app has two root layouts
// (the language picker and /[lang]), so this page brings its own document.
export const metadata: Metadata = {
  title: "Page not found — FosterHub AZ",
  robots: { index: false, follow: true },
};

const linkClass =
  "inline-flex min-h-11 items-center justify-center rounded-2xl px-6 py-3 text-base font-bold transition";

export default function GlobalNotFound() {
  return (
    <RootDocument lang="en">
      <main className="mx-auto flex min-h-screen max-w-xl flex-col justify-center gap-8 bg-[#F5F2EE] px-6 py-16 text-[#1B3A5C]">
        <section>
          <h1 className="text-3xl font-black tracking-tight">We can&apos;t find that page.</h1>
          <p className="mt-3 text-lg leading-relaxed">
            That&apos;s okay. You didn&apos;t do anything wrong. You can start again from here.
          </p>
          <Link href="/en" className={`${linkClass} mt-5 bg-[#1B3A5C] text-white hover:opacity-90`}>
            Go to FosterHub AZ
          </Link>
        </section>
        <section lang="es">
          <h2 className="text-3xl font-black tracking-tight">No encontramos esa página.</h2>
          <p className="mt-3 text-lg leading-relaxed">
            Está bien. No hiciste nada malo. Puedes empezar de nuevo desde aquí.
          </p>
          <Link href="/es" className={`${linkClass} mt-5 bg-[#1B3A5C] text-white hover:opacity-90`}>
            Ir a FosterHub AZ
          </Link>
        </section>
        <p className="text-base leading-relaxed">
          In danger right now? Call <a className="font-bold underline" href="tel:911">911</a>. Need to talk? Call or
          text <a className="font-bold underline" href="tel:988">988</a>.
        </p>
      </main>
    </RootDocument>
  );
}
