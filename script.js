(function () {
  var isTransitioning = false;
  var MOBILE_BREAKPOINT = 768;

  function isReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function isMobile() {
    return window.innerWidth <= MOBILE_BREAKPOINT;
  }

  function getDuration(type) {
    if (type === "service") {
      return isMobile() ? 300 : 420;
    }
    return isMobile() ? 400 : 520;
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

  function ensureLayers() {
    var wipe = document.querySelector(".page-wipe");
    var fade = document.querySelector(".page-fade");

    if (!wipe) {
      wipe = document.createElement("div");
      wipe.className = "page-wipe";
      document.body.appendChild(wipe);
    }

    if (!fade) {
      fade = document.createElement("div");
      fade.className = "page-fade";
      document.body.appendChild(fade);
    }
  }

  function clearTransitionClasses() {
    document.body.classList.remove(
      "is-leaving-default",
      "is-entering-default",
      "is-leaving-service",
      "is-entering-service"
    );
  }

  function getStoredEnterType() {
    try {
      return sessionStorage.getItem("pageTransitionType") || "default";
    } catch (e) {
      return "default";
    }
  }

  function setStoredEnterType(type) {
    try {
      sessionStorage.setItem("pageTransitionType", type);
    } catch (e) {}
  }

  function enterPage() {
    ensureLayers();
    isTransitioning = false;

    if (isReducedMotion()) {
      clearTransitionClasses();
      return;
    }

    var type = getStoredEnterType();
    clearTransitionClasses();

    if (type === "service") {
      document.body.classList.add("is-entering-service");
    } else {
      document.body.classList.add("is-entering-default");
    }

    window.setTimeout(function () {
      document.body.classList.remove(
        "is-entering-default",
        "is-entering-service"
      );
    }, getDuration(type));
  }

  function leavePage(url, type) {
    if (isTransitioning) return;
    isTransitioning = true;

    ensureLayers();
    setStoredEnterType(type);

    if (isReducedMotion()) {
      window.location.href = url;
      return;
    }

    clearTransitionClasses();

    if (type === "service") {
      document.body.classList.add("is-leaving-service");
    } else {
      document.body.classList.add("is-leaving-default");
    }

    window.setTimeout(function () {
      window.location.href = url;
    }, getDuration(type) - 20);
  }

  document.addEventListener("DOMContentLoaded", function () {
    enterPage();

    document.addEventListener("click", function (e) {
      var link = e.target.closest("a");
      if (!shouldHandleLink(link)) return;

      var url = new URL(link.href, window.location.origin).href;
      if (url === window.location.href) return;

      var type = link.dataset.transition === "service" ? "service" : "default";

      e.preventDefault();
      leavePage(url, type);
    });
  });

  window.addEventListener("pageshow", function (e) {
    if (e.persisted) {
      enterPage();
    }
  });
})();
