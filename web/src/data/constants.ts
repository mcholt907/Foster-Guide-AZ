export const COUNTIES = [
  "Apache", "Cochise", "Coconino", "Gila", "Graham",
  "Greenlee", "La Paz", "Maricopa", "Mohave", "Navajo",
  "Pima", "Pinal", "Santa Cruz", "Yavapai", "Yuma",
] as const;

export type County = (typeof COUNTIES)[number];

export const AGE_BANDS = [
  { id: "10-12" as const, label: "10–12" },
  { id: "13-15" as const, label: "13–15" },
  { id: "16-17" as const, label: "16–17" },
  { id: "18-21" as const, label: "18–21" },
];

// ── Crisis contacts — the single source of truth ─────────────────────────────
// Every crisis UI (Help sheet, Wellness, Home, empty states) reads from here.
// Keep each entry FLAT (no nested objects/arrays): the freshness scripts in
// /scripts parse this block with regexes keyed on `name`, `url`, `lastVerified`.
//
//   tel / telDisplay         — number to dial + how to print it
//   telAlt / telAltDisplay   — second number (e.g. statewide toll-free)
//   sms / smsDisplay         — number to text + how to print it
//   smsBody / smsBody_es     — keyword pre-filled in the text message
//   crisis: false            — kept in the data, but hidden from crisis UIs
//   compact: true            — shown in the short 3-button list
export const CRISIS_PINS = [
  {
    id: "911",
    name: "911 Emergency",
    name_es: "911 Emergencias",
    how: "Call 911",
    how_es: "Llama al 911",
    desc: "Call if you or someone else is in danger right now.",
    desc_es: "Llama si tú u otra persona está en peligro ahora mismo.",
    tel: "911",
    telDisplay: "911",
    crisis: true,
    compact: true,
    lastVerified: "2026-11-09",
  },
  {
    id: "988",
    name: "988 Suicide & Crisis Lifeline",
    name_es: "Línea 988 de Crisis y Suicidio",
    how: "Call or text 988",
    how_es: "Llama o envía mensaje al 988",
    desc: "Talk to a caring person any time, day or night. It is free and private.",
    desc_es: "Habla con alguien que te escucha, de día o de noche. Es gratis y privado.",
    url: "https://988lifeline.org/",
    tel: "988",
    telDisplay: "988",
    sms: "988",
    smsDisplay: "988",
    crisis: true,
    compact: true,
    lastVerified: "2026-11-09",
  },
  {
    id: "teen-lifeline",
    name: "Teen Lifeline Arizona",
    name_es: "Teen Lifeline Arizona",
    how: "Call or text 602-248-8336",
    how_es: "Llama o envía mensaje al 602-248-8336",
    desc: "Talk with another teen who gets it. Outside Phoenix, call 1-800-248-8336.",
    desc_es: "Habla con otro joven que te entiende. Fuera de Phoenix, llama al 1-800-248-8336.",
    url: "https://teenlifeline.org/",
    tel: "6022488336",
    telDisplay: "602-248-8336",
    telAlt: "18002488336",
    telAltDisplay: "1-800-248-8336",
    sms: "6022488336",
    smsDisplay: "602-248-8336",
    crisis: true,
    compact: false,
    lastVerified: "2026-11-09",
  },
  {
    id: "crisis-text",
    name: "Crisis Text Line",
    name_es: "Línea de Texto de Crisis",
    how: "Text HOME to 741741",
    how_es: "Envía HOLA al 741741",
    desc: "Text when you can't talk out loud. A real person texts you back.",
    desc_es: "Escribe cuando no puedas hablar en voz alta. Una persona real te contesta.",
    url: "https://www.crisistextline.org/",
    sms: "741741",
    smsDisplay: "741741",
    smsBody: "HOME",
    smsBody_es: "HOLA",
    crisis: true,
    compact: false,
    lastVerified: "2026-11-09",
  },
  {
    id: "dcs",
    name: "AZ DCS Child Abuse Hotline",
    name_es: "Línea de Abuso Infantil del DCS de Arizona",
    how: "1-888-SOS-CHILD (1-888-767-2445)",
    how_es: "1-888-SOS-CHILD (1-888-767-2445)",
    desc: "Call if someone is hurting you or you are not safe where you live. Open 24/7.",
    desc_es: "Llama si alguien te hace daño o no estás a salvo donde vives. Abierta 24/7.",
    url: "https://dcs.az.gov/about/contact",
    tel: "18887672445",
    telDisplay: "1-888-767-2445",
    crisis: true,
    compact: true,
    lastVerified: "2026-11-09",
  },
  {
    id: "always",
    name: "ALWAYS (legal help)",
    name_es: "ALWAYS (ayuda legal)",
    how: "Youth legal services (AZ)",
    how_es: "Servicios legales para jóvenes (AZ)",
    desc: "Free legal help for young people in Arizona. Not a crisis line.",
    desc_es: "Ayuda legal gratis para jóvenes en Arizona. No es una línea de crisis.",
    url: "https://alwaysaz.org/",
    crisis: false,
    compact: false,
    lastVerified: "2026-11-02",
  },
] as const;

export type CrisisContactId = (typeof CRISIS_PINS)[number]["id"];

/** Widened shape of a CRISIS_PINS entry, with the optional action fields. */
export type CrisisContact = {
  id: CrisisContactId;
  name: string;
  name_es: string;
  how: string;
  how_es: string;
  desc: string;
  desc_es: string;
  url?: string;
  tel?: string;
  telDisplay?: string;
  telAlt?: string;
  telAltDisplay?: string;
  sms?: string;
  smsDisplay?: string;
  smsBody?: string;
  smsBody_es?: string;
  crisis: boolean;
  compact: boolean;
  lastVerified: string;
};

const ALL_CONTACTS: readonly CrisisContact[] = CRISIS_PINS;

/** Real crisis lines only (no legal help). Use this in every crisis UI. */
export const CRISIS_CONTACTS: readonly CrisisContact[] = ALL_CONTACTS.filter((c) => c.crisis);

/** The short list for tight spaces: 911, 988, DCS hotline. */
export const CRISIS_CONTACTS_COMPACT: readonly CrisisContact[] = CRISIS_CONTACTS.filter((c) => c.compact);

export function getCrisisContact(id: CrisisContactId): CrisisContact {
  return ALL_CONTACTS.find((c) => c.id === id) as CrisisContact;
}

export type CrisisAction = {
  kind: "tel" | "sms";
  /** Ready-to-use link: `tel:…` or `sms:…` */
  href: string;
  /** The number as people read it, e.g. "1-888-767-2445" */
  display: string;
  /** Keyword to send, for text lines that need one (HOME / HOLA) */
  keyword?: string;
};

/** Tap-to-call / tap-to-text actions for one contact, in display order. */
export function crisisActions(c: CrisisContact, lang: "en" | "es"): CrisisAction[] {
  const actions: CrisisAction[] = [];
  if (c.tel) {
    actions.push({ kind: "tel", href: `tel:${c.tel}`, display: c.telDisplay ?? c.tel });
  }
  if (c.sms) {
    const keyword = lang === "es" ? c.smsBody_es ?? c.smsBody : c.smsBody;
    actions.push({
      kind: "sms",
      href: keyword ? `sms:${c.sms}?body=${encodeURIComponent(keyword)}` : `sms:${c.sms}`,
      display: c.smsDisplay ?? c.sms,
      keyword,
    });
  }
  if (c.telAlt) {
    actions.push({ kind: "tel", href: `tel:${c.telAlt}`, display: c.telAltDisplay ?? c.telAlt });
  }
  return actions;
}
