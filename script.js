// =========================
// PAGE WIPE TRANSITIONS
// =========================

document.addEventListener("DOMContentLoaded", () => {

  // Create wipe overlay automatically
  const wipe = document.createElement("div");
  wipe.className = "page-wipe";
  document.body.appendChild(wipe);

  // Enter animation
  document.body.classList.add("is-entering");

  // Handle link clicks
  const links = document.querySelectorAll("a[href]");

  links.forEach(link => {
    const href = link.getAttribute("href");

    if (
      !href ||
      href.startsWith("#") ||
      href.startsWith("mailto:") ||
      href.startsWith("tel:") ||
      href.startsWith("javascript:") ||
      link.target === "_blank" ||
      link.hasAttribute("download")
    ) {
      return;
    }

    link.addEventListener("click", function(e) {
      const url = this.href;

      if (!url || url === window.location.href) return;

      e.preventDefault();
      document.body.classList.remove("is-entering");
      document.body.classList.add("is-leaving");

      setTimeout(() => {
        window.location.href = url;
      }, 520);
    });
  });

});
