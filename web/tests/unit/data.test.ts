import { describe, expect, it } from "vitest";
import {
  COUNTIES,
  CRISIS_PINS,
  CRISIS_CONTACTS,
  CRISIS_CONTACTS_COMPACT,
  crisisActions,
  type CrisisContact,
} from "../../src/data/constants";
import { RESOURCES } from "../../src/data/resources";
import { IMPORTANT_DOCS } from "../../src/data/docs";
import { QUESTIONS, TOPIC_CONFIG } from "../../src/data/questions";
import * as courtData from "../../src/data/court";
import * as futureData from "../../src/data/future";
import * as rightsData from "../../src/data/rights";
import { KNOWN_BAD_PHONES, US_PHONE, badPhoneRegex, isPastIsoDate, sourceFiles } from "./helpers";

const AGE_BAND_KEYS = ["10-12", "13-15", "16-17", "18-21"];
const ALL_PINS: readonly CrisisContact[] = CRISIS_PINS;

function duplicates(ids: readonly string[]): string[] {
  return ids.filter((id, i) => ids.indexOf(id) !== i);
}

describe("lastVerified dates", () => {
  it.each([
    ["resources.ts", RESOURCES as readonly { id: string; lastVerified: string }[]],
    ["constants.ts crisis contacts", ALL_PINS as readonly { id: string; lastVerified: string }[]],
    ["docs.ts", IMPORTANT_DOCS as readonly { id: string; lastVerified: string }[]],
  ])("%s: every entry has a real ISO date that is not in the future", (_name, entries) => {
    expect(entries.length).toBeGreaterThan(0);
    const bad = entries.filter((e) => !isPastIsoDate(e.lastVerified)).map((e) => `${e.id}: ${e.lastVerified}`);
    expect(bad).toEqual([]);
  });
});

describe("crisis contacts", () => {
  const allHrefs = (list: readonly CrisisContact[]) =>
    list.flatMap((c) => crisisActions(c, "en").map((a) => a.href));

  it("has unique ids", () => {
    expect(duplicates(ALL_PINS.map((c) => c.id))).toEqual([]);
  });

  it("includes 911, 988 and the DCS hotline 1-888-767-2445", () => {
    const hrefs = allHrefs(CRISIS_CONTACTS);
    expect(hrefs).toContain("tel:911");
    expect(hrefs).toContain("tel:988");
    expect(hrefs).toContain("tel:18887672445");
  });

  it("keeps 911, 988 and the DCS hotline in the short list too", () => {
    const hrefs = allHrefs(CRISIS_CONTACTS_COMPACT);
    expect(hrefs).toEqual(expect.arrayContaining(["tel:911", "tel:988", "tel:18887672445"]));
  });

  it("prints the DCS hotline as 1-888-767-2445", () => {
    const dcs = ALL_PINS.find((c) => c.tel === "18887672445");
    expect(dcs?.telDisplay).toBe("1-888-767-2445");
    expect(dcs?.crisis).toBe(true);
  });

  it("every crisis line can be called or texted", () => {
    const none = CRISIS_CONTACTS.filter((c) => crisisActions(c, "en").length === 0).map((c) => c.id);
    expect(none).toEqual([]);
  });

  it.each(["en", "es"] as const)("builds well-formed tel: and sms: links (%s)", (lang) => {
    for (const c of ALL_PINS) {
      for (const a of crisisActions(c, lang)) {
        if (a.kind === "tel") expect(a.href, c.id).toMatch(/^tel:(?:911|988|1?\d{10})$/);
        else expect(a.href, c.id).toMatch(/^sms:\d{3,11}(?:\?body=[A-Za-z0-9%]+)?$/);
        expect(a.display.trim(), c.id).not.toBe("");
      }
    }
  });

  it("stores dial numbers as digits only, and the printed number matches them", () => {
    const pairs: [keyof CrisisContact, keyof CrisisContact][] = [
      ["tel", "telDisplay"],
      ["telAlt", "telAltDisplay"],
      ["sms", "smsDisplay"],
    ];
    for (const c of ALL_PINS) {
      for (const [raw, display] of pairs) {
        const number = c[raw] as string | undefined;
        if (number === undefined) continue;
        expect(number, `${c.id}.${raw}`).toMatch(/^\d{3,11}$/);
        const shown = c[display] as string | undefined;
        expect(shown, `${c.id}.${display}`).toBeTruthy();
        expect(shown!.replace(/\D/g, ""), `${c.id}.${display}`).toBe(number);
      }
      if (c.telDisplay) expect(c.telDisplay, c.id).toMatch(US_PHONE);
      if (c.telAltDisplay) expect(c.telAltDisplay, c.id).toMatch(US_PHONE);
    }
  });

  it("has English and Spanish text and an https link where there is one", () => {
    for (const c of ALL_PINS) {
      for (const field of ["name", "name_es", "how", "how_es", "desc", "desc_es"] as const) {
        expect(c[field].trim(), `${c.id}.${field}`).not.toBe("");
      }
      if (c.url) expect(c.url, c.id).toMatch(/^https:\/\/\S+$/);
    }
  });
});

describe("resources", () => {
  it("has unique ids", () => {
    expect(duplicates(RESOURCES.map((r) => r.id))).toEqual([]);
  });

  it("only uses real Arizona counties (or Statewide)", () => {
    const allowed = new Set<string>([...COUNTIES, "Statewide"]);
    for (const r of RESOURCES) {
      expect(r.counties.length, r.id).toBeGreaterThan(0);
      for (const county of r.counties) expect(allowed, `${r.id}: ${county}`).toContain(county);
    }
  });

  it("prints phone numbers in a US format (empty means website only)", () => {
    const bad = RESOURCES.filter((r) => r.phone !== "" && !US_PHONE.test(r.phone)).map((r) => `${r.id}: ${r.phone}`);
    expect(bad).toEqual([]);
  });

  it("gives every entry a way to reach it: a phone number or an https website", () => {
    for (const r of RESOURCES) {
      const url: string = r.url ?? "";
      if (url) expect(url, r.id).toMatch(/^https:\/\/\S+$/);
      expect(r.phone !== "" || url !== "", r.id).toBe(true);
    }
  });

  it("has a name, both descriptions, categories and a sane age range", () => {
    for (const r of RESOURCES) {
      expect(r.name.trim(), r.id).not.toBe("");
      expect(r.description.trim(), r.id).not.toBe("");
      expect(r.description_es.trim(), r.id).not.toBe("");
      expect(r.categories.length, r.id).toBeGreaterThan(0);
      const [min, max] = r.ages;
      expect(min, r.id).toBeLessThanOrEqual(max);
    }
  });
});

describe("important documents", () => {
  it("has unique ids and bilingual text", () => {
    expect(duplicates(IMPORTANT_DOCS.map((d) => d.id))).toEqual([]);
    for (const d of IMPORTANT_DOCS) {
      for (const field of ["label", "label_es", "why", "why_es", "contact", "contact_es"] as const) {
        expect(d[field].trim(), `${d.id}.${field}`).not.toBe("");
      }
      expect(d.steps.length, d.id).toBeGreaterThan(0);
      expect(d.steps_es.length, d.id).toBe(d.steps.length);
    }
  });
});

describe("questions", () => {
  const ids = QUESTIONS.map((q) => q.id);
  const idSet = new Set(ids);

  it("has unique ids", () => {
    expect(duplicates(ids)).toEqual([]);
  });

  it("has English and Spanish question, answer and keywords for every entry", () => {
    const problems: string[] = [];
    for (const q of QUESTIONS) {
      for (const lang of ["en", "es"] as const) {
        if (!q.question?.[lang]?.trim()) problems.push(`${q.id}: question.${lang}`);
        if (!q.answer?.[lang]?.trim()) problems.push(`${q.id}: answer.${lang}`);
        if (q.answer1012 && !q.answer1012[lang]?.trim()) problems.push(`${q.id}: answer1012.${lang}`);
        const words = q.keywords?.[lang];
        if (!Array.isArray(words) || words.length === 0 || words.some((w) => !w.trim())) {
          problems.push(`${q.id}: keywords.${lang}`);
        }
      }
    }
    expect(problems).toEqual([]);
  });

  it("uses known age bands and topics, and related ids that exist", () => {
    const topics = new Set(TOPIC_CONFIG.map((t) => t.category));
    for (const q of QUESTIONS) {
      expect(q.ageBands.length, q.id).toBeGreaterThan(0);
      for (const band of q.ageBands) expect(AGE_BAND_KEYS, q.id).toContain(band);
      expect(topics, q.id).toContain(q.category);
      for (const related of q.relatedIds ?? []) expect(idSet, `${q.id} -> ${related}`).toContain(related);
    }
  });

  it("gives 10-12 questions a simpler answer", () => {
    const missing = QUESTIONS.filter((q) => q.ageBands.includes("10-12") && !q.answer1012).map((q) => q.id);
    expect(missing).toEqual([]);
  });
});

describe("phone numbers in the source", () => {
  const files = sourceFiles();

  it.each(KNOWN_BAD_PHONES.map((p) => [p.digits.join("-"), p] as const))(
    "known-bad number %s never reappears in web/src",
    (_label, bad) => {
      const re = badPhoneRegex(bad.digits);
      const hits: string[] = [];
      for (const { path, text } of files) {
        text.split("\n").forEach((line, i) => {
          if (re.test(line)) hits.push(`${path}:${i + 1} (${bad.why})`);
        });
      }
      expect(hits).toEqual([]);
    },
  );

  it("every hard-coded tel: / sms: link is digits only", () => {
    const bad: string[] = [];
    for (const { path, text } of files) {
      text.split("\n").forEach((line, i) => {
        if (/^\s*(\/\/|\/\*|\*)/.test(line)) return; // comments
        for (const m of line.matchAll(/["'`](tel|sms):([^"'`$?]*)/g)) {
          if (m[2] !== "" && !/^\+?\d{3,11}$/.test(m[2])) bad.push(`${path}:${i + 1} ${m[0]}`);
        }
      });
    }
    expect(bad).toEqual([]);
  });

  it("the DCS hotline is always written 1-888-767-2445", () => {
    // Any 888 number starting 767 must be the full, correct hotline.
    const bad: string[] = [];
    for (const { path, text } of files) {
      text.split("\n").forEach((line, i) => {
        for (const m of line.matchAll(/888\D{0,3}767\D{0,3}(\d{0,4})/g)) {
          if (m[1] !== "2445") bad.push(`${path}:${i + 1} ${m[0]}`);
        }
      });
    }
    expect(bad).toEqual([]);
  });
});

describe("Spanish wording in page data", () => {
  // Foster care is "cuidado de crianza" in Spanish, never "adoptivo/a"
  // (that means adopted). Walk every exported data value and check the
  // Spanish fields: `es`, `*_es`, `*Es`.
  const isSpanishKey = (key: string) => key === "es" || /_es$/.test(key) || /[a-z0-9]Es$/.test(key);

  function spanishStrings(value: unknown, inSpanish: boolean, path: string, out: [string, string][]) {
    if (typeof value === "string") {
      if (inSpanish) out.push([path, value]);
    } else if (Array.isArray(value)) {
      value.forEach((v, i) => spanishStrings(v, inSpanish, `${path}[${i}]`, out));
    } else if (value && typeof value === "object" && !(value instanceof Set)) {
      for (const [k, v] of Object.entries(value)) {
        spanishStrings(v, inSpanish || isSpanishKey(k), `${path}.${k}`, out);
      }
    }
  }

  it('never says "adoptiv…"', () => {
    const found: [string, string][] = [];
    const modules = { constants: { CRISIS_PINS }, resources: { RESOURCES }, docs: { IMPORTANT_DOCS }, questions: { QUESTIONS, TOPIC_CONFIG }, court: courtData, future: futureData, rights: rightsData };
    spanishStrings(modules, false, "data", found);
    expect(found.length).toBeGreaterThan(100);
    expect(found.filter(([, text]) => /adoptiv/i.test(text)).map(([path]) => path)).toEqual([]);
  });
});
