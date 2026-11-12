import { expect, type Locator, type Page } from "@playwright/test";

export type Band = "10-12" | "13-15" | "16-17" | "18-21";
export const BANDS: Band[] = ["10-12", "13-15", "16-17", "18-21"];

/** The 8 main sections, as URL tails after /en or /es. */
export const ROUTES = ["", "/rights", "/case", "/team", "/future", "/resources", "/wellness", "/ask"];

/** Pretend the visitor already finished setup with this age band. */
export async function setBand(page: Page, band: Band) {
  await page.addInitScript((ageBand) => {
    localStorage.setItem(
      "fgaz_prefs_v2",
      JSON.stringify({ ageBand, county: "Maricopa", tribal: false, tribalUnsure: false, onboardingDone: true }),
    );
  }, band);
}

/** Collect console errors and uncaught exceptions for the life of the page. */
export function watchErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(`console: ${msg.text()} (${page.url()})`);
  });
  page.on("pageerror", (err) => errors.push(`exception: ${err.message} (${page.url()})`));
  return errors;
}

/** The page must not scroll sideways. */
export async function expectNoHorizontalOverflow(page: Page) {
  const { scrollWidth, clientWidth } = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
  expect(scrollWidth, `page is ${scrollWidth}px wide in a ${clientWidth}px window (${page.url()})`).toBeLessThanOrEqual(
    clientWidth + 1,
  );
}

/** 911 and 988 tap-to-call links are visible inside `scope`. */
export async function expectCallLinks(scope: Locator | Page) {
  await expect(scope.locator('a[href="tel:911"]').first()).toBeVisible();
  await expect(scope.locator('a[href="tel:988"]').first()).toBeVisible();
}

/** The search box on Find Answers (the only text input on the page). */
export function searchBox(page: Page): Locator {
  return page.locator('main input[type="text"], main input[type="search"]').first();
}
