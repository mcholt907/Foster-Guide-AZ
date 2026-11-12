import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// Unit tests: pure data + helpers, no browser. Run with `npm test`.
// Browser tests live in tests/e2e and run with Playwright (`npm run test:e2e`).
export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  test: {
    environment: "node",
    include: ["tests/unit/**/*.test.ts"],
  },
});
