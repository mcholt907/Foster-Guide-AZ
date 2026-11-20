import type { Lang } from "./i18n";

/** The one public contact address for the site. Change it here only. */
export const CONTACT_EMAIL = "info@fosterhubaz.com";

/**
 * What a prefilled email is for. Each kind sets the subject and gives the
 * sender a short outline to fill in, so nobody has to guess what to write.
 */
export type ContactKind = "mistake" | "resource" | "general";

const SUBJECTS: Record<ContactKind, Record<Lang, string>> = {
  mistake: {
    en: "Mistake on FosterHub AZ",
    es: "Error en FosterHub AZ",
  },
  resource: {
    en: "Resource change for FosterHub AZ",
    es: "Cambio de recurso para FosterHub AZ",
  },
  general: {
    en: "Question about FosterHub AZ",
    es: "Pregunta sobre FosterHub AZ",
  },
};

const OUTLINES: Record<ContactKind, Record<Lang, string[]>> = {
  mistake: {
    en: [
      "Which page? (paste the link or name it):",
      "",
      "What looks wrong:",
      "",
      "Where did you see the right information? (optional):",
    ],
    es: [
      "¿Qué página? (pega el enlace o di su nombre):",
      "",
      "¿Qué parece estar mal?:",
      "",
      "¿Dónde viste la información correcta? (opcional):",
    ],
  },
  resource: {
    en: [
      "Organization or program:",
      "",
      "What should we add or change:",
      "",
      "Link to the source (the organization's own page):",
    ],
    es: [
      "Organización o programa:",
      "",
      "¿Qué debemos agregar o cambiar?:",
      "",
      "Enlace a la fuente (la página de la organización):",
    ],
  },
  general: {
    en: ["Your question or idea:"],
    es: ["Tu pregunta o idea:"],
  },
};

/**
 * The reminder at the bottom of every prefilled email. The inbox is not a
 * place for case details or emergencies, and the site promises to collect
 * nothing personal, so the email itself says so.
 */
export const EMAIL_PRIVACY_NOTE: Record<Lang, string> = {
  en: "Please don't include your name, a case number, or details about anyone's case. This inbox can't help in an emergency: call 911, or call or text 988.",
  es: "Por favor no incluyas tu nombre, un número de caso, ni detalles del caso de nadie. Este correo no puede ayudar en una emergencia: llama al 911, o llama o envía un mensaje al 988.",
};

/** A `mailto:` link with the subject and outline for `kind` filled in. */
export function contactHref(kind: ContactKind, lang: Lang): string {
  const body = [...OUTLINES[kind][lang], "", "", "—", EMAIL_PRIVACY_NOTE[lang]].join("\n");
  // encodeURIComponent, not URLSearchParams: mail apps read "+" as a plus
  // sign, not a space, so spaces must be %20.
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(SUBJECTS[kind][lang])}&body=${encodeURIComponent(body)}`;
}
