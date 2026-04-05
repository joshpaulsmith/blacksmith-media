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
      return isMobile() ? 260 : 360;
    }
    return isMobile() ? 220 : 300;
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
    ) {
      return false;
    }

    if (link.target === "_blank" || link.hasAttribute("download")) {
      return false;
    }

    var url = new URL(link.href, window.location.origin);

    if (url.origin !== window.location.origin) return false;
    if (url.pathname === window.location.pathname && url.hash) return false;

    return true;
  }

  function ensureOverlay() {
    var overlay = document.querySelector(".page-transition-overlay");

    if (!overlay) {
      overlay = document.createElement("div");
      overlay.className = "page-transition-overlay";
      document.body.appendChild(overlay);
    }

    return overlay;
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
    ensureOverlay();
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
    }, type === "service" ? (isMobile() ? 320 : 420) : (isMobile() ? 280 : 360));
  }

  function leavePage(url, type) {
    if (isTransitioning) return;
    isTransitioning = true;

    ensureOverlay();
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
    }, getDuration(type));
  }

  function initPageTransitions() {
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
  }

  function initPortfolioForm() {
    var portfolioForm = document.getElementById("portfolioForm");
    var portfolioFormSuccess = document.getElementById("portfolioFormSuccess");

    if (!portfolioForm || !portfolioFormSuccess) return;

    portfolioForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      var data = new FormData(portfolioForm);

      try {
        var response = await fetch("https://formsubmit.co/ajax/blacksmithmedia@protonmail.com", {
          method: "POST",
          body: data,
          headers: {
            Accept: "application/json"
          }
        });

        if (response.ok) {
          portfolioForm.reset();
          portfolioForm.style.display = "none";
          portfolioFormSuccess.style.display = "block";
        } else {
          alert("Something went wrong. Please try again.");
        }
      } catch (err) {
        alert("Something went wrong. Please try again.");
      }
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initPageTransitions();
    initPortfolioForm();
  });

  window.addEventListener("pageshow", function (e) {
    if (e.persisted) {
      enterPage();
    }
  });
})();
