import { defineConfig, devices } from "@playwright/test";

const port = 4321;
const baseURL = `http://127.0.0.1:${port}`;

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: "list",
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  webServer: {
    command: `npx astro build && npx astro preview --host 127.0.0.1 --port ${port}`,
    url: baseURL,
    reuseExistingServer: false,
    timeout: 120_000,
    env: {
      PUBLIC_FORMSPREE_FORM_ID: "testform123",
      PUBLIC_GA_MEASUREMENT_ID: "G-TESTMEASURE1",
      PUBLIC_COOKIEBOT_DOMAIN_GROUP_ID: "PLACEHOLDER_COOKIEBOT_ID",
    },
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
