import { test, expect } from "@playwright/test";

test.describe("quote form", () => {
  test.beforeEach(async ({ page }) => {
    await page.route("https://formspree.io/**", async (route) => {
      if (route.request().method() === "POST") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ ok: true, next: "https://formspree.io/thanks" }),
        });
        return;
      }
      await route.continue();
    });
    await page.goto("/");
  });

  test("shows native validation on empty submit", async ({ page }) => {
    await page.locator("#quote").scrollIntoViewIfNeeded();
    await page.getByRole("button", { name: "Request a quote" }).click();
    await expect(page.locator("#full-name")).toHaveJSProperty("validity.valid", false);
  });

  test("submits successfully and shows confirmation", async ({ page }) => {
    await page.locator("#full-name").fill("Alex Morgan");
    await page.locator("#company").fill("North Bank Offices");
    await page.locator("#email").fill("alex@northbank.test");
    await page.locator("#postcode").fill("EC2A 2BB");
    await page.locator("#property-type").selectOption("offices");
    await page.locator("[data-service-option='contract-cleaning']").check();
    await page.getByRole("button", { name: "Request a quote" }).click();
    await expect(page.getByRole("heading", { name: "Quote request received" })).toBeVisible();
  });

  test("preserves values after a network failure", async ({ page }) => {
    await page.unroute("https://formspree.io/**");
    await page.route("https://formspree.io/**", (route) => route.abort("failed"));
    await page.locator("#full-name").fill("Alex Morgan");
    await page.locator("#company").fill("North Bank Offices");
    await page.locator("#email").fill("alex@northbank.test");
    await page.locator("#postcode").fill("EC2A 2BB");
    await page.locator("#property-type").selectOption("offices");
    await page.getByRole("button", { name: "Request a quote" }).click();
    await expect(page.locator(".quote__error")).toBeVisible();
    await expect(page.locator("#full-name")).toHaveValue("Alex Morgan");
    await expect(page.locator("#company")).toHaveValue("North Bank Offices");
  });

  test("honeypot submissions do not hit Formspree", async ({ page }) => {
    let sent = false;
    await page.unroute("https://formspree.io/**");
    await page.route("https://formspree.io/**", async (route) => {
      sent = true;
      await route.fulfill({ status: 200, body: JSON.stringify({ ok: true }) });
    });
    await page.locator("#full-name").fill("Bot");
    await page.locator("#company").fill("Spam");
    await page.locator("#email").fill("bot@spam.test");
    await page.locator("#postcode").fill("EC1A 1BB");
    await page.locator("#property-type").selectOption("offices");
    await page.locator("#company_website").fill("https://spam.example");
    await page.getByRole("button", { name: "Request a quote" }).click();
    await expect(page.getByRole("heading", { name: "Quote request received" })).toBeVisible();
    expect(sent).toBe(false);
  });
});
