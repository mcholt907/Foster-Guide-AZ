import { expect, test } from "@playwright/test";
import { BANDS, ROUTES, expectNoHorizontalOverflow, setBand, watchErrors } from "./helpers";

for (const band of BANDS) {
  test(`band ${band}: the 8 main pages load cleanly on a phone screen`, async ({ page }) => {
    await setBand(page, band);
    const errors = watchErrors(page);

    for (const route of ROUTES) {
      await test.step(`/en${route}`, async () => {
        const response = await page.goto(`/en${route}`);
        expect(response?.status(), `/en${route}`).toBe(200);
        await expect(page.locator("main").first()).toBeVisible();
        // Wait for hydration + the saved band to be applied.
        await expect(page.getByRole("button", { name: /need help now/i })).toBeVisible();
        await page.waitForLoadState("networkidle");
        await expectNoHorizontalOverflow(page);
      });
    }

    expect(errors).toEqual([]);
  });
}

test("Spanish pages load cleanly too", async ({ page }) => {
  await setBand(page, "16-17");
  const errors = watchErrors(page);
  for (const route of ROUTES) {
    await test.step(`/es${route}`, async () => {
      const response = await page.goto(`/es${route}`);
      expect(response?.status(), `/es${route}`).toBe(200);
      await expect(page.locator("html")).toHaveAttribute("lang", "es");
      await page.waitForLoadState("networkidle");
      await expectNoHorizontalOverflow(page);
    });
  }
  expect(errors).toEqual([]);
});

test.describe("chrome by age band", () => {
  // The teen shell has a hamburger menu on phones; the kids' chrome does not.
  const teenMenu = 'button[aria-label*="menu" i], button[aria-label*="menú" i]';

  test("a 10-12 user gets the kids' chrome", async ({ page }) => {
    await setBand(page, "10-12");
    await page.goto("/en");
    await expect(page.getByRole("button", { name: /need help now/i })).toBeVisible();
    await expect(page.locator(teenMenu)).toHaveCount(0);

    // Find Resources is hidden for this band: no nav link, and the page sends them home.
    await expect(page.locator('nav a[href="/en/resources"]')).toHaveCount(0);
    await page.goto("/en/resources");
    await expect(page).toHaveURL(/\/en\/?$/);
  });

  test("a teen gets the teen shell", async ({ page }) => {
    await setBand(page, "16-17");
    await page.goto("/en");
    await expect(page.locator(teenMenu).first()).toBeVisible();
    await expect(page.locator('nav a[href="/en/resources"]').first()).toBeAttached();
  });
});

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  for (const lang of ["en", "es"]) {
    test(`/${lang}/rights shows a heading and the rights`, async ({ page }) => {
      const response = await page.goto(`/${lang}/rights`);
      expect(response?.status()).toBe(200);
      const h1 = page.locator("h1").first();
      await expect(h1).toBeVisible();
      await expect(h1).not.toBeEmpty();
      await expect(page.locator("html")).toHaveAttribute("lang", lang);
    });
  }
});
