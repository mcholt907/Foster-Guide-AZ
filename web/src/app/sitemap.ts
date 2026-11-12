import type { MetadataRoute } from "next";
import { RESOURCES } from "../data/resources";
import { IMPORTANT_DOCS } from "../data/docs";
import { CRISIS_PINS } from "../data/constants";

const BASE_URL = "https://www.fosterhubaz.com";
const LANGS = ["en", "es"] as const;

/** Newest `lastVerified` date (YYYY-MM-DD) in a data list. */
function newest(entries: readonly { lastVerified: string }[]): string | undefined {
  return entries.reduce<string | undefined>(
    (max, e) => (!max || e.lastVerified > max ? e.lastVerified : max),
    undefined
  );
}

// `lastModified` is only set where the page shows data that carries a real
// "last checked" date. Stamping every URL with the build time (the old
// behaviour) tells search engines everything changed on every deploy, which
// teaches them to ignore the field. Pages with no dated data leave it out.
//
// Do NOT include /setup — it's onboarding UI, not indexable content.
const ROUTES: { path: string; lastModified?: string; priority: number }[] = [
  { path: "", priority: 0.9 },
  { path: "/rights", priority: 0.8 },
  { path: "/case", priority: 0.8 },
  { path: "/team", priority: 0.8 },
  { path: "/future", lastModified: newest(IMPORTANT_DOCS), priority: 0.8 },
  { path: "/resources", lastModified: newest(RESOURCES), priority: 0.8 },
  { path: "/wellness", lastModified: newest(CRISIS_PINS), priority: 0.8 },
  { path: "/ask", priority: 0.8 },
  { path: "/privacy", priority: 0.3 },
  { path: "/terms", priority: 0.3 },
  { path: "/accessibility", priority: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  // Root: the language picker. It is the x-default for the two home pages.
  const entries: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      priority: 1,
      alternates: {
        languages: { en: `${BASE_URL}/en`, es: `${BASE_URL}/es`, "x-default": BASE_URL },
      },
    },
  ];

  for (const { path, lastModified, priority } of ROUTES) {
    // Same alternates on both language versions, matching each page's <head>.
    // (The home pages point x-default at the picker; sub-pages at English.)
    const languages = {
      en: `${BASE_URL}/en${path}`,
      es: `${BASE_URL}/es${path}`,
      "x-default": path === "" ? BASE_URL : `${BASE_URL}/en${path}`,
    };
    for (const lang of LANGS) {
      entries.push({
        url: `${BASE_URL}/${lang}${path}`,
        ...(lastModified ? { lastModified } : {}),
        priority,
        alternates: { languages },
      });
    }
  }

  return entries;
}
