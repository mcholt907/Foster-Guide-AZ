import { describe, expect, it } from "vitest";
import * as search from "../../src/lib/questionSearch";
import type { AgeBandKey } from "../../src/lib/prefs";

// searchQuestions may be sync or return a Promise (lazy-loaded index).
// `await` handles both.
async function topIds(query: string, band: AgeBandKey): Promise<string[]> {
  const results = await search.searchQuestions(query, { band });
  return results.map((q) => q.id);
}

const BANDS: AgeBandKey[] = ["10-12", "16-17"];

const CASES: [query: string, expected: string][] = [
  ["will i see my siblings", "q-see-siblings"],
  ["why was i taken", "q-why-was-i-taken"],
  ["am i in trouble", "q-why-was-i-taken"],
  ["sibings", "q-see-siblings"], // typo
  ["hermanos", "q-see-siblings"], // Spanish on any page
  ["abuse", "q-report-abuse"],
];

describe("searchQuestions", () => {
  describe.each(BANDS)("band %s", (band) => {
    it.each(CASES)('"%s" -> %s is the top result', async (query, expected) => {
      const ids = await topIds(query, band);
      expect(ids[0], `results: ${ids.slice(0, 5).join(", ")}`).toBe(expected);
    });

    it("returns nothing for nonsense", async () => {
      expect(await topIds("zzqxvkw", band)).toEqual([]);
    });

    it("only returns questions meant for this band", async () => {
      const results = await search.searchQuestions("court", { band });
      for (const q of results) expect(q.ageBands, q.id).toContain(band);
    });

    it("an empty search lists the questions for the band", async () => {
      const results = await search.searchQuestions("", { band });
      expect(results.length).toBeGreaterThan(5);
    });
  });
});

describe("isCrisisQuery", () => {
  it.each(["i want to die", "kill myself", "me quiero morir", "I Want To Die!", "i wanna kill myself"])(
    'flags "%s"',
    (query) => {
      expect(search.isCrisisQuery(query)).toBe(true);
    },
  );

  it.each(["diet", "food", "my friend", "", "court date", "siblings"])('does not flag "%s"', (query) => {
    expect(search.isCrisisQuery(query)).toBe(false);
  });
});
