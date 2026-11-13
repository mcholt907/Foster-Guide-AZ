"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Shield, ChevronRight, Search, HeartHandshake,
  Users, FolderOpen, HeartPulse, HelpCircle, MapPin, Sparkles,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Lang } from "../../lib/i18n";
import { tt, ttBand } from "../../lib/i18n-teen";
import { tho, STARTER_QUESTIONS } from "../../lib/i18n-home";
import type { AgeBandKey } from "../../lib/prefs";

interface DashboardTeenProps {
  lang: Lang;
  band: AgeBandKey;
}

interface Tile {
  id: string;
  href: string;
  Icon: LucideIcon;
  title: (lang: Lang) => string;
  desc: (lang: Lang) => string;
  /** Soft background + icon colour for the chip. Titles stay navy. */
  chip: string;
  /** Bands that see this tile. Omit for all teen bands. */
  bands?: AgeBandKey[];
}

const TILES: Tile[] = [
  {
    id: "case", href: "/case", Icon: FolderOpen, chip: "bg-sky-100 text-sky-800",
    title: (l) => tt("dashboard.tile.case.title", l), desc: (l) => tt("dashboard.tile.case.desc", l),
  },
  {
    id: "team", href: "/team", Icon: Users, chip: "bg-amber-100 text-amber-800",
    title: (l) => tt("dashboard.tile.team.title", l), desc: (l) => tt("dashboard.tile.team.desc", l),
  },
  {
    id: "rights", href: "/rights", Icon: Shield, chip: "bg-emerald-100 text-emerald-800",
    title: (l) => tt("nav.rights", l), desc: (l) => tho("home.tile.rights.desc", l),
  },
  {
    id: "answers", href: "/ask", Icon: HelpCircle, chip: "bg-[#E3F1F3] text-[#1F6B78]",
    title: (l) => tt("dashboard.tile.answers.title", l), desc: (l) => tt("dashboard.tile.answers.desc", l),
  },
  {
    id: "wellness", href: "/wellness", Icon: HeartPulse, chip: "bg-violet-100 text-violet-800",
    title: (l) => tt("dashboard.tile.wellness.title", l), desc: (l) => tt("dashboard.tile.wellness.desc", l),
  },
  {
    id: "resources", href: "/resources", Icon: MapPin, chip: "bg-indigo-100 text-indigo-800",
    title: (l) => tt("nav.resources", l), desc: (l) => tho("home.tile.resources.desc", l),
  },
  {
    id: "future", href: "/future", Icon: Sparkles, chip: "bg-orange-100 text-orange-800",
    title: (l) => tt("nav.future", l), desc: (l) => tho("home.tile.future.desc", l),
    bands: ["16-17", "18-21"],
  },
];

export function DashboardTeen({ lang, band }: DashboardTeenProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const askHref = (q: string) => `/${lang}/ask${q.trim() ? `?q=${encodeURIComponent(q.trim())}` : ""}`;
  const starters = band === "10-12" ? [] : STARTER_QUESTIONS[band];
  const tiles = TILES.filter((t) => !t.bands || t.bands.includes(band));

  return (
    <div className="max-w-[1240px] mx-auto px-4 pt-6 pb-12 sm:px-12 sm:py-16">
      {/* Start here: a warm welcome, a question box, and questions other youth ask */}
      <section className="relative mb-10 sm:mb-14 overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] border border-[#F5D9A8]/50 bg-[linear-gradient(135deg,#FEF3DC_0%,#FBF6EE_45%,#E3F1F3_100%)] px-5 py-7 sm:px-10 sm:py-10 shadow-[0_16px_48px_rgba(180,83,9,0.06)]">
        {/* Soft shapes, decoration only */}
        <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-[#F7C873]/30 blur-2xl" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-24 right-1/3 h-56 w-56 rounded-full bg-[#8FCBD3]/25 blur-2xl" />

        <div className="relative flex items-start gap-6">
          <div className="min-w-0 flex-1 max-w-3xl">
            <p className="text-base sm:text-lg font-bold text-[#B45309]">{tho("home.hello", lang)}</p>
            <h1 className="mt-1 text-3xl sm:text-5xl font-black text-[#1a2f44] tracking-tight leading-[1.05]">
              {tho("home.title", lang)}
            </h1>
            <p className="mt-4 text-lg sm:text-xl font-semibold leading-snug text-[#1a2f44]">{tho("home.reassure", lang)}</p>
            <p className="mt-2 text-base sm:text-lg font-medium text-slate-600">{tho("home.subtitle", lang)}</p>
          </div>
          <div aria-hidden="true" className="hidden md:block shrink-0 rotate-3 rounded-[2rem] bg-white p-2 shadow-[0_16px_40px_rgba(26,47,68,0.12)]">
            <Image src="/onboarding/welcome_icon.png" alt="" width={144} height={144} className="h-32 w-32 rounded-[1.5rem] object-cover" />
          </div>
        </div>

        <div className="relative max-w-3xl">
        <form
          role="search"
          className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-stretch"
          onSubmit={(e) => {
            e.preventDefault();
            router.push(askHref(query));
          }}
        >
          <div className="relative flex-1 min-w-0">
            <Search size={20} strokeWidth={2.5} aria-hidden="true" className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1F6B78]" />
            <input
              id="home-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label={tho("home.search.label", lang)}
              placeholder={tho("home.search.placeholder", lang)}
              className="w-full min-h-14 rounded-2xl border border-slate-200 bg-white pl-12 pr-4 text-base font-medium text-slate-800 shadow-sm placeholder:text-slate-500 focus:outline-none focus:ring-4 focus:ring-[#2A7F8E]/25 focus:border-[#2A7F8E]"
            />
          </div>
          <button
            type="submit"
            className="min-h-14 shrink-0 rounded-2xl bg-[#1a2f44] px-5 sm:px-7 text-base font-bold text-white transition hover:bg-[#24405c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2A7F8E]"
          >
            {tho("home.search.button", lang)}
          </button>
        </form>

        {starters.length > 0 && (
          <div className="mt-5">
            <h2 className="text-sm font-bold text-slate-700">{tho("home.starters.label", lang)}</h2>
            <ul className="mt-2 flex flex-wrap gap-2">
              {starters.map((s) => (
                <li key={s.answerId}>
                  <Link
                    href={`${askHref(s.label[lang])}&a=${s.answerId}`}
                    className="inline-flex min-h-11 items-center rounded-full border border-[#2A7F8E]/25 bg-white px-4 py-2 text-[15px] font-semibold text-[#1a2f44] shadow-sm transition hover:bg-[#E3F1F3] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2A7F8E]"
                  >
                    {s.label[lang]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        <p className="mt-5 flex items-start gap-2 text-sm font-medium text-slate-700">
          <Shield size={16} strokeWidth={2.5} aria-hidden="true" className="mt-0.5 shrink-0 text-emerald-700" />
          {tt("dashboard.privacy.body", lang)}
        </p>
        </div>
      </section>

      {/* Every section, as a short tappable tile */}
      <section aria-labelledby="home-tiles">
        <h2 id="home-tiles" className="mb-4 text-sm font-bold text-slate-600">{tho("home.tiles.label", lang)}</h2>
        <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 sm:gap-4">
          {tiles.map((tile) => (
            <li key={tile.id} className="min-w-0">
              <Link
                href={`/${lang}${tile.href}`}
                className="group flex h-full items-start gap-4 rounded-3xl border border-slate-200/70 bg-white p-5 shadow-[0_8px_24px_rgba(26,47,68,0.04)] transition hover:-translate-y-0.5 hover:border-[#2A7F8E]/40 hover:shadow-[0_16px_40px_rgba(26,47,68,0.10)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2A7F8E]"
              >
                <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${tile.chip}`}>
                  <tile.Icon size={22} strokeWidth={2.25} aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-lg font-black tracking-tight text-[#1a2f44]">{tile.title(lang)}</span>
                  <span className="mt-1 block text-sm font-medium leading-relaxed text-slate-600">{tile.desc(lang)}</span>
                </span>
                <ChevronRight
                  size={20}
                  strokeWidth={2.5}
                  aria-hidden="true"
                  className="mt-3 shrink-0 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-[#1F6B78]"
                />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Tip */}
      <section className="mt-8 sm:mt-10 flex flex-col gap-4 rounded-3xl bg-[#1a2f44] p-6 text-white sm:flex-row sm:items-center sm:gap-6 sm:p-8">
        <div aria-hidden="true" className="h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-white p-1">
          <Image src="/compass_avatar.png" alt="" width={56} height={56} className="h-full w-full rounded-xl object-cover" />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-bold uppercase tracking-widest text-emerald-300">{tt("dashboard.tip.heading", lang)}</h2>
          <p className="mt-1 text-base font-semibold leading-relaxed text-slate-100">{ttBand("dashboard.tip", band, lang)}</p>
        </div>
        <Link
          href={`/${lang}/team`}
          className="inline-flex min-h-11 shrink-0 items-center gap-2 self-start rounded-full bg-white/10 px-5 py-2 text-sm font-bold text-white transition hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300 sm:self-center"
        >
          {tt("dashboard.tile.team.cta", lang)} <ChevronRight size={16} strokeWidth={2.5} aria-hidden="true" />
        </Link>
      </section>

      {/* A gentle note to end on */}
      <section className="mt-6 flex items-start gap-4 rounded-3xl border border-[#F5D9A8]/60 bg-[#FEF6E7] p-6 sm:p-8">
        <span aria-hidden="true" className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-[#B45309]">
          <HeartHandshake size={24} strokeWidth={2.25} />
        </span>
        <div className="min-w-0">
          <h2 className="text-lg font-black tracking-tight text-[#1a2f44]">{tho("home.closing.title", lang)}</h2>
          <p className="mt-1 text-base font-medium leading-relaxed text-slate-700">{tho("home.closing.body", lang)}</p>
        </div>
      </section>
    </div>
  );
}
