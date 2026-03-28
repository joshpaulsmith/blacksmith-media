(function () {
  var isTransitioning = false;
  var ENTER_DURATION_DESKTOP = 520;
  var LEAVE_DURATION_DESKTOP = 520;
  var ENTER_DURATION_MOBILE = 400;
  var LEAVE_DURATION_MOBILE = 400;
  var MOBILE_BREAKPOINT = 768;

  function isReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function isMobile() {
    return window.innerWidth <= MOBILE_BREAKPOINT;
  }

  function getEnterDuration() {
    return isMobile() ? ENTER_DURATION_MOBILE : ENTER_DURATION_DESKTOP;
  }

  function getLeaveDuration() {
    return isMobile() ? LEAVE_DURATION_MOBILE : LEAVE_DURATION_DESKTOP;
  }

  function shouldHandleLink(link) {
    if (!link) return false;

    var href = link.getAttribute("href");
    if (!href) return false;

    if (
      href.startsWith("#") ||
      href.startsWith("mailto:") ||
      href.startsWith("tel:") ||
      href.startsWith("javascript:")
    ) return false;

    if (link.target === "_blank" || link.hasAttribute("download")) return false;

    var url = new URL(link.href, window.location.origin);

    if (url.origin !== window.location.origin) return false;

    if (url.pathname === window.location.pathname && url.hash) return false;

    return true;
  }

  function ensureWipe() {
    var wipe = document.querySelector(".page-wipe");

    if (!wipe) {
      wipe = document.createElement("div");
      wipe.className = "page-wipe";
      document.body.appendChild(wipe);
    }

    return wipe;
  }

  function clearTransitionClasses() {
    document.body.classList.remove("is-entering");
    document.body.classList.remove("is-leaving");
  }

  function enterPage() {
    ensureWipe();
    isTransitioning = false;

    if (isReducedMotion()) {
      clearTransitionClasses();
      return;
    }

    clearTransitionClasses();
    document.body.classList.add("is-entering");

    window.setTimeout(function () {
      document.body.classList.remove("is-entering");
    }, getEnterDuration());
  }

  function leavePage(url) {
    if (isTransitioning) return;
    isTransitioning = true;

    ensureWipe();

    if (isReducedMotion()) {
      window.location.href = url;
      return;
    }

    document.body.classList.remove("is-entering");
    document.body.classList.add("is-leaving");

    window.setTimeout(function () {
      window.location.href = url;
    }, getLeaveDuration() - 20);
  }

  document.addEventListener("DOMContentLoaded", function () {
    enterPage();

    document.addEventListener("click", function (e) {
      var link = e.target.closest("a");
      if (!shouldHandleLink(link)) return;

      var url = new URL(link.href, window.location.origin).href;
      if (url === window.location.href) return;

      e.preventDefault();
      leavePage(url);
    });
  });

  window.addEventListener("pageshow", function (e) {
    if (e.persisted) {
      enterPage();
    }
  });
})();
