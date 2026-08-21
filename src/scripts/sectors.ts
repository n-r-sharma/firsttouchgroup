const root = document.querySelector<HTMLElement>("[data-sectors]");

if (root) {
  const sectorsWindow = window as typeof window & {
    __firstTouchSectorsCleanup?: () => void;
  };
  sectorsWindow.__firstTouchSectorsCleanup?.();

  const cards = [...root.querySelectorAll<HTMLElement>("[data-sector-card]")];
  const prev = root.querySelector<HTMLButtonElement>("[data-sectors-prev]");
  const next = root.querySelector<HTMLButtonElement>("[data-sectors-next]");
  const status = root.querySelector<HTMLElement>("[data-sector-status]");

  if (cards.length && prev && next) {
    const events = new AbortController();
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const desktopLayout = window.matchMedia("(min-width: 72rem)");
    let activeIndex = Math.max(0, cards.findIndex((card) => card.classList.contains("is-active")));

    const setActive = (nextIndex: number, announce = true) => {
      activeIndex = (nextIndex + cards.length) % cards.length;

      cards.forEach((card, index) => {
        const active = index === activeIndex;
        const trigger = card.querySelector<HTMLButtonElement>("[data-sector-select]");
        card.classList.toggle("is-active", active);
        trigger?.setAttribute("aria-pressed", active ? "true" : "false");
        if (trigger) trigger.tabIndex = active ? -1 : 0;
      });

      const activeCard = cards[activeIndex];
      if (!desktopLayout.matches) {
        activeCard.scrollIntoView({
          behavior: reducedMotion.matches ? "auto" : "smooth",
          block: "nearest",
          inline: "center",
        });
      }

      if (announce && status) {
        status.textContent = `${activeCard.dataset.sectorName ?? "Sector"} selected.`;
      }
    };

    prev.addEventListener("click", () => setActive(activeIndex - 1), { signal: events.signal });
    next.addEventListener("click", () => setActive(activeIndex + 1), { signal: events.signal });

    cards.forEach((card, index) => {
      card.querySelector<HTMLButtonElement>("[data-sector-select]")?.addEventListener(
        "click",
        () => setActive(index),
        { signal: events.signal },
      );
    });

    desktopLayout.addEventListener("change", () => setActive(activeIndex, false), {
      signal: events.signal,
    });

    setActive(activeIndex, false);

    const cleanup = () => {
      events.abort();
      if (sectorsWindow.__firstTouchSectorsCleanup === cleanup) {
        delete sectorsWindow.__firstTouchSectorsCleanup;
      }
    };

    sectorsWindow.__firstTouchSectorsCleanup = cleanup;
    import.meta.hot?.dispose(cleanup);
  }
}

export {};
