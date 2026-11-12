import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { describe, expect, it } from "vitest";
import { SRC_ROOT, sourceFiles } from "./helpers";
import { TEEN_STRINGS, ttBand } from "../../src/lib/i18n-teen";
import { twBand } from "../../src/lib/i18n-wellness";

type Pair = { en: string; es: string };
type Table = Record<string, Pair>;

const isPair = (v: unknown): v is Pair =>
  !!v && typeof v === "object" && typeof (v as Pair).en === "string" && typeof (v as Pair).es === "string";

const LIB = join(SRC_ROOT, "lib");
const I18N_FILES = readdirSync(LIB).filter((f) => /^i18n(-[\w-]+)?\.ts$/.test(f)).sort();

/** Quoted keys of the string table in a file: `"some.key": {` at line start. */
function keysInSource(file: string): string[] {
  const text = readFileSync(join(LIB, file), "utf8");
  return Array.from(text.matchAll(/^\s*["']([\w.\-]+)["']\s*:\s*\{/gm), (m) => m[1]);
}

/**
 * Load every string of an i18n module as { key: { en, es } }.
 * Exported tables are read directly. Tables that are not exported are read
 * through the module's lookup function (tc / th / tr / tw ...) using the keys
 * found in the source text.
 */
async function loadTable(file: string): Promise<Table> {
  const mod = (await import(/* @vite-ignore */ pathToFileURL(join(LIB, file)).href)) as Record<string, unknown>;
  const table: Table = {};

  for (const value of Object.values(mod)) {
    if (!value || typeof value !== "object") continue;
    const entries = Object.entries(value as Record<string, unknown>);
    if (entries.length > 0 && entries.every(([, v]) => isPair(v))) {
      Object.assign(table, value as Table);
    }
  }

  const missing = keysInSource(file).filter((k) => !(k in table));
  if (missing.length > 0) {
    const lookups = Object.values(mod).filter((v): v is (key: string, lang: string) => unknown => {
      if (typeof v !== "function") return false;
      try {
        return typeof (v as (k: string, l: string) => unknown)(missing[0], "en") === "string";
      } catch {
        return false;
      }
    });
    for (const key of missing) {
      for (const lookup of lookups) {
        try {
          const en = lookup(key, "en");
          const es = lookup(key, "es");
          if (typeof en === "string" && typeof es === "string") {
            table[key] = { en, es };
            break;
          }
        } catch {
          /* try the next exported function */
        }
      }
    }
  }
  return table;
}

describe("i18n string tables", () => {
  it("finds the i18n modules", () => {
    expect(I18N_FILES).toContain("i18n.ts");
    expect(I18N_FILES).toContain("i18n-teen.ts");
  });

  describe.each(I18N_FILES)("%s", (file) => {
    it("has strings, and every key in the file can be read", async () => {
      const table = await loadTable(file);
      const keys = keysInSource(file);
      expect(Object.keys(table).length).toBeGreaterThan(0);
      expect(keys.filter((k) => !(k in table))).toEqual([]);
    });

    it("has non-empty English and Spanish for every key", async () => {
      const table = await loadTable(file);
      const empty = Object.entries(table)
        .filter(([, v]) => !isPair(v) || v.en.trim() === "" || v.es.trim() === "")
        .map(([k]) => k);
      expect(empty).toEqual([]);
    });

    it('never says "adoptiv…" in Spanish (foster care is "cuidado de crianza")', async () => {
      const table = await loadTable(file);
      const bad = Object.entries(table)
        .filter(([, v]) => /adoptiv/i.test(v.es))
        .map(([k]) => k);
      expect(bad).toEqual([]);
    });
  });
});

describe("band-specific teen strings (ttBand)", () => {
  const SUFFIXES = ["1315", "1617", "1821"] as const;
  const TEEN_BANDS = ["13-15", "16-17", "18-21"] as const;
  const teenKeys = new Set(Object.keys(TEEN_STRINGS));

  // Every ttBand("some.base", ...) call in the app, with a literal base.
  const basesInCode = new Set<string>();
  for (const { path, text } of sourceFiles()) {
    if (path.endsWith("i18n-teen.ts")) continue;
    for (const m of text.matchAll(/\bttBand\(\s*["'`]([\w.\-]+)["'`]\s*,/g)) basesInCode.add(m[1]);
  }

  it("finds ttBand calls in the source", () => {
    expect(basesInCode.size).toBeGreaterThan(0);
  });

  it.each(Array.from(basesInCode))('"%s" resolves for all three teen bands', (base) => {
    for (const suffix of SUFFIXES) expect(teenKeys, `${base}.${suffix}`).toContain(`${base}.${suffix}`);
    for (const band of TEEN_BANDS) {
      for (const lang of ["en", "es"] as const) {
        expect(ttBand(base, band, lang).trim(), `${base} ${band} ${lang}`).not.toBe("");
      }
    }
  });

  it("every band-suffixed key has its two sibling bands", () => {
    const incomplete: string[] = [];
    for (const key of teenKeys) {
      const m = key.match(/^(.*)\.(1315|1617|1821)$/);
      if (!m) continue;
      for (const suffix of SUFFIXES) {
        if (!teenKeys.has(`${m[1]}.${suffix}`)) incomplete.push(`${m[1]}.${suffix}`);
      }
    }
    expect(incomplete).toEqual([]);
  });
});

describe("tiered wellness strings (twBand)", () => {
  it("every .kid / .mid / .older key has all three tiers and resolves for all bands", () => {
    const keys = new Set(keysInSource("i18n-wellness.ts"));
    const bases = new Set<string>();
    for (const key of keys) {
      const m = key.match(/^(.*)\.(kid|mid|older)$/);
      if (m) bases.add(m[1]);
    }
    expect(bases.size).toBeGreaterThan(0);
    for (const base of bases) {
      for (const tier of ["kid", "mid", "older"]) expect(keys, `${base}.${tier}`).toContain(`${base}.${tier}`);
      for (const band of ["10-12", "13-15", "16-17", "18-21"] as const) {
        for (const lang of ["en", "es"] as const) {
          const value = twBand(base as Parameters<typeof twBand>[0], band, lang);
          expect(typeof value === "string" && value.trim() !== "", `${base} ${band} ${lang}`).toBe(true);
        }
      }
    }
  });
});
