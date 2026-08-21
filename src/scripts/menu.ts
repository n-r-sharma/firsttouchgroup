const dialog = document.querySelector<HTMLDialogElement>("[data-menu-dialog]");
const openButton = document.querySelector<HTMLButtonElement>("[data-menu-open]");

if (!dialog || !openButton) {
  // Header without a mobile menu on this page.
} else {
  const closeMenu = () => {
    if (dialog.open) dialog.close();
  };

  openButton.addEventListener("click", () => {
    dialog.showModal();
    openButton.setAttribute("aria-expanded", "true");
  });

  dialog.addEventListener("close", () => {
    openButton.setAttribute("aria-expanded", "false");
    openButton.focus();
  });

  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) closeMenu();
  });

  dialog.querySelectorAll<HTMLAnchorElement>("[data-menu-link]").forEach((link) => {
    link.addEventListener("click", () => closeMenu());
  });
}

export {};
