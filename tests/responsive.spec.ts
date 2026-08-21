import { test, expect } from "@playwright/test";

const viewports = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "iphone", width: 390, height: 844 },
  { name: "narrow", width: 320, height: 568 },
];

for (const viewport of viewports) {
  test(`does not overflow horizontally at ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto("/");
    const docWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(docWidth).toBeLessThanOrEqual(viewport.width + 1);
  });
}

test("holds together at 200% zoom equivalent", async ({ page }) => {
  await page.setViewportSize({ width: 640, height: 800 });
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  const docWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(docWidth).toBeLessThanOrEqual(641);
});

test("keeps sector titles inside proportioned desktop cards", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/#sectors");

  const cards = await page.locator(".sector-card").evaluateAll((elements) =>
    elements.map((element) => {
      const card = element.getBoundingClientRect();
      const heading = element.querySelector("h3")?.getBoundingClientRect();
      return {
        ratio: card.width / card.height,
        headingFits:
          !!heading &&
          heading.left >= card.left &&
          heading.right <= card.right &&
          heading.top >= card.top &&
          heading.bottom <= card.bottom,
      };
    }),
  );

  expect(cards).toHaveLength(3);
  expect(cards.every((card) => Math.abs(card.ratio - 0.8) < 0.02)).toBe(true);
  expect(cards.every((card) => card.headingFits)).toBe(true);
});

test("keeps the Distinct-inspired surface grammar intentional", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");

  const structure = await page.evaluate(() => {
    const hero = document.querySelector<HTMLElement>(".hero");
    const promise = document.querySelector<HTMLElement>(".promise-section");
    const content = document.querySelector<HTMLElement>(".page-content");
    const services = document.querySelector<HTMLElement>("#services");
    const servicesIntro = document.querySelector<HTMLElement>(".services__intro");

    return {
      heroRect: hero?.getBoundingClientRect().toJSON(),
      heroRadius: hero ? getComputedStyle(hero).borderRadius : null,
      promiseTopRadius: promise ? getComputedStyle(promise).borderTopLeftRadius : null,
      contentTopRadius: content ? getComputedStyle(content).borderTopLeftRadius : null,
      servicesBorder: services ? getComputedStyle(services).borderTopWidth : null,
      servicesIntroBorder: servicesIntro ? getComputedStyle(servicesIntro).borderTopWidth : null,
    };
  });

  expect(structure.heroRect?.left).toBe(0);
  expect(structure.heroRect?.right).toBe(1440);
  expect(structure.heroRadius).toBe("0px");
  expect(structure.promiseTopRadius).toBe("0px");
  expect(parseFloat(structure.contentTopRadius ?? "0")).toBeGreaterThan(0);
  expect(structure.servicesBorder).toBe("0px");
  expect(structure.servicesIntroBorder).toBe("1px");
});

test("uses one eyebrow-to-title rhythm across the four editorial sections", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");

  const headers = await page.locator(".editorial-header").evaluateAll((elements) =>
    elements.map((element) => {
      const eyebrow = element.querySelector<HTMLElement>(".eyebrow")?.getBoundingClientRect();
      const title = element.querySelector<HTMLElement>("h2")?.getBoundingClientRect();
      return {
        gap: (title?.top ?? 0) - (eyebrow?.bottom ?? 0),
        alignment: Math.abs((title?.left ?? 0) - (eyebrow?.left ?? 0)),
        border: getComputedStyle(element).borderTopWidth,
      };
    }),
  );

  expect(headers).toHaveLength(4);
  expect(headers.every((header) => header.gap >= 40)).toBe(true);
  expect(headers.every((header) => header.alignment <= 1)).toBe(true);
  expect(headers.every((header) => header.border === "1px")).toBe(true);
});

test("lets the services rail continue through the viewport edge", async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto("/#services");

  const geometry = await page.evaluate(() => {
    const intro = document.querySelector<HTMLElement>(".services__intro")?.getBoundingClientRect();
    const scroller = document.querySelector<HTMLElement>(".services__scroller")?.getBoundingClientRect();
    const firstCard = document.querySelector<HTMLElement>(".service-card")?.getBoundingClientRect();
    const cards = [...document.querySelectorAll<HTMLElement>(".service-card")].map((card) =>
      card.getBoundingClientRect(),
    );

    return {
      introLeft: intro?.left,
      scrollerLeft: scroller?.left,
      scrollerRight: scroller?.right,
      firstCardLeft: firstCard?.left,
      hasCardContinuingPastViewport: cards.some(
        (card) => card.left < window.innerWidth && card.right > window.innerWidth,
      ),
      viewportWidth: window.innerWidth,
    };
  });

  expect(geometry.scrollerLeft).toBe(0);
  expect(geometry.scrollerRight).toBe(geometry.viewportWidth);
  expect(Math.abs((geometry.firstCardLeft ?? 0) - (geometry.introLeft ?? 0))).toBeLessThanOrEqual(1);
  expect(geometry.hasCardContinuingPastViewport).toBe(true);
});

test("lets the content sheet cover the sticky hero during natural scroll", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");

  const hero = page.locator(".hero");
  const content = page.locator(".page-content");
  const initialHero = await hero.boundingBox();
  const initialContent = await content.boundingBox();

  await page.evaluate(() => window.scrollTo(0, 360));

  const scrolledHero = await hero.boundingBox();
  const scrolledContent = await content.boundingBox();
  expect(initialHero?.y).toBe(0);
  expect(scrolledHero?.y).toBe(0);
  expect(scrolledContent?.y).toBeLessThan((initialContent?.y ?? 0) - 350);
  expect(scrolledContent?.y).toBeLessThan(scrolledHero?.height ?? 0);
});

test("keeps the promise headline on intentional editorial lines", async ({ page }) => {
  await page.setViewportSize({ width: 1586, height: 900 });
  await page.goto("/");

  const geometry = await page.locator("#promise-heading").evaluate((heading) => {
    const lines = heading.querySelectorAll<HTMLElement>(".promise__headline-line");
    const accent = heading.querySelector<HTMLElement>("em");
    const bounds = heading.getBoundingClientRect();
    const first = lines[0]?.getBoundingClientRect();
    const second = lines[1]?.getBoundingClientRect();
    const accentRect = accent?.getBoundingClientRect();

    return {
      firstBottom: first?.bottom,
      firstLeft: first?.left,
      secondTop: second?.top,
      secondLeft: second?.left,
      accentText: accent?.textContent?.trim(),
      accentRight: accentRect?.right,
      headingRight: bounds.right,
    };
  });

  expect(geometry.secondTop).toBeGreaterThanOrEqual((geometry.firstBottom ?? 0) - 5);
  expect(Math.abs((geometry.secondLeft ?? 0) - (geometry.firstLeft ?? 0))).toBeLessThanOrEqual(1);
  expect(geometry.accentText).toBe("every first impression.");
  expect(geometry.accentRight).toBeLessThanOrEqual(geometry.headingRight + 1);
});

test("changes the overlay header to a solid sticky header on scroll", async ({ page }) => {
  await page.goto("/");
  const header = page.locator("[data-overlay-header='true']");
  await expect(header).not.toHaveClass(/is-scrolled/);
  await page.evaluate(() => window.scrollTo(0, 200));
  await expect(header).toHaveClass(/is-scrolled/);
});

test("keeps the desktop header material readable and its CTA compact", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");

  const geometry = await page.evaluate(() => {
    const header = document.querySelector<HTMLElement>("[data-overlay-header='true']");
    const cta = document.querySelector<HTMLElement>(".site-header__cta");
    const ctaRect = cta?.getBoundingClientRect();
    const headerStyle = header ? getComputedStyle(header) : null;
    const ctaStyle = cta ? getComputedStyle(cta) : null;

    return {
      headerBackground: headerStyle?.backgroundColor,
      ctaHeight: ctaRect?.height,
      ctaFontSize: ctaStyle?.fontSize,
    };
  });

  expect(geometry.headerBackground).not.toBe("rgba(0, 0, 0, 0)");
  expect(geometry.ctaHeight).toBeGreaterThanOrEqual(44);
  expect(geometry.ctaHeight).toBeLessThanOrEqual(46);
  expect(geometry.ctaFontSize).toBe("16px");
});
