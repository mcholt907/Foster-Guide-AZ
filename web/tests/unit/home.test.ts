import { describe, expect, test } from "vitest";
import { STARTER_QUESTIONS, LEFT_CARE_STARTERS, LEFT_CARE_STEPS } from "../../src/lib/i18n-home";
import { QUESTIONS } from "../../src/data/questions";
import { searchQuestions } from "../../src/lib/questionSearch";

describe("Home starter questions", () => {
  for (const band of ["13-15", "16-17", "18-21"] as const) {
    for (const s of STARTER_QUESTIONS[band]) {
      test(`${band}: "${s.label.en}" opens an answer that band can see`, () => {
        const q = QUESTIONS.find((x) => x.id === s.answerId);
        expect(q, `no question with id ${s.answerId}`).toBeTruthy();
        expect(q!.ageBands as readonly string[]).toContain(band);
        expect(s.label.en.trim()).not.toBe("");
        expect(s.label.es.trim()).not.toBe("");
      });
    }
  }
});

describe("Coming back to foster care", () => {
  for (const phrase of ["can i come back to foster care", "i left foster care can i return", "puedo regresar al cuidado de crianza"]) {
    test(`"${phrase}" finds the returning-to-care answer first`, async () => {
      const r = await searchQuestions(phrase, { band: "18-21", limit: 1 });
      expect(r[0]?.id).toBe("q-come-back-to-care");
    });
  }
});

describe("Left foster care (18-21)", () => {
  const targets = [
    ...LEFT_CARE_STARTERS.map((s) => ({ what: s.label.en, id: s.answerId, es: s.label.es })),
    ...LEFT_CARE_STEPS.map((s) => ({ what: s.title.en, id: s.answerId, es: s.title.es })),
  ];
  for (const t of targets) {
    test(`"${t.what}" opens an answer 18-21 can see`, () => {
      const q = QUESTIONS.find((x) => x.id === t.id);
      expect(q, `no question with id ${t.id}`).toBeTruthy();
      expect(q!.ageBands as readonly string[]).toContain("18-21");
      expect(t.es.trim()).not.toBe("");
    });
  }

  test("no start-here step tells a young adult to ask a caseworker", () => {
    for (const s of LEFT_CARE_STEPS) {
      expect(s.body.en.toLowerCase()).not.toContain("caseworker");
      expect(s.body.es.toLowerCase()).not.toContain("trabajador");
    }
  });
});
