// =========================
// PAGE WIPE TRANSITIONS
// =========================

(function () {
  function shouldHandleLink(link) {
    if (!link) return false;

    const href = link.getAttribute("href");
    if (!href) return false;

    if (
      href.startsWith("#") ||
      href.startsWith("mailto:") ||
      href.startsWith("tel:") ||
      href.startsWith("javascript:")
    ) {
      return false;
    }

    if (link.target === "_blank" || link.hasAttribute("download")) {
      return false;
    }

    const url = new URL(link.href, window.location.origin);

    // only handle same-origin links
    if (url.origin !== window.location.origin) return false;

    // don't animate same-page anchor jumps
    if (
      url.pathname === window.location.pathname &&
      url.hash &&
      url.hash !== ""
    ) {
      return false;
    }

    return true;
  }

  function ensureWipe() {
    let wipe = document.querySelector(".page-wipe");
    if (!wipe) {
      wipe = document.createElement("div");
      wipe.className = "page-wipe";
      document.body.appendChild(wipe);
    }
    return wipe;
  }

  function enterAnimation() {
    ensureWipe();
    document.body.classList.remove("is-leaving");
    document.body.classList.add("is-entering");

    setTimeout(() => {
      document.body.classList.remove("is-entering");
    }, 650);
  }

  function leaveTo(url) {
    ensureWipe();
    document.body.classList.remove("is-entering");
    document.body.classList.add("is-leaving");

    setTimeout(() => {
      window.location.href = url;
    }, 520);
  }

  document.addEventListener("DOMContentLoaded", function () {
    enterAnimation();

    // delegated click handling works better across pages/mobile
    document.addEventListener("click", function (e) {
      const link = e.target.closest("a");
      if (!shouldHandleLink(link)) return;

      const url = new URL(link.href, window.location.origin).href;
      if (url === window.location.href) return;

      e.preventDefault();
      leaveTo(url);
    });
  });

  // helps when using back/forward cache on mobile Safari
  window.addEventListener("pageshow", function () {
    enterAnimation();
  });
})();
