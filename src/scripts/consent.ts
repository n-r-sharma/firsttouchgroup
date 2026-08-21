const STORAGE_KEY = "ftg-consent";

export type ConsentState = "unknown" | "granted" | "denied";

export function getConsent(): ConsentState {
  const value = window.localStorage.getItem(STORAGE_KEY);
  if (value === "granted" || value === "denied") return value;
  return "unknown";
}

export function setConsent(state: Exclude<ConsentState, "unknown">) {
  window.localStorage.setItem(STORAGE_KEY, state);
  window.dispatchEvent(new CustomEvent("ftg:consent", { detail: { state } }));
}

const banner = document.querySelector<HTMLElement>("[data-consent-banner]");
const cookiebotReady = banner?.dataset.cookiebotReady === "true";
const cookiebotId = banner?.dataset.cookiebotId ?? "";
let hideTimer: number | undefined;

function showBanner() {
  if (!banner) return;
  if (hideTimer) window.clearTimeout(hideTimer);
  banner.removeAttribute("hidden");
  banner.dataset.state = "opening";
  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      if (!banner.hidden && banner.dataset.state === "opening") banner.dataset.state = "open";
    });
  });
}

function hideBanner() {
  if (!banner || banner.hidden) return;
  if (hideTimer) window.clearTimeout(hideTimer);
  banner.dataset.state = "closing";
  hideTimer = window.setTimeout(() => {
    banner.setAttribute("hidden", "");
    delete banner.dataset.state;
    hideTimer = undefined;
  }, 160);
}

function loadCookiebot() {
  if (document.getElementById("Cookiebot") || !cookiebotId) return;
  const script = document.createElement("script");
  script.id = "Cookiebot";
  script.src = "https://consent.cookiebot.com/uc.js";
  script.setAttribute("data-cbid", cookiebotId);
  script.setAttribute("data-blockingmode", "none");
  document.head.append(script);
}

if (cookiebotReady) {
  hideBanner();
  loadCookiebot();
  window.addEventListener("CookiebotOnAccept", () => {
    if (window.Cookiebot?.consent?.statistics) setConsent("granted");
    else setConsent("denied");
  });
  window.addEventListener("CookiebotOnDecline", () => setConsent("denied"));
} else if (banner) {
  if (getConsent() === "unknown") showBanner();
  banner.querySelector("[data-consent-accept]")?.addEventListener("click", () => {
    setConsent("granted");
    hideBanner();
  });
  banner.querySelector("[data-consent-reject]")?.addEventListener("click", () => {
    setConsent("denied");
    hideBanner();
  });
}

document.querySelectorAll("[data-cookie-settings]").forEach((button) => {
  button.addEventListener("click", () => {
    if (cookiebotReady && window.Cookiebot?.renew) {
      window.Cookiebot.renew();
      return;
    }
    showBanner();
  });
});
