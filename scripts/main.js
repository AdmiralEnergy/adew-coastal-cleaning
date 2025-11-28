(() => {
  const navToggle = document.getElementById("nav-toggle");
  const navMenu = document.getElementById("nav-menu");

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      const isOpen = navMenu.classList.toggle("hidden");
      navToggle.setAttribute("aria-expanded", (!isOpen).toString());
    });
  }

  // Simple success banner if redirected with ?success=1
  const params = new URLSearchParams(window.location.search);
  if (params.get("success") === "1") {
    const banner = document.getElementById("form-success");
    if (banner) {
      banner.classList.remove("hidden");
    }
  }

   // Opportunistic Notion sync: send form data to Netlify Function while still letting Netlify Forms capture it.
  document.querySelectorAll("form[data-notion-function]").forEach((form) => {
    form.addEventListener("submit", () => {
      try {
        const endpoint = form.getAttribute("data-notion-function");
        if (!endpoint) return;
        const formData = new FormData(form);
        const payload = {};
        formData.forEach((value, key) => {
          payload[key] = value;
        });
        navigator.sendBeacon(
          endpoint,
          new Blob([JSON.stringify(payload)], { type: "application/json" })
        );
      } catch (err) {
        console.warn("Notion sync beacon failed", err);
      }
    });
  });
})();
