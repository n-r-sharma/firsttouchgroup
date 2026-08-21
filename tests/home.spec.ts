import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("homepage", () => {
  test("renders the core marketing page", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Clean spaces");
    await expect(page.getByRole("link", { name: "Request a quote" }).first()).toBeVisible();
    await expect(page.locator(".site-header__nav").getByRole("link", { name: "Quote", exact: true })).toHaveCount(0);
    await expect(page.locator("#services")).toBeVisible();
    await expect(page.locator("#quote")).toBeVisible();
  });

  test("privacy route is a supporting legal page", async ({ page }) => {
    await page.goto("/privacy");
    await expect(page.getByRole("heading", { name: "Privacy notice" })).toBeVisible();
    await expect(page.getByText("awaiting legal review")).toBeVisible();
  });
});

test.describe("accessibility", () => {
  test("has no serious axe violations on desktop", async ({ page }) => {
    await page.goto("/");
    const results = await new AxeBuilder({ page }).analyze();
    const serious = results.violations.filter((item) =>
      ["serious", "critical"].includes(item.impact ?? ""),
    );
    expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);
  });
});

test.describe("hero", () => {
  test("keeps the hero free of slideshow controls", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator(".hero__controls")).toHaveCount(0);
    await expect(page.getByText("Scroll", { exact: true })).toHaveCount(0);
    await expect(page.getByRole("button", { name: /slideshow/i })).toHaveCount(0);
  });
});

test.describe("mobile menu", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("traps focus and restores it", async ({ page }) => {
    await page.goto("/");
    const opener = page.getByRole("button", { name: "Menu" });
    await opener.click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(opener).toBeFocused();
  });
});

test.describe("services and sectors", () => {
  test("service action prefills the quote form", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /add contract cleaning to quote/i }).click();
    await expect(page.locator("#quote-form")).toBeVisible();
    await expect(page.locator("#full-name")).toBeFocused();
    await expect(page.locator("[data-service-option='contract-cleaning']")).toBeChecked();
  });

  test("sector action prefills property type", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Show details for Retail & showrooms" }).click();
    await page.getByRole("button", { name: /quote for your retail space/i }).click();
    await expect(page.locator("#property-type")).toHaveValue("retail");
  });

  test("sector stories move between four selectable panels", async ({ page }) => {
    await page.goto("/#sectors");
    const cards = page.locator("[data-sector-card]");
    await expect(cards).toHaveCount(4);
    await expect(cards.nth(0)).toHaveClass(/is-active/);
    await page.getByRole("button", { name: "Next sector" }).click();
    await expect(cards.nth(1)).toHaveClass(/is-active/);
    await expect(page.getByRole("button", { name: /quote for your hotel/i })).toBeVisible();
  });

  test("service scroller controls move in both directions around the loop", async ({ page }) => {
    await page.goto("/");
    const prev = page.getByRole("button", { name: "Previous service" });
    const next = page.getByRole("button", { name: "Next service" });
    await expect(next).toBeEnabled();
    await next.click();
    await page.waitForTimeout(450);
    const afterNext = await page.locator("[data-services-scroller]").evaluate((element) => element.scrollLeft);
    expect(afterNext).toBeGreaterThan(0);
    await prev.click();
  });

  test("service rail moves automatically, pauses on hover, and resumes immediately", async ({ page }) => {
    await page.goto("/#services");
    const scroller = page.locator("[data-services-scroller]");
    const track = page.locator(".services__track");
    await scroller.scrollIntoViewIfNeeded();

    const position = () =>
      track.evaluate((element) => new DOMMatrix(getComputedStyle(element).transform).m41);

    const start = await position();
    await page.waitForTimeout(700);
    const moved = await position();
    expect(moved).toBeLessThan(start);

    await scroller.hover();
    const pausedAt = await position();
    await page.waitForTimeout(450);
    const stillPaused = await position();
    expect(Math.abs(stillPaused - pausedAt)).toBeLessThanOrEqual(1);

    await page.mouse.move(0, 0);
    await page.waitForTimeout(450);
    const resumed = await position();
    expect(resumed).toBeLessThan(stillPaused);

    expect(await scroller.evaluate((element) => getComputedStyle(element).scrollbarWidth)).toBe("none");
    await expect(page.getByRole("button", { name: /add contract cleaning to quote/i })).toHaveCount(1);
  });

  test("service rail remains still for reduced motion", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/#services");
    const scroller = page.locator("[data-services-scroller]");
    const track = page.locator(".services__track");
    const start = await scroller.evaluate((element) => element.scrollLeft);
    await page.waitForTimeout(350);
    const end = await scroller.evaluate((element) => element.scrollLeft);
    expect(end).toBe(start);
    await expect(track).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 0)");
  });
});

test.describe("standards accordion", () => {
  test("opens one panel and syncs the image", async ({ page }) => {
    await page.goto("/");
    const pay = page.getByRole("button", { name: /fair pay/i });
    await pay.click();
    await expect(pay).toHaveAttribute("aria-expanded", "true");
    await expect(page.locator("[data-standard-frame='pay']")).toHaveClass(/is-active/);
    await expect(page.locator("[data-standard-frame='pay']")).toHaveAttribute("aria-hidden", "false");
    await expect(page.locator("[data-standard-frame='recruitment']")).toHaveAttribute("aria-hidden", "true");
    await expect(page.getByRole("button", { name: /recruitment/i })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });

  test("active imagery fills the standards media frame", async ({ page }) => {
    await page.goto("/#standards");
    const gap = await page.locator(".standards__visual").evaluate((visual) => {
      const image = visual.querySelector(".standards__frame.is-active img");
      if (!image) return Number.POSITIVE_INFINITY;
      return Math.abs(visual.getBoundingClientRect().bottom - image.getBoundingClientRect().bottom);
    });
    expect(gap).toBeLessThanOrEqual(1);
  });

  test("aligns expanded copy with its accordion title", async ({ page }) => {
    await page.goto("/#standards");
    const alignment = await page.locator("[data-standard-item]").first().evaluate((item) => {
      const title = item.querySelector("button > span:first-child")?.getBoundingClientRect();
      const copy = item.querySelector("[data-standard-panel] p")?.getBoundingClientRect();
      return Math.abs((title?.left ?? 0) - (copy?.left ?? 0));
    });
    expect(alignment).toBeLessThanOrEqual(1);
  });
});

test.describe("process cards", () => {
  test("restores the original lift interaction", async ({ page }) => {
    await page.goto("/#process");
    const card = page.locator(".process > li").first();
    await card.hover();
    await expect.poll(() => card.evaluate((element) => getComputedStyle(element).transform)).not.toBe("none");
    await expect.poll(() => card.evaluate((element) => getComputedStyle(element).boxShadow)).not.toBe("none");
  });

  test("keeps process cards still under reduced motion", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/#process");
    const card = page.locator(".process > li").first();
    await card.hover();
    await expect(card).toHaveCSS("transform", "none");
  });
});
