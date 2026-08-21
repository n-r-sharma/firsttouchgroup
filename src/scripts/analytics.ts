import { getConsent } from "./consent.ts";

let loaded = false;

function gaId() {
  return window.__FTG_ANALYTICS__?.enabled ? window.__FTG_ANALYTICS__.measurementId : "";
}

export function loadAnalytics() {
  const id = gaId();
  if (!id || loaded || getConsent() !== "granted") return;
  loaded = true;

  window.dataLayer = window.dataLayer ?? [];
  window.gtag = (...args: unknown[]) => {
    window.dataLayer?.push(args);
  };
  window.gtag("js", new Date());
  window.gtag("consent", "default", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "granted",
  });
  window.gtag("config", id, { anonymize_ip: true });

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
  script.dataset.ftgAnalytics = "true";
  document.head.append(script);
}

export function track(eventName: string, params: Record<string, string> = {}) {
  if (getConsent() !== "granted" || typeof window.gtag !== "function") return;
  window.gtag("event", eventName, params);
}

function applyConsent(state: string) {
  if (state === "granted") loadAnalytics();
}

applyConsent(getConsent());
window.addEventListener("ftg:consent", (event) => {
  const state = (event as CustomEvent<{ state: string }>).detail.state;
  applyConsent(state);
});

document.addEventListener("click", (event) => {
  const link = (event.target as HTMLElement | null)?.closest<HTMLElement>("[data-track='contact_click']");
  if (!link) return;
  track("contact_click", { method: link.dataset.method ?? "unknown" });
});
