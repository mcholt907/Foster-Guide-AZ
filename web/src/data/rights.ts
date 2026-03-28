import type { AgeBandKey } from "../lib/prefs";

export type RightTier = {
  plain: string;
  plain_es: string;
  example: string;
  example_es: string;
  howToAsk: string;
  howToAsk_es: string;
  ifIgnored: string;
  ifIgnored_es: string;
};

export type Right = {
  id: string;
  title: string;
  title_es: string;
  citation: string;
  tiers: Record<AgeBandKey, RightTier>;
};

export const RIGHTS: Right[] = [
  {
    id: "participate",
    title: "Having a Say in Your Case",
    title_es: "Tener voz en tu caso",
    citation: "A.R.S. §8-529(A)(18)",
    tiers: {
      "10-12": {
        plain: "The adults in your case are supposed to listen to what you need and what matters to you. Your voice counts.",
        plain_es: "Los adultos en tu caso deben escuchar lo que necesitas y lo que es importante para ti. Tu voz importa.",
        example: "You can tell your caseworker what helps you feel safe — at home, at school, wherever.",
        example_es: "Puedes decirle a tu trabajador de casos lo que te ayuda a sentirte seguro — en casa, en la escuela, donde sea.",
        howToAsk: "Before your next meeting, make a list of the things that matter most to you. You can hand it to your caseworker or ask a trusted adult to help you share it.",
        howToAsk_es: "Antes de tu próxima reunión, haz una lista de las cosas que más te importan. Puedes dársela a tu trabajador de casos o pedirle a un adulto de confianza que te ayude a compartirla.",
        ifIgnored: "Tell your lawyer that your wishes weren't listened to. Your lawyer has to speak up for you at the next hearing — that's their job.",
        ifIgnored_es: "Dile a tu abogado que no escucharon tus deseos. Tu abogado tiene que defender lo que quieres en la próxima audiencia — ese es su trabajo.",
      },
      "13-15": {
        plain: "You can be part of making your case plan and share what you want — things like school, visits, and where you live.",
        plain_es: "Puedes participar en la creación de tu plan de caso y compartir lo que quieres — cosas como la escuela, las visitas y dónde vives.",
        example: "Before a hearing, write down 3 things you want your attorney to say to the judge for you.",
        example_es: "Antes de una audiencia, escribe 3 cosas que quieres que tu abogado le diga al juez.",
        howToAsk: "Write down 3 things you want your attorney to say to the judge and give them the list before the hearing. They are required to share your wishes.",
        howToAsk_es: "Escribe 3 cosas que quieres que tu abogado le diga al juez y dáselas antes de la audiencia. Están obligados a compartir tus deseos.",
        ifIgnored: "Tell your attorney directly. They are required to advocate for what you want. If they aren't doing that, you can ask to have a different attorney assigned.",
        ifIgnored_es: "Díselo directamente a tu abogado. Están obligados a defender lo que quieres. Si no lo hacen, puedes pedir que te asignen otro abogado.",
      },
      "16-17": {
        plain: "You have a right to participate in planning your future — including questions about permanency and what happens after 18.",
        plain_es: "Tienes el derecho de participar en la planificación de tu futuro — incluyendo preguntas sobre permanencia y qué pasa después de los 18.",
        example: `Check out the hearing prep questions in the "My Case" tab to get ready.`,
        example_es: "Revisa las preguntas de preparación para la audiencia en la pestaña 'Mi Caso' para prepararte.",
        howToAsk: `Ask your attorney: "Can I speak at my next hearing or submit a written statement?" Both are options you have the right to use.`,
        howToAsk_es: "Pregúntale a tu abogado: '¿Puedo hablar en mi próxima audiencia o presentar una declaración escrita?' Ambas son opciones que tienes el derecho de usar.",
        ifIgnored: "Ask your attorney to file an objection. You can also contact the DCS Ombudsman if you believe your voice is being systematically excluded from planning.",
        ifIgnored_es: "Pídele a tu abogado que presente una objeción. También puedes contactar al DCS Ombudsman si crees que tu voz está siendo excluida sistemáticamente de la planificación.",
      },
      "18-21": {
        plain: "Your plan in extended care should actually reflect your goals — school, work, housing. If it doesn't, you can ask for it to be updated.",
        plain_es: "Tu plan en el cuidado extendido debe reflejar realmente tus metas — escuela, trabajo, vivienda. Si no es así, puedes pedir que se actualice.",
        example: "Ask for a written summary of what was agreed to and what the next steps are.",
        example_es: "Pide un resumen escrito de lo que se acordó y cuáles son los próximos pasos.",
        howToAsk: "Request a copy of your current case plan and ask for a meeting to update it with your actual goals. Put the request in writing so there's a record.",
        howToAsk_es: "Solicita una copia de tu plan de caso actual y pide una reunión para actualizarlo con tus metas reales. Haz la solicitud por escrito para que quede un registro.",
        ifIgnored: "Contact your attorney or the DCS Ombudsman. In extended care, your participation in planning is not optional — it's required by law.",
        ifIgnored_es: "Comunícate con tu abogado o el DCS Ombudsman. En el cuidado extendido, tu participación en la planificación no es opcional — es requerida por ley.",
      },
    },
  },
  {
    id: "privacy",
    title: "Your Privacy & Communication",
    title_es: "Tu privacidad y comunicación",
    citation: "A.R.S. §8-529 (privacy provisions)",
    tiers: {
      "10-12": {
        plain: "You have the right to talk with your caseworker privately — without other people listening in.",
        plain_es: "Tienes el derecho de hablar con tu trabajador de casos en privado — sin que otras personas escuchen.",
        example: `You can say: "Can I talk with my caseworker alone for a minute?"`,
        example_es: "Puedes decir: '¿Puedo hablar con mi trabajador de casos a solas un momento?'",
        howToAsk: `Say: "I'd like to talk to my caseworker alone." A trusted adult or teacher can help you ask if you need it.`,
        howToAsk_es: "Di: 'Quisiera hablar con mi trabajador de casos a solas.' Un adulto de confianza o un maestro puede ayudarte a pedirlo si lo necesitas.",
        ifIgnored: "Tell your lawyer or a trusted adult what happened. Private conversations with your caseworker and lawyer are your right, not a privilege.",
        ifIgnored_es: "Dile a tu abogado o a un adulto de confianza lo que pasó. Las conversaciones privadas con tu trabajador de casos y tu abogado son tu derecho, no un privilegio.",
      },
      "13-15": {
        plain: "You can ask to speak privately with your caseworker and your attorney. You don't have to talk in front of others if you don't want to.",
        plain_es: "Puedes pedir hablar en privado con tu trabajador de casos y tu abogado. No tienes que hablar frente a otros si no quieres.",
        example: `If you don't feel comfortable speaking freely, ask: "Can we find a private time and place to talk?"`,
        example_es: "Si no te sientes cómodo hablando libremente, pregunta: '¿Podemos encontrar un momento y lugar privado para hablar?'",
        howToAsk: `Say: "Can we find a private time and place to talk?" You can also ask your attorney to schedule a private call directly with you.`,
        howToAsk_es: "Di: '¿Podemos encontrar un momento y lugar privado para hablar?' También puedes pedirle a tu abogado que programe una llamada privada directamente contigo.",
        ifIgnored: "Tell your attorney. Private communication with your lawyer is protected by law — even if others disagree or push back.",
        ifIgnored_es: "Díselo a tu abogado. La comunicación privada con tu abogado está protegida por ley — aunque otros no estén de acuerdo o se opongan.",
      },
      "16-17": {
        plain: "You have the right to private calls and meetings with your attorney and caseworker. If someone keeps blocking that, you can push back.",
        plain_es: "Tienes el derecho a llamadas y reuniones privadas con tu abogado y trabajador de casos. Si alguien sigue bloqueando eso, puedes defenderte.",
        example: "If it keeps getting blocked, follow the steps in the escalation ladder below.",
        example_es: "Si sigue siendo bloqueado, sigue los pasos en la escalera de escalada que aparece abajo.",
        howToAsk: "Request private meeting times in writing (text or email) so you have a record. Ask your attorney to call you directly, not through a third party.",
        howToAsk_es: "Solicita tiempos de reunión privados por escrito (texto o correo electrónico) para tener un registro. Pídele a tu abogado que te llame directamente, no a través de un tercero.",
        ifIgnored: "This is a right, not a favor. Escalate to the caseworker's supervisor, then to the DCS Ombudsman if it keeps being blocked.",
        ifIgnored_es: "Este es un derecho, no un favor. Escala al supervisor del trabajador de casos, luego al DCS Ombudsman si sigue siendo bloqueado.",
      },
      "18-21": {
        plain: "You can ask for privacy in your communications and ask who has access to your information — that's a fair question.",
        plain_es: "Puedes pedir privacidad en tus comunicaciones y preguntar quién tiene acceso a tu información — esa es una pregunta justa.",
        example: "If you're in extended care, ask which provider or coach is responsible for your case.",
        example_es: "Si estás en cuidado extendido, pregunta qué proveedor o entrenador es responsable de tu caso.",
        howToAsk: "Ask who has access to your records and request that sensitive communications come directly to you, not through a third party.",
        howToAsk_es: "Pregunta quién tiene acceso a tus registros y solicita que las comunicaciones confidenciales lleguen directamente a ti, no a través de un tercero.",
        ifIgnored: "Contact your attorney. Privacy rights don't end at 18. In extended care, you still control your own information.",
        ifIgnored_es: "Comunícate con tu abogado. Los derechos de privacidad no terminan a los 18. En el cuidado extendido, tú controlas tu propia información.",
      },
    },
  },
  {
    id: "siblings",
    title: "Seeing Your Brothers & Sisters",
    title_es: "Ver a tus hermanos y hermanas",
    citation: "A.R.S. §8-529(A)(4)",
    tiers: {
      "10-12": {
        plain: "You can usually visit and talk with your brothers and sisters. The adults in your case should help make that happen.",
        plain_es: "Por lo general puedes visitar y hablar con tus hermanos y hermanas. Los adultos en tu caso deben ayudar a que eso suceda.",
        example: `If you haven't been able to see your sibling, you can ask your caseworker: "Why not, and when can I?"`,
        example_es: "Si no estás con tus hermanos, puedes preguntarle a tu trabajador de casos: '¿Cuándo puedo ver a mis hermanos?'",
        howToAsk: `Ask your caseworker: "When can I see my brother or sister? Who makes that happen?" If you need help asking, a teacher or trusted adult can ask for you.`,
        howToAsk_es: "Di: 'Extraño a mis hermanos y quiero visitarlos.' Tu trabajador de casos debe organizar visitas regulares. Si puedes, escríbelo también.",
        ifIgnored: "Tell your lawyer that you haven't been able to see your sibling. They can ask the judge to help at the next hearing.",
        ifIgnored_es: "Dile a tu abogado que no se están organizando las visitas. Tu abogado puede pedirle al juez que ordene las visitas.",
      },
      "13-15": {
        plain: "You have a right to stay in contact with your siblings — unless a judge has decided it isn't safe. That's the rule, and you can ask about it.",
        plain_es: "Tienes el derecho a ver regularmente a tus hermanos, aunque estén en distintos hogares de cuidado. DCS debe ayudar a organizar las visitas.",
        example: `Ask your caseworker: "When is my next sibling visit, and who sets it up?"`,
        example_es: "Pide visitas programadas para que sean consistentes y no dependan solo de que alguien se acuerde.",
        howToAsk: `Ask for a date, not just a promise: "When is my next sibling visit, and who sets it up?" Keep a record of what they say.`,
        howToAsk_es: "Dile a tu trabajador de casos: 'Quiero visitas regulares con mis hermanos — ¿podemos programarlas?' Pide que se pongan por escrito en tu plan de caso.",
        ifIgnored: "Tell your attorney you haven't had contact. They can raise it at the next hearing. DCS must show a reason for restricting sibling visits — the burden is not on you.",
        ifIgnored_es: "Díselo a tu abogado. Las visitas entre hermanos están protegidas legalmente. Tu abogado puede solicitar una orden del tribunal si DCS no las organiza.",
      },
      "16-17": {
        plain: "You have a right to sibling contact. If it isn't happening, you can ask for a clear reason and a plan to fix it — and you deserve a real answer.",
        plain_es: "Tienes el derecho a mantener el contacto con tus hermanos. Si las visitas se bloquean sin una razón válida, eso puede ser una violación de tus derechos.",
        example: "If your caseworker doesn't follow through, you can ask to speak with their supervisor.",
        example_es: "Lleva un registro de cuándo se negaron o cancelaron las visitas — esa documentación importa.",
        howToAsk: "Ask for a written schedule of visits. If contact is being restricted, you have a right to know the specific reason in writing.",
        howToAsk_es: "Solicita visitas programadas por escrito y pide que se incluyan en tu plan de caso. Si se rechazan, pide una explicación por escrito también.",
        ifIgnored: "Ask your attorney to request a court order. A judge can order sibling visits if DCS isn't following through on its own.",
        ifIgnored_es: "Contacta a tu abogado de inmediato. Las visitas entre hermanos son un derecho legal. Tu abogado puede llevar esto al juez.",
      },
      "18-21": {
        plain: "Even in extended care, you can advocate for staying connected with your family and siblings. That matters, and it can be part of your plan.",
        plain_es: "Incluso en el cuidado extendido, mantener el contacto con tus hermanos importa. Si DCS no está apoyando eso, puedes defender tu derecho.",
        example: "Write down your requests with dates so you have a record if you need to follow up.",
        example_es: "Si ya saliste del sistema pero tienes hermanos que todavía están en él, contacta a ALWAYS o Fostering Advocates AZ para orientación.",
        howToAsk: "Ask your case manager to write sibling connection into your transition plan — not just as a note, but as an action item with a timeline.",
        howToAsk_es: "Comunícate directamente con tus hermanos si puedes, y pide a tu trabajador de casos apoyo para las visitas o transporte si lo necesitas.",
        ifIgnored: "Contact your attorney or Fostering Advocates AZ. Sibling rights don't expire at 18, and a lawyer can help you enforce them.",
        ifIgnored_es: "Contacta a ALWAYS (1-855-ALWAYS-1) o Fostering Advocates AZ para ayuda legal. Los derechos de contacto entre hermanos no desaparecen cuando cumples 18.",
      },
    },
  },
];

export const ESCALATION_STEPS = [
  {
    step: 1,
    who: "Your Caseworker",
    who_es: "Tu trabajador/a de casos",
    what: "Raise your concern directly and give them a chance to fix it.",
    what_es: "Plantea tu preocupación directamente y dale la oportunidad de resolverlo.",
  },
  {
    step: 2,
    who: "Caseworker's Supervisor",
    who_es: "Supervisor/a del trabajador de casos",
    what: "If your caseworker isn't responding, ask to speak with their supervisor.",
    what_es: "Si tu trabajador/a de casos no responde, pide hablar con su supervisor/a.",
  },
  {
    step: 3,
    who: "DCS Ombudsman",
    who_es: "Defensor del Pueblo de DCS",
    what: "Call 1-877-527-7250. They're independent and handle complaints about DCS.",
    what_es: "Llama al 1-877-527-7250. Son independientes y manejan quejas sobre DCS.",
  },
  {
    step: 4,
    who: "Your Attorney / Court",
    who_es: "Tu abogado/a / Tribunal",
    what: "Your attorney can raise violations at your next hearing, or file a motion.",
    what_es: "Tu abogado/a puede plantear violaciones en tu próxima audiencia o presentar una moción.",
  },
];
