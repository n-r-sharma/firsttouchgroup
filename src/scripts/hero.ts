const root = document.querySelector<HTMLElement>("[data-hero]");
if (root) {
  const slides = [...root.querySelectorAll<HTMLElement>("[data-hero-slide]")];
  const fallback = root.querySelector<HTMLElement>("[data-hero-fallback]");
  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  let reduceMotion = motionQuery.matches;
  const intervalMs = 6500;

  let index = 0;
  let timer: number | undefined;
  let failed = new Set<number>();

  const usable = () => slides.map((_, i) => i).filter((i) => !failed.has(i));

  const show = (next: number) => {
    const available = usable();
    if (!available.length) {
      fallback?.removeAttribute("hidden");
      return;
    }
    index = available.includes(next) ? next : available[0];
    slides.forEach((slide, i) => {
      const active = i === index;
      slide.classList.toggle("is-active", active);
      slide.setAttribute("aria-hidden", active ? "false" : "true");
    });
  };

  const stop = () => {
    if (timer) window.clearInterval(timer);
    timer = undefined;
  };

  const play = () => {
    stop();
    if (reduceMotion || document.hidden) return;
    timer = window.setInterval(() => {
      const available = usable();
      if (available.length < 2) return;
      const position = available.indexOf(index);
      show(available[(position + 1) % available.length]);
    }, intervalMs);
  };

  const syncMotionPreference = (matches: boolean) => {
    reduceMotion = matches;
    if (reduceMotion) stop();
    else play();
  };

  slides.forEach((slide, i) => {
    slide.querySelectorAll("img").forEach((image) => {
      image.addEventListener("error", () => {
        failed.add(i);
        slide.classList.remove("is-active");
        slide.setAttribute("aria-hidden", "true");
        show(index);
        play();
      });
    });
  });

  motionQuery.addEventListener("change", (event) => syncMotionPreference(event.matches));
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stop();
    else play();
  });

  show(0);
  syncMotionPreference(reduceMotion);
}

export {};
