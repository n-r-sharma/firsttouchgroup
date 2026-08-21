const root = document.querySelector<HTMLElement>("[data-standards]");
if (root) {
  const items = [...root.querySelectorAll<HTMLElement>("[data-standard-item]")];

  const setOpen = (current: HTMLElement) => {
    const trigger = current.querySelector<HTMLButtonElement>("[data-standard-trigger]");
    const imageId = trigger?.dataset.standardImage;

    items.forEach((item) => {
      const button = item.querySelector<HTMLButtonElement>("[data-standard-trigger]");
      const panel = item.querySelector<HTMLElement>("[data-standard-panel]");
      const open = item === current;
      if (!button || !panel) return;
      button.setAttribute("aria-expanded", open ? "true" : "false");
      const mark = button.querySelector("[aria-hidden]");
      if (mark) mark.textContent = open ? "–" : "+";
      panel.hidden = !open;
    });

    root.querySelectorAll<HTMLElement>("[data-standard-frame]").forEach((frame) => {
      const active = frame.dataset.standardFrame === imageId;
      frame.classList.toggle("is-active", active);
      frame.setAttribute("aria-hidden", active ? "false" : "true");
    });
  };

  items.forEach((item) => {
    item.querySelector<HTMLButtonElement>("[data-standard-trigger]")?.addEventListener("click", () => {
      setOpen(item);
    });
  });
}

export {};
