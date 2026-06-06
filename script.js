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

  function initHomeProjectModal() {
    var modal = document.getElementById("projectModal");
    var overlay = document.getElementById("projectModalOverlay");
    var closeBtn = document.getElementById("closeProjectForm");
    var openBtns = document.querySelectorAll(".open-project-form");
    var form = document.getElementById("projectForm");
    var successMsg = document.getElementById("formSuccess");

    if (!modal || !overlay || !closeBtn || !form || !successMsg || !openBtns.length) {
      return;
    }

    function openModal() {
      modal.style.display = "flex";
      modal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    }

    function resetModalState() {
      form.style.display = "block";
      successMsg.style.display = "none";
      successMsg.classList.remove("is-visible");
      successMsg.setAttribute("aria-hidden", "true");
    }

    function closeModal() {
      modal.setAttribute("aria-hidden", "true");
      modal.style.display = "none";
      document.body.style.overflow = "";
      resetModalState();
    }

    openBtns.forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        openModal();
      });
    });

    overlay.addEventListener("click", closeModal);
    closeBtn.addEventListener("click", closeModal);

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && modal.getAttribute("aria-hidden") === "false") {
        closeModal();
      }
    });

    form.addEventListener("submit", async function (e) {
      e.preventDefault();

      var data = new FormData(form);
      if (data.get("_honey")) return;

      try {
        var response = await fetch("https://formsubmit.co/ajax/blacksmithmedia@protonmail.com", {
          method: "POST",
          body: data,
          headers: {
            Accept: "application/json"
          }
        });

        if (response.ok) {
          form.reset();
          form.style.display = "none";
          successMsg.style.display = "block";
          successMsg.classList.add("is-visible");
          successMsg.setAttribute("aria-hidden", "false");
          window.setTimeout(function () {
            window.location.href = "/thank-you/";
          }, 700);
        } else {
          alert("Something went wrong. Please try again or email blacksmithmedia@protonmail.com.");
        }
      } catch (err) {
        alert("Something went wrong. Please try again or email blacksmithmedia@protonmail.com.");
      }
    });
  }

  function initContactForm() {
    var contactForm = document.getElementById("contactForm");
    var contactFormSuccess = document.getElementById("contactFormSuccess");

    if (!contactForm || !contactFormSuccess) return;

    contactForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      var data = new FormData(contactForm);
      if (data.get("_honey")) return;

      try {
        var response = await fetch("https://formsubmit.co/ajax/blacksmithmedia@protonmail.com", {
          method: "POST",
          body: data,
          headers: {
            Accept: "application/json"
          }
        });

        if (response.ok) {
          contactForm.reset();
          contactForm.style.display = "none";
          contactFormSuccess.style.display = "block";
          contactFormSuccess.classList.add("is-visible");
          contactFormSuccess.setAttribute("aria-hidden", "false");
          window.setTimeout(function () {
            window.location.href = "/thank-you/";
          }, 700);
        } else {
          alert("Something went wrong. Please try again or email blacksmithmedia@protonmail.com.");
        }
      } catch (err) {
        alert("Something went wrong. Please try again or email blacksmithmedia@protonmail.com.");
      }
    });
  }

  function initMobileNav() {
    var nav = document.querySelector(".nav");
    var navInner = document.querySelector(".nav-inner");
    var navLinks = document.querySelector(".nav-links");

    if (!nav || !navInner || !navLinks) return;
    if (navInner.querySelector(".nav-toggle")) return;

    var toggle = document.createElement("button");
    toggle.className = "nav-toggle";
    toggle.type = "button";
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-controls", "site-nav-links");
    toggle.setAttribute("aria-label", "Open menu");
    toggle.innerHTML =
      '<span class="nav-toggle-box" aria-hidden="true">' +
      '<span class="nav-toggle-line"></span>' +
      '<span class="nav-toggle-line"></span>' +
      '<span class="nav-toggle-line"></span>' +
      "</span>" +
      '<span class="nav-toggle-text">Menu</span>';

    if (!navLinks.id) {
      navLinks.id = "site-nav-links";
    }

    navInner.insertBefore(toggle, navLinks);

    function closeMenu() {
      nav.classList.remove("nav-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open menu");
      document.body.classList.remove("nav-is-open");
    }

    function openMenu() {
      nav.classList.add("nav-open");
      toggle.setAttribute("aria-expanded", "true");
      toggle.setAttribute("aria-label", "Close menu");
      document.body.classList.add("nav-is-open");
    }

    toggle.addEventListener("click", function () {
      if (nav.classList.contains("nav-open")) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    navLinks.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        closeMenu();
      });
    });

    document.addEventListener("click", function (e) {
      if (!nav.classList.contains("nav-open")) return;
      if (nav.contains(e.target)) return;
      closeMenu();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("nav-open")) {
        closeMenu();
      }
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > MOBILE_BREAKPOINT) {
        closeMenu();
      }
    });
  }

  function initMotionSystem() {
    if (isReducedMotion()) return;

    document.body.classList.add("motion-enabled");

    var revealGroups = [
      {
        selector: ".breadcrumbs .wrap > *, .hero .eyebrow, .hero h1, .hero .lead, .hero .seo-block, .hero .btn-row, .hero .micro",
        step: 42
      },
      {
        selector: ".overview-rail > .overview-node",
        step: 36
      },
      {
        selector: "main .section > .wrap > .section-kicker, main .section > .wrap > h2, main .section > .wrap > .section-copy, main .section > .wrap > .section-lead, main .section > .wrap > .contact-layout, main .section > .wrap > .contact-box, main .section > .wrap > .legal-copy, main .section > .wrap > .review-link-box",
        step: 40
      },
      {
        selector: ".cards > .card, .process > .step, .process-grid > *, .deliverables-grid > *, .faq-grid > *, .portfolio-list > *, .footer-inner > *, .contact-points > *, .portfolio-cta .btn-row > *",
        step: 34
      }
    ];

    var seen = new WeakSet();
    var revealItems = [];

    revealGroups.forEach(function (group) {
      var nodes = document.querySelectorAll(group.selector);
      nodes.forEach(function (node, index) {
        if (seen.has(node)) return;
        seen.add(node);
        node.classList.add("reveal-on-scroll");
        node.style.setProperty("--reveal-delay", index * group.step + "ms");
        revealItems.push(node);
      });
    });

    if (!revealItems.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, {
      threshold: 0.14,
      rootMargin: "0px 0px -12% 0px"
    });

    revealItems.forEach(function (item) {
      observer.observe(item);
    });
  }

  function initProcessFlow() {
    var grid = document.querySelector("[data-process-grid]");
    if (!grid) return;

    var steps = Array.prototype.slice.call(grid.querySelectorAll("[data-process-step]"));
    if (!steps.length) return;

    function setProgress(activeIndex) {
      var percent = steps.length <= 1 ? 100 : (activeIndex / (steps.length - 1)) * 100;
      grid.style.setProperty("--process-progress", percent.toFixed(2));

      steps.forEach(function (step, index) {
        step.classList.toggle("is-active", index <= activeIndex);
      });
    }

    setProgress(0);

    if (isReducedMotion()) {
      setProgress(steps.length - 1);
      return;
    }

    var maxSeen = 0;
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var idx = steps.indexOf(entry.target);
        if (idx > maxSeen) {
          maxSeen = idx;
          setProgress(maxSeen);
        }
      });
    }, {
      threshold: 0.45,
      rootMargin: "0px 0px -18% 0px"
    });

    steps.forEach(function (step) {
      observer.observe(step);
    });
  }

  function initInteractiveCards() {
    return;

    var targets = document.querySelectorAll(".card, .process-card, .deliverable-item, .contact-box, .contact-form, .portfolio-item");

    targets.forEach(function (target) {
      target.addEventListener("mousemove", function (e) {
        var rect = target.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        var px = x / rect.width;
        var py = y / rect.height;
        var rotateY = (px - 0.5) * 7;
        var rotateX = (0.5 - py) * 6;

        target.style.setProperty("--card-rotate-x", rotateX.toFixed(2) + "deg");
        target.style.setProperty("--card-rotate-y", rotateY.toFixed(2) + "deg");
        target.style.setProperty("--card-glow-x", (px * 100).toFixed(2) + "%");
        target.style.setProperty("--card-glow-y", (py * 100).toFixed(2) + "%");
      });

      target.addEventListener("mouseleave", function () {
        target.style.setProperty("--card-rotate-x", "0deg");
        target.style.setProperty("--card-rotate-y", "0deg");
        target.style.setProperty("--card-glow-x", "50%");
        target.style.setProperty("--card-glow-y", "50%");
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initPageTransitions();
    initMobileNav();
    initHomeProjectModal();
    initContactForm();
    initMotionSystem();
    initProcessFlow();
    initInteractiveCards();
  });

  window.addEventListener("pageshow", function (e) {
    if (e.persisted) {
      enterPage();
    }
  });
})();
