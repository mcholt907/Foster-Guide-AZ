import { Outfit, Inter } from "next/font/google";
import "../app/globals.css";
import { ServiceWorkerRegister } from "./ServiceWorkerRegister";

const outfit = Outfit({ subsets: ["latin"], display: "swap", variable: "--font-outfit" });
const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-inter" });

// Runs before first paint. Copies the saved age band (localStorage key
// `fgaz_prefs_v2`, see lib/prefs.ts) onto <html data-band="…"> so globals.css
// can hide the server-rendered teen layout from a 10–12 user until React has
// loaded their prefs and swapped in the kids' layout (BandShell then sets
// `data-band-ready`). With no saved prefs, or no JavaScript, nothing is hidden.
const BAND_SCRIPT = `(function(){try{var p=JSON.parse(localStorage.getItem("fgaz_prefs_v2")||"null"),b=p&&p.ageBand;if(b==="10-12"||b==="13-15"||b==="16-17"||b==="18-21")document.documentElement.setAttribute("data-band",b)}catch(e){}})()`;

/**
 * The <html> / <body> document shared by both root layouts.
 * `bandScript` adds the before-paint age-band script (only /[lang] pages
 * have band-specific chrome).
 */
export function RootDocument({
  lang,
  bandScript = false,
  children,
}: {
  lang: "en" | "es";
  bandScript?: boolean;
  children: React.ReactNode;
}) {
  return (
    <html
      lang={lang}
      data-scroll-behavior="smooth"
      className={`h-full ${outfit.variable} ${inter.variable} ${outfit.className}`}
      // The band script adds data-band / BandShell adds data-band-ready.
      suppressHydrationWarning
    >
      {/* App Router root document: a real <head> is correct here (the lint
          rule is for the Pages Router). Metadata still comes from the layouts. */}
      {/* eslint-disable-next-line @next/next/no-head-element */}
      <head>
        {bandScript && <script dangerouslySetInnerHTML={{ __html: BAND_SCRIPT }} />}
      </head>
      <body className="min-h-full bg-[#FFF9F3] antialiased">
        {children}
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
