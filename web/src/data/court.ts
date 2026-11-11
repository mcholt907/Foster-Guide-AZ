// Court stages and "who is in your case" content.
//
// Wording rules for this file:
// - Plain words, 6th-grade reading level, speak to "you".
// - "caseworker" in English, "trabajador/a de casos" in Spanish.
// - Foster care is "cuidado de crianza" in Spanish (never "adoptivo").
// - A lawyer speaks for what the youth WANTS. A guardian ad litem (GAL) tells
//   the judge what they think is BEST. A youth may have one or both
//   (A.R.S. §8-221). Never promise that everything a youth says stays private.

export const COURT_STAGES = [
  {
    id: "prelim",
    title: "First safety hearing (Preliminary Protective Hearing)",
    title_es: "Primera audiencia de seguridad (Audiencia Preliminar de Protección)",
    what: "The judge checks if you're safe and decides where you stay for now — usually within a few days.",
    what_es: "El juez revisa si estás a salvo y decide dónde te quedas por ahora — generalmente en unos pocos días.",
    youth: "Before it starts, tell your lawyer what you want the judge to hear.",
    youth_es: "Antes de que comience, dile a tu abogado/a lo que quieres que el juez escuche.",
    next: "Dates for the next hearings are set.",
    next_es: "Se fijan las fechas de las próximas audiencias.",
  },
  {
    id: "adjudication",
    title: "Facts hearing (Adjudication)",
    title_es: "Audiencia de hechos (Adjudicación)",
    what: "The judge decides if the worries in your case are true and whether the case keeps going.",
    what_es: "El juez decide si las preocupaciones en tu caso son ciertas y si el caso continúa.",
    youth: `Ask your lawyer: "What does this mean for where I live and my school?"`,
    youth_es: "Pregúntale a tu abogado/a: «¿Qué significa esto para dónde vivo y mi escuela?»",
    next: "The judge decides on a plan for your case.",
    next_es: "El juez decide un plan para tu caso.",
  },
  {
    id: "disposition",
    title: "Plan hearing (Disposition)",
    title_es: "Audiencia del plan (Disposición)",
    what: "The judge decides where you will live for now and what the case plan is. This can happen the same day as the facts hearing.",
    what_es: "El juez decide dónde vivirás por ahora y cuál es el plan de caso. Puede pasar el mismo día que la audiencia de hechos.",
    youth: "Ask for a copy of your case plan. Ask your lawyer to explain it in plain words.",
    youth_es: "Pide una copia de tu plan de caso. Pídele a tu abogado/a que te lo explique en palabras sencillas.",
    next: "Check-in hearings start.",
    next_es: "Empiezan las audiencias de seguimiento.",
  },
  {
    id: "review",
    title: "Check‑in hearing (Review Hearing)",
    title_es: "Audiencia de seguimiento (Audiencia de Revisión)",
    what: "The judge checks in on how your plan is going and what needs to change. This happens at least every six months.",
    what_es: "El juez revisa cómo va tu plan y qué necesita cambiar. Esto pasa al menos cada seis meses.",
    youth: "Come with 1 or 2 things you want people to know: what's working and what isn't.",
    youth_es: "Ven con 1 o 2 cosas que quieres que la gente sepa: qué está funcionando y qué no.",
    next: "More check-ins are set, or you move toward a long-term plan hearing.",
    next_es: "Se programan más seguimientos, o avanzas hacia una audiencia de plan a largo plazo.",
  },
  {
    id: "permanency",
    title: "Long‑term plan hearing (Permanency Hearing)",
    title_es: "Audiencia de plan a largo plazo (Audiencia de Permanencia)",
    what: "The judge talks about the long-term plan for you — like going home, living with a guardian, or adoption.",
    what_es: "El juez habla del plan a largo plazo para ti — como regresar a casa, vivir con un tutor o la adopción.",
    youth: "Ask your lawyer to walk you through each choice in plain words. You get to say what you want.",
    youth_es: "Pídele a tu abogado/a que te explique cada opción en palabras sencillas. Puedes decir lo que quieres.",
    next: "Everyone takes steps toward the long-term plan.",
    next_es: "Todos dan pasos hacia el plan a largo plazo.",
  },
  {
    id: "severance",
    title: "If a parent's rights end (Termination of Parental Rights, or \"severance\")",
    title_es: "Si terminan los derechos de un padre o madre (Terminación de la Patria Potestad)",
    what: "In some cases, the judge is asked to decide if a parent's legal rights should end. This is the judge's decision. It is not your fault. Many cases never get to this step.",
    what_es: "En algunos casos, se le pide al juez que decida si los derechos legales de un padre o madre deben terminar. Es decisión del juez. No es tu culpa. Muchos casos nunca llegan a este paso.",
    youth: `Ask your lawyer: "Is this happening in my case? What does it mean for me?"`,
    youth_es: "Pregúntale a tu abogado/a: «¿Esto está pasando en mi caso? ¿Qué significa para mí?»",
    next: "The team works on a lasting home for you, like adoption or living with a guardian.",
    next_es: "El equipo trabaja en un hogar duradero para ti, como la adopción o vivir con un tutor.",
  },
];

export const WHO_IN_YOUR_CASE = [
  {
    id: "caseworker",
    title: "Your Caseworker",
    title_es: "Tu trabajador/a de casos",
    aka: "Also called: DCS case manager, DCS specialist",
    aka_es: "También se le dice: administrador/a de casos de DCS, especialista de DCS",
    emoji: "👤",
    color: "#2A7F8E",
    role: "Your main contact at the Department of Child Safety (DCS).",
    role_es: "Tu contacto principal en el Departamento de Seguridad Infantil (DCS).",
    what: "Your caseworker handles your case day to day. They write your case plan, set up visits, and connect you to help. They are supposed to see you in person at least once a month.",
    what_es: "Tu trabajador/a de casos maneja tu caso día a día. Escribe tu plan de caso, organiza visitas y te conecta con ayuda. Debe verte en persona al menos una vez al mes.",
    tip: "Keep their number saved. If something feels wrong or isn't getting done, call them. If you are in danger right now, call 911 first.",
    tip_es: "Guarda su número. Si algo se siente mal o no se está haciendo, llámale. Si estás en peligro ahora mismo, llama primero al 911.",
    teen_tips: {
      "13-15": {
        en: "Starting at age 14, you get to help write your case plan. You can also pick up to two people you trust to be on your planning team. Ask your caseworker how.",
        es: "Desde los 14 años, puedes ayudar a escribir tu plan de caso. También puedes elegir hasta dos personas de confianza para estar en tu equipo de planificación. Pregúntale a tu trabajador/a de casos cómo.",
      },
      "16-17": {
        en: "You should already be helping write your case plan — that starts at 14. Ask your caseworker, in writing, to see the part about getting ready for adult life. Before you turn 18, you should also get a plan just for your move to adulthood.",
        es: "Ya deberías estar ayudando a escribir tu plan de caso — eso empieza a los 14. Pídele a tu trabajador/a de casos, por escrito, ver la parte sobre prepararte para la vida adulta. Antes de cumplir 18, también deberías recibir un plan solo para tu paso a la vida adulta.",
      },
      "18-21": {
        en: "Even if you left care at 18, you can ask DCS about coming back before you turn 21. Keep a caseworker's number where you can find it.",
        es: "Aunque hayas salido del cuidado a los 18, puedes preguntarle a DCS sobre regresar antes de cumplir 21. Guarda el número de un/a trabajador/a de casos donde lo puedas encontrar.",
      },
    },
  },
  {
    id: "judge",
    title: "The Judge",
    title_es: "El/La juez",
    aka: "Also called: juvenile court judge",
    aka_es: "También se le dice: juez del tribunal de menores",
    emoji: "⚖️",
    color: "#1B3A5C",
    role: "Makes the big decisions about your case — like where you live.",
    role_es: "Toma las grandes decisiones sobre tu caso — como dónde vives.",
    what: "The judge is in charge of your court case. The judge listens to everyone, looks at your case plan, and decides at each hearing. You have a voice here — the judge wants to know what you think.",
    what_es: "El juez está a cargo de tu caso en el tribunal. Escucha a todos, revisa tu plan de caso y decide en cada audiencia. Tienes voz aquí — el juez quiere saber lo que piensas.",
    tip: "You can ask your lawyer to help you talk to the judge — in court, or sometimes in a smaller room with the lawyers there.",
    tip_es: "Puedes pedirle a tu abogado/a que te ayude a hablar con el juez — en la sala del tribunal, o a veces en un cuarto más pequeño con los abogados presentes.",
    teen_tips: {
      "13-15": {
        en: "It's not weird to speak up. Ask your lawyer to help you talk to the judge — in court, or sometimes in a smaller room with the lawyers there. You can also write the judge a letter and give it to your lawyer.",
        es: "No es raro hablar. Pídele a tu abogado/a que te ayude a hablar con el juez — en la sala del tribunal, o a veces en un cuarto más pequeño con los abogados presentes. También puedes escribirle una carta al juez y dársela a tu abogado/a.",
      },
      "16-17": {
        en: "Judges pay close attention to what older youth say. Come to hearings with clear asks — about school, where you live, or seeing your brothers and sisters.",
        es: "Los jueces ponen mucha atención a lo que dicen los jóvenes mayores. Llega a las audiencias con peticiones claras — sobre la escuela, dónde vives o ver a tus hermanos y hermanas.",
      },
      "18-21": {
        en: "In extended foster care, your plan still gets checked about every six months. If something isn't working, say so at your review or tell your caseworker.",
        es: "En el cuidado de crianza extendido, tu plan se sigue revisando más o menos cada seis meses. Si algo no funciona, dilo en tu revisión o díselo a tu trabajador/a de casos.",
      },
    },
  },
  {
    id: "attorney",
    title: "Your Lawyer",
    title_es: "Tu abogado/a",
    aka: "Also called: your attorney",
    aka_es: "También se le dice: tu licenciado/a",
    emoji: "📋",
    color: "#D97706",
    role: "A lawyer the court picks for you. They do not work for DCS, your parents, or your foster family.",
    role_es: "Un/a abogado/a que el tribunal elige para ti. No trabaja para DCS, ni para tus padres, ni para tu familia de crianza.",
    what: "Arizona law says every child in a foster care court case gets a lawyer. Your lawyer goes to court, explains what is going on, and tells the judge what you want. Some youth also have a guardian ad litem (GAL). A GAL tells the judge what they think is best for you — which may not be the same as what you want. You may have a lawyer, a GAL, or both.",
    what_es: "La ley de Arizona dice que cada niño, niña o joven en un caso de cuidado de crianza recibe un/a abogado/a. Tu abogado/a va al tribunal, te explica lo que está pasando y le dice al juez lo que tú quieres. Algunos jóvenes también tienen un tutor ad litem (GAL). Un GAL le dice al juez lo que cree que es mejor para ti — que puede no ser lo mismo que tú quieres. Puedes tener un/a abogado/a, un GAL o los dos.",
    tip: "Ask: \"Are you my lawyer or my GAL? Do you tell the judge what I want, or what you think is best?\" Also ask them what they keep private. If you don't know who your lawyer is, ask your caseworker.",
    tip_es: "Pregunta: «¿Eres mi abogado/a o mi GAL? ¿Le dices al juez lo que yo quiero, o lo que tú crees que es mejor?» También pregúntale qué mantiene en privado. Si no sabes quién es tu abogado/a, pregúntale a tu trabajador/a de casos.",
    teen_tips: {
      "13-15": {
        en: "Ask: \"Are you my lawyer or my GAL? Do you tell the judge what I want, or what you think is best?\" Ask what they keep private, too. If you don't know who your lawyer is, your caseworker can tell you.",
        es: "Pregunta: «¿Eres mi abogado/a o mi GAL? ¿Le dices al juez lo que yo quiero, o lo que tú crees que es mejor?» También pregunta qué mantiene en privado. Si no sabes quién es tu abogado/a, tu trabajador/a de casos te lo puede decir.",
      },
      "16-17": {
        en: "Ask: \"Are you my lawyer or my GAL? Do you tell the judge what I want, or what you think is best?\" And ask your lawyer to explain any court paper before you sign or agree to it.",
        es: "Pregunta: «¿Eres mi abogado/a o mi GAL? ¿Le dices al juez lo que yo quiero, o lo que tú crees que es mejor?» Y pídele a tu abogado/a que te explique cualquier papel del tribunal antes de firmar o aceptar algo.",
      },
      "18-21": {
        en: "Before you turn 18, ask your lawyer: \"Will you still be my lawyer after I'm 18? If not, who do I call with legal questions?\"",
        es: "Antes de cumplir 18, pregúntale a tu abogado/a: «¿Vas a seguir siendo mi abogado/a después de que cumpla 18? Si no, ¿a quién llamo con preguntas legales?»",
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
    role: "A trained volunteer from the community who gets to know you and tells the judge what they think is best for you.",
    role_es: "Un/a voluntario/a de la comunidad, con capacitación, que te conoce y le dice al juez lo que cree que es mejor para ti.",
    what: "A CASA volunteer has one job: get to know you and tell the judge what they think you need. They visit you, learn about your case, and write a report for the judge. Not every case has a CASA. If you don't have one, you can ask your caseworker or lawyer to ask for one.",
    what_es: "Un/a voluntario/a CASA tiene un solo trabajo: conocerte y decirle al juez lo que cree que necesitas. Te visita, aprende sobre tu caso y escribe un informe para el juez. No todos los casos tienen un CASA. Si no tienes uno, puedes pedirle a tu trabajador/a de casos o a tu abogado/a que solicite uno.",
    tip: "CASA volunteers do not work for DCS. They chose to be there for youth. A CASA shares what they learn with the judge, so ask them what they keep private.",
    tip_es: "Los voluntarios CASA no trabajan para DCS. Eligieron estar ahí para los jóvenes. Un CASA comparte con el juez lo que aprende, así que pregúntale qué mantiene en privado.",
    teen_tips: {
      "13-15": {
        en: "A CASA volunteer can be someone you see outside of court — a steady adult who is not your caseworker and not related to you.",
        es: "Un/a voluntario/a CASA puede ser alguien que ves fuera del tribunal — un adulto constante que no es tu trabajador/a de casos ni tu pariente.",
      },
      "16-17": {
        en: "If your CASA hasn't talked with you about your long-term plan, ask them to. They can bring what you say to the judge.",
        es: "Si tu CASA no ha hablado contigo sobre tu plan a largo plazo, pídeselo. Puede llevarle al juez lo que tú dices.",
      },
      "18-21": {
        en: "A CASA usually ends when your court case closes. If you want to stay in touch, ask — some volunteers do.",
        es: "Un CASA generalmente termina cuando se cierra tu caso en el tribunal. Si quieres seguir en contacto, pregunta — algunos voluntarios lo hacen.",
      },
    },
  },
  {
    id: "caregiver",
    title: "Foster Parent, Kinship Caregiver, or House Manager",
    title_es: "Padre o madre de crianza, cuidador/a pariente o encargado/a de hogar grupal",
    aka: "Also called: foster family, relative caregiver, group home staff",
    aka_es: "También se le dice: familia de crianza, cuidador/a pariente, personal del hogar grupal",
    emoji: "🏠",
    color: "#059669",
    role: "The adult or adults who take care of you every day — in a foster home, a relative's home, or a group home.",
    role_es: "El adulto o los adultos que te cuidan cada día — en un hogar de crianza, en casa de un pariente o en un hogar grupal.",
    what: "Foster parents and kinship caregivers are approved by DCS to give you a home. A kinship caregiver is a relative or someone you already knew. If you live in a group home, a house manager or staff does this job. They work for the group home, not for DCS. None of them is your caseworker, but they are in charge of keeping you safe and meeting your daily needs.",
    what_es: "Los padres de crianza y los cuidadores parientes están aprobados por DCS para darte un hogar. Un cuidador pariente es un familiar o alguien que ya conocías. Si vives en un hogar grupal, un/a encargado/a o el personal hace este trabajo. Trabajan para el hogar grupal, no para DCS. Ninguno de ellos es tu trabajador/a de casos, pero están a cargo de mantenerte a salvo y de tus necesidades diarias.",
    tip: "If you are in danger right now, call 911. To report abuse any time, day or night, call 1-888-SOS-CHILD (1-888-767-2445). If you don't feel safe where you live, also tell your caseworker, lawyer, or CASA. You have the right to be safe.",
    tip_es: "Si estás en peligro ahora mismo, llama al 911. Para reportar abuso a cualquier hora, de día o de noche, llama al 1-888-SOS-CHILD (1-888-767-2445). Si no te sientes a salvo donde vives, díselo también a tu trabajador/a de casos, abogado/a o CASA. Tienes derecho a estar a salvo.",
    teen_tips: {
      "13-15": {
        en: "Your caregiver takes care of your daily needs — food, a bed, getting to school. If something basic is missing, tell your caseworker. If you are not safe, call 911 or 1-888-767-2445.",
        es: "Tu cuidador/a se encarga de tus necesidades diarias — comida, una cama, llegar a la escuela. Si falta algo básico, díselo a tu trabajador/a de casos. Si no estás a salvo, llama al 911 o al 1-888-767-2445.",
      },
      "16-17": {
        en: "Caregivers can help you learn adult skills — cooking, using a bank, driving. It's okay to ask. If you are not safe where you live, call 911 or 1-888-767-2445.",
        es: "Los cuidadores pueden ayudarte a aprender habilidades de adulto — cocinar, usar un banco, manejar. Está bien pedirlo. Si no estás a salvo donde vives, llama al 911 o al 1-888-767-2445.",
      },
      "18-21": {
        en: "In extended foster care, you are an adult. Talk with your caregiver about house rules and what you each expect from the other.",
        es: "En el cuidado de crianza extendido, eres adulto/a. Habla con tu cuidador/a sobre las reglas de la casa y lo que cada quien espera del otro.",
      },
    },
  },
  {
    id: "gal",
    title: "Guardian ad Litem (GAL)",
    title_es: "Tutor ad litem (GAL)",
    aka: "Not every case has one",
    aka_es: "No todos los casos tienen uno",
    emoji: "🛡️",
    color: "#7c3aed",
    role: "A person the court picks to tell the judge what they think is best for you.",
    role_es: "Una persona que el tribunal elige para decirle al juez lo que cree que es mejor para ti.",
    what: "A GAL looks at your whole life — school, health, where you live, the people you care about. Then they tell the judge what they think is best for you. That is not always the same as what you want. A GAL is different from a lawyer who speaks for what you want. Some youth have a lawyer, some have a GAL, and some have both.",
    what_es: "Un GAL mira toda tu vida — escuela, salud, dónde vives, las personas que te importan. Luego le dice al juez lo que cree que es mejor para ti. Eso no siempre es lo mismo que tú quieres. Un GAL es diferente de un/a abogado/a que habla por lo que tú quieres. Algunos jóvenes tienen abogado/a, algunos tienen un GAL y algunos tienen los dos.",
    tip: "Ask: \"Are you my lawyer or my GAL? Do you tell the judge what I want, or what you think is best?\" A GAL may share what you say with the judge, so ask them what they keep private.",
    tip_es: "Pregunta: «¿Eres mi abogado/a o mi GAL? ¿Le dices al juez lo que yo quiero, o lo que tú crees que es mejor?» Un GAL puede compartir con el juez lo que le dices, así que pregúntale qué mantiene en privado.",
    teen_tips: {
      "13-15": {
        en: "A GAL tells the judge what they think is best for you. If you want something different, say so — to your GAL, to your lawyer if you have one, or to the judge. Ask your GAL what they keep private.",
        es: "Un GAL le dice al juez lo que cree que es mejor para ti. Si tú quieres algo diferente, dilo — a tu GAL, a tu abogado/a si tienes, o al juez. Pregúntale a tu GAL qué mantiene en privado.",
      },
      "16-17": {
        en: "Ask your GAL: \"What are you going to tell the judge is best for me, and why?\" If you don't agree, tell them — and tell your lawyer or the judge what you want.",
        es: "Pregúntale a tu GAL: «¿Qué le vas a decir al juez que es mejor para mí, y por qué?» Si no estás de acuerdo, díselo — y dile a tu abogado/a o al juez lo que tú quieres.",
      },
      "18-21": {
        en: "Things change after 18. Ask your lawyer or caseworker if you still have a GAL, and who speaks for you now.",
        es: "Las cosas cambian después de los 18. Pregúntale a tu abogado/a o a tu trabajador/a de casos si todavía tienes un GAL y quién habla por ti ahora.",
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
    role: "Your caseworker's boss at DCS. The person to talk to if things aren't getting fixed.",
    role_es: "El/la jefe/a de tu trabajador/a de casos en DCS. La persona con quien hablar si las cosas no se arreglan.",
    what: "If you told your caseworker about a problem and nothing is changing, ask to talk to their supervisor. Write down when you asked and what was said. Dates help.",
    what_es: "Si le contaste un problema a tu trabajador/a de casos y nada cambia, pide hablar con su supervisor/a. Anota cuándo preguntaste y qué te dijeron. Las fechas ayudan.",
    tip: "Asking for the supervisor is normal and okay. You will not get in trouble for asking.",
    tip_es: "Pedir hablar con el/la supervisor/a es normal y está bien. No te meterás en problemas por pedirlo.",
    teen_tips: {
      "13-15": {
        en: "A supervisor is your caseworker's boss. If a problem isn't getting fixed, this is who you ask for next. You won't get in trouble for asking.",
        es: "Un/a supervisor/a es el/la jefe/a de tu trabajador/a de casos. Si un problema no se arregla, es a quien pides después. No te meterás en problemas por pedirlo.",
      },
      "16-17": {
        en: "Write things down before you call a supervisor: dates, what you asked for, and what happened. It helps everyone.",
        es: "Anota las cosas antes de llamar a un/a supervisor/a: fechas, lo que pediste y lo que pasó. Ayuda a todos.",
      },
      "18-21": {
        en: "If you don't agree with what a supervisor decides, you can contact the DCS Ombudsman's office. Your lawyer or an adult you trust can help.",
        es: "Si no estás de acuerdo con lo que decide un/a supervisor/a, puedes contactar a la oficina del Ombudsman (defensor) de DCS. Tu abogado/a o un adulto de confianza puede ayudarte.",
      },
    },
  },
];

// ─────────────────────────────────────────────────────────────────────────
// Teen case stages — shown on /case for ageBand != "10-12"
// ─────────────────────────────────────────────────────────────────────────

export type TeenColorTheme = "emerald" | "indigo" | "blue" | "rose" | "amber" | "cyan" | "slate";

type TeenBand = "13-15" | "16-17" | "18-21";

export interface CaseStageTeen {
  id: string;
  title:    { en: string; es: string };
  subtitle: { en: string; es: string };
  color:    TeenColorTheme;
  /** True for stages that only happen in some cases (shown without a stage number). */
  sometimes?: boolean;
  what:     { en: string; es: string };
  teen:     Record<TeenBand, { en: string; es: string }>;
  insight:  Record<TeenBand, { en: string; es: string }>;
  next:     { en: string; es: string };
}

export const CASE_STAGES_TEEN: CaseStageTeen[] = [
  {
    id: "prelim",
    title:    { en: "First Safety Hearing", es: "Primera Audiencia de Seguridad" },
    subtitle: { en: "Preliminary Protective Hearing", es: "Audiencia Preliminar de Protección" },
    color:    "emerald",
    what: {
      en: "The judge checks if you're safe and decides where you stay for now. This happens fast — usually within a few days of coming into care.",
      es: "El juez revisa si estás a salvo y decide dónde te quedas por ahora. Esto pasa rápido — generalmente a los pocos días de entrar al cuidado.",
    },
    teen: {
      "13-15": {
        en: "This hearing moves fast. The goal is a safe place that feels as much like a home as it can — with family or people you know, when that is safe.",
        es: "Esta audiencia va rápido. La meta es un lugar seguro que se sienta lo más parecido posible a un hogar — con familia o personas que conoces, cuando eso es seguro.",
      },
      "16-17": {
        en: "This hearing moves fast. The goal is a safe place that feels as much like a home as it can — with family or people you know, when that is safe. Your lawyer can tell the judge where you want to be.",
        es: "Esta audiencia va rápido. La meta es un lugar seguro que se sienta lo más parecido posible a un hogar — con familia o personas que conoces, cuando eso es seguro. Tu abogado/a puede decirle al juez dónde quieres estar.",
      },
      "18-21": {
        en: "This hearing happens when a child first comes into care. If you are 18 or older and signing up for extended foster care, you most likely won't have this hearing — you sign an agreement with DCS instead. Ask your caseworker how it works for you.",
        es: "Esta audiencia pasa cuando un niño o joven entra al cuidado por primera vez. Si tienes 18 años o más y te estás inscribiendo en el cuidado de crianza extendido, lo más probable es que no tengas esta audiencia — en su lugar firmas un acuerdo con DCS. Pregúntale a tu trabajador/a de casos cómo funciona para ti.",
      },
    },
    insight: {
      "13-15": {
        en: "Before it starts, tell your lawyer where you'd like to live. A relative, a friend's family, someone you already know — what you want matters.",
        es: "Antes de que empiece, dile a tu abogado/a dónde te gustaría vivir. Un pariente, la familia de un amigo, alguien que ya conoces — lo que tú quieres importa.",
      },
      "16-17": {
        en: "Before it starts, tell your lawyer where you want to live — a relative, a friend's family, someone you know. Your lawyer can tell the judge what you want.",
        es: "Antes de que empiece, dile a tu abogado/a dónde quieres vivir — un pariente, la familia de un amigo, alguien que conoces. Tu abogado/a puede decirle al juez lo que quieres.",
      },
      "18-21": {
        en: "Ask early about help for young adults — like help with housing, money for living costs, and life-skills support. Ask your caseworker what you can get.",
        es: "Pregunta pronto por la ayuda para adultos jóvenes — como ayuda con vivienda, dinero para gastos de vida y apoyo con habilidades para la vida. Pregúntale a tu trabajador/a de casos qué puedes recibir.",
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
      en: "The judge decides if the worries in your case are true and if DCS needs to stay involved.",
      es: "El juez decide si las preocupaciones en tu caso son ciertas y si DCS necesita seguir involucrado.",
    },
    teen: {
      "13-15": {
        en: "If the judge finds the worries are true, the judge says you are \"dependent.\" That means the court helps decide where you live and what help you get. It is not a punishment, and it is not about anything you did.",
        es: "Si el juez encuentra que las preocupaciones son ciertas, dice que eres «dependiente». Eso significa que el tribunal ayuda a decidir dónde vives y qué ayuda recibes. No es un castigo y no es por nada que tú hiciste.",
      },
      "16-17": {
        en: "This is a big step. If the judge finds the worries are true, the judge says you are \"dependent.\" That means the court helps decide where you live and what help you get. It is not a punishment, and it is not about anything you did.",
        es: "Este es un paso grande. Si el juez encuentra que las preocupaciones son ciertas, dice que eres «dependiente». Eso significa que el tribunal ayuda a decidir dónde vives y qué ayuda recibes. No es un castigo y no es por nada que tú hiciste.",
      },
      "18-21": {
        en: "Extended foster care is your choice. It is an agreement between you and DCS, so this hearing is usually not part of it. Your plan still gets checked about every six months. Ask your lawyer or caseworker what applies to you.",
        es: "El cuidado de crianza extendido es tu decisión. Es un acuerdo entre tú y DCS, así que esta audiencia generalmente no es parte de eso. Tu plan se sigue revisando más o menos cada seis meses. Pregúntale a tu abogado/a o a tu trabajador/a de casos qué aplica para ti.",
      },
    },
    insight: {
      "13-15": {
        en: "Ask your lawyer: \"What does this mean for my school?\" and \"Will I get to see my brothers and sisters?\"",
        es: "Pregúntale a tu abogado/a: «¿Qué significa esto para mi escuela?» y «¿Podré ver a mis hermanos y hermanas?»",
      },
      "16-17": {
        en: "Ask your lawyer: \"How does this change my school, my job, and seeing my brothers and sisters?\"",
        es: "Pregúntale a tu abogado/a: «¿Cómo cambia esto mi escuela, mi trabajo y ver a mis hermanos y hermanas?»",
      },
      "18-21": {
        en: "Ask now about the Education and Training Voucher (ETV) — money for college or job training. Ask when to apply so you don't miss it.",
        es: "Pregunta ahora por el Vale de Educación y Capacitación (ETV) — dinero para la universidad o capacitación para el trabajo. Pregunta cuándo solicitarlo para no perderlo.",
      },
    },
    next: {
      en: "The judge decides on a plan for your case.",
      es: "El juez decide un plan para tu caso.",
    },
  },
  {
    id: "disposition",
    title:    { en: "The Plan Hearing", es: "La Audiencia del Plan" },
    subtitle: { en: "Disposition", es: "Disposición" },
    color:    "amber",
    what: {
      en: "After the facts hearing — sometimes the same day — the judge decides what happens next: where you will live for now, and what the case plan is. The case plan lists what your parents, DCS, and others need to do.",
      es: "Después de la audiencia de hechos — a veces el mismo día — el juez decide qué sigue: dónde vivirás por ahora y cuál es el plan de caso. El plan de caso dice lo que tus padres, DCS y otras personas necesitan hacer.",
    },
    teen: {
      "13-15": {
        en: "This is where your case plan starts. Starting at age 14, you get to help write it. You can also pick up to two people you trust to be on your planning team.",
        es: "Aquí empieza tu plan de caso. Desde los 14 años, puedes ayudar a escribirlo. También puedes elegir hasta dos personas de confianza para estar en tu equipo de planificación.",
      },
      "16-17": {
        en: "You help write your case plan — that starts at age 14. Your plan should have a part about getting ready for adult life: school, work, money, and a place to live.",
        es: "Tú ayudas a escribir tu plan de caso — eso empieza a los 14 años. Tu plan debe tener una parte sobre prepararte para la vida adulta: escuela, trabajo, dinero y un lugar donde vivir.",
      },
      "18-21": {
        en: "In extended foster care, you make your plan with your caseworker. It should be about your goals — school, work, and a place to live.",
        es: "En el cuidado de crianza extendido, haces tu plan con tu trabajador/a de casos. Debe tratarse de tus metas — escuela, trabajo y un lugar donde vivir.",
      },
    },
    insight: {
      "13-15": {
        en: "Ask for a copy of your case plan. Ask your lawyer to explain it in plain words.",
        es: "Pide una copia de tu plan de caso. Pídele a tu abogado/a que te lo explique en palabras sencillas.",
      },
      "16-17": {
        en: "Ask: \"What is the goal of my case plan right now?\" Going home is usually the first goal. Ask what happens if that changes.",
        es: "Pregunta: «¿Cuál es la meta de mi plan de caso ahora?» Regresar a casa suele ser la primera meta. Pregunta qué pasa si eso cambia.",
      },
      "18-21": {
        en: "Ask to see your plan in writing. If something in it doesn't fit your life, say so.",
        es: "Pide ver tu plan por escrito. Si algo en el plan no va con tu vida, dilo.",
      },
    },
    next: {
      en: "Check-in hearings start. The judge looks at your case at least every six months.",
      es: "Empiezan las audiencias de seguimiento. El juez revisa tu caso al menos cada seis meses.",
    },
  },
  {
    id: "review",
    title:    { en: "The Check-In Hearing", es: "La Audiencia de Seguimiento" },
    subtitle: { en: "Review Hearing", es: "Audiencia de Revisión" },
    color:    "blue",
    what: {
      en: "The judge checks in on how your plan is going, how your family is doing, and what needs to change.",
      es: "El juez revisa cómo va tu plan, cómo está tu familia y qué necesita cambiar.",
    },
    teen: {
      "13-15": {
        en: "These hearings happen at least every six months. They are how the judge learns what your life is like right now — school, home, health.",
        es: "Estas audiencias pasan al menos cada seis meses. Así el juez se entera de cómo es tu vida ahora — escuela, hogar, salud.",
      },
      "16-17": {
        en: "These hearings happen at least every six months. They are a good time to tell the judge how you are getting ready for adult life, and what help you still need.",
        es: "Estas audiencias pasan al menos cada seis meses. Son un buen momento para decirle al juez cómo te estás preparando para la vida adulta y qué ayuda te falta.",
      },
      "18-21": {
        en: "In extended foster care, reviews look at whether the help you get is really working. Bring real examples — good and bad.",
        es: "En el cuidado de crianza extendido, las revisiones ven si la ayuda que recibes de verdad funciona. Trae ejemplos reales — buenos y malos.",
      },
    },
    insight: {
      "13-15": {
        en: "Bring 1 or 2 real updates: something going well (a class, a friend) and something that isn't (a missed appointment, a hard time at home).",
        es: "Trae 1 o 2 novedades reales: algo que va bien (una clase, una amistad) y algo que no (una cita perdida, un momento difícil en casa).",
      },
      "16-17": {
        en: "Bring 1 or 2 real updates: what's working (like a job or a school club) and what isn't (like needing driver's ed). Writing them down helps you remember.",
        es: "Trae 1 o 2 novedades reales: qué funciona (como un trabajo o un club de la escuela) y qué no (como necesitar clases de manejo). Anotarlas te ayuda a recordar.",
      },
      "18-21": {
        en: "If someone who is supposed to help you isn't showing up, or you're not learning a skill you need, say so at your review. Ask what can change.",
        es: "Si alguien que debe ayudarte no se presenta, o no estás aprendiendo una habilidad que necesitas, dilo en tu revisión. Pregunta qué puede cambiar.",
      },
    },
    next: {
      en: "More check-ins are set, or you move toward a long-term plan.",
      es: "Se programan más seguimientos, o avanzas hacia un plan a largo plazo.",
    },
  },
  {
    id: "permanency",
    title:    { en: "Long-Term Plan Hearing", es: "Audiencia del Plan a Largo Plazo" },
    subtitle: { en: "Permanency Hearing", es: "Audiencia de Permanencia" },
    color:    "cyan",
    what: {
      en: "The judge talks about the long-term plan for you — like going home, living with a guardian, adoption, or getting ready to be an adult.",
      es: "El juez habla del plan a largo plazo para ti — como regresar a casa, vivir con un tutor, la adopción o prepararte para ser adulto/a.",
    },
    teen: {
      "13-15": {
        en: "This hearing asks: what is the lasting plan? Going home, a relative becoming your guardian, adoption, or another long-term path.",
        es: "Esta audiencia pregunta: ¿cuál es el plan duradero? Regresar a casa, que un pariente sea tu tutor, la adopción u otro camino a largo plazo.",
      },
      "16-17": {
        en: "For older youth, this hearing is also about life after 18: where you will live, school, work, and whether you want to stay in extended foster care.",
        es: "Para jóvenes mayores, esta audiencia también trata de la vida después de los 18: dónde vivirás, escuela, trabajo y si quieres quedarte en el cuidado de crianza extendido.",
      },
      "18-21": {
        en: "If you are close to 18 or older, make sure everyone knows your plan: staying in extended foster care, or moving out on your own with support.",
        es: "Si estás cerca de los 18 o eres mayor, asegúrate de que todos sepan tu plan: quedarte en el cuidado de crianza extendido o vivir por tu cuenta con apoyo.",
      },
    },
    insight: {
      "13-15": {
        en: "Tell your lawyer what kind of home you want long-term — even if it feels early. It helps the judge to know.",
        es: "Dile a tu abogado/a qué tipo de hogar quieres a largo plazo — aunque se sienta temprano. Le ayuda al juez saberlo.",
      },
      "16-17": {
        en: "Youth 14 and older help write their case plan, and it should cover getting ready for adult life. If no one talks about life after 18 at your hearing, ask your lawyer to bring it up.",
        es: "Los jóvenes de 14 años o más ayudan a escribir su plan de caso, y debe incluir prepararse para la vida adulta. Si nadie habla de la vida después de los 18 en tu audiencia, pídele a tu abogado/a que lo mencione.",
      },
      "18-21": {
        en: "Extended foster care is your choice. You can leave, and you can ask to come back before you turn 21. Ask your caseworker how it works.",
        es: "El cuidado de crianza extendido es tu decisión. Puedes salir, y puedes pedir regresar antes de cumplir 21. Pregúntale a tu trabajador/a de casos cómo funciona.",
      },
    },
    next: {
      en: "Everyone works on the long-term plan. There may be more hearings along the way.",
      es: "Todos trabajan en el plan a largo plazo. Puede haber más audiencias en el camino.",
    },
  },
  {
    id: "severance",
    title:    { en: "If a Parent's Rights End", es: "Si Terminan los Derechos de un Padre o Madre" },
    subtitle: { en: "Termination of parental rights (\"severance\")", es: "Terminación de la patria potestad" },
    color:    "slate",
    sometimes: true,
    what: {
      en: "In some cases, the judge is asked to decide if a parent's legal rights should end. People may call this \"severance.\" If it happens, that parent no longer makes legal decisions for you, and you could be adopted. Many cases never get to this step.",
      es: "En algunos casos, se le pide al juez que decida si los derechos legales de un padre o madre deben terminar. Si pasa, ese padre o madre ya no toma decisiones legales por ti, y podrías ser adoptado/a. Muchos casos nunca llegan a este paso.",
    },
    teen: {
      "13-15": {
        en: "This is the judge's decision. It is not your fault, and it is not because of anything you said or did. It's okay to feel sad, angry, relieved, or all of these at once.",
        es: "Esta es una decisión del juez. No es tu culpa, y no es por nada que dijiste o hiciste. Está bien sentir tristeza, enojo, alivio o todo al mismo tiempo.",
      },
      "16-17": {
        en: "This is the judge's decision. It is not your fault, and it is not because of anything you said or did. You can tell your lawyer how you feel about it. In Arizona, youth 12 and older usually have to agree before they can be adopted.",
        es: "Esta es una decisión del juez. No es tu culpa, y no es por nada que dijiste o hiciste. Puedes decirle a tu abogado/a cómo te sientes. En Arizona, los jóvenes de 12 años o más generalmente tienen que estar de acuerdo antes de ser adoptados.",
      },
      "18-21": {
        en: "If this happened in your case when you were younger, it was the judge's decision. It was not your fault. If you still have questions about it, you can ask your lawyer or caseworker.",
        es: "Si esto pasó en tu caso cuando eras más joven, fue decisión del juez. No fue tu culpa. Si todavía tienes preguntas, puedes hacérselas a tu abogado/a o a tu trabajador/a de casos.",
      },
    },
    insight: {
      "13-15": {
        en: "Ask your lawyer: \"Is this happening in my case? What does it mean for seeing my brothers, sisters, and other family?\" You can also talk with your caseworker, CASA, or a counselor.",
        es: "Pregúntale a tu abogado/a: «¿Esto está pasando en mi caso? ¿Qué significa para ver a mis hermanos, hermanas y otros familiares?» También puedes hablar con tu trabajador/a de casos, CASA o un/a consejero/a.",
      },
      "16-17": {
        en: "Ask your lawyer: \"Is this happening in my case? What does it mean for seeing my brothers, sisters, and other family?\" You can also talk with your caseworker, CASA, or a counselor.",
        es: "Pregúntale a tu abogado/a: «¿Esto está pasando en mi caso? ¿Qué significa para ver a mis hermanos, hermanas y otros familiares?» También puedes hablar con tu trabajador/a de casos, CASA o un/a consejero/a.",
      },
      "18-21": {
        en: "As an adult, you decide who is in your life. If you want help with this, talk with a counselor or an adult you trust.",
        es: "Como adulto/a, tú decides quién está en tu vida. Si quieres ayuda con esto, habla con un/a consejero/a o un adulto de confianza.",
      },
    },
    next: {
      en: "The judge decides. Then your team works on a lasting home for you, like adoption or living with a guardian.",
      es: "El juez decide. Luego tu equipo trabaja en un hogar duradero para ti, como la adopción o vivir con un tutor.",
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
      en: "Most youth go, and it helps the judge hear what you want. Your lawyer will tell you what to expect ahead of time, and you won't be alone. If going feels too hard, tell your lawyer — there may be other ways to share what you think.",
      es: "La mayoría de los jóvenes van, y eso ayuda a que el juez escuche lo que quieres. Tu abogado/a te dirá qué esperar antes, y no estarás solo/a. Si ir se siente muy difícil, díselo a tu abogado/a — puede haber otras formas de compartir lo que piensas.",
    },
  },
  {
    q: {
      en: "Can I talk to the judge?",
      es: "¿Puedo hablar con el juez?",
    },
    a: {
      en: "Yes. You can ask your lawyer to help you talk to the judge — in court, or sometimes in a smaller room with the lawyers there. Most judges want to hear from you.",
      es: "Sí. Puedes pedirle a tu abogado/a que te ayude a hablar con el juez — en la sala del tribunal, o a veces en un cuarto más pequeño con los abogados presentes. La mayoría de los jueces quieren escucharte.",
    },
  },
  {
    q: {
      en: "Is my lawyer the same as a guardian ad litem (GAL)?",
      es: "¿Mi abogado/a es lo mismo que un tutor ad litem (GAL)?",
    },
    a: {
      en: "Not always. A lawyer tells the judge what you want. A GAL tells the judge what they think is best for you. You may have one or both. Ask: \"Are you my lawyer or my GAL? Do you tell the judge what I want, or what you think is best?\" Ask them what they keep private, too.",
      es: "No siempre. Un/a abogado/a le dice al juez lo que tú quieres. Un GAL le dice al juez lo que cree que es mejor para ti. Puedes tener uno o los dos. Pregunta: «¿Eres mi abogado/a o mi GAL? ¿Le dices al juez lo que yo quiero, o lo que tú crees que es mejor?» También pregúntale qué mantiene en privado.",
    },
  },
  {
    q: {
      en: "What if I don't understand what's happening?",
      es: "¿Qué pasa si no entiendo lo que está pasando?",
    },
    a: {
      en: "Stop and ask your lawyer to explain. That is their job. \"What does that mean?\" is a good question any time.",
      es: "Detente y pídele a tu abogado/a que te explique. Ese es su trabajo. «¿Qué significa eso?» es una buena pregunta en cualquier momento.",
    },
  },
  {
    q: {
      en: "How many hearings will there be?",
      es: "¿Cuántas audiencias habrá?",
    },
    a: {
      en: "Every case is different. Some end in a few months. Others take years. Ask your lawyer what is likely in your case and when the next hearing is.",
      es: "Cada caso es diferente. Algunos terminan en unos meses. Otros toman años. Pregúntale a tu abogado/a qué es probable en tu caso y cuándo es la próxima audiencia.",
    },
  },
];
