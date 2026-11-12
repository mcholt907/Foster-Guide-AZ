// Strings for the site shell: navigation labels for screen readers, the teen
// menu drawer, the "Start over" confirm step, and the short safety-button
// labels used on small phones. Plain language, youth voice, EN + ES.

export type ShellLang = "en" | "es";

const SHELL_STRINGS = {
  // Screen-reader names for each navigation area
  "nav.side":            { en: "Main menu",            es: "Menú principal" },
  "nav.drawer":          { en: "All sections",         es: "Todas las secciones" },
  "nav.bottom":          { en: "Quick menu",           es: "Menú rápido" },
  "nav.legal":           { en: "Legal links",          es: "Enlaces legales" },
  "nav.more":            { en: "Swipe for more",       es: "Desliza para ver más" },

  // Teen mobile menu (drawer)
  "menu.open":           { en: "Open menu",            es: "Abrir menú" },
  "menu.close":          { en: "Close menu",           es: "Cerrar menú" },
  "menu.title":          { en: "Menu",                 es: "Menú" },

  // "Start over" confirm step
  "reset.button":        { en: "Start over",           es: "Empezar de nuevo" },
  "reset.confirm":       { en: "Start over? This clears your age and county.",
                           es: "¿Empezar de nuevo? Esto borra tu edad y tu condado." },
  "reset.yes":           { en: "Yes, start over",      es: "Sí, empezar de nuevo" },
  "reset.no":            { en: "Cancel",               es: "Cancelar" },

  // Short label for the floating help button on small phones
  "help.short":          { en: "Help now",             es: "Ayuda ya" },
} as const;

export type ShellStringKey = keyof typeof SHELL_STRINGS;

export function ts(key: ShellStringKey, lang: ShellLang): string {
  return SHELL_STRINGS[key][lang];
}
