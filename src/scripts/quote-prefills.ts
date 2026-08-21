import { track } from "./analytics.ts";

function focusQuote() {
  const heading = document.getElementById("quote-heading");
  const name = document.getElementById("full-name");
  document.getElementById("quote")?.scrollIntoView({
    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    block: "start",
  });
  window.setTimeout(() => {
    (name as HTMLInputElement | null)?.focus();
    heading?.setAttribute("tabindex", "-1");
  }, 50);
}

document.addEventListener("click", (event) => {
  const target = (event.target as HTMLElement | null)?.closest<HTMLElement>("[data-prefill-service], [data-prefill-sector]");
  if (!target) return;

  const serviceId = target.dataset.prefillService;
  const sectorId = target.dataset.prefillSector;
  const form = document.querySelector<HTMLFormElement>("[data-quote-form]");
  if (!form) return;

  if (serviceId) {
    const option = form.querySelector<HTMLInputElement>(`[data-service-option="${serviceId}"]`);
    if (option) option.checked = true;
    track("service_selected", { service_id: serviceId });
  }

  if (sectorId) {
    const select = form.querySelector<HTMLSelectElement>("#property-type");
    if (select) select.value = sectorId;
    track("sector_selected", { sector_id: sectorId });
  }

  focusQuote();
});
