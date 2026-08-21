const root = document.querySelector<HTMLElement>("[data-services]");
if (root) {
  const servicesWindow = window as typeof window & {
    __firstTouchServicesCleanup?: () => void;
  };
  servicesWindow.__firstTouchServicesCleanup?.();

  const scroller = root.querySelector<HTMLElement>("[data-services-scroller]");
  const track = root.querySelector<HTMLElement>(".services__track");
  const prev = root.querySelector<HTMLButtonElement>("[data-services-prev]");
  const next = root.querySelector<HTMLButtonElement>("[data-services-next]");

  if (scroller && track && prev && next) {
    const events = new AbortController();
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const firstCard = scroller.querySelector<HTMLElement>(".service-card:not([data-service-clone])");
    const firstClone = scroller.querySelector<HTMLElement>("[data-service-clone]");
    const step = () => Math.min(scroller.clientWidth * 0.85, 360);
    let loopDistance = 0;
    let isHovering = false;
    let hasFocus = false;
    let isPointerDown = false;
    let isProgrammaticMove = false;
    let isInViewport = false;
    let previousTime = 0;
    let autoPosition = 0;
    let moveTimer = 0;
    let animationFrame = 0;

    const updateMetrics = () => {
      loopDistance = firstCard && firstClone ? firstClone.offsetLeft - firstCard.offsetLeft : 0;
    };

    const updateVisibility = () => {
      const bounds = scroller.getBoundingClientRect();
      isInViewport = bounds.bottom > 0 && bounds.top < window.innerHeight;
    };

    const normalize = (position: number) => {
      if (loopDistance <= 0) return position;
      return ((position % loopDistance) + loopDistance) % loopDistance;
    };

    const renderAutoPosition = () => {
      track.style.transform = reducedMotion.matches
        ? "translate3d(0, 0, 0)"
        : `translate3d(${-autoPosition}px, 0, 0)`;
    };

    const finishProgrammaticMove = () => {
      window.clearTimeout(moveTimer);
      isProgrammaticMove = false;
      scroller.scrollLeft = normalize(scroller.scrollLeft);
    };

    const move = (direction: -1 | 1) => {
      if (direction < 0 && loopDistance > 0 && scroller.scrollLeft < step()) {
        scroller.scrollLeft += loopDistance;
      }
      isProgrammaticMove = true;
      scroller.scrollBy({
        left: direction * step(),
        behavior: reducedMotion.matches ? "auto" : "smooth",
      });
      window.clearTimeout(moveTimer);
      moveTimer = window.setTimeout(finishProgrammaticMove, reducedMotion.matches ? 0 : 550);
    };

    prev.addEventListener("click", () => move(-1), { signal: events.signal });
    next.addEventListener("click", () => move(1), { signal: events.signal });

    scroller.addEventListener("pointerenter", () => {
      isHovering = true;
    }, { signal: events.signal });
    scroller.addEventListener("pointerleave", () => {
      isHovering = false;
    }, { signal: events.signal });
    scroller.addEventListener("focusin", () => {
      hasFocus = true;
    }, { signal: events.signal });
    scroller.addEventListener("focusout", (event) => {
      hasFocus = event.relatedTarget instanceof Node && scroller.contains(event.relatedTarget);
    }, { signal: events.signal });
    scroller.addEventListener("pointerdown", () => {
      isPointerDown = true;
    }, { signal: events.signal });
    window.addEventListener("pointerup", () => {
      isPointerDown = false;
      scroller.scrollLeft = normalize(scroller.scrollLeft);
    }, { signal: events.signal });
    window.addEventListener("pointercancel", () => {
      isPointerDown = false;
    }, { signal: events.signal });
    reducedMotion.addEventListener("change", () => {
      autoPosition = 0;
      renderAutoPosition();
    }, { signal: events.signal });

    const animate = (time: number) => {
      const elapsed = previousTime ? Math.min(time - previousTime, 64) : 0;
      previousTime = time;

      if (
        isInViewport &&
        !isHovering &&
        !hasFocus &&
        !isPointerDown &&
        !isProgrammaticMove &&
        !document.hidden &&
        !reducedMotion.matches
      ) {
        autoPosition = normalize(autoPosition + (elapsed / 1000) * 22);
        renderAutoPosition();
      }

      animationFrame = requestAnimationFrame(animate);
    };

    const updateLayout = () => {
      updateMetrics();
      updateVisibility();
      autoPosition = normalize(autoPosition);
      renderAutoPosition();
    };

    window.addEventListener("scroll", updateVisibility, { passive: true, signal: events.signal });
    window.addEventListener("resize", updateLayout, { passive: true, signal: events.signal });
    updateLayout();
    animationFrame = requestAnimationFrame(animate);

    const cleanup = () => {
      events.abort();
      window.clearTimeout(moveTimer);
      cancelAnimationFrame(animationFrame);
      track.style.transform = "translate3d(0, 0, 0)";
      if (servicesWindow.__firstTouchServicesCleanup === cleanup) {
        delete servicesWindow.__firstTouchServicesCleanup;
      }
    };

    servicesWindow.__firstTouchServicesCleanup = cleanup;
    import.meta.hot?.dispose(cleanup);
  }
}

export {};
