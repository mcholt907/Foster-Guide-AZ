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

  "dashboard.greeting.morning":    { en: "Good morning.", es: "Buenos días." },
  "dashboard.greeting.subtitle":   {
    en: "Welcome to your secure command center. {date}.",
    es: "Bienvenido/a a tu centro de comando seguro. {date}.",
  },
  "dashboard.privacy.label":       { en: "Privacy First",              es: "Privacidad primero" },
  "dashboard.privacy.body":        { en: "No data is ever saved or tracked.",
                                     es: "Nunca se guardan ni se rastrean datos." },
  "dashboard.section.label":       { en: "Command Control",            es: "Control de Comando" },

  "dashboard.tile.team.title":     { en: "Your Advocates",             es: "Tus Defensores" },
  "dashboard.tile.team.desc":      { en: "Direct lines to your judge, lawyer, and caseworker.",
                                     es: "Líneas directas a tu juez, abogado/a y trabajador/a de casos." },
  "dashboard.tile.team.cta":       { en: "Open Portal",                es: "Abrir Portal" },

  "dashboard.tile.case.title":     { en: "Legal Roadmap",              es: "Hoja de Ruta Legal" },
  "dashboard.tile.case.desc":      { en: "Timeline of your hearings and next legal maneuvers.",
                                     es: "Cronograma de tus audiencias y próximas acciones legales." },
  "dashboard.tile.case.cta":       { en: "View Timeline",              es: "Ver Cronograma" },

  "dashboard.tile.wellness.title": { en: "Mindful Hub",                es: "Centro de Bienestar" },
  "dashboard.tile.wellness.desc":  { en: "Daily grounding tools and mental health resources.",
                                     es: "Herramientas diarias de equilibrio y recursos de salud mental." },
  "dashboard.tile.wellness.cta":   { en: "Start Session",              es: "Iniciar Sesión" },

  "dashboard.tile.answers.title":  { en: "Knowledge Hub",              es: "Centro de Conocimiento" },
  "dashboard.tile.answers.desc":   { en: "Searchable database for rights, laws, and next steps.",
                                     es: "Base de datos de búsqueda para derechos, leyes y próximos pasos." },
  "dashboard.tile.answers.cta":    { en: "Search Portal",              es: "Portal de Búsqueda" },

  "dashboard.tip.heading":         { en: "Strategic Tip",              es: "Consejo Estratégico" },
  "dashboard.tip.cta":             { en: "Learn your rights",          es: "Conoce tus derechos" },
  "dashboard.tip.1315": {
    en: "Bring written questions to every meeting with your lawyer. They work for you — your questions shape what they fight for.",
    es: "Trae preguntas escritas a cada reunión con tu abogado/a. Trabajan para ti — tus preguntas determinan por qué luchan.",
  },
  "dashboard.tip.1617": {
    en: "Did you know you can request a private meeting with your judge before your next hearing?",
    es: "¿Sabías que puedes pedir una reunión privada con tu juez antes de tu próxima audiencia?",
  },
  "dashboard.tip.1821": {
    en: "Ask your caseworker about extended foster care. It's voluntary, you can still use it, and it comes with housing support.",
    es: "Pregúntale a tu trabajador/a de casos sobre el cuidado extendido. Es voluntario, aún puedes usarlo, e incluye apoyo de vivienda.",
  },

  "dashboard.crisis.title":        { en: "Crisis Support",             es: "Apoyo en Crisis" },
  "dashboard.crisis.body":         { en: "If you're feeling overwhelmed or need immediate help, 988 is available 24/7.",
                                     es: "Si te sientes abrumado/a o necesitas ayuda inmediata, el 988 está disponible 24/7." },
  "dashboard.crisis.cta":          { en: "Call or Text 988",           es: "Llama o envía mensaje al 988" },
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
