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
    ) return false;

    if (link.target === "_blank" || link.hasAttribute("download")) return false;

    const url = new URL(link.href, window.location.origin);

    if (url.origin !== window.location.origin) return false;

    if (url.pathname === window.location.pathname && url.hash) return false;

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

  function enterPage() {
    ensureWipe();
    document.body.classList.remove("is-leaving");
    document.body.classList.add("is-entering");

    setTimeout(() => {
      document.body.classList.remove("is-entering");
    }, 700);
  }

  function leavePage(url) {
    ensureWipe();
    document.body.classList.remove("is-entering");
    document.body.classList.add("is-leaving");

    setTimeout(() => {
      window.location.href = url;
    }, 620);
  }

  document.addEventListener("DOMContentLoaded", function () {
    enterPage();

    document.addEventListener("click", function (e) {
      const link = e.target.closest("a");
      if (!shouldHandleLink(link)) return;

      const url = new URL(link.href, window.location.origin).href;
      if (url === window.location.href) return;

      e.preventDefault();
      leavePage(url);
    });
  });

  window.addEventListener("pageshow", function () {
    enterPage();
  });
})();
