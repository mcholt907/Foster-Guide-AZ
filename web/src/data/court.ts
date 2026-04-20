export const COURT_STAGES = [
  {
    id: "prelim",
    title: "First safety hearing (Preliminary Protective Hearing)",
    title_es: "Primera audiencia de seguridad (Audiencia Preliminar de Protección)",
    what: "The judge checks if you're safe and decides what happens right away — usually within a few days.",
    what_es: "El juez verifica si estás seguro y decide qué pasa de inmediato — generalmente en unos pocos días.",
    youth: "Before it starts, tell your lawyer what you want the judge to hear. They're there to speak up for you.",
    youth_es: "Antes de que comience, dile a tu abogado lo que quieres que el juez escuche. Están ahí para hablar por ti.",
    next: "Dates for the next hearings are set.",
    next_es: "Se establecen fechas para las próximas audiencias.",
  },
  {
    id: "adjudication",
    title: "Facts hearing (Adjudication)",
    title_es: "Audiencia de hechos (Adjudicación)",
    what: "The court decides if the concerns in your case are proven and whether the case continues.",
    what_es: "El tribunal decide si las preocupaciones en tu caso están probadas y si el caso continúa.",
    youth: `Ask your lawyer: "What does this mean for where I live and my school?"`,
    youth_es: "Pregúntale a tu abogado: '¿Qué significa esto para dónde vivo y mi escuela?'",
    next: "Your case plan and services get reviewed and updated.",
    next_es: "Tu plan de caso y los servicios se revisan y actualizan.",
  },
  {
    id: "review",
    title: "Check‑in hearing (Review Hearing)",
    title_es: "Audiencia de seguimiento (Audiencia de Revisión)",
    what: "The judge checks in on how your plan is going and what needs to change.",
    what_es: "El juez verifica cómo va tu plan y qué necesita cambiar.",
    youth: "Come with 1–2 updates you want people to know: what's working and what isn't.",
    youth_es: "Ven con 1 o 2 actualizaciones que quieres que la gente sepa: qué está funcionando y qué no.",
    next: "More check-ins are scheduled, or you move toward a long-term plan hearing.",
    next_es: "Se programan más seguimientos, o avanzas hacia una audiencia de plan a largo plazo.",
  },
  {
    id: "permanency",
    title: "Long‑term plan hearing (Permanency Hearing)",
    title_es: "Audiencia de plan a largo plazo (Audiencia de Permanencia)",
    what: "The judge discusses the long-term plan for you — like going home, guardianship, or adoption.",
    what_es: "El juez discute el plan a largo plazo para ti — como regresar a casa, tutela o adopción.",
    youth: "Ask your lawyer to walk you through each option in plain words. You have a say in this.",
    youth_es: "Pídele a tu abogado que te explique cada opción en palabras simples. Tienes voz en esto.",
    next: "Everyone takes steps toward the long-term plan.",
    next_es: "Todos toman medidas hacia el plan a largo plazo.",
  },
];

export const WHO_IN_YOUR_CASE = [
  {
    id: "caseworker",
    title: "Your DCS Case Manager",
    title_es: "Tu trabajador/a de casos (DCS)",
    aka: "Also called: caseworker",
    aka_es: "También llamado: caseworker",
    emoji: "👤",
    color: "#2A7F8E",
    role: "Your main point of contact at the Department of Child Safety (DCS).",
    role_es: "Tu contacto principal en el Departamento de Seguridad Infantil (DCS).",
    what: "They manage your case day-to-day — writing your case plan, scheduling visits, and connecting you to services. By law they're supposed to meet with you at least once a month in person.",
    what_es: "Maneja tu caso día a día — escribe tu plan de caso, programa visitas y te conecta con servicios. Por ley debe reunirse contigo en persona al menos una vez al mes.",
    tip: "Keep their number saved. If something feels wrong or isn't happening, they're your first call.",
    tip_es: "Guarda su número. Si algo se siente mal o no está pasando, es tu primera llamada.",
    teen_tips: {
      "13-15": {
        en: "Your caseworker's number should always be in your phone. If they don't visit monthly, that's a problem you can raise.",
        es: "El número de tu trabajador/a de casos debe estar siempre en tu teléfono. Si no te visita cada mes, eso es algo que puedes reportar.",
      },
      "16-17": {
        en: "Ask your caseworker in writing about your transition plan. You're entitled to one at 16 — make sure it's being built.",
        es: "Pídele a tu trabajador/a de casos por escrito sobre tu plan de transición. Tienes derecho a uno a los 16 — asegúrate de que lo estén desarrollando.",
      },
      "18-21": {
        en: "Even if you've signed out, your caseworker can still connect you to extended services. Keep the line open.",
        es: "Aunque hayas salido del cuidado, tu trabajador/a de casos aún puede conectarte con servicios extendidos. Mantén el contacto.",
      },
    },
  },
  {
    id: "judge",
    title: "The Judge",
    title_es: "El/La juez",
    aka: "Also called: dependency court judge",
    aka_es: "También llamado: juez del tribunal de dependencia",
    emoji: "⚖️",
    color: "#1B3A5C",
    role: "Makes the big legal decisions about your case — including where you live.",
    role_es: "Toma las grandes decisiones legales sobre tu caso — incluyendo dónde vives.",
    what: "A Superior Court judge oversees your dependency case. They approve your case plan, decide placement, and make the final call at every hearing. You have the right to speak at hearings — your voice counts.",
    what_es: "Un juez del Tribunal Superior supervisa tu caso de dependencia. Aprueba tu plan de caso, decide la colocación y da el veredicto final en cada audiencia. Tienes el derecho de hablar — tu voz cuenta.",
    tip: "You can tell the judge how you feel, what you want, and what's not working — through your attorney or by asking to address the court directly.",
    tip_es: "Puedes decirle al juez cómo te sientes, qué quieres y qué no está funcionando — a través de tu abogado o pidiéndole al tribunal que te dé la palabra.",
    teen_tips: {
      "13-15": {
        en: "Judges want to hear from you — it's not weird to speak up. Your attorney can ask for you, or you can ask to speak directly.",
        es: "Los jueces quieren escucharte — no es raro hablar. Tu abogado/a puede pedirlo por ti, o tú puedes pedir hablar directamente.",
      },
      "16-17": {
        en: "At this age the judge weighs your input heavily. Come to hearings ready with specific requests — school, placement, contact with siblings.",
        es: "A esta edad, el juez considera mucho tu opinión. Llega a las audiencias con peticiones específicas — escuela, colocación, contacto con hermanos.",
      },
      "18-21": {
        en: "If you're in extended care, the judge still oversees your case. You can request hearings to address services that aren't working.",
        es: "Si estás en cuidado extendido, el juez aún supervisa tu caso. Puedes pedir audiencias para tratar servicios que no están funcionando.",
      },
    },
  },
  {
    id: "attorney",
    title: "Your Attorney",
    title_es: "Tu abogado/a",
    aka: "Also called: your lawyer",
    aka_es: "También llamado: tu abogado",
    emoji: "📋",
    color: "#D97706",
    role: "Represents only you — not DCS (the state), not your parents, not the foster family.",
    role_es: "Te representa solo a ti — no a DCS (el estado), no a tus padres, no a la familia adoptiva.",
    what: "Arizona law gives every youth in foster care the right to an attorney. They go to court with you, explain what's happening, and argue for what you want. Everything you tell them stays private.",
    what_es: "La ley de Arizona le da a todo joven en cuidado adoptivo el derecho a un abogado. Va al tribunal contigo, explica lo que está pasando y argumenta lo que tú quieres. Todo lo que le cuentes queda en privado.",
    tip: "Be honest with your attorney — they can only fight for you if they know what's really going on. If you don't have one, ask your caseworker immediately.",
    tip_es: "Sé honesto con tu abogado — solo puede luchar por ti si sabe lo que realmente está pasando. Si no tienes uno, pídelo a tu trabajador/a de casos de inmediato.",
    teen_tips: {
      "13-15": {
        en: "Your attorney works for you, not your parents and not DCS. If you don't know who they are, your caseworker has to tell you.",
        es: "Tu abogado/a trabaja para ti, no para tus padres ni para DCS. Si no sabes quién es, tu trabajador/a de casos tiene que decírtelo.",
      },
      "16-17": {
        en: "Ask your attorney to walk you through every court document before you sign or agree to anything. That's their job.",
        es: "Pídele a tu abogado/a que te explique cada documento del tribunal antes de firmar o aceptar algo. Ese es su trabajo.",
      },
      "18-21": {
        en: "Your attorney may change if you enter extended care. Get the new attorney's contact info at the transition hearing.",
        es: "Tu abogado/a puede cambiar si entras al cuidado extendido. Obtén la información de contacto del nuevo abogado en la audiencia de transición.",
      },
    },
  },
  {
    id: "casa",
    title: "CASA Volunteer",
    title_es: "Voluntario/a CASA",
    aka: "Court Appointed Special Advocate",
    aka_es: "Defensor Especial Nombrado por el Tribunal",
    emoji: "🤝",
    color: "#2A7F8E",
    role: "Court Appointed Special Advocate — a trained community volunteer who gets to know you personally and speaks up for you in court.",
    role_es: "Defensor Especial Nombrado por el Tribunal — un voluntario de la comunidad capacitado que te conoce personalmente y habla por ti en el tribunal.",
    what: "Unlike your caseworker, a CASA has one job: figure out what's best for you and tell the judge. They visit you regularly, read your full case file, and write a report for the court. Not every case has a CASA — but if you don't have one, you can ask your caseworker or attorney to request one.",
    what_es: "A diferencia de tu trabajador/a de casos, un CASA tiene un solo trabajo: determinar qué es mejor para ti y decírselo al juez. Te visita regularmente, lee tu expediente completo y escribe un informe para el tribunal. No todos los casos tienen un CASA — pero si no tienes uno, puedes pedirle a tu trabajador/a social o abogado que solicite uno.",
    tip: "CASA volunteers are not DCS employees. They chose to be there for kids. They tend to have more time for you than a caseworker does.",
    tip_es: "Los voluntarios de CASA no son empleados de DCS. Eligieron estar ahí para los jóvenes. Suelen tener más tiempo para ti que un trabajador de casos.",
    teen_tips: {
      "13-15": {
        en: "A CASA volunteer can be someone you see outside of court — a steady adult who's not your caseworker and not related to you.",
        es: "Un voluntario/a CASA puede ser alguien que ves fuera del tribunal — un adulto constante que no es tu trabajador/a de casos ni pariente.",
      },
      "16-17": {
        en: "If your CASA hasn't talked with you about your long-term plan, ask them to. That's what they're there for.",
        es: "Si tu CASA no ha hablado contigo sobre tu plan a largo plazo, pídeselo. Para eso están.",
      },
      "18-21": {
        en: "CASA typically ends when your case closes. If you had one and want to stay in touch, ask — many volunteers stay connected informally.",
        es: "CASA generalmente termina cuando tu caso se cierra. Si tuviste uno/a y quieres mantenerte en contacto, pregunta — muchos voluntarios se mantienen en contacto informalmente.",
      },
    },
  },
  {
    id: "caregiver",
    title: "Foster Parent, Kinship Caregiver, or House Manager",
    title_es: "Padre/madre adoptivo/a, cuidador/a pariente o encargado/a de hogar grupal",
    aka: "Also called: foster family, relative caregiver, group home staff",
    aka_es: "También llamado: familia adoptiva, cuidador pariente, personal de hogar grupal",
    emoji: "🏠",
    color: "#059669",
    role: "The adult(s) responsible for your day-to-day care — in a foster home, kinship home, or group home.",
    role_es: "El/los adulto(s) responsable(s) de tu cuidado diario — en un hogar adoptivo, hogar pariente o hogar grupal.",
    what: "Foster parents and kinship caregivers are licensed or approved by DCS to provide a home. If you live in a group home, a House Manager (also called a house parent or staff) fills that role — they're employed by the group home agency, not DCS. A kinship caregiver is a relative or someone you already knew. None of them are your caseworker, but they're responsible for your safety and daily needs.",
    what_es: "Los padres adoptivos y cuidadores parientes están autorizados por DCS para proveer un hogar. Si vives en un hogar grupal, un encargado/a de hogar (también llamado personal o house parent) cumple ese rol — trabaja para la agencia del hogar grupal, no para DCS. Un cuidador pariente es un familiar o alguien que ya conocías. Ninguno de ellos es tu trabajador/a de casos, pero son responsables de tu seguridad y necesidades diarias.",
    tip: "If you ever feel unsafe where you're living — whether a foster home or group home — tell your caseworker, attorney, or CASA right away. You have the right to be safe.",
    tip_es: "Si alguna vez te sientes inseguro donde vives — ya sea en un hogar adoptivo o grupal — díselo a tu trabajador/a de casos, abogado o CASA de inmediato. Tienes el derecho a estar seguro.",
    teen_tips: {
      "13-15": {
        en: "Your caregiver is responsible for your day-to-day needs. If something basic isn't happening — food, a bed, school transport — tell your caseworker.",
        es: "Tu cuidador/a es responsable de tus necesidades diarias. Si algo básico no está pasando — comida, una cama, transporte a la escuela — dile a tu trabajador/a de casos.",
      },
      "16-17": {
        en: "Caregivers can help you learn adult skills — cooking, banking, driving. Ask. It's a normal teenager thing to expect.",
        es: "Los cuidadores pueden ayudarte a aprender habilidades de adulto — cocinar, banca, manejar. Pide. Es algo normal que un/a adolescente debe esperar.",
      },
      "18-21": {
        en: "If you're staying with a former caregiver in extended care, you're technically a 'young adult in care' — your relationship is different.",
        es: "Si estás con un/a ex-cuidador/a en cuidado extendido, técnicamente eres un/a 'adulto joven en cuidado' — tu relación es diferente.",
      },
    },
  },
  {
    id: "gal",
    title: "Guardian ad Litem (GAL)",
    title_es: "Guardian ad Litem (GAL)",
    aka: "Sometimes the same person as your attorney",
    aka_es: "A veces es la misma persona que tu abogado",
    emoji: "🛡️",
    color: "#7c3aed",
    role: "Someone appointed by the court specifically to represent your best interests.",
    role_es: "Alguien nombrado por el tribunal específicamente para representar tu mejor interés.",
    what: "In some cases the court appoints a GAL who is separate from your attorney. They look at your whole situation — school, health, placement, relationships — and advise the judge. In Arizona, this role is sometimes filled by your attorney or your CASA.",
    what_es: "En algunos casos el tribunal nombra un GAL separado de tu abogado. Revisa toda tu situación — escuela, salud, colocación, relaciones — y aconseja al juez. En Arizona, este rol a veces lo cumple tu abogado o tu CASA.",
    tip: "Ask your attorney or caseworker if you have a GAL and who they are.",
    tip_es: "Pregúntale a tu abogado o trabajador/a de casos si tienes un GAL y quién es.",
    teen_tips: {
      "13-15": {
        en: "A GAL is an attorney who represents your 'best interest' — sometimes different from what you want. Your own attorney is separate.",
        es: "Un GAL es un abogado/a que representa tu 'mejor interés' — a veces diferente de lo que tú quieres. Tu propio/a abogado/a es separado.",
      },
      "16-17": {
        en: "Ask the GAL to explain what 'best interest' means for your specific case. They should be able to tell you clearly.",
        es: "Pídele al GAL que te explique qué significa 'mejor interés' para tu caso específico. Debe poder decírtelo claramente.",
      },
      "18-21": {
        en: "At 18+, you typically have your own attorney directly — the GAL role often ends. Confirm with your attorney.",
        es: "A los 18+, usualmente tienes tu propio/a abogado/a directamente — el rol de GAL a menudo termina. Confirma con tu abogado/a.",
      },
    },
  },
  {
    id: "supervisor",
    title: "DCS Supervisor",
    title_es: "Supervisor/a de DCS",
    aka: "Your caseworker's boss",
    aka_es: "El/la jefe/a de tu trabajador/a de casos",
    emoji: "📞",
    color: "#1B3A5C",
    role: "Your caseworker's boss at the Department of Child Safety (DCS). Who you can talk to if things aren't getting fixed.",
    role_es: "El/la jefe/a de tu trabajador/a de casos en el Departamento de Seguridad Infantil (DCS). Con quien puedes hablar si las cosas no se están resolviendo.",
    what: "If you've raised a concern with your caseworker and nothing is changing, ask to speak with their supervisor. Keep a written record of when you asked and what was said — dates matter.",
    what_es: "Si has planteado una preocupación con tu trabajador/a de casos y nada está cambiando, pide hablar con su supervisor/a. Guarda un registro escrito de cuándo preguntaste y qué dijeron — las fechas importan.",
    tip: "Asking to escalate is normal and OK. The system is designed for it. You won't get in trouble for asking.",
    tip_es: "Pedir escalar es normal y está bien. El sistema está diseñado para ello. No te meterás en problemas por preguntar.",
    teen_tips: {
      "13-15": {
        en: "A supervisor is your caseworker's boss. If something isn't being handled, this is who you call next.",
        es: "Un supervisor/a es el jefe/a de tu trabajador/a de casos. Si algo no se está manejando, es a quien llamas después.",
      },
      "16-17": {
        en: "Write things down before calling a supervisor. Dates, what you asked for, what happened. It helps everyone.",
        es: "Escribe las cosas antes de llamar a un supervisor/a. Fechas, lo que pediste, lo que pasó. Ayuda a todos.",
      },
      "18-21": {
        en: "If you disagree with a supervisor's decision, the next step is the DCS Ombudsman. Your attorney can help you file.",
        es: "Si no estás de acuerdo con la decisión de un supervisor/a, el siguiente paso es el Defensor/a del Pueblo de DCS. Tu abogado/a puede ayudarte a presentar el caso.",
      },
    },
  },
];

// ─────────────────────────────────────────────────────────────────────────
// Teen case stages — shown on /case for ageBand != "10-12"
// ─────────────────────────────────────────────────────────────────────────

export type TeenColorTheme = "emerald" | "indigo" | "blue" | "rose" | "amber" | "cyan" | "slate";

export interface CaseStageTeen {
  id: string;
  title:    { en: string; es: string };
  subtitle: { en: string; es: string };
  color:    TeenColorTheme;
  what:     { en: string; es: string };
  teen:     Record<"13-15" | "16-17" | "18-21", { en: string; es: string }>;
  insight:  Record<"13-15" | "16-17" | "18-21", { en: string; es: string }>;
  next:     { en: string; es: string };
}

export const CASE_STAGES_TEEN: CaseStageTeen[] = [
  {
    id: "prelim",
    title:    { en: "First Safety Hearing", es: "Primera Audiencia de Seguridad" },
    subtitle: { en: "Preliminary Protective Hearing", es: "Audiencia Protectora Preliminar" },
    color:    "emerald",
    what: {
      en: "The judge checks if you're safe and decides what happens right away — usually within just a few days of coming into care.",
      es: "El juez verifica si estás seguro/a y decide qué pasa de inmediato — generalmente a los pocos días de entrar al cuidado.",
    },
    teen: {
      "13-15": {
        en: "This hearing moves fast. Your lawyer's main job is to make sure you end up in the safest, least restrictive place possible.",
        es: "Esta audiencia se mueve rápido. El trabajo principal de tu abogado/a es asegurarse de que termines en el lugar más seguro y menos restrictivo posible.",
      },
      "16-17": {
        en: "This is often a fast-paced hearing. Your lawyer's primary job is to ensure you are in the safest, least restrictive placement possible.",
        es: "A menudo es una audiencia rápida. El trabajo principal de tu abogado/a es asegurar que estés en la colocación más segura y menos restrictiva posible.",
      },
      "18-21": {
        en: "If you're coming back into care as a young adult, this hearing sets your extended care placement. Know your options before it starts.",
        es: "Si regresas al cuidado como adulto joven, esta audiencia establece tu colocación en cuidado extendido. Conoce tus opciones antes de que empiece.",
      },
    },
    insight: {
      "13-15": {
        en: "Before it starts, tell your lawyer where you'd like to live. A relative, a friend's family, someone you already know — your preference matters.",
        es: "Antes de que empiece, dile a tu abogado/a dónde te gustaría vivir. Un pariente, la familia de un amigo, alguien que ya conoces — tu preferencia importa.",
      },
      "16-17": {
        en: "Before it starts, tell your lawyer exactly where you want to live. Even if it's with a relative or a friend's family, they need to advocate for your preference.",
        es: "Antes de que empiece, dile a tu abogado/a exactamente dónde quieres vivir. Incluso si es con un pariente o la familia de un amigo, necesitan abogar por tu preferencia.",
      },
      "18-21": {
        en: "Ask about Independent Living Services up front — they exist and you're eligible. Don't wait for someone to bring it up.",
        es: "Pregunta por los Servicios de Vida Independiente desde el principio — existen y eres elegible. No esperes a que alguien lo mencione.",
      },
    },
    next: {
      en: "Dates for the next hearings are set.",
      es: "Se fijan las fechas de las próximas audiencias.",
    },
  },
  {
    id: "adjudication",
    title:    { en: "The Facts Hearing", es: "La Audiencia de Hechos" },
    subtitle: { en: "Adjudication", es: "Adjudicación" },
    color:    "indigo",
    what: {
      en: "The court decides if the concerns in your case are proven and whether the state (DCS) needs to stay involved.",
      es: "El tribunal decide si las preocupaciones en tu caso están probadas y si el estado (DCS) necesita seguir involucrado.",
    },
    teen: {
      "13-15": {
        en: "If the judge decides your case is 'dependent,' the court stays in charge of decisions about where you live and what help you get.",
        es: "Si el juez decide que tu caso es 'dependiente,' el tribunal sigue a cargo de las decisiones sobre dónde vives y qué ayuda recibes.",
      },
      "16-17": {
        en: "This is a critical legal milestone. If the judge 'adjudicates' you dependent, the court gains authority over where you live and what services you receive.",
        es: "Este es un hito legal crítico. Si el juez te 'adjudica' dependiente, el tribunal gana autoridad sobre dónde vives y qué servicios recibes.",
      },
      "18-21": {
        en: "If you voluntarily entered extended care, there's no adjudication — but reviews of your plan still happen. This stage looks different for you.",
        es: "Si entraste voluntariamente al cuidado extendido, no hay adjudicación — pero las revisiones de tu plan aún ocurren. Esta etapa se ve diferente para ti.",
      },
    },
    insight: {
      "13-15": {
        en: "Ask your lawyer: 'What does this mean for my school?' and 'Will I be able to see my siblings?' Those are legal questions they can answer.",
        es: "Pregúntale a tu abogado/a: '¿Qué significa esto para mi escuela?' y '¿Podré ver a mis hermanos/as?' Son preguntas legales que pueden responder.",
      },
      "16-17": {
        en: "Ask your lawyer: 'How does this decision affect my school stability and my right to work?' If you're 16+, your education plan should be a priority.",
        es: "Pregúntale a tu abogado/a: '¿Cómo afecta esta decisión mi estabilidad escolar y mi derecho a trabajar?' Si tienes 16+, tu plan educativo debe ser prioridad.",
      },
      "18-21": {
        en: "Ask about your Educational and Training Voucher (ETV) eligibility now. The deadline to apply each year is real.",
        es: "Pregunta sobre tu elegibilidad para el Vale Educativo y de Capacitación (ETV) ahora. La fecha límite anual para aplicar es real.",
      },
    },
    next: {
      en: "Your case plan and services get reviewed and updated.",
      es: "Tu plan de caso y servicios se revisan y actualizan.",
    },
  },
  {
    id: "review",
    title:    { en: "The Check-In Hearing", es: "La Audiencia de Seguimiento" },
    subtitle: { en: "Review Hearing", es: "Audiencia de Revisión" },
    color:    "blue",
    what: {
      en: "The judge checks in on how your plan is going, how your family is doing, and what needs to change.",
      es: "El juez revisa cómo va tu plan, cómo está tu familia, y qué necesita cambiar.",
    },
    teen: {
      "13-15": {
        en: "These hearings happen a few times a year. They're where the judge gets a current picture of your life — school, home, health.",
        es: "Estas audiencias pasan varias veces al año. Es donde el juez obtiene una imagen actual de tu vida — escuela, hogar, salud.",
      },
      "16-17": {
        en: "As a teen, these are your best opportunities to update the judge on your progress toward independence.",
        es: "Como adolescente, estas son tus mejores oportunidades para actualizar al juez sobre tu progreso hacia la independencia.",
      },
      "18-21": {
        en: "Reviews in extended care focus on whether services are actually working. Bring specific examples — good and bad.",
        es: "Las revisiones en cuidado extendido se centran en si los servicios realmente funcionan. Trae ejemplos específicos — buenos y malos.",
      },
    },
    insight: {
      "13-15": {
        en: "Bring 1 or 2 specific updates: something going well (a class, a friendship) and something that isn't (a missed appointment, a tough placement). Real stuff is useful.",
        es: "Trae 1 o 2 actualizaciones específicas: algo que va bien (una clase, una amistad) y algo que no (una cita perdida, una colocación difícil). Lo real es útil.",
      },
      "16-17": {
        en: "Come with 1–2 specific updates: what's working (like a job or a school club) and what isn't (like needing more driver's ed). Documenting these makes them real for the court.",
        es: "Llega con 1–2 actualizaciones específicas: qué funciona (como un trabajo o un club escolar) y qué no (como necesitar más clases de manejo). Documentar esto lo hace real para el tribunal.",
      },
      "18-21": {
        en: "If a service provider isn't showing up or a skill you need isn't being taught, say so on the record. The judge can order changes.",
        es: "Si un proveedor de servicios no aparece o una habilidad que necesitas no se está enseñando, dilo en el registro. El juez puede ordenar cambios.",
      },
    },
    next: {
      en: "More check-ins are scheduled, or you move toward a long-term plan.",
      es: "Se programan más seguimientos, o avanzas hacia un plan a largo plazo.",
    },
  },
  {
    id: "permanency",
    title:    { en: "Long-Term Plan Hearing", es: "Audiencia del Plan a Largo Plazo" },
    subtitle: { en: "Permanency Hearing", es: "Audiencia de Permanencia" },
    color:    "rose",
    what: {
      en: "The judge discusses the long-term plan for your future — like going home, guardianship, or transitioning to adulthood.",
      es: "El juez discute el plan a largo plazo para tu futuro — como regresar a casa, tutela, o la transición a la adultez.",
    },
    teen: {
      "13-15": {
        en: "This hearing asks the question: what's the permanent plan? Going home, a relative taking guardianship, adoption, or another long-term path.",
        es: "Esta audiencia pregunta: ¿cuál es el plan permanente? Regresar a casa, un pariente tomando tutela, adopción, u otro camino a largo plazo.",
      },
      "16-17": {
        en: "For older youth, this hearing is essentially your 'launch plan.' It's where the court formalizes what happens when you turn 18.",
        es: "Para jóvenes mayores, esta audiencia es esencialmente tu 'plan de lanzamiento.' Es donde el tribunal formaliza qué pasa cuando cumples 18.",
      },
      "18-21": {
        en: "This is where extended care is set up, renewed, or closed. Know which of these is on the agenda before you walk in.",
        es: "Aquí es donde el cuidado extendido se establece, se renueva, o se cierra. Sabe cuál de estos está en la agenda antes de entrar.",
      },
    },
    insight: {
      "13-15": {
        en: "Tell your lawyer what kind of home you want long-term — even if it feels early. Having that on the record matters for years.",
        es: "Dile a tu abogado/a qué tipo de hogar quieres a largo plazo — aunque se sienta temprano. Tenerlo en el registro importa por años.",
      },
      "16-17": {
        en: "Arizona law requires a transition plan for all youth 16 and older. If your hearing doesn't mention 'Independent Living' or 'Extended Care' options, remind your attorney to bring it up.",
        es: "La ley de Arizona requiere un plan de transición para todos los jóvenes de 16 años o más. Si tu audiencia no menciona 'Vida Independiente' o 'Cuidado Extendido,' recuérdale a tu abogado/a que lo mencione.",
      },
      "18-21": {
        en: "Once you sign into extended care, you can sign out anytime. You can also come back in (once) before 21. Know your options.",
        es: "Una vez que firmas para entrar al cuidado extendido, puedes firmar para salir en cualquier momento. También puedes regresar (una vez) antes de los 21. Conoce tus opciones.",
      },
    },
    next: {
      en: "Everyone takes final steps toward your long-term plan.",
      es: "Todos toman los pasos finales hacia tu plan a largo plazo.",
    },
  },
];

// ─────────────────────────────────────────────────────────────────────────
// Teen case FAQs
// ─────────────────────────────────────────────────────────────────────────

export interface CaseFAQTeen {
  q: { en: string; es: string };
  a: { en: string; es: string };
}

export const CASE_FAQS_TEEN: CaseFAQTeen[] = [
  {
    q: {
      en: "Do I have to go to court?",
      es: "¿Tengo que ir a la corte?",
    },
    a: {
      en: "Usually yes — but your lawyer will tell you what to expect ahead of time. You won't be alone. Your lawyer goes with you, and being present is the best way to ensure your 'best interests' match your actual wishes.",
      es: "Usualmente sí — pero tu abogado/a te dirá qué esperar con anticipación. No estarás solo/a. Tu abogado/a va contigo, y estar presente es la mejor manera de asegurar que tus 'mejores intereses' coincidan con tus deseos reales.",
    },
  },
  {
    q: {
      en: "Can I talk to the judge?",
      es: "¿Puedo hablar con el juez?",
    },
    a: {
      en: "Yes. You can speak up at hearings through your lawyer, or ask to speak directly to the judge. Most judges want to hear from you — it helps them make better decisions about your life.",
      es: "Sí. Puedes hablar en las audiencias a través de tu abogado/a, o pedir hablar directamente con el juez. La mayoría de los jueces quieren escucharte — les ayuda a tomar mejores decisiones sobre tu vida.",
    },
  },
  {
    q: {
      en: "What if I don't understand what's happening?",
      es: "¿Qué pasa si no entiendo lo que está pasando?",
    },
    a: {
      en: "Stop and ask your lawyer to explain it — that's literally their job. You should understand every decision being made in your case. 'What does that mean?' is a fine question any time.",
      es: "Detente y pídele a tu abogado/a que te explique — literalmente ese es su trabajo. Debes entender cada decisión que se toma en tu caso. '¿Qué significa eso?' es una pregunta buena en cualquier momento.",
    },
  },
  {
    q: {
      en: "How many hearings will there be?",
      es: "¿Cuántas audiencias habrá?",
    },
    a: {
      en: "Every case is different. Some end in a few months, others take years. Your lawyer can give you a realistic timeline for your specific case and what triggers the next hearing.",
      es: "Cada caso es diferente. Algunos terminan en unos meses, otros toman años. Tu abogado/a puede darte un cronograma realista para tu caso específico y qué activa la siguiente audiencia.",
    },
  },
];
