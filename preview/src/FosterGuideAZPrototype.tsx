import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Home as HomeIcon,
  Shield,
  Gavel,
  MapPin,
  HeartPulse,
  MessageCircle,
  X,
  Search,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  Phone,
  Globe,
  ExternalLink,
  GraduationCap,
  FileText,
  Users,
  Calendar,
  ArrowRight,
  ChevronLeft,
} from "lucide-react";

/**
 * FosterGuide AZ — lightweight click-through prototype
 * - No backend
 * - No PII
 * - "AI chat" is a scripted simulator for storytelling
 * - Local-only personalization (language, age band, county, tribal indicator)
 */

const COUNTIES = [
  "Apache",
  "Cochise",
  "Coconino",
  "Gila",
  "Graham",
  "Greenlee",
  "La Paz",
  "Maricopa",
  "Mohave",
  "Navajo",
  "Pima",
  "Pinal",
  "Santa Cruz",
  "Yavapai",
  "Yuma",
];

const AGE_BANDS = [
  { id: "10-12", label: "10–12" },
  { id: "13-15", label: "13–15" },
  { id: "16-17", label: "16–17" },
  { id: "18-21", label: "18–21" },
];

const PATHWAYS = [
  { id: "understand", label: "I'm new to foster care. Explain it." },
  { id: "rights", label: "I want to know my rights" },
  { id: "court", label: "I have court soon and I'm nervous" },
  { id: "future", label: "I'm getting close to 18 and need a plan" },
  { id: "resources", label: "I need help (housing, school, health, money)" },
  { id: "wellness", label: "I'm stressed and need support" },
  { id: "explore", label: "I just want to look around" },
];

const DEMO_PERSONAS = [
  {
    id: "maria",
    name: "Maria, 11",
    blurb: "Wants to understand what's happening and see her brother.",
    preset: {
      language: "en",
      ageBand: "10-12",
      county: "Maricopa",
      tribal: false,
      pathway: "understand",
    },
  },
  {
    id: "jaylen",
    name: "Jaylen, 14",
    blurb: "Has a permanency hearing and wants plain-language court help.",
    preset: {
      language: "en",
      ageBand: "13-15",
      county: "Maricopa",
      tribal: false,
      pathway: "court",
    },
  },
  {
    id: "destiny",
    name: "Destiny, 17",
    blurb: "Navajo Nation, turning 18, needs EFC/ETV and ICWA-aware guidance.",
    preset: {
      language: "en",
      ageBand: "16-17",
      county: "Coconino",
      tribal: true,
      pathway: "future",
    },
  },
  {
    id: "andre",
    name: "Andre, 19",
    blurb: "Housing instability — wants re-entry info and document steps.",
    preset: {
      language: "en",
      ageBand: "18-21",
      county: "Pima",
      tribal: false,
      pathway: "resources",
    },
  },
];

const CRISIS_PINS = [
  {
    name: "988 Suicide & Crisis Lifeline",
    how: "Call or text 988",
    url: "https://988lifeline.org/",
  },
  {
    name: "Crisis Text Line",
    how: "Text HOME to 741741",
    url: "https://www.crisistextline.org/",
  },
  {
    name: "AZ DCS Child Abuse Hotline",
    how: "1-888-SOS-CHILD",
    url: "https://dcs.az.gov/about/contact",
  },
  {
    name: "ALWAYS (legal help)",
    how: "Youth legal services (AZ)",
    url: "https://alwaysaz.org/",
  },
];

const RESOURCES = [
  {
    id: "always",
    name: "ALWAYS",
    categories: ["legal"],
    counties: ["Statewide"],
    ages: [10, 21],
    spanish: true,
    phone: "(602) 442-7230",
    url: "https://alwaysaz.org/",
    description:
      "Youth legal services and advocacy; helps kids navigate dependency court and rights.",
  },
  {
    id: "211",
    name: "211 Arizona",
    categories: ["emergency", "housing", "food"],
    counties: ["Statewide"],
    ages: [10, 99],
    spanish: true,
    phone: "2-1-1",
    url: "https://211arizona.org/",
    description:
      "Human navigators for food, shelter, help paying bills, and more. Great fallback when unsure.",
  },
  {
    id: "yati",
    name: "AHCCCS — YATI (Young Adults Transitional Insurance)",
    categories: ["health"],
    counties: ["Statewide"],
    ages: [18, 26],
    spanish: true,
    phone: "(602) 417-4000",
    url: "https://www.azahcccs.gov/Members/GetCovered/Categories/YATI.html",
    description:
      "Health coverage pathway for eligible young adults formerly in foster care.",
  },
  {
    id: "azca",
    name: "Arizona's Children Association (AzCA) — Transition supports",
    categories: ["housing", "transition"],
    counties: ["Maricopa", "Pima", "Pinal", "Coconino", "Statewide"],
    ages: [16, 21],
    spanish: true,
    phone: "(480) 247-1413",
    url: "https://www.arizonaschildren.org/",
    description:
      "Transition-to-adulthood supports; includes re-entry pathways in some programs (availability varies).",
  },
  {
    id: "newculture",
    name: "New Culture",
    categories: ["housing", "transition"],
    counties: ["Maricopa"],
    ages: [18, 24],
    spanish: true,
    phone: "(602) 461-6488",
    url: "https://www.newcultureaz.org/",
    description: "Transitional housing and supports (capacity and eligibility vary).",
  },
  {
    id: "thrive",
    name: "Thrive AZ — Transitional Housing",
    categories: ["housing"],
    counties: ["Pima"],
    ages: [18, 24],
    spanish: true,
    phone: "(520) 299-4614",
    url: "https://www.thriveaz.org/transitional-housing",
    description: "Transitional housing support (capacity varies; call first).",
  },
  {
    id: "fosteringadvocates",
    name: "Fostering Advocates Arizona",
    categories: ["rights", "community"],
    counties: ["Statewide"],
    ages: [14, 26],
    spanish: true,
    phone: "(602) 697-7184",
    url: "https://www.fosteringadvocatesarizona.org/",
    description:
      "Youth voice, advocacy, and supports for current and former foster youth.",
  },
  {
    id: "affcf",
    name: "Arizona Friends of Foster Children Foundation (AFFCF)",
    categories: ["education", "money", "transition"],
    counties: ["Statewide"],
    ages: [0, 21],
    spanish: true,
    phone: "(602) 438-7230",
    url: "https://www.affcf.org/",
    description: "Programs and support for foster youth and caregivers; resources vary by need.",
  },
  {
    id: "arizonaatwork",
    name: "ARIZONA@WORK — Local Job Center Locator",
    categories: ["employment"],
    counties: ["Statewide"],
    ages: [16, 99],
    spanish: true,
    phone: "(877) 600-2722",
    url: "https://arizonaatwork.com/locations",
    description: "Job search help, training, and local support.",
  },
];

const RIGHTS = [
  {
    id: "siblings",
    title: "Siblings & Family Contact",
    citation: "A.R.S. §8-529(A)(4)",
    tiers: {
      "10-12": {
        plain:
          "You can usually visit and talk with your brothers and sisters. Adults should help make it happen.",
        example:
          "If you can't see your sibling, you can ask your caseworker why and what the plan is.",
      },
      "13-15": {
        plain:
          "You have a right to visit and have contact with your siblings unless a judge says it isn't safe.",
        example: `Ask: "When is my next sibling visit? Who sets it up?"`,
      },
      "16-17": {
        plain:
          "You have a right to sibling contact; if it isn't happening, ask for the reason and the plan to fix it.",
        example:
          "If you don't get an answer, ask to speak with the caseworker's supervisor.",
      },
      "18-21": {
        plain:
          "Even as a young adult in extended care, you can advocate for family/sibling contact as part of your plan.",
        example: "Document your requests (dates/times) so you can follow up.",
      },
    },
  },
  {
    id: "privacy",
    title: "Privacy & Communication",
    citation: "A.R.S. §8-529 (privacy provisions)",
    tiers: {
      "10-12": {
        plain: "You should be able to talk to your caseworker privately.",
        example: `You can say: "Can I talk with my caseworker alone for a minute?"`,
      },
      "13-15": {
        plain:
          "You can ask for private conversations with your DCS Specialist and your attorney.",
        example:
          "If you feel you can't speak freely, ask for a time and place where you can.",
      },
      "16-17": {
        plain:
          "You can request privacy for calls and meetings with your attorney/caseworker.",
        example: "If it keeps getting blocked, use the complaint path described in the app.",
      },
      "18-21": {
        plain:
          "You can still ask for privacy in communications and for clarity about who can see what.",
        example:
          "If you're in extended care, confirm which provider/coach is responsible.",
      },
    },
  },
  {
    id: "participate",
    title: "Participate in Your Case",
    citation: "A.R.S. §8-529(A)(18)",
    tiers: {
      "10-12": {
        plain:
          "Adults should listen to you about what you need and what's important to you.",
        example:
          "You can tell your caseworker what helps you feel safe at home and school.",
      },
      "13-15": {
        plain:
          "You can be included in your case plan and share what you want, like school and visits.",
        example:
          "Before a hearing, write 3 things you want your attorney to tell the judge.",
      },
      "16-17": {
        plain:
          "You can participate in planning and ask questions about permanency and transition.",
        example: `Use hearing prep questions in the "My Case" tab.`,
      },
      "18-21": {
        plain:
          "If you're in extended care, your plan should reflect your goals (school, work, housing).",
        example:
          "Ask for a written summary of what you agreed to and next steps.",
      },
    },
  },
];

const COURT_STAGES = [
  {
    id: "prelim",
    title: "First safety hearing (Preliminary Protective Hearing)",
    what: "The judge checks safety and decides what happens next right away.",
    youth: "Tell your lawyer what you want the judge to know.",
    next: "Next hearing dates are set.",
  },
  {
    id: "adjudication",
    title: "Facts hearing (Adjudication)",
    what: "The court decides if the concerns are proven and the case continues.",
    youth: `Ask: "What does this mean for where I live and school?"`,
    next: "The plan and services get updated.",
  },
  {
    id: "review",
    title: "Check‑in hearing (Review Hearing)",
    what: "The judge checks how the plan is going and what needs to change.",
    youth: "Bring 1–2 updates: what's working, what isn't.",
    next: "More check‑ins, or a long‑term plan hearing.",
  },
  {
    id: "permanency",
    title: "Long‑term plan hearing (Permanency Hearing)",
    what: "The judge talks about the long‑term plan (reunify, guardianship, adoption, etc.).",
    youth: "Ask your lawyer to explain the choices in simple words.",
    next: "Steps toward the long‑term plan.",
  },
];

// ─── helpers ──────────────────────────────────────────────────────────────────

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function bandToRange(bandId: string) {
  const map: Record<string, [number, number]> = {
    "10-12": [10, 12],
    "13-15": [13, 15],
    "16-17": [16, 17],
    "18-21": [18, 21],
  };
  return map[bandId] || [10, 21];
}

function readingTone(ageBand: string) {
  switch (ageBand) {
    case "10-12":
      return { title: "Simple", hint: "Short, friendly sentences." };
    case "13-15":
      return { title: "Plain", hint: "Clear steps, fewer big words." };
    case "16-17":
      return { title: "Action", hint: "More details + next steps." };
    case "18-21":
      return { title: "Full", hint: "Most detail and options." };
    default:
      return { title: "Plain", hint: "" };
  }
}

function pill(cls: string) {
  return `inline-flex items-center rounded-full border px-2.5 py-1 text-xs ${cls}`;
}

function getCategoryAccent(categories: string[]): string {
  if (categories.includes("legal")) return "bg-[#1B3A5C]";
  if (categories.includes("emergency")) return "bg-rose-500";
  if (categories.includes("housing")) return "bg-[#2A7F8E]";
  if (categories.includes("health")) return "bg-emerald-500";
  if (categories.includes("employment")) return "bg-[#D97706]";
  if (categories.includes("education")) return "bg-purple-500";
  if (categories.includes("rights")) return "bg-[#2A7F8E]";
  return "bg-slate-300";
}

// ─── persona color palette ─────────────────────────────────────────────────────

const PERSONA_COLORS: Record<string, { bg: string; ring: string; avatar: string; text: string; lightBg: string }> = {
  maria:  { bg: "bg-[#2A7F8E]/10",   ring: "ring-[#2A7F8E]/30",  avatar: "bg-[#2A7F8E]",  text: "text-[#2A7F8E]",   lightBg: "bg-[#2A7F8E]/5" },
  jaylen: { bg: "bg-[#1B3A5C]/10",   ring: "ring-[#1B3A5C]/30",  avatar: "bg-[#1B3A5C]",  text: "text-[#1B3A5C]",   lightBg: "bg-[#1B3A5C]/5" },
  destiny:{ bg: "bg-[#D97706]/10",   ring: "ring-[#D97706]/30",  avatar: "bg-[#D97706]",  text: "text-[#D97706]",   lightBg: "bg-[#D97706]/5" },
  andre:  { bg: "bg-emerald-500/10", ring: "ring-emerald-500/30", avatar: "bg-emerald-600", text: "text-emerald-700", lightBg: "bg-emerald-500/5" },
};

// ─── feature card config ───────────────────────────────────────────────────────

const FEATURE_CARDS = [
  {
    id: "rights",
    icon: Shield,
    title: "Know your rights",
    subtitle: "Plain-language rights + what to do if something feels wrong.",
    badge: "Cites A.R.S. §8-529",
    gradient: "from-[#2A7F8E]/10 to-transparent",
    iconBg: "bg-[#2A7F8E]/10",
    iconColor: "text-[#2A7F8E]",
    pillCls: "bg-[#2A7F8E]/10 text-[#2A7F8E] ring-1 ring-[#2A7F8E]/25",
    chevronColor: "text-[#2A7F8E]/50",
  },
  {
    id: "case",
    icon: Gavel,
    title: "My case explained",
    subtitle: "What hearings mean, who's who, and how to prep.",
    badge: "Timeline + hearing prep",
    gradient: "from-[#1B3A5C]/8 to-transparent",
    iconBg: "bg-[#1B3A5C]/10",
    iconColor: "text-[#1B3A5C]",
    pillCls: "bg-[#1B3A5C]/10 text-[#1B3A5C] ring-1 ring-[#1B3A5C]/20",
    chevronColor: "text-[#1B3A5C]/40",
  },
  {
    id: "future",
    icon: FileText,
    title: "My future plan",
    subtitle: "Turning 18? Checklists, deadlines, and next steps.",
    badge: "EFC · ETV · Docs · Housing",
    gradient: "from-[#D97706]/10 to-transparent",
    iconBg: "bg-[#D97706]/10",
    iconColor: "text-[#D97706]",
    pillCls: "bg-[#D97706]/10 text-[#D97706] ring-1 ring-[#D97706]/25",
    chevronColor: "text-[#D97706]/50",
  },
  {
    id: "resources",
    icon: MapPin,
    title: "Find resources",
    subtitle: "County + age filters. Crisis resources always pinned.",
    badge: "100+ directory (prototype sample)",
    gradient: "from-emerald-500/8 to-transparent",
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-700",
    pillCls: "bg-emerald-500/10 text-emerald-700 ring-1 ring-emerald-500/20",
    chevronColor: "text-emerald-600/40",
  },
  {
    id: "wellness",
    icon: HeartPulse,
    title: "Wellness check-in",
    subtitle: `Coping skills + "talk to someone" routing (not therapy).`,
    badge: "Trauma-informed",
    gradient: "from-rose-400/8 to-transparent",
    iconBg: "bg-rose-400/10",
    iconColor: "text-rose-600",
    pillCls: "bg-rose-400/10 text-rose-700 ring-1 ring-rose-400/20",
    chevronColor: "text-rose-400/40",
  },
];

// ─── small UI primitives ───────────────────────────────────────────────────────

function SectionTitle({
  icon: Icon,
  title,
  subtitle,
  right,
  iconClassName,
}: {
  icon: React.ElementType;
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  iconClassName?: string;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="flex items-start gap-3">
        <div className={`mt-0.5 rounded-2xl p-2 shadow-sm ring-1 ring-black/5 ${iconClassName ?? "bg-white/60"}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <div className="text-lg font-semibold leading-tight text-[#1B3A5C]">{title}</div>
          {subtitle ? (
            <div className="mt-0.5 text-sm text-slate-500">{subtitle}</div>
          ) : null}
        </div>
      </div>
      {right}
    </div>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className={pill("bg-white/70 text-slate-600 shadow-sm ring-1 ring-black/8")}>
      {children}
    </span>
  );
}

function PrimaryButton({
  children,
  onClick,
  icon: Icon,
  variant = "default",
}: {
  children: React.ReactNode;
  onClick: () => void;
  icon?: React.ElementType;
  variant?: "default" | "amber" | "teal";
}) {
  const cls =
    variant === "amber"
      ? "bg-[#D97706] hover:bg-[#c96a00] text-white"
      : variant === "teal"
        ? "bg-[#2A7F8E] hover:bg-[#236d7a] text-white"
        : "bg-[#1B3A5C] hover:bg-[#152e49] text-white";
  return (
    <button
      onClick={onClick}
      className={`w-full rounded-2xl px-4 py-3 text-sm font-semibold shadow-sm active:scale-[0.99] transition-all ${cls}`}
    >
      <span className="flex items-center justify-center gap-2">
        {Icon ? <Icon className="h-4 w-4" /> : null}
        {children}
      </span>
    </button>
  );
}

function Card({
  children,
  onClick,
  className = "",
  accentColor,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  accentColor?: string;
}) {
  const clickable = !!onClick;
  if (accentColor) {
    return (
      <div
        onClick={onClick}
        className={
          "flex overflow-hidden rounded-3xl bg-white/85 shadow-sm ring-1 ring-black/5 " +
          (clickable ? "cursor-pointer hover:shadow-md active:scale-[0.995] " : "") +
          className
        }
      >
        <div className={`w-1 shrink-0 ${accentColor}`} />
        <div className="flex-1 p-4">{children}</div>
      </div>
    );
  }
  return (
    <div
      onClick={onClick}
      className={
        "rounded-3xl bg-white/85 p-4 shadow-sm ring-1 ring-black/5 " +
        (clickable ? "cursor-pointer hover:shadow-md active:scale-[0.995] " : "") +
        className
      }
    >
      {children}
    </div>
  );
}

function Divider() {
  return <div className="my-3 h-px w-full bg-slate-200/70" />;
}

function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-3 sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl"
            initial={{ y: 30, opacity: 0.9, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 30, opacity: 0, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
          >
            <div className="flex items-center justify-between border-b border-slate-100 bg-[#1B3A5C] px-4 py-3">
              <div className="text-sm font-semibold text-white">{title}</div>
              <button
                onClick={onClose}
                className="rounded-xl p-2 text-white/70 hover:bg-white/10"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="max-h-[70vh] overflow-y-auto p-4">{children}</div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function StatCite({ children }: { children: React.ReactNode }) {
  return (
    <span className={pill("bg-[#D97706]/10 text-[#9a5200] ring-1 ring-[#D97706]/25")}>
      {children}
    </span>
  );
}

function SafeNotice() {
  return (
    <div className="rounded-2xl bg-white/60 p-3 text-xs text-slate-500 ring-1 ring-slate-200/80">
      <div className="font-semibold text-slate-700">This is info, not advice</div>
      <div className="mt-1">
        This app shares information and links. It can't give legal or medical advice. For help with your case, talk to your
        lawyer, caseworker, or a trusted adult.
      </div>
    </div>
  );
}

// ─── new visual components ─────────────────────────────────────────────────────

function ImpactStrip() {
  const stats = [
    { value: "~9,000", label: "AZ youth\nin foster care" },
    { value: "~900", label: "age out\nevery year" },
    { value: "38%", label: "report\nhomelessness" },
  ];
  return (
    <div className="mt-4 overflow-hidden rounded-3xl bg-[#1B3A5C] px-4 py-4 shadow-md">
      <div className="mb-3 text-[10px] font-bold uppercase tracking-widest text-white/40">
        Arizona context
      </div>
      <div className="grid grid-cols-3 divide-x divide-white/10">
        {stats.map((s) => (
          <div key={s.label} className="px-2 text-center first:pl-0 last:pr-0">
            <div className="text-2xl font-bold text-white">{s.value}</div>
            <div className="mt-0.5 whitespace-pre-line text-[10px] leading-tight text-white/50">
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EscalationLadder() {
  const steps = [
    {
      n: 1,
      role: "Your caseworker",
      action: "Tell them directly what isn't right and ask for a fix. Put it in writing if you can.",
    },
    {
      n: 2,
      role: "Their supervisor",
      action: `If nothing changes, ask: "Can I speak with your supervisor?" Note the date you asked.`,
    },
    {
      n: 3,
      role: "DCS Ombudsman",
      action: "File a formal complaint. They are independent from DCS and must respond.",
    },
    {
      n: 4,
      role: "Your attorney / court",
      action: "Your lawyer can raise unresolved issues at the next scheduled hearing.",
    },
  ];
  return (
    <div>
      {steps.map((s, i) => (
        <div key={s.n} className="flex gap-3">
          <div className="flex flex-col items-center">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#2A7F8E] text-white text-xs font-bold shadow-sm">
              {s.n}
            </div>
            {i < steps.length - 1 && (
              <div className="my-1 w-0.5 flex-1 bg-[#2A7F8E]/20 min-h-[18px]" />
            )}
          </div>
          <div className="pb-4 flex-1 min-w-0">
            <div className="text-sm font-semibold text-[#1B3A5C]">{s.role}</div>
            <div className="mt-0.5 text-xs text-slate-600 leading-relaxed">{s.action}</div>
          </div>
        </div>
      ))}
      <div className="mt-1 flex flex-wrap gap-2">
        <StatCite>A.R.S. §8-529(D)</StatCite>
        <StatCite>DCS complaint pathway</StatCite>
      </div>
    </div>
  );
}

function DeadlineBanner({
  label,
  date,
  note,
}: {
  label: string;
  date: string;
  note?: string;
}) {
  return (
    <div className="rounded-3xl bg-[#D97706] px-4 py-4 shadow-lg">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-white/20 p-2.5 shadow-sm">
          <Calendar className="h-5 w-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[10px] font-bold uppercase tracking-widest text-amber-100/80">
            {label}
          </div>
          <div className="text-xl font-bold text-white leading-tight">{date}</div>
          {note && <div className="mt-0.5 text-xs text-amber-100/70">{note}</div>}
        </div>
        <div className="shrink-0 rounded-2xl bg-white/15 px-3 py-2 ring-1 ring-white/25">
          <div className="flex items-center gap-1 text-xs font-semibold text-white">
            Act now
            <ArrowRight className="h-3 w-3" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── layout shell ──────────────────────────────────────────────────────────────

function TopBar({
  title,
  onQuickExit,
  onOpenChat,
  onBack,
}: {
  title: string;
  onQuickExit: () => void;
  onOpenChat: () => void;
  onBack?: () => void;
}) {
  return (
    <div className="sticky top-0 z-40">
      <div className="flex items-center justify-between bg-[#1B3A5C] px-4 py-3 shadow-md">
        <div className="flex items-center gap-2">
          {onBack ? (
            <button
              onClick={onBack}
              className="rounded-2xl bg-white/10 p-2 text-white/80 ring-1 ring-white/20 hover:bg-white/15 transition-colors"
              aria-label="Back to Home"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          ) : null}
          <div className="flex items-center gap-2.5">
            <div className="grid h-9 w-9 place-items-center rounded-2xl bg-[#2A7F8E] text-white shadow-md ring-2 ring-white/20">
              <span className="text-sm font-bold tracking-tight">FG</span>
            </div>
            <div>
              <div className="text-sm font-semibold text-white leading-tight">{title}</div>
              <div className="text-[11px] text-white/45 leading-tight tracking-wide">
                FosterGuide AZ · prototype
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenChat}
            className="rounded-2xl bg-white/10 px-3 py-2 text-xs font-semibold text-white ring-1 ring-white/20 hover:bg-white/15 transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <MessageCircle className="h-3.5 w-3.5" />
              Ask
            </span>
          </button>
          <button
            onClick={onQuickExit}
            className="rounded-2xl bg-white/10 p-2 text-white/75 ring-1 ring-white/20 hover:bg-white/15 transition-colors"
            aria-label="Quick Exit"
            title="Quick Exit — leaves this page instantly"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function TabBar({
  active,
  onGo,
}: {
  active: string;
  onGo: (id: string) => void;
}) {
  const items = [
    { id: "home", label: "Home", icon: HomeIcon },
    { id: "rights", label: "My Rights", icon: Shield },
    { id: "case", label: "My Case", icon: Gavel },
    { id: "future", label: "My Future", icon: FileText },
    { id: "resources", label: "Resources", icon: MapPin },
  ];
  return (
    <div className="sticky bottom-0 z-40 bg-white/95 backdrop-blur-sm shadow-[0_-1px_0_0_rgba(0,0,0,0.06)]">
      <div className="mx-auto max-w-md px-3 py-2">
        <div className="grid grid-cols-5 gap-1">
          {items.map((it) => {
            const is = active === it.id;
            const Icon = it.icon;
            return (
              <button
                key={it.id}
                onClick={() => onGo(it.id)}
                className={
                  "flex flex-col items-center justify-center rounded-2xl px-2 py-2 text-[11px] font-semibold transition-all " +
                  (is
                    ? "bg-[#2A7F8E]/10 text-[#1B3A5C]"
                    : "text-slate-400 hover:bg-slate-100/60 hover:text-slate-600")
                }
              >
                <Icon
                  className={"h-4 w-4 transition-colors " + (is ? "text-[#2A7F8E]" : "text-slate-400")}
                />
                <span className="mt-1 leading-none">{it.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── hooks ─────────────────────────────────────────────────────────────────────

function useLocalPref<T>(key: string, initial: T) {
  const [val, setVal] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch {
      // ignore
    }
  }, [key, val]);
  return [val, setVal] as const;
}

function isCrisis(text: string) {
  const t = (text || "").toLowerCase();
  const flags = [
    "suicide",
    "kill myself",
    "end it",
    "hurt myself",
    "self harm",
    "cut myself",
    "overdose",
    "i want to die",
    "abuse",
    "hit me",
    "molest",
    "rape",
    "unsafe",
  ];
  return flags.some((f) => t.includes(f));
}

// ─── types ─────────────────────────────────────────────────────────────────────

type Prefs = {
  language: "en" | "es" | null;
  ageBand: string | null;
  county: string | null;
  pathway: string | null;
  tribal: boolean;
};

type AiReply = {
  kind: "normal" | "crisis";
  title: string;
  body: string;
  cites?: string[];
};

// ─── AI simulator ─────────────────────────────────────────────────────────────

function aiSimReply({ q, prefs }: { q: string; prefs: Prefs }): AiReply {
  const lower = (q || "").trim().toLowerCase();
  const tone = readingTone(prefs.ageBand || "").title;

  if (isCrisis(lower)) {
    return {
      kind: "crisis",
      title: "If you're in danger, get help now",
      body:
        "If you feel like you might hurt yourself, or you don't feel safe, please contact a crisis service now. You deserve help from a real person.",
      cites: ["988", "Crisis Text Line", "AZ DCS Hotline"],
    };
  }

  const scopeHints = [
    "foster",
    "dcs",
    "court",
    "hearing",
    "rights",
    "etv",
    "tuition",
    "yati",
    "icwa",
    "case plan",
    "placement",
  ];
  if (!scopeHints.some((h) => lower.includes(h))) {
    return {
      kind: "normal",
      title: "I can help with Arizona foster care",
      body:
        "I can help with rights, court, turning 18, and finding resources in Arizona. Tell me what's going on, and I'll point you to a good next step.",
      cites: ["App scope"],
    };
  }

  if (lower.includes("permanency") || lower.includes("hearing")) {
    return {
      kind: "normal",
      title: `What a permanency hearing is (${tone} mode)`,
      body:
        prefs.ageBand === "10-12"
          ? "A permanency hearing is a court meeting where the judge talks about the long‑term plan. You can ask your lawyer to explain what's happening."
          : "A permanency hearing is when the judge talks about the long‑term plan (going home, guardianship, adoption, etc.). Ask your lawyer: (1) what the goal is today, (2) what might change next, and (3) what you can say in court.",
      cites: ["AZ dependency process", "Your right to participate"],
    };
  }

  if (
    lower.includes("see my brother") ||
    lower.includes("see my sister") ||
    lower.includes("sibling")
  ) {
    return {
      kind: "normal",
      title: `Sibling contact (${tone} mode)`,
      body:
        prefs.ageBand === "10-12"
          ? "You usually have the right to visit and talk with your siblings. Your caseworker should help set that up. Want a sentence you can use to ask?"
          : "Arizona law includes a right to sibling contact unless a judge says it isn't safe. If it isn't happening, ask your caseworker for the reason and the plan to fix it.",
      cites: ["A.R.S. §8-529(A)(4)"],
    };
  }

  if (
    lower.includes("etv") ||
    lower.includes("college") ||
    lower.includes("tuition")
  ) {
    return {
      kind: "normal",
      title: `Paying for school (${tone} mode)`,
      body:
        prefs.ageBand === "10-12"
          ? "When you're older, there are programs that can help pay for school. A trusted adult can help you apply."
          : "There are programs that can help pay for school (like ETV). Deadlines matter. Tell me your age and what school you're thinking about, and I'll show a simple checklist.",
      cites: ["ETV program", "Arizona tuition waiver"],
    };
  }

  if (
    lower.includes("id") ||
    lower.includes("birth certificate") ||
    lower.includes("social security")
  ) {
    return {
      kind: "normal",
      title: `Getting your documents (${tone} mode)`,
      body:
        prefs.ageBand === "10-12"
          ? "Important papers like a birth certificate help with school and doctors. An adult should help keep them safe."
          : `First, make a list of what you're missing (birth certificate, Social Security card, state ID). Then follow the steps in "My Future" → "Documents."`,
      cites: ["A.R.S. §8-514.06 (documents)"],
    };
  }

  if (
    lower.includes("re-enter") ||
    lower.includes("go back") ||
    lower.includes("back into foster")
  ) {
    return {
      kind: "normal",
      title: `Re-entry / coming back into care (${tone} mode)`,
      body:
        "Some young adults can come back for help after leaving care. The app would show your options and who to call first (and what to say).",
      cites: ["Transition services", "Provider pathways"],
    };
  }

  return {
    kind: "normal",
    title: `Here's a safe next step (${tone} mode)`,
    body:
      "Tell me what you're trying to do (rights, court, school, housing, health, or turning 18). I'll point you to a short checklist and a trusted contact.",
    cites: ["Verified AZ resources"],
  };
}

function CitationsRow({ cites }: { cites?: string[] }) {
  if (!cites?.length) return null;
  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {cites.map((c, i) => (
        <StatCite key={`${c}-${i}`}>{c}</StatCite>
      ))}
    </div>
  );
}

// ─── onboarding ────────────────────────────────────────────────────────────────

function Onboarding({
  prefs,
  setPrefs,
  onDone,
}: {
  prefs: Prefs;
  setPrefs: React.Dispatch<React.SetStateAction<Prefs>>;
  onDone: () => void;
}) {
  const [step, setStep] = useState(0);

  const stepTitle =
    [
      "Pick your language",
      "Pick your age",
      "Pick your county",
      "What brings you here today?",
      "Optional: Tribal membership",
    ][step] || "";

  const isReady =
    !!prefs.language &&
    !!prefs.ageBand &&
    !!prefs.county &&
    (step < 4 || typeof prefs.tribal === "boolean");

  return (
    <div className="px-4 pb-28 pt-4">
      {/* Header */}
      <div className="mb-6">
        <div className="text-2xl font-bold text-[#1B3A5C] leading-tight">Welcome to<br />FosterGuide AZ</div>
        <div className="mt-1.5 text-sm text-slate-500">No account. No personal info. Just helpful Arizona-specific guidance.</div>
      </div>

      {/* Step card */}
      <div className="rounded-3xl bg-white/85 p-5 shadow-sm ring-1 ring-black/5">
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm font-semibold text-[#1B3A5C]">{stepTitle}</div>
          {/* Dot indicator */}
          <div className="flex gap-1.5 items-center">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={
                  "h-2 rounded-full transition-all duration-300 " +
                  (i === step
                    ? "w-6 bg-[#2A7F8E]"
                    : i < step
                      ? "w-2 bg-[#2A7F8E]/35"
                      : "w-2 bg-slate-200")
                }
              />
            ))}
          </div>
        </div>

        {step === 0 ? (
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => {
                setPrefs((p) => ({ ...p, language: "en" }));
                setStep(1);
              }}
              className={
                "rounded-3xl p-4 text-left ring-1 transition-all " +
                (prefs.language === "en"
                  ? "bg-[#2A7F8E]/10 ring-[#2A7F8E]/40 shadow-sm"
                  : "bg-white ring-black/10 hover:ring-black/20")
              }
            >
              <div className="text-base font-bold text-slate-900">English</div>
              <div className="mt-0.5 text-xs text-slate-500">Default</div>
            </button>
            <button
              onClick={() => {
                setPrefs((p) => ({ ...p, language: "es" }));
                setStep(1);
              }}
              className={
                "rounded-3xl p-4 text-left ring-1 transition-all " +
                (prefs.language === "es"
                  ? "bg-[#2A7F8E]/10 ring-[#2A7F8E]/40 shadow-sm"
                  : "bg-white ring-black/10 hover:ring-black/20")
              }
            >
              <div className="text-base font-bold text-slate-900">Español</div>
              <div className="mt-0.5 text-xs text-slate-500">En lanzamiento</div>
            </button>
          </div>
        ) : null}

        {step === 1 ? (
          <div className="grid grid-cols-2 gap-3">
            {AGE_BANDS.map((b) => (
              <button
                key={b.id}
                onClick={() => {
                  setPrefs((p) => ({ ...p, ageBand: b.id }));
                  setStep(2);
                }}
                className={
                  "rounded-3xl p-4 text-left ring-1 transition-all " +
                  (prefs.ageBand === b.id
                    ? "bg-[#2A7F8E]/10 ring-[#2A7F8E]/40 shadow-sm"
                    : "bg-white ring-black/10 hover:ring-black/20")
                }
              >
                <div className="text-base font-bold text-slate-900">{b.label}</div>
                <div className="mt-0.5 text-xs text-slate-500">
                  {b.id === "10-12"
                    ? "Understand + basics"
                    : b.id === "13-15"
                      ? "Rights + court"
                      : b.id === "16-17"
                        ? "Transition + checklists"
                        : "Extended care + workflows"}
                </div>
              </button>
            ))}
          </div>
        ) : null}

        {step === 2 ? (
          <div>
            <div className="text-xs text-slate-500 mb-3">
              Pick the county you're in (for local resources).
            </div>
            <div className="grid grid-cols-2 gap-2">
              {COUNTIES.map((c) => (
                <button
                  key={c}
                  onClick={() => {
                    setPrefs((p) => ({ ...p, county: c }));
                    setStep(3);
                  }}
                  className={
                    "rounded-2xl px-3 py-2.5 text-left text-sm font-semibold ring-1 transition-all " +
                    (prefs.county === c
                      ? "bg-[#2A7F8E]/10 ring-[#2A7F8E]/40 text-[#1B3A5C]"
                      : "bg-white ring-black/10 text-slate-700 hover:ring-black/20")
                  }
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {step === 3 ? (
          <div className="space-y-2">
            {PATHWAYS.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  setPrefs((x) => ({ ...x, pathway: p.id }));
                  setStep(4);
                }}
                className={
                  "w-full rounded-2xl px-4 py-3 text-left text-sm font-semibold ring-1 transition-all " +
                  (prefs.pathway === p.id
                    ? "bg-[#2A7F8E]/10 ring-[#2A7F8E]/40 text-[#1B3A5C]"
                    : "bg-white ring-black/10 text-slate-700 hover:ring-black/20")
                }
              >
                {p.label}
              </button>
            ))}
          </div>
        ) : null}

        {step === 4 ? (
          <div>
            <div className="text-xs text-slate-500 mb-3">
              Optional: this helps the prototype show ICWA-aware navigation. Stored only in your browser.
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  setPrefs((p) => ({ ...p, tribal: true }));
                }}
                className={
                  "rounded-3xl p-4 text-left ring-1 transition-all " +
                  (prefs.tribal === true
                    ? "bg-[#2A7F8E]/10 ring-[#2A7F8E]/40 shadow-sm"
                    : "bg-white ring-black/10 hover:ring-black/20")
                }
              >
                <div className="text-sm font-bold text-slate-900">Yes</div>
                <div className="mt-0.5 text-xs text-slate-500">Show ICWA-aware steps</div>
              </button>
              <button
                onClick={() => {
                  setPrefs((p) => ({ ...p, tribal: false }));
                }}
                className={
                  "rounded-3xl p-4 text-left ring-1 transition-all " +
                  (prefs.tribal === false
                    ? "bg-[#2A7F8E]/10 ring-[#2A7F8E]/40 shadow-sm"
                    : "bg-white ring-black/10 hover:ring-black/20")
                }
              >
                <div className="text-sm font-bold text-slate-900">No / Not sure</div>
                <div className="mt-0.5 text-xs text-slate-500">Standard steps</div>
              </button>
            </div>
          </div>
        ) : null}

        <Divider />
        <div className="flex gap-3">
          <button
            onClick={() => setStep((s) => clamp(s - 1, 0, 4))}
            className={
              "flex-1 rounded-2xl px-4 py-3 text-sm font-semibold ring-1 transition-all " +
              (step === 0
                ? "bg-slate-50 text-slate-300 ring-slate-200 cursor-not-allowed"
                : "bg-white text-slate-700 ring-black/10 hover:bg-slate-50")
            }
            disabled={step === 0}
          >
            Back
          </button>
          <button
            onClick={() => {
              if (!isReady) return;
              if (step < 4) setStep((s) => s + 1);
              else onDone();
            }}
            className={
              "flex-1 rounded-2xl px-4 py-3 text-sm font-semibold transition-all " +
              (isReady
                ? "bg-[#1B3A5C] text-white hover:bg-[#152e49] shadow-sm"
                : "bg-slate-100 text-slate-400 cursor-not-allowed")
            }
            disabled={!isReady}
          >
            {step < 4 ? "Next" : "Start"}
          </button>
        </div>
      </div>

      <div className="mt-4">
        <SafeNotice />
      </div>

      {/* Story mode — persona cards */}
      <div className="mt-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-px flex-1 bg-slate-200" />
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-1">
            or jump into a story
          </div>
          <div className="h-px flex-1 bg-slate-200" />
        </div>
        <div className="grid gap-3">
          {DEMO_PERSONAS.map((p) => {
            const colors = PERSONA_COLORS[p.id] ?? PERSONA_COLORS.maria;
            const initial = p.name.charAt(0);
            const ageBand = AGE_BANDS.find((a) => a.id === p.preset.ageBand);
            return (
              <button
                key={p.id}
                onClick={() => {
                  setPrefs((x) => ({ ...x, ...p.preset } as Prefs));
                  onDone();
                }}
                className={`w-full text-left rounded-3xl ${colors.bg} p-4 ring-1 ${colors.ring} hover:shadow-md active:scale-[0.995] transition-all`}
              >
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${colors.avatar} text-white text-lg font-bold shadow-sm`}
                  >
                    {initial}
                  </div>
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm font-bold ${colors.text}`}>{p.name}</div>
                    <div className="mt-0.5 text-xs text-slate-600 leading-snug">{p.blurb}</div>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      <span className="inline-flex items-center rounded-full bg-white/70 px-2 py-0.5 text-[11px] text-slate-600 ring-1 ring-black/8">
                        {p.preset.county}
                      </span>
                      {ageBand && (
                        <span className="inline-flex items-center rounded-full bg-white/70 px-2 py-0.5 text-[11px] text-slate-600 ring-1 ring-black/8">
                          Age {ageBand.label}
                        </span>
                      )}
                      {p.preset.tribal && (
                        <span className="inline-flex items-center rounded-full bg-white/70 px-2 py-0.5 text-[11px] text-slate-600 ring-1 ring-black/8">
                          ICWA
                        </span>
                      )}
                    </div>
                  </div>
                  <ChevronRight className={`h-5 w-5 shrink-0 ${colors.text} opacity-60`} />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── home screen ───────────────────────────────────────────────────────────────

function HomeScreen({
  prefs,
  onGo,
  onOpenChat,
  onReset,
}: {
  prefs: Prefs;
  onGo: (route: string) => void;
  onOpenChat: () => void;
  onReset: () => void;
}) {
  const tone = readingTone(prefs.ageBand || "");
  const chips = [
    prefs.language === "es" ? "Español" : "English",
    `Age ${AGE_BANDS.find((a) => a.id === prefs.ageBand)?.label ?? "—"}`,
    prefs.county ? `${prefs.county} County` : "—",
    prefs.tribal ? "ICWA-aware" : "Standard",
    `${tone.title} mode`,
  ];

  return (
    <div className="px-4 pb-28 pt-4">
      <SectionTitle
        icon={HomeIcon}
        title="Home"
        subtitle="What do you need today?"
        right={
          <button
            onClick={onReset}
            className="rounded-2xl bg-white px-3 py-2 text-xs font-semibold text-slate-600 shadow-sm ring-1 ring-black/10 hover:bg-slate-50 transition-colors"
          >
            Reset
          </button>
        }
      />

      <div className="mt-3 flex flex-wrap gap-2">
        {chips.map((c) => (
          <Chip key={c}>{c}</Chip>
        ))}
      </div>

      {/* Arizona impact strip */}
      <ImpactStrip />

      {/* Color-coded feature cards */}
      <div className="mt-4 grid gap-3">
        {FEATURE_CARDS.map((fc) => {
          const Icon = fc.icon;
          return (
            <div
              key={fc.id}
              onClick={() => onGo(fc.id)}
              className={`cursor-pointer rounded-3xl bg-gradient-to-br ${fc.gradient} bg-white/80 p-4 shadow-sm ring-1 ring-black/5 hover:shadow-md active:scale-[0.995] transition-all`}
            >
              <div className="flex items-start gap-3">
                <div className={`mt-0.5 rounded-2xl ${fc.iconBg} p-2.5 shadow-sm`}>
                  <Icon className={`h-5 w-5 ${fc.iconColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-base font-semibold text-[#1B3A5C]">{fc.title}</div>
                  <div className="mt-0.5 text-xs text-slate-500 leading-snug">{fc.subtitle}</div>
                </div>
                <ChevronRight className={`mt-1 h-5 w-5 shrink-0 ${fc.chevronColor}`} />
              </div>
              <div className="mt-3">
                <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${fc.pillCls}`}>
                  {fc.badge}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4">
        <PrimaryButton onClick={onOpenChat} icon={MessageCircle} variant="teal">
          Ask FosterGuide
        </PrimaryButton>
      </div>

      {/* Crisis strip */}
      <div className="mt-4 rounded-3xl bg-white/85 p-4 ring-1 ring-black/5 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 rounded-2xl bg-rose-50 p-2 ring-1 ring-rose-200">
            <AlertTriangle className="h-5 w-5 text-rose-600" />
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-900">Crisis resources — always available</div>
            <div className="mt-1 text-xs text-slate-500">
              If someone is in danger or needs immediate help, the app routes to real people instantly.
            </div>
          </div>
        </div>
        <div className="mt-3 grid gap-2">
          {CRISIS_PINS.slice(0, 2).map((c) => (
            <a
              key={c.name}
              href={c.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between rounded-2xl bg-white px-3 py-3 text-sm font-semibold ring-1 ring-black/10 hover:bg-slate-50 transition-colors"
            >
              <span className="text-slate-800">
                {c.name}
                <span className="ml-2 text-xs font-normal text-slate-500">· {c.how}</span>
              </span>
              <ExternalLink className="h-4 w-4 text-slate-400" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── rights screen ─────────────────────────────────────────────────────────────

function RightsScreen({ prefs }: { prefs: Prefs }) {
  const tier = prefs.ageBand || "10-12";
  return (
    <div className="px-4 pb-28 pt-4">
      <SectionTitle
        icon={Shield}
        title="Know Your Rights"
        subtitle="Your rights in plain language + what to do next."
        iconClassName="bg-[#2A7F8E]/10 text-[#2A7F8E]"
      />

      <div className="mt-4 rounded-3xl bg-white/85 p-4 ring-1 ring-black/5 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold text-[#1B3A5C]">Rights explorer</div>
          <Chip>Age {AGE_BANDS.find((a) => a.id === tier)?.label}</Chip>
        </div>
        <div className="mt-1.5 text-xs text-slate-500">
          Demo sample. In the real app, all content is verified against current Arizona law.
        </div>
      </div>

      {/* Rights cards with teal left accent bar */}
      <div className="mt-4 grid gap-3">
        {RIGHTS.map((r) => {
          const defaultTier = "10-12";
          const t =
            (r.tiers as Record<string, { plain: string; example: string }>)[tier] ||
            (r.tiers as Record<string, { plain: string; example: string }>)[defaultTier];
          return (
            <Card key={r.id} accentColor="bg-[#2A7F8E]">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-[#1B3A5C]">{r.title}</div>
                  <div className="mt-2 text-sm text-slate-700 leading-relaxed">{t.plain}</div>
                  <div className="mt-2 text-xs text-slate-500">
                    <span className="font-semibold text-slate-700">For example:</span> {t.example}
                  </div>
                </div>
                <div className="shrink-0">
                  <StatCite>{r.citation}</StatCite>
                </div>
              </div>
              <Divider />
              <div className="flex flex-wrap items-center gap-2">
                <span className={pill("bg-[#2A7F8E]/8 text-[#2A7F8E] ring-1 ring-[#2A7F8E]/20")}>
                  What it means
                </span>
                <span className={pill("bg-white text-slate-600 ring-1 ring-black/10")}>
                  What to say
                </span>
                <span className={pill("bg-white text-slate-600 ring-1 ring-black/10")}>
                  If it's not happening
                </span>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Visual escalation ladder */}
      <div className="mt-4 rounded-3xl bg-white/85 p-4 ring-1 ring-black/5 shadow-sm">
        <div className="flex items-start gap-3 mb-4">
          <div className="mt-0.5 rounded-2xl bg-[#2A7F8E]/10 p-2 ring-1 ring-[#2A7F8E]/20">
            <CheckCircle2 className="h-5 w-5 text-[#2A7F8E]" />
          </div>
          <div>
            <div className="text-sm font-semibold text-[#1B3A5C]">If your rights are being violated</div>
            <div className="mt-1 text-xs text-slate-500">
              Follow these steps in order. Document dates and responses at each step.
            </div>
          </div>
        </div>
        <EscalationLadder />
      </div>

      <div className="mt-4">
        <SafeNotice />
      </div>
    </div>
  );
}

// ─── case screen ───────────────────────────────────────────────────────────────

function CaseScreen({ prefs }: { prefs: Prefs }) {
  const tier = prefs.ageBand;
  const isYoung = tier === "10-12";
  return (
    <div className="px-4 pb-28 pt-4">
      <SectionTitle
        icon={Gavel}
        title="My Case Explained"
        subtitle="A simple timeline + who's who + hearing prep."
        iconClassName="bg-[#1B3A5C]/10 text-[#1B3A5C]"
      />

      {prefs.tribal ? (
        <div className="mt-4 rounded-3xl bg-[#2A7F8E]/8 p-4 ring-1 ring-[#2A7F8E]/20 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="rounded-2xl bg-[#2A7F8E]/15 p-2">
              <Users className="h-5 w-5 text-[#2A7F8E]" />
            </div>
            <div>
              <div className="text-sm font-semibold text-[#1B3A5C]">ICWA guidance is on</div>
              <div className="mt-1 text-xs text-slate-600">
                In the full app, this module is co-designed with tribal partners — you'd see tribe-specific contacts and ICWA-specific case steps here.
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <StatCite>ICWA (25 U.S.C. §§1901–1963)</StatCite>
                <StatCite>AZ courts ICWA guidance</StatCite>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <div className="mt-4 rounded-3xl bg-white/85 p-4 ring-1 ring-black/5 shadow-sm">
        <div className="text-sm font-semibold text-[#1B3A5C]">Court process timeline</div>
        <div className="mt-1.5 text-xs text-slate-500">
          {isYoung
            ? "A story-style visual would go here for younger users."
            : "Each stage leads to the next. Tap any stage to see what it means for you."}
        </div>
      </div>

      {/* Visual timeline with numbered nodes */}
      <div className="mt-4">
        {COURT_STAGES.map((s, i) => (
          <div key={s.id} className="flex gap-4">
            {/* Left: node + connector */}
            <div className="flex flex-col items-center">
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white text-sm font-bold shadow-md z-10"
                style={{ backgroundColor: i < 2 ? "#2A7F8E" : "#D97706" }}
              >
                {i + 1}
              </div>
              {i < COURT_STAGES.length - 1 && (
                <div
                  className="w-0.5 flex-1 min-h-[20px] my-1"
                  style={{
                    background:
                      i === 1
                        ? "linear-gradient(to bottom, #2A7F8E55, #D9770655)"
                        : i < 2
                          ? "#2A7F8E33"
                          : "#D9770633",
                  }}
                />
              )}
            </div>
            {/* Right: card */}
            <div className="flex-1 pb-4 last:pb-0">
              <div className="rounded-3xl bg-white/85 p-4 shadow-sm ring-1 ring-black/5">
                <div className="text-sm font-semibold text-[#1B3A5C]">{s.title}</div>
                <div className="mt-2 text-xs text-slate-600">
                  <span className="font-semibold text-slate-700">What it is:</span> {s.what}
                </div>
                <div className="mt-2 text-xs text-slate-600">
                  <span className="font-semibold text-slate-700">What you can do:</span> {s.youth}
                </div>
                <div className="mt-2 text-xs text-slate-500">
                  <span className="font-semibold text-slate-600">What's next:</span> {s.next}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Hearing prep */}
      <div className="mt-4 rounded-3xl bg-white/85 p-4 ring-1 ring-black/5 shadow-sm">
        <div className="text-sm font-semibold text-[#1B3A5C] mb-3">Hearing prep questions</div>
        <div className="grid gap-2">
          {[
            "What is the goal of today's hearing?",
            "What could change next, and when?",
            "What do you need to feel safe at home and school?",
            "Who should I call if something isn't happening?",
          ].map((q) => (
            <div
              key={q}
              className="flex items-start gap-2.5 rounded-2xl bg-white p-3 ring-1 ring-black/8"
            >
              <CheckCircle2 className="mt-0.5 h-4 w-4 text-[#2A7F8E] shrink-0" />
              <div className="text-sm text-slate-700">{q}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <SafeNotice />
      </div>
    </div>
  );
}

// ─── future screen ─────────────────────────────────────────────────────────────

function FutureScreen({ prefs }: { prefs: Prefs }) {
  const [showSensitive, setShowSensitive] = useState(false);
  const tier = prefs.ageBand;
  const isOldEnough = tier === "16-17" || tier === "18-21";

  return (
    <div className="px-4 pb-28 pt-4">
      <SectionTitle
        icon={FileText}
        title="My Future Plan"
        subtitle="Turning 18, school, documents, housing — as simple checklists."
        iconClassName="bg-[#D97706]/10 text-[#D97706]"
      />

      {!isOldEnough ? (
        <div className="mt-4 rounded-3xl bg-white/85 p-4 ring-1 ring-black/5 shadow-sm">
          <div className="text-sm font-semibold text-[#1B3A5C]">You'll see more here as you get older</div>
          <div className="mt-1 text-xs text-slate-500">
            This prototype keeps detailed transition tools for ages 16+.
          </div>
        </div>
      ) : null}

      {isOldEnough ? (
        <>
          {/* ETV Deadline banner */}
          <div className="mt-4">
            <DeadlineBanner
              label="ETV Application Deadline"
              date="July 31, 2026"
              note="Educational and Training Vouchers — act before this date for the 2025–2026 cycle"
            />
          </div>

          {/* Content note */}
          <div className="mt-4 rounded-3xl bg-white/85 p-4 ring-1 ring-black/5 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 rounded-2xl bg-amber-50 p-2 ring-1 ring-amber-200">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-[#1B3A5C]">Content note</div>
                <div className="mt-1 text-xs text-slate-500">
                  Planning for the future can include hard topics like housing problems. You can skip any section.
                </div>
                <div className="mt-3">
                  <button
                    onClick={() => setShowSensitive((s) => !s)}
                    className={
                      "rounded-2xl px-4 py-2 text-xs font-semibold ring-1 transition-all " +
                      (showSensitive
                        ? "bg-[#1B3A5C] text-white ring-[#1B3A5C]"
                        : "bg-white text-slate-700 ring-black/10 hover:bg-slate-50")
                    }
                  >
                    {showSensitive ? "Hide detailed sections" : "Show detailed sections"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 grid gap-3">
            {/* EFC decision */}
            <Card accentColor="bg-[#2A7F8E]">
              <SectionTitle
                icon={CheckCircle2}
                title="Turning 18: choose your path"
                subtitle="Extended Foster Care vs. leaving care — what changes and what stays the same."
                iconClassName="bg-[#2A7F8E]/10 text-[#2A7F8E]"
              />
              <div className="mt-3 flex flex-wrap gap-2">
                <StatCite>A.R.S. §8-521.02</StatCite>
                <StatCite>A.R.S. §8-521.03 (SB 1303)</StatCite>
              </div>
            </Card>

            {/* Education funding */}
            <Card accentColor="bg-[#D97706]">
              <SectionTitle
                icon={GraduationCap}
                title="Money for school"
                subtitle="Help paying for school (like ETV). Deadlines matter — see banner above."
                iconClassName="bg-[#D97706]/10 text-[#D97706]"
              />
              <div className="mt-3 grid gap-2">
                {[
                  { label: "ETV checklist", note: "Get your papers. Apply before July 31." },
                  { label: "FAFSA reminder", note: "Ask a trusted adult or your school for help." },
                ].map((x) => (
                  <div
                    key={x.label}
                    className="rounded-2xl bg-white/70 p-3 ring-1 ring-black/8"
                  >
                    <div className="text-sm font-semibold text-slate-900">{x.label}</div>
                    <div className="mt-0.5 text-xs text-slate-500">{x.note}</div>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <StatCite>ETV (Arizona)</StatCite>
                <StatCite>A.R.S. §15-1809.01</StatCite>
              </div>
            </Card>

            {/* Documents */}
            <Card accentColor="bg-[#1B3A5C]">
              <SectionTitle
                icon={FileText}
                title="Documents"
                subtitle="Birth certificate → Social Security card → state ID."
                iconClassName="bg-[#1B3A5C]/10 text-[#1B3A5C]"
              />
              <div className="mt-3 grid gap-2">
                {[
                  "Birth certificate",
                  "Social Security card",
                  "State ID / driver's license",
                  "Immunization records",
                ].map((x) => (
                  <div
                    key={x}
                    className="flex items-center justify-between rounded-2xl bg-white/70 p-3 ring-1 ring-black/8"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="h-4 w-4 rounded-full ring-1 ring-[#1B3A5C]/30 bg-white" />
                      <div className="text-sm font-semibold text-slate-800">{x}</div>
                    </div>
                    <span className={pill("bg-slate-50 text-slate-600 ring-1 ring-slate-200")}>
                      Steps
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <StatCite>A.R.S. §8-514.06</StatCite>
              </div>
            </Card>

            {showSensitive ? (
              <Card accentColor="bg-emerald-500">
                <SectionTitle
                  icon={MapPin}
                  title="Housing path"
                  subtitle={`Filtered for ${prefs.county} + age. Some programs fill up — call first.`}
                  iconClassName="bg-emerald-500/10 text-emerald-700"
                />
                <div className="mt-3 grid gap-2">
                  {RESOURCES.filter((r) => r.categories.includes("housing"))
                    .slice(0, 3)
                    .map((r) => (
                      <div
                        key={r.id}
                        className="rounded-2xl bg-white/70 p-3 ring-1 ring-black/8"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="text-sm font-semibold text-slate-900">{r.name}</div>
                          <span className={pill("bg-[#D97706]/10 text-[#9a5200] ring-1 ring-[#D97706]/25")}>
                            Call first
                          </span>
                        </div>
                        <div className="mt-1 text-xs text-slate-500">{r.description}</div>
                      </div>
                    ))}
                </div>
              </Card>
            ) : null}

            {prefs.tribal ? (
              <Card accentColor="bg-[#2A7F8E]">
                <SectionTitle
                  icon={Users}
                  title="ICWA-aware transition notes"
                  subtitle="In the real app: tribal-specific contacts + placement preference explanations."
                  iconClassName="bg-[#2A7F8E]/10 text-[#2A7F8E]"
                />
                <div className="mt-3 flex flex-wrap gap-2">
                  <StatCite>ICWA</StatCite>
                  <StatCite>Tribal resources (co-designed)</StatCite>
                </div>
              </Card>
            ) : null}
          </div>
        </>
      ) : null}

      <div className="mt-4">
        <SafeNotice />
      </div>
    </div>
  );
}

// ─── resources screen ──────────────────────────────────────────────────────────

function ResourcesScreen({ prefs }: { prefs: Prefs }) {
  const [q, setQ] = useState("");
  const [need, setNeed] = useState("all");

  const ageRange = useMemo(() => bandToRange(prefs.ageBand || ""), [prefs.ageBand]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    const [amin, amax] = ageRange;

    return RESOURCES.filter((r) => {
      const matchesNeed = need === "all" ? true : r.categories.includes(need);
      const matchesAge = r.ages[0] <= amax && r.ages[1] >= amin;
      const matchesCounty =
        r.counties.includes("Statewide") ||
        (prefs.county ? r.counties.includes(prefs.county) : false);
      const matchesQuery =
        !query ||
        r.name.toLowerCase().includes(query) ||
        r.description.toLowerCase().includes(query) ||
        r.categories.some((c) => c.includes(query));
      return matchesNeed && matchesAge && matchesCounty && matchesQuery;
    }).sort((a, b) => {
      const aScore =
        (a.categories.includes("emergency") ? 2 : 0) +
        (a.categories.includes("legal") ? 1 : 0);
      const bScore =
        (b.categories.includes("emergency") ? 2 : 0) +
        (b.categories.includes("legal") ? 1 : 0);
      return bScore - aScore;
    });
  }, [q, need, ageRange, prefs.county]);

  const NEEDS = [
    { id: "all", label: "All" },
    { id: "housing", label: "Housing" },
    { id: "education", label: "Education" },
    { id: "legal", label: "Legal" },
    { id: "health", label: "Health" },
    { id: "employment", label: "Work" },
    { id: "emergency", label: "Emergency" },
    { id: "transition", label: "Transition" },
    { id: "rights", label: "Rights" },
    { id: "money", label: "Money" },
    { id: "food", label: "Food" },
  ];

  return (
    <div className="px-4 pb-28 pt-4">
      <SectionTitle
        icon={MapPin}
        title="Find Resources"
        subtitle={`Filtered for ${prefs.county ?? "—"} · Ages ${ageRange[0]}–${ageRange[1]}`}
        iconClassName="bg-emerald-500/10 text-emerald-700"
      />

      {/* Search + filter */}
      <div className="mt-4 rounded-3xl bg-white/85 p-4 ring-1 ring-black/5 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="rounded-2xl bg-slate-100 p-2">
            <Search className="h-4 w-4 text-slate-500" />
          </div>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search (housing, legal, ID, college…)"
            className="w-full rounded-2xl bg-white px-3 py-2 text-sm ring-1 ring-black/10 outline-none focus:ring-2 focus:ring-[#2A7F8E]/35 transition-all"
          />
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {NEEDS.map((n) => (
            <button
              key={n.id}
              onClick={() => setNeed(n.id)}
              className={
                "rounded-full px-3 py-1.5 text-xs font-semibold ring-1 transition-all " +
                (need === n.id
                  ? "bg-[#1B3A5C] text-white ring-[#1B3A5C]"
                  : "bg-white text-slate-600 ring-black/10 hover:ring-black/20")
              }
            >
              {n.label}
            </button>
          ))}
        </div>
      </div>

      {/* Pinned crisis */}
      <div className="mt-4 rounded-3xl bg-rose-50/80 p-4 ring-1 ring-rose-200/60 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="h-4 w-4 text-rose-600" />
          <div className="text-sm font-semibold text-rose-900">Pinned crisis options</div>
        </div>
        <div className="grid gap-2">
          {CRISIS_PINS.map((c) => (
            <a
              key={c.name}
              href={c.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between rounded-2xl bg-white px-3 py-3 text-sm font-semibold ring-1 ring-black/8 hover:bg-slate-50 transition-colors"
            >
              <span className="text-slate-800">
                {c.name}
                <span className="ml-2 text-xs font-normal text-slate-500">· {c.how}</span>
              </span>
              <ExternalLink className="h-4 w-4 text-slate-400" />
            </a>
          ))}
        </div>
      </div>

      {/* Resource results */}
      <div className="mt-4 grid gap-3">
        {filtered.length === 0 ? (
          <div className="rounded-3xl bg-white/85 p-5 text-center ring-1 ring-black/5 shadow-sm">
            <div className="text-sm font-semibold text-slate-700">No matches found</div>
            <div className="mt-1 text-xs text-slate-500">Try calling 211 — a real person can help you find options.</div>
          </div>
        ) : null}

        {filtered.map((r) => {
          const accentColor = getCategoryAccent(r.categories);
          return (
            <div
              key={r.id}
              className="flex overflow-hidden rounded-3xl bg-white/85 shadow-sm ring-1 ring-black/5"
            >
              <div className={`w-1 shrink-0 ${accentColor}`} />
              <div className="flex-1 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-[#1B3A5C]">{r.name}</div>
                    <div className="mt-1 text-xs text-slate-500 leading-relaxed">{r.description}</div>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {r.categories.slice(0, 3).map((c) => (
                        <span
                          key={c}
                          className={pill("bg-slate-50 text-slate-600 ring-1 ring-slate-200")}
                        >
                          {c}
                        </span>
                      ))}
                      {r.spanish ? (
                        <span className={pill("bg-[#2A7F8E]/8 text-[#2A7F8E] ring-1 ring-[#2A7F8E]/20")}>
                          Español
                        </span>
                      ) : null}
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-col gap-2">
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-2xl bg-white px-3 py-2 text-xs font-semibold text-slate-700 ring-1 ring-black/10 hover:bg-slate-50 transition-colors"
                    >
                      <span className="flex items-center gap-1.5">
                        <Globe className="h-3.5 w-3.5" />
                        Site
                      </span>
                    </a>
                    <button
                      onClick={() =>
                        alert("Prototype: click-to-call would trigger a phone dialer on mobile.")
                      }
                      className="rounded-2xl bg-[#1B3A5C] px-3 py-2 text-xs font-semibold text-white hover:bg-[#152e49] transition-colors"
                    >
                      <span className="flex items-center gap-1.5">
                        <Phone className="h-3.5 w-3.5" />
                        Call
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4">
        <SafeNotice />
      </div>
    </div>
  );
}

// ─── wellness screen ───────────────────────────────────────────────────────────

function WellnessScreen() {
  const [mood, setMood] = useState(3);
  const moodConfig = [
    { n: 1, label: "Really bad", color: "bg-slate-400", active: "bg-slate-500 ring-slate-400/40" },
    { n: 2, label: "Bad",        color: "bg-slate-300", active: "bg-slate-400 ring-slate-300/40" },
    { n: 3, label: "Meh",        color: "bg-[#2A7F8E]/50", active: "bg-[#2A7F8E] ring-[#2A7F8E]/30" },
    { n: 4, label: "Okay",       color: "bg-[#2A7F8E]/75", active: "bg-[#2A7F8E] ring-[#2A7F8E]/30" },
    { n: 5, label: "Good",       color: "bg-[#D97706]/60", active: "bg-[#D97706] ring-[#D97706]/30" },
  ];
  const currentMood = moodConfig[mood - 1];

  return (
    <div className="px-4 pb-28 pt-4">
      <SectionTitle
        icon={HeartPulse}
        title="Wellness Check‑In"
        subtitle="Quick calm‑down tools + help links. Not therapy."
        iconClassName="bg-rose-400/10 text-rose-600"
      />

      {/* Mood scale */}
      <div className="mt-4 rounded-3xl bg-white/85 p-4 ring-1 ring-black/5 shadow-sm">
        <div className="text-sm font-semibold text-[#1B3A5C] mb-3">How are you feeling right now?</div>
        <div className="flex items-center justify-between gap-2">
          {moodConfig.map((m) => (
            <button
              key={m.n}
              onClick={() => setMood(m.n)}
              className={
                "flex flex-col items-center gap-1.5 rounded-2xl p-2 flex-1 transition-all " +
                (mood === m.n ? "bg-slate-50 ring-1 ring-black/8" : "")
              }
              aria-label={m.label}
            >
              <div
                className={
                  "h-8 w-8 rounded-full transition-all " +
                  (mood === m.n ? `${m.active} ring-4 shadow-sm` : m.color)
                }
              />
              <div className={`text-[10px] font-semibold ${mood === m.n ? "text-slate-800" : "text-slate-400"} leading-tight text-center`}>
                {m.label}
              </div>
            </button>
          ))}
        </div>
        <div className="mt-3 text-center text-xs text-slate-500">
          Feeling: <span className="font-semibold text-slate-700">{currentMood.label}</span>
        </div>
      </div>

      <div className="mt-4 grid gap-3">
        <Card accentColor="bg-[#2A7F8E]">
          <SectionTitle
            icon={CheckCircle2}
            title="One-minute reset"
            subtitle="Try box breathing or a grounding exercise."
            iconClassName="bg-[#2A7F8E]/10 text-[#2A7F8E]"
          />
          <div className="mt-3 rounded-2xl bg-[#2A7F8E]/5 p-4 ring-1 ring-[#2A7F8E]/15">
            <div className="text-sm font-semibold text-[#1B3A5C]">Box breathing (4‑4‑4‑4)</div>
            <div className="mt-2 grid grid-cols-4 gap-1.5">
              {["Breathe in\n4 sec", "Hold\n4 sec", "Breathe out\n4 sec", "Hold\n4 sec"].map((step) => (
                <div key={step} className="rounded-xl bg-white p-2 text-center ring-1 ring-[#2A7F8E]/15">
                  <div className="whitespace-pre-line text-[10px] text-slate-600 leading-tight">{step}</div>
                </div>
              ))}
            </div>
            <div className="mt-2 text-center text-[11px] text-slate-500">Repeat 3 times</div>
          </div>
        </Card>

        <Card accentColor="bg-rose-400">
          <SectionTitle
            icon={Users}
            title="Want to talk to a person?"
            subtitle="These are real people you can contact right now."
            iconClassName="bg-rose-400/10 text-rose-600"
          />
          <div className="mt-3 grid gap-2">
            {CRISIS_PINS.slice(0, 2).map((c) => (
              <a
                key={c.name}
                href={c.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between rounded-2xl bg-white px-3 py-3 text-sm font-semibold ring-1 ring-black/8 hover:bg-slate-50 transition-colors"
              >
                <span className="text-slate-800">
                  {c.name}
                  <span className="ml-2 text-xs font-normal text-slate-500">· {c.how}</span>
                </span>
                <ExternalLink className="h-4 w-4 text-slate-400" />
              </a>
            ))}
          </div>
        </Card>

        <div className="rounded-3xl bg-slate-50/80 p-4 ring-1 ring-slate-200/80 shadow-sm">
          <div className="text-xs font-semibold text-slate-700">Hard boundary</div>
          <div className="mt-1.5 text-xs text-slate-500 leading-relaxed">
            This app can't treat mental health. If you feel unsafe or like you might hurt yourself, use the crisis links right away or call 911.
          </div>
        </div>
      </div>

      <div className="mt-4">
        <SafeNotice />
      </div>
    </div>
  );
}

// ─── chat modal ─────────────────────────────────────────────────────────────────

function ChatModal({
  open,
  onClose,
  prefs,
  onNavigate,
}: {
  open: boolean;
  onClose: () => void;
  prefs: Prefs;
  onNavigate: (route: string) => void;
}) {
  const [text, setText] = useState("");
  const [msgs, setMsgs] = useState<
    Array<{
      role: string;
      text?: string;
      title?: string;
      body?: string;
      cites?: string[];
      kind?: string;
    }>
  >([]);
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    if (!open) {
      timeout = setTimeout(() => {
        setMsgs([]);
        setText("");
      }, 300);
    }
    return () => clearTimeout(timeout);
  }, [open]);

  useEffect(() => {
    if (!listRef.current) return;
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [msgs]);

  const prompts = useMemo(() => {
    const base = [
      "What's a permanency hearing?",
      "Can I see my brother or sister?",
      "How do I get my birth certificate?",
      "How can I pay for college?",
      "I feel stressed and need support",
    ];
    if (prefs.tribal) base.unshift("What does ICWA mean for my case?");
    return base;
  }, [prefs.tribal]);

  const send = (q?: string) => {
    const trimmed = (q ?? text).trim();
    if (!trimmed) return;

    const userMsg = { role: "user", text: trimmed };
    const reply = aiSimReply({ q: trimmed, prefs });
    const botMsg = { role: "bot", ...reply };

    setMsgs((m) => [...m, userMsg, botMsg]);
    setText("");

    if (reply.kind === "crisis") {
      onNavigate("resources");
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Ask FosterGuide (simulated)">
      {/* Disclosure */}
      <div className="rounded-2xl bg-[#2A7F8E]/8 p-3 ring-1 ring-[#2A7F8E]/20">
        <div className="text-xs font-semibold text-[#1B3A5C]">I can share info and next steps</div>
        <div className="mt-0.5 text-xs text-slate-600">
          I'm not a counselor or a friend — I share Arizona-specific info and trusted links.
        </div>
      </div>

      {/* Message thread */}
      <div ref={listRef} className="mt-3 max-h-[42vh] space-y-3 overflow-y-auto pr-1">
        {msgs.length === 0 ? (
          <div className="rounded-2xl bg-slate-50 p-3 text-sm text-slate-500 ring-1 ring-black/8">
            Try a prompt below, or type your own question.
          </div>
        ) : null}

        {msgs.map((m, idx) => {
          const isUser = m.role === "user";
          return (
            <div key={idx} className={"flex " + (isUser ? "justify-end" : "justify-start")}>
              {isUser ? (
                <div className="max-w-[80%] rounded-3xl rounded-br-md bg-[#1B3A5C] px-4 py-2.5 text-sm text-white shadow-sm">
                  {m.text}
                </div>
              ) : (
                <div className="max-w-[88%] overflow-hidden rounded-3xl rounded-bl-md bg-white shadow-sm ring-1 ring-black/8 flex">
                  <div className="w-1 shrink-0 bg-[#2A7F8E]" />
                  <div className="flex-1 p-3">
                    <div className="text-xs font-bold text-[#1B3A5C]">{m.title}</div>
                    <div className="mt-1 text-sm text-slate-700 leading-relaxed">{m.body}</div>
                    <CitationsRow cites={m.cites} />
                    <div className="mt-2 text-[10px] text-slate-400">
                      For help with your case, talk to your lawyer or caseworker.
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Suggested prompts */}
      <div className="mt-3">
        <div className="flex flex-wrap gap-1.5">
          {prompts.slice(0, 5).map((p) => (
            <button
              key={p}
              onClick={() => send(p)}
              className="rounded-full bg-[#1B3A5C]/5 px-3 py-1.5 text-xs font-semibold text-[#1B3A5C] ring-1 ring-[#1B3A5C]/15 hover:bg-[#1B3A5C]/10 transition-colors"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="mt-3 flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a question…"
          className="w-full rounded-2xl bg-white px-3 py-2.5 text-sm ring-1 ring-black/10 outline-none focus:ring-2 focus:ring-[#2A7F8E]/35 transition-all"
          onKeyDown={(e) => {
            if (e.key === "Enter") send();
          }}
        />
        <button
          onClick={() => send()}
          className="rounded-2xl bg-[#1B3A5C] px-4 py-2 text-sm font-semibold text-white hover:bg-[#152e49] transition-colors shadow-sm"
        >
          Send
        </button>
      </div>

      <div className="mt-2 text-[10px] text-slate-400">
        Messages clear when you close this window — no history is stored.
      </div>
    </Modal>
  );
}

// ─── self-tests ────────────────────────────────────────────────────────────────

function runSelfTests() {
  const assert = (cond: boolean, msg: string) => {
    if (!cond) throw new Error(`Self-test failed: ${msg}`);
  };

  assert(JSON.stringify(bandToRange("10-12")) === JSON.stringify([10, 12]), "bandToRange 10-12");
  assert(JSON.stringify(bandToRange("18-21")) === JSON.stringify([18, 21]), "bandToRange 18-21");
  assert(isCrisis("I want to die") === true, "isCrisis detects self-harm phrase");
  assert(isCrisis("I love pizza") === false, "isCrisis ignores benign text");

  const prefs: Prefs = {
    language: "en",
    ageBand: "16-17",
    county: "Maricopa",
    pathway: "future",
    tribal: false,
  };

  const r1 = aiSimReply({ q: "What is a permanency hearing?", prefs });
  assert(r1.kind === "normal", "aiSimReply normal path");

  const r2 = aiSimReply({ q: "I want to kill myself", prefs });
  assert(r2.kind === "crisis", "aiSimReply crisis path");

  const r3 = aiSimReply({ q: "What is the capital of France?", prefs });
  assert(r3.kind === "normal" && r3.title.includes("Arizona"), "aiSimReply out-of-scope");
}

// ─── root component ────────────────────────────────────────────────────────────

export default function FosterGuideAZPrototype() {
  const [prefs, setPrefs] = useLocalPref<Prefs>("fgaz_prefs", {
    language: null,
    ageBand: null,
    county: null,
    pathway: null,
    tribal: false,
  });

  const [route, setRoute] = useState("onboarding");
  const [chatOpen, setChatOpen] = useState(false);
  const [toast, setToast] = useState<{ title: string; body: string } | null>(null);

  useEffect(() => {
    try {
      // @ts-expect-error - process might not be defined in browser
      const isDev = typeof process !== "undefined" && process?.env?.NODE_ENV !== "production";
      if (isDev) runSelfTests();
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Gentle session boundary reminder (20 minutes)
  useEffect(() => {
    const t = setTimeout(() => {
      setToast({
        title: "Break reminder",
        body: "You've been here a while. Want to take a break? You can come back anytime.",
      });
    }, 20 * 60 * 1000);
    return () => clearTimeout(t);
  }, []);

  const onDoneOnboarding = () => {
    const tab =
      prefs.pathway === "rights"
        ? "rights"
        : prefs.pathway === "court"
          ? "case"
          : prefs.pathway === "future"
            ? "future"
            : prefs.pathway === "resources"
              ? "resources"
              : prefs.pathway === "wellness"
                ? "wellness"
                : "home";
    setRoute(tab);
  };

  const onReset = () => {
    setPrefs({ language: null, ageBand: null, county: null, pathway: null, tribal: false });
    setRoute("onboarding");
  };

  const quickExit = () => {
    window.open("https://www.google.com", "_blank", "noopener,noreferrer");
    setToast({ title: "Quick Exit", body: "Opened a neutral page in a new tab (prototype behavior)." });
  };

  const titleByRoute: Record<string, string> = {
    onboarding: "FosterGuide AZ",
    home: "Home",
    rights: "My Rights",
    case: "My Case",
    future: "My Future",
    resources: "Resources",
    wellness: "Wellness",
  };

  const main = () => {
    if (route === "onboarding") {
      return <Onboarding prefs={prefs} setPrefs={setPrefs} onDone={onDoneOnboarding} />;
    }
    if (route === "home") {
      return (
        <HomeScreen
          prefs={prefs}
          onGo={(r) => setRoute(r)}
          onOpenChat={() => setChatOpen(true)}
          onReset={onReset}
        />
      );
    }
    if (route === "rights") return <RightsScreen prefs={prefs} />;
    if (route === "case") return <CaseScreen prefs={prefs} />;
    if (route === "future") return <FutureScreen prefs={prefs} />;
    if (route === "resources") return <ResourcesScreen prefs={prefs} />;
    if (route === "wellness") return <WellnessScreen />;
    return null;
  };

  const showTabs = route !== "onboarding";

  return (
    <div
      className="min-h-screen text-slate-900"
      style={{
        background:
          "radial-gradient(ellipse at 85% 8%, rgba(42,127,142,0.13) 0%, transparent 52%), " +
          "radial-gradient(ellipse at 15% 92%, rgba(217,119,6,0.09) 0%, transparent 50%), " +
          "#F5F2EE",
      }}
    >
      <div className="mx-auto max-w-md">
        <TopBar
          title={titleByRoute[route] || "FosterGuide AZ"}
          onQuickExit={quickExit}
          onOpenChat={() => setChatOpen(true)}
          onBack={route !== "onboarding" && route !== "home" ? () => setRoute("home") : undefined}
        />

        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={route}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
            >
              {main()}
            </motion.div>
          </AnimatePresence>
        </div>

        {showTabs ? <TabBar active={route} onGo={(r) => setRoute(r)} /> : null}

        <ChatModal
          open={chatOpen}
          onClose={() => setChatOpen(false)}
          prefs={prefs}
          onNavigate={(r) => setRoute(r)}
        />

        {/* Toast */}
        <AnimatePresence>
          {toast ? (
            <motion.div
              className="fixed bottom-20 left-0 right-0 z-[60] mx-auto max-w-md px-4"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 14 }}
            >
              <div className="rounded-3xl bg-[#1B3A5C] px-4 py-3 text-white shadow-xl">
                <div className="text-sm font-semibold">{toast.title}</div>
                <div className="mt-0.5 text-xs text-white/70">{toast.body}</div>
                <div className="mt-2 flex justify-end">
                  <button
                    onClick={() => setToast(null)}
                    className="rounded-2xl bg-white/10 px-3 py-1.5 text-xs font-semibold hover:bg-white/15 transition-colors"
                  >
                    OK
                  </button>
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        {/* Floating chat button */}
        {showTabs ? (
          <button
            onClick={() => setChatOpen(true)}
            className="fixed bottom-24 right-4 z-50 rounded-full bg-[#D97706] p-4 text-white shadow-xl hover:brightness-105 active:scale-[0.97] transition-all"
            aria-label="Open chat"
            title="Ask FosterGuide"
          >
            <MessageCircle className="h-6 w-6" />
          </button>
        ) : null}
      </div>
    </div>
  );
}
