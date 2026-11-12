import { defineConfig, devices } from "@playwright/test";

// End-to-end tests run against a real production build on port 3410.
//   npm run test:e2e
//
// Env vars:
//   E2E_BASE_URL                    test a server that is already running
//                                   (skips the build + start below)
//   PLAYWRIGHT_CHROMIUM_EXECUTABLE  path to a Chromium binary, for machines
//                                   where `npx playwright install chromium`
//                                   cannot be used
const PORT = 3410;
const baseURL = process.env.E2E_BASE_URL ?? `http://localhost:${PORT}`;
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || undefined;

export default defineConfig({
  testDir: "./tests/e2e",
  // Traces of failed tests. Inside node_modules/.cache so it is already git-ignored.
  outputDir: "./node_modules/.cache/e2e-results",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  timeout: 30_000,
  reporter: process.env.CI ? [["github"], ["list"]] : "list",
  use: {
    baseURL,
    // Phone-sized screen: most youth use this site on a phone.
    viewport: { width: 375, height: 740 },
    trace: "retain-on-failure",
    launchOptions: executablePath ? { executablePath } : {},
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"], viewport: { width: 375, height: 740 } },
    },
  ],
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : {
        command: `npm run build && npm run start -- -p ${PORT}`,
        url: `${baseURL}/en`,
        reuseExistingServer: !process.env.CI,
        timeout: 240_000,
      },
});
