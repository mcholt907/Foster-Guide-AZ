import { expect, test } from "@playwright/test";
import { expectCallLinks, searchBox, setBand } from "./helpers";

test.describe('"Need help now?" button', () => {
  for (const band of ["10-12", "16-17"] as const) {
    test(`opens a sheet with 911 and 988, and Escape closes it (band ${band})`, async ({ page }) => {
      await setBand(page, band);
      await page.goto("/en");

      const button = page.getByRole("button", { name: /need help now/i });
      await button.click();

      const dialog = page.getByRole("dialog");
      await expect(dialog).toBeVisible();
      await expectCallLinks(dialog);
      // DCS child abuse hotline
      await expect(dialog.locator('a[href="tel:18887672445"]').first()).toBeVisible();

      await page.keyboard.press("Escape");
      await expect(dialog).toBeHidden();
      await expect(button).toBeFocused();
    });
  }

  test("is on the language picker and setup screens too", async ({ page }) => {
    for (const path of ["/", "/en/setup"]) {
      await page.goto(path);
      await page.getByRole("button", { name: /need help now|necesitas ayuda/i }).first().click();
      await expectCallLinks(page.getByRole("dialog"));
      await page.keyboard.press("Escape");
      await expect(page.getByRole("dialog")).toBeHidden();
    }
  });

  test("works in Spanish", async ({ page }) => {
    await setBand(page, "13-15");
    await page.goto("/es");
    await page.getByRole("button", { name: /necesitas ayuda/i }).click();
    await expectCallLinks(page.getByRole("dialog"));
  });
});

test.describe("Find Answers", () => {
  for (const band of ["10-12", "16-17"] as const) {
    test(`"i want to die" shows people to call first (band ${band})`, async ({ page }) => {
      await setBand(page, band);
      await page.goto("/en/ask");
      await searchBox(page).fill("i want to die");
      await expectCallLinks(page.locator("main"));
    });

    test(`a nonsense search shows the empty state with people to call (band ${band})`, async ({ page }) => {
      await setBand(page, band);
      await page.goto("/en/ask");
      await expect(page.locator('main a[href="tel:988"]')).toHaveCount(0);
      await searchBox(page).fill("zzqxvkw");
      await expectCallLinks(page.locator("main"));
    });

    test(`"will i see my siblings" finds the siblings answer (band ${band})`, async ({ page }) => {
      await setBand(page, band);
      await page.goto("/en/ask");
      await searchBox(page).fill("will i see my siblings");
      await expect(page.locator("main").getByText(/brothers? (and|or) sisters?|siblings/i).first()).toBeVisible();
      await expect(page.locator('main a[href="tel:988"]')).toHaveCount(0);
    });
  }
});

test.describe("Wellness check-in", () => {
  for (const band of ["10-12", "16-17"] as const) {
    test(`"Really bad" shows people to call right away (band ${band})`, async ({ page }) => {
      await setBand(page, band);
      await page.goto("/en/wellness");
      await page.getByRole("button", { name: /really bad/i }).click();
      await expectCallLinks(page.locator("main"));

      // Saying "Yes, I'm in danger" keeps the call links on screen.
      await page.getByRole("button", { name: /^yes$/i }).click();
      await expectCallLinks(page.locator("main"));
    });
  }
});
