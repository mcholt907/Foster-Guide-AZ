import type { Lang } from "./i18n";
import type { AgeBandKey } from "./prefs";

export const TEEN_STRINGS = {
  "nav.dashboard":           { en: "Dashboard",              es: "Inicio" },
  "nav.case":                { en: "My Case Explained",      es: "Mi Caso Explicado" },
  "nav.team":                { en: "My Advocates",           es: "Mis Defensores" },
  "nav.wellness":            { en: "Mental Health",          es: "Salud Mental" },
  "nav.answers":             { en: "Search Portal",          es: "Portal de Búsqueda" },
  "nav.rights":              { en: "Know Your Rights",       es: "Conoce Tus Derechos" },
  "nav.resources":           { en: "Resources",              es: "Recursos" },
  "nav.future":              { en: "My Future",              es: "Mi Futuro" },
  "shell.brand":             { en: "FosterHub",              es: "FosterHub" },
  "shell.brand_sub":         { en: "Arizona",                es: "Arizona" },
  "shell.command_center":    { en: "Command Center",         es: "Centro de Comando" },
  "shell.band_language.en":  { en: "Ages {band} · English",  es: "Edades {band} · Inglés" },
  "shell.band_language.es":  { en: "Ages {band} · Spanish",  es: "Edades {band} · Español" },
  "shell.start_over":        { en: "↩ Start over",           es: "↩ Empezar de nuevo" },
  "shell.start_over_confirm":{ en: "This clears your preferences. Continue?",
                               es: "Esto borra tus preferencias. ¿Continuar?" },
  "shell.start_over_yes":    { en: "Yes, start over",        es: "Sí, empezar de nuevo" },
  "shell.start_over_no":     { en: "Cancel",                 es: "Cancelar" },
  "shell.footer_tagline":    { en: "Arizona Youth Services", es: "Servicios para Jóvenes de Arizona" },
} as const;

export type TeenStringKey = keyof typeof TEEN_STRINGS;

export function tt(key: TeenStringKey, lang: Lang, vars?: Record<string, string>): string {
  const template = TEEN_STRINGS[key][lang];
  return vars ? template.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? "") : template;
}

export function ttBand(keyBase: string, band: AgeBandKey, lang: Lang): string {
  const suffix = band.replace("-", "");
  return tt(`${keyBase}.${suffix}` as TeenStringKey, lang);
}
