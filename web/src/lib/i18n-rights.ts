import type { Lang } from "./i18n";

// UI strings used only by the Your Rights page (10-12 page and RightsTeen).
const STRINGS = {
  "hero.title":      { en: "Your Rights",
                       es: "Tus derechos" },
  "hero.subtitle":   { en: "Your rights under Arizona law — in plain words.",
                       es: "Tus derechos bajo la ley de Arizona — en palabras simples." },
  "list.hint":       { en: "Tap a right to learn what it means.",
                       es: "Toca un derecho para saber qué significa." },
  "list.label":      { en: "List of your rights",
                       es: "Lista de tus derechos" },
  "counter":         { en: "Right {n} of {total}",
                       es: "Derecho {n} de {total}" },
  "prev":            { en: "Back",
                       es: "Anterior" },
  "next":            { en: "Next right",
                       es: "Siguiente derecho" },
  "tab.ignored":     { en: "If nobody listens",
                       es: "Si nadie escucha" },
  "example":         { en: "For example",
                       es: "Por ejemplo" },
  "wrong.title":     { en: "If something feels wrong",
                       es: "Si sientes que algo está mal" },
  "wrong.1.who":     { en: "Tell your caseworker",
                       es: "Dile a tu trabajador/a de casos" },
  "wrong.1.what":    { en: "Tell them what you need. Their job is to help.",
                       es: "Dile lo que necesitas. Su trabajo es ayudarte." },
  "wrong.2.who":     { en: "Tell your lawyer or GAL",
                       es: "Dile a tu abogado/a o a tu GAL" },
  "wrong.2.what":    { en: "A lawyer tells the judge what you want. A GAL (guardian ad litem) tells the judge what they think is best for you. You can ask: “Are you my lawyer or my GAL?”",
                       es: "Un abogado le dice al juez lo que tú quieres. Un GAL (tutor ad litem) le dice al juez lo que cree que es mejor para ti. Puedes preguntar: “¿Eres mi abogado/a o mi GAL?”" },
  "wrong.3.who":     { en: "Tell a trusted adult",
                       es: "Dile a un adulto de confianza" },
  "wrong.3.what":    { en: "A teacher, a school counselor, or another grown-up you trust can help you ask.",
                       es: "Un maestro, un consejero de la escuela u otro adulto de confianza puede ayudarte a pedirlo." },
  "wrong.note":      { en: "You don't have to figure this out alone. Asking for help is always okay.",
                       es: "No tienes que resolver esto solo/a. Pedir ayuda siempre está bien." },
} as const;

export type RightsStringKey = keyof typeof STRINGS;

export function tr(
  key: RightsStringKey,
  lang: Lang,
  vars?: Record<string, string | number>,
): string {
  let s: string = STRINGS[key][lang];
  if (vars) {
    for (const [k, v] of Object.entries(vars)) s = s.replace(`{${k}}`, String(v));
  }
  return s;
}
