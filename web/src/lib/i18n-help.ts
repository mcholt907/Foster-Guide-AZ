// Strings for the safety UI: "Need help now?" sheet, crisis quick links,
// and the "Leave fast" quick exit. Plain language, youth voice, EN + ES.

export type HelpLang = "en" | "es";

const HELP_STRINGS = {
  "help.button":          { en: "Need help now?",  es: "¿Necesitas ayuda ya?" },
  "help.title":           { en: "Need help now?",  es: "¿Necesitas ayuda ya?" },
  "help.reassure":        { en: "You are not in trouble for asking for help.",
                            es: "No estás en problemas por pedir ayuda." },
  "help.intro":           { en: "Real people answer. Calls and texts are free.",
                            es: "Te contesta una persona real. Llamar y escribir es gratis." },
  "help.close":           { en: "Close",           es: "Cerrar" },

  "help.call":            { en: "Call {n}",        es: "Llama al {n}" },
  "help.text":            { en: "Text {n}",        es: "Escribe al {n}" },
  "help.text_keyword":    { en: "Text {k} to {n}", es: "Envía {k} al {n}" },
  "help.list_label":      { en: "People you can call or text right now",
                            es: "Personas a quienes puedes llamar o escribir ahora" },

  // Short labels for the compact (3-button) list
  "help.compact.911":     { en: "In danger now",        es: "En peligro ahora" },
  "help.compact.988":     { en: "Need to talk",         es: "Necesito hablar" },
  "help.compact.dcs":     { en: "Not safe where I live", es: "No estoy a salvo donde vivo" },

  "exit.button":          { en: "Leave fast",      es: "Salir rápido" },
  "exit.aria":            { en: "Leave this site fast. This opens Google.",
                            es: "Sal de este sitio rápido. Esto abre Google." },
  "exit.heading":         { en: "Need to hide this page?",
                            es: "¿Necesitas ocultar esta página?" },
  "exit.hint":            { en: "Tap Leave fast, or press the Esc key 3 times. You will go to Google.",
                            es: "Toca Salir rápido, o presiona la tecla Esc 3 veces. Irás a Google." },
  "exit.history":         { en: "This site can still show up in your browser history.",
                            es: "Este sitio aún puede aparecer en el historial de tu navegador." },
} as const;

export type HelpStringKey = keyof typeof HELP_STRINGS;

export function th(key: HelpStringKey, lang: HelpLang, vars?: Record<string, string>): string {
  let s: string = HELP_STRINGS[key][lang];
  if (vars) {
    for (const [k, v] of Object.entries(vars)) s = s.replace(`{${k}}`, v);
  }
  return s;
}
