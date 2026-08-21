import { initForm } from "@formspree/ajax";
import { track } from "./analytics.ts";

const form = document.querySelector<HTMLFormElement>("[data-quote-form]");
if (form) {
  const status = form.querySelector<HTMLElement>("[data-form-status]");
  const success = document.querySelector<HTMLElement>("[data-fs-success]");
  const topError = document.querySelector<HTMLElement>(".quote__error");
  const submit = form.querySelector<HTMLButtonElement>("[data-fs-submit-btn]");
  const formId = form.dataset.formId ?? "";
  const ready = form.dataset.formReady === "true";
  let completionTimer: number | undefined;

  const setStatus = (message: string) => {
    if (status) status.textContent = message;
  };

  const showTopError = (message: string) => {
    if (!topError) return;
    topError.hidden = false;
    topError.textContent = message;
  };

  const hideTopError = () => {
    if (topError) {
      topError.hidden = true;
      topError.textContent = "";
    }
  };

  const lock = (locked: boolean) => {
    form.classList.toggle("is-submitting", locked);
    if (submit) submit.disabled = locked;
    setStatus(locked ? "Sending your request…" : "");
  };

  const showSuccessState = () => {
    if (completionTimer || form.hidden) return;
    form.classList.add("is-completing");
    completionTimer = window.setTimeout(() => {
      form.hidden = true;
      form.classList.remove("is-completing");
      if (success) {
        success.hidden = false;
        success.setAttribute("tabindex", "-1");
        success.focus();
      }
      completionTimer = undefined;
    }, 120);
  };

  form.addEventListener("submit", (event) => {
    const honeypot = form.querySelector<HTMLInputElement>("[name='company_website']");
    const gotcha = form.querySelector<HTMLInputElement>("[name='_gotcha']");
    if (honeypot?.value || gotcha?.value) {
      event.preventDefault();
      event.stopImmediatePropagation();
      showSuccessState();
      return;
    }

    if (!form.checkValidity()) {
      form.reportValidity();
    }
  });

  if (!ready) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      showTopError(
        "The live enquiry inbox is not connected yet. Please email or telephone using the details above.",
      );
    });
  } else {
    initForm({
      formElement: form,
      formId,
      useDefaultStyles: false,
      disable: () => lock(true),
      enable: () => lock(false),
      renderSuccess: (_context, message) => {
        if (message === null) return;
        hideTopError();
        showSuccessState();
        track("quote_submitted", { method: "form" });
      },
      renderFormError: (_context, message) => {
        if (message === null) {
          hideTopError();
          return;
        }
        showTopError(message || "We could not send your request. Please try again or use email or phone.");
      },
      onFailure: () => {
        lock(false);
        showTopError("The network request failed. Your answers are still here. Try again or email us directly.");
      },
      onError: () => {
        lock(false);
      },
    });
  }
}
