export interface ImportantDoc {
  id: string;
  label: string;
  label_es: string;
  why: string;
  why_es: string;
  steps: readonly string[];
  steps_es: readonly string[];
  contact: string;
  contact_es: string;
  /** True when the document is only for some youth. The page shows an "If this applies to you" tag. */
  ifApplies?: boolean;
  lastVerified: string;
}

export const IMPORTANT_DOCS: readonly ImportantDoc[] = [
  {
    id: "birth-cert",
    label: "Birth certificate",
    label_es: "Acta de nacimiento",
    why: "You need this to get almost everything else — start here.",
    why_es: "Necesitas esto para obtener casi todo lo demás — empieza aquí.",
    steps: [
      "Ask your caseworker first. DCS can request your birth certificate for free on your behalf.",
      "If that doesn't work, contact the Arizona Department of Health Services (ADHS) directly.",
      "Call (602) 364-1300 or go to azdhs.gov to order a copy online.",
      "It's free for foster youth in Arizona — if anyone tries to charge you, remind them of A.R.S. §8-514.06.",
    ],
    steps_es: [
      "Primero pregúntale a tu trabajador/a de casos. DCS puede solicitar tu acta de nacimiento gratis en tu nombre.",
      "Si eso no funciona, comunícate directamente con el Departamento de Servicios de Salud de Arizona (ADHS).",
      "Llama al (602) 364-1300 o ve a azdhs.gov para pedir una copia en línea.",
      "Es gratis para jóvenes en cuidado de crianza en Arizona — si alguien intenta cobrarte, recuérdales A.R.S. §8-514.06.",
    ],
    contact: "ADHS Vital Records: (602) 364-1300",
    contact_es: "Registros Vitales de ADHS: (602) 364-1300",
    lastVerified: "2026-10-12",
  },
  {
    id: "ssn-card",
    label: "Social Security card",
    label_es: "Tarjeta de Seguro Social",
    why: "Needed for jobs, benefits, and your state ID. Your number may already be in your DCS file.",
    why_es: "Necesaria para empleos, beneficios y tu identificación estatal. Tu número puede estar ya en tu expediente de DCS.",
    steps: [
      "Ask your caseworker for your Social Security number — it should be in your case file.",
      "To get a physical replacement card, go to ssa.gov or call 1-800-772-1213.",
      "Bring your birth certificate when you apply (or ask your caseworker to help).",
      "Replacement cards are free — you can get up to 3 per year.",
    ],
    steps_es: [
      "Pídele a tu trabajador/a de casos tu número de Seguro Social — debe estar en tu expediente.",
      "Para obtener una tarjeta de reemplazo, ve a ssa.gov o llama al 1-800-772-1213.",
      "Lleva tu acta de nacimiento cuando solicites (o pídele a tu trabajador/a que te ayude).",
      "Las tarjetas de reemplazo son gratis — puedes obtener hasta 3 por año.",
    ],
    contact: "Social Security Administration: 1-800-772-1213",
    contact_es: "Administración del Seguro Social: 1-800-772-1213",
    lastVerified: "2026-10-12",
  },
  {
    id: "state-id",
    label: "State ID / driver's license",
    label_es: "Identificación estatal / licencia de conducir",
    why: "Get your birth certificate and Social Security card first — you'll need both.",
    why_es: "Obtén primero tu acta de nacimiento y tarjeta de Seguro Social — necesitarás ambas.",
    steps: [
      "Get your birth certificate and Social Security card before you go.",
      "Visit an Arizona MVD office or start at azmvdnow.gov.",
      "Ask your caseworker about a fee waiver — foster youth often qualify.",
      "Bring proof of Arizona address (a letter from DCS on their letterhead works).",
    ],
    steps_es: [
      "Consigue tu acta de nacimiento y tarjeta de Seguro Social antes de ir.",
      "Visita una oficina de MVD de Arizona o comienza en azmvdnow.gov.",
      "Pregúntale a tu trabajador/a de casos sobre una exención de tarifas — muchos jóvenes en cuidado de crianza califican.",
      "Lleva comprobante de domicilio en Arizona (una carta de DCS en su membrete funciona).",
    ],
    contact: "AZ Motor Vehicle Division: azmvdnow.gov",
    contact_es: "División de Vehículos de Motor de AZ: azmvdnow.gov",
    lastVerified: "2026-10-12",
  },
  {
    id: "immunizations",
    label: "Medical and shot (immunization) records",
    label_es: "Expediente médico y registro de vacunas",
    why: "Schools, doctors, and some jobs ask for these. Your caseworker may already have them.",
    why_es: "Las escuelas, los doctores y algunos empleos los piden. Tu trabajador/a de casos puede tenerlos.",
    steps: [
      "Ask your caseworker for a copy of your health records — doctor visits, medicines, allergies, and shots.",
      "Ask your caseworker — DCS is required to keep your immunization records.",
      "Check with your school's health office — they often keep records on file.",
      "If you still can't find them, Arizona has a statewide registry. Call ADHS at (602) 364-3630.",
      "Any doctor or clinic you've visited can also provide records of shots they gave you.",
    ],
    steps_es: [
      "Pídele a tu trabajador/a de casos una copia de tu expediente de salud — visitas al doctor, medicinas, alergias y vacunas.",
      "Pregúntale a tu trabajador/a de casos — DCS está obligado a conservar tus registros de vacunas.",
      "Consulta con la enfermería de tu escuela — frecuentemente guardan registros.",
      "Si aún no los encuentras, Arizona tiene un registro estatal. Llama a ADHS al (602) 364-3630.",
      "Cualquier médico o clínica que hayas visitado también puede darte registros de vacunas que aplicaron.",
    ],
    contact: "AZ Immunization Registry: (602) 364-3630",
    contact_es: "Registro de Vacunas de AZ: (602) 364-3630",
    lastVerified: "2026-10-12",
  },
  {
    id: "health-card",
    label: "Health insurance (AHCCCS) card",
    label_es: "Tarjeta de seguro médico (AHCCCS)",
    why: "AHCCCS is Arizona's free health plan (Medicaid). Your card lets you see a doctor, dentist, or counselor and get medicine.",
    why_es: "AHCCCS es el plan de salud gratis de Arizona (Medicaid). Con tu tarjeta puedes ver a un doctor, dentista o consejero y recibir medicinas.",
    steps: [
      "Ask your caseworker which health plan you have and for a copy of your member card.",
      "Take a photo of the card, or write down your member ID number and keep it safe.",
      "Lost it? Call the member phone number for your health plan and ask for a new card. Your caseworker can help.",
      "If you were in foster care when you turned 18, you can keep free AHCCCS until age 26. It is called Young Adult Transitional Insurance. Ask your caseworker to make sure it is set up before you leave care.",
    ],
    steps_es: [
      "Pregúntale a tu trabajador/a de casos qué plan de salud tienes y pídele una copia de tu tarjeta de miembro.",
      "Tómale una foto a la tarjeta, o apunta tu número de miembro y guárdalo en un lugar seguro.",
      "¿La perdiste? Llama al número para miembros de tu plan de salud y pide una tarjeta nueva. Tu trabajador/a de casos te puede ayudar.",
      "Si estabas en cuidado de crianza cuando cumpliste 18, puedes seguir con AHCCCS gratis hasta los 26 años. Se llama Seguro de Transición para Adultos Jóvenes (Young Adult Transitional Insurance). Pídele a tu trabajador/a de casos que lo deje listo antes de que salgas del cuidado de crianza.",
    ],
    contact: "Your caseworker, or AHCCCS: azahcccs.gov",
    contact_es: "Tu trabajador/a de casos, o AHCCCS: azahcccs.gov",
    lastVerified: "2026-11-11",
  },
  {
    id: "school-records",
    label: "School records and transcripts",
    label_es: "Expediente escolar y calificaciones",
    why: "A transcript lists your classes and credits. You need it to change schools, graduate, apply to college, or get into job training.",
    why_es: "Tu historial de calificaciones (transcript) muestra tus clases y créditos. Lo necesitas para cambiar de escuela, graduarte, entrar a la universidad o a una capacitación de trabajo.",
    steps: [
      "Ask your school counselor or the front office for a copy of your transcript.",
      "If you changed schools, ask your caseworker to help get records from each school, so you don't lose credits.",
      "If you have a learning plan (an IEP or a 504 plan), ask for a copy of that too.",
      "Keep your diploma or GED certificate in a safe place once you have it.",
    ],
    steps_es: [
      "Pídele a tu consejero/a escolar o a la oficina de tu escuela una copia de tu historial de calificaciones.",
      "Si cambiaste de escuela, pídele a tu trabajador/a de casos que te ayude a conseguir los papeles de cada escuela, para que no pierdas créditos.",
      "Si tienes un plan de aprendizaje (un IEP o un plan 504), pide una copia también.",
      "Guarda tu diploma o certificado de GED en un lugar seguro cuando lo tengas.",
    ],
    contact: "Your school counselor or school office",
    contact_es: "Tu consejero/a escolar o la oficina de tu escuela",
    lastVerified: "2026-11-11",
  },
  {
    id: "tribal-id",
    label: "Tribal enrollment card or Certificate of Indian Blood",
    label_es: "Tarjeta de inscripción tribal o Certificado de Sangre Indígena",
    why: "If you are Native American, these papers show you belong to your tribe. They can help you get tribal health care, school money, and other support from your tribe.",
    why_es: "Si eres nativo/a americano/a, estos papeles muestran que perteneces a tu tribu. Te pueden ayudar a recibir atención médica tribal, dinero para estudiar y otros apoyos de tu tribu.",
    steps: [
      "Tell your caseworker and your lawyer that you are, or might be, a member of a tribe.",
      "Ask your caseworker to help you contact your tribe's enrollment office. Each tribe has its own rules and forms.",
      "If you are not enrolled yet but a parent or grandparent is, ask if you can enroll. Your caseworker should help with this.",
      "Ask for copies of your tribal papers before you leave foster care.",
    ],
    steps_es: [
      "Dile a tu trabajador/a de casos y a tu abogado/a que eres, o podrías ser, miembro de una tribu.",
      "Pídele a tu trabajador/a de casos que te ayude a comunicarte con la oficina de inscripción de tu tribu. Cada tribu tiene sus propias reglas y formularios.",
      "Si todavía no estás inscrito/a pero tu mamá, tu papá o un abuelo/a sí lo está, pregunta si te puedes inscribir. Tu trabajador/a de casos debe ayudarte con esto.",
      "Pide copias de tus papeles tribales antes de salir del cuidado de crianza.",
    ],
    contact: "Your tribe's enrollment office (ask your caseworker to help you find it)",
    contact_es: "La oficina de inscripción de tu tribu (pídele a tu trabajador/a de casos que te ayude a encontrarla)",
    ifApplies: true,
    lastVerified: "2026-11-11",
  },
];
