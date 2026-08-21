import { test, expect } from "@playwright/test";

test.describe("consent and analytics", () => {
  test("does not load GA4 before consent", async ({ page }) => {
    const analyticsRequests: string[] = [];
    page.on("request", (request) => {
      if (request.url().includes("googletagmanager.com") || request.url().includes("google-analytics.com")) {
        analyticsRequests.push(request.url());
      }
    });
    await page.goto("/");
    await expect(page.getByRole("button", { name: "Accept analytics" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Reject non-essential" })).toBeVisible();
    expect(analyticsRequests).toEqual([]);
    expect(await page.locator("script[data-ftg-analytics]").count()).toBe(0);
  });

  test("loads GA4 after acceptance", async ({ page }) => {
    await page.route("https://www.googletagmanager.com/**", (route) =>
      route.fulfill({ status: 204, body: "" }),
    );
    await page.goto("/");
    await page.getByRole("button", { name: "Accept analytics" }).click();
    await expect(page.locator("script[data-ftg-analytics]")).toHaveCount(1);
  });

  test("keeps GA4 blocked after rejection", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Reject non-essential" }).click();
    await expect(page.locator("[data-consent-banner]")).toBeHidden();
    expect(await page.locator("script[data-ftg-analytics]").count()).toBe(0);
  });

  test("cookie settings can change a previous choice", async ({ page }) => {
    await page.route("https://www.googletagmanager.com/**", (route) =>
      route.fulfill({ status: 204, body: "" }),
    );
    await page.goto("/");
    await page.getByRole("button", { name: "Reject non-essential" }).click();
    await page.getByRole("button", { name: "Cookie settings" }).click();
    await expect(page.getByRole("button", { name: "Accept analytics" })).toBeVisible();
    await page.getByRole("button", { name: "Accept analytics" }).click();
    await expect(page.locator("script[data-ftg-analytics]")).toHaveCount(1);
  });
});
