/* =========================================================================
   BIG Supply Chain — interactions
   i18n · sticky header · mobile menu · smooth scroll · scroll-spy ·
   FAQ accordion · form validation · popup modal · widgets · reveal
   ========================================================================= */
(function () {
  "use strict";
  var doc = document;
  var DICT = window.I18N || { uk: {}, en: {} };

  /* ---------------- i18n ---------------- */
  var SUPPORTED = ["uk", "en"];
  var lang = localStorage.getItem("bsc-lang");
  if (SUPPORTED.indexOf(lang) === -1) lang = "uk";

  function t(key) {
    var pack = DICT[lang] || {};
    return pack[key];
  }

  function applyI18n() {
    // textContent
    doc.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      var val = t(key);
      if (val == null) return; // keep existing text if key missing
      var attr = el.getAttribute("data-i18n-attr");
      if (attr) {
        el.setAttribute(attr, val);
      } else {
        el.textContent = val;
      }
    });
    // innerHTML (for strings with inline markup)
    doc.querySelectorAll("[data-i18n-html]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-html");
      var val = t(key);
      if (val == null) return;
      el.innerHTML = val;
    });
    doc.documentElement.setAttribute("lang", lang === "uk" ? "uk" : "en");
    if (t("meta.title")) doc.title = t("meta.title");
    // reflect active state on every lang switch button
    doc.querySelectorAll(".lang__btn").forEach(function (btn) {
      btn.classList.toggle("is-active", btn.getAttribute("data-lang") === lang);
    });
  }

  function setLang(next) {
    if (SUPPORTED.indexOf(next) === -1 || next === lang) return;
    lang = next;
    localStorage.setItem("bsc-lang", lang);
    applyI18n();
  }

  doc.querySelectorAll(".lang__btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      setLang(btn.getAttribute("data-lang"));
    });
  });

  applyI18n();

  /* ---------------- Year ---------------- */
  var yearEl = doc.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------------- Sticky header hide / show ---------------- */
  var header = doc.getElementById("header");
  var lastY = window.pageYOffset;
  var ticking = false;

  function onScroll() {
    var y = window.pageYOffset;
    if (header) {
      header.classList.toggle("is-scrolled", y > 20);
      if (y > 400 && y > lastY + 4) {
        header.classList.add("is-hidden"); // scrolling down
      } else if (y < lastY - 4 || y < 200) {
        header.classList.remove("is-hidden"); // scrolling up / near top
      }
    }
    toggleWidgets(y);
    lastY = y;
    ticking = false;
  }
  window.addEventListener("scroll", function () {
    if (!ticking) { window.requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });

  /* ---------------- Floating widget + mobile sticky CTA ---------------- */
  var floatCta = doc.getElementById("floatCta");
  var mobileCta = doc.getElementById("mobileCta");
  function toggleWidgets(y) {
    var show = y > 700;
    if (floatCta) floatCta.classList.toggle("is-visible", show);
    if (mobileCta) mobileCta.classList.toggle("is-visible", show);
  }
  toggleWidgets(window.pageYOffset);

  /* ---------------- Mobile menu ---------------- */
  var burger = doc.getElementById("burger");
  var mobileMenu = doc.getElementById("mobileMenu");

  function setMenu(open) {
    doc.body.classList.toggle("menu-open", open);
    if (burger) burger.setAttribute("aria-expanded", open ? "true" : "false");
    if (mobileMenu) mobileMenu.setAttribute("aria-hidden", open ? "false" : "true");
    doc.body.style.overflow = open ? "hidden" : "";
  }
  if (burger) {
    burger.addEventListener("click", function () {
      setMenu(!doc.body.classList.contains("menu-open"));
    });
  }
  if (mobileMenu) {
    mobileMenu.querySelectorAll("a[href^='#']").forEach(function (a) {
      a.addEventListener("click", function () { setMenu(false); });
    });
  }

  /* ---------------- Smooth anchor scroll ---------------- */
  var HEADER_OFFSET = 96;
  doc.querySelectorAll("a[href^='#']").forEach(function (link) {
    link.addEventListener("click", function (e) {
      var id = link.getAttribute("href");
      if (!id || id === "#") return;
      var target = doc.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var top = target.getBoundingClientRect().top + window.pageYOffset - HEADER_OFFSET;
      window.scrollTo({ top: top, behavior: "smooth" });
      history.replaceState(null, "", id);
    });
  });

  /* ---------------- Scroll-spy (active nav) ---------------- */
  var navLinks = Array.prototype.slice.call(doc.querySelectorAll(".nav__link"));
  var sections = navLinks
    .map(function (l) { return doc.querySelector(l.getAttribute("href")); })
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = "#" + entry.target.id;
          navLinks.forEach(function (l) {
            l.classList.toggle("is-active", l.getAttribute("href") === id);
          });
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------------- FAQ accordion ---------------- */
  doc.querySelectorAll(".faq-item").forEach(function (item) {
    var btn = item.querySelector(".faq-item__q");
    var panel = item.querySelector(".faq-item__a");
    if (!btn || !panel) return;
    btn.addEventListener("click", function () {
      var isOpen = item.classList.contains("is-open");
      // close siblings within the same list
      var list = item.parentElement;
      list.querySelectorAll(".faq-item.is-open").forEach(function (other) {
        if (other !== item) {
          other.classList.remove("is-open");
          other.querySelector(".faq-item__a").style.height = "0px";
          other.querySelector(".faq-item__q").setAttribute("aria-expanded", "false");
        }
      });
      if (isOpen) {
        item.classList.remove("is-open");
        panel.style.height = "0px";
        btn.setAttribute("aria-expanded", "false");
      } else {
        item.classList.add("is-open");
        panel.style.height = panel.scrollHeight + "px";
        btn.setAttribute("aria-expanded", "true");
      }
    });
  });
  // recompute open panel heights on resize
  window.addEventListener("resize", function () {
    doc.querySelectorAll(".faq-item.is-open .faq-item__a").forEach(function (p) {
      p.style.height = p.scrollHeight + "px";
    });
  });

  /* ---------------- Reveal on scroll ---------------- */
  var reveals = Array.prototype.slice.call(doc.querySelectorAll(".reveal"));
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          obs.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* ---------------- Popup modal ---------------- */
  var modal = doc.getElementById("popupModal");
  var lastFocused = null;

  function openModal() {
    if (!modal) return;
    lastFocused = doc.activeElement;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    doc.body.style.overflow = "hidden";
    var first = modal.querySelector("input, textarea, button");
    if (first) setTimeout(function () { first.focus(); }, 60);
  }
  function closeModal() {
    if (!modal) return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    doc.body.style.overflow = "";
    if (lastFocused && lastFocused.focus) lastFocused.focus();
  }
  doc.querySelectorAll("[data-cta='popup']").forEach(function (b) {
    b.addEventListener("click", function (e) { e.preventDefault(); openModal(); });
  });
  if (modal) {
    modal.querySelectorAll("[data-close]").forEach(function (c) {
      c.addEventListener("click", closeModal);
    });
    // focus trap
    modal.addEventListener("keydown", function (e) {
      if (e.key !== "Tab") return;
      var f = modal.querySelectorAll("a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled])");
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && doc.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && doc.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  }
  doc.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      if (modal && modal.classList.contains("is-open")) closeModal();
      if (doc.body.classList.contains("menu-open")) setMenu(false);
    }
  });

  /* ---------------- Form validation ---------------- */
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  var PHONE_RE = /^[+]?[\d\s()-]{9,20}$/;

  function setError(field, on) {
    if (!field) return;
    field.classList.toggle("has-error", on);
  }

  function validateField(input) {
    var field = input.closest(".field") || input.closest(".checkbox");
    if (input.type === "checkbox") {
      var okC = input.checked;
      var wrap = input.closest(".checkbox");
      if (wrap) wrap.classList.toggle("has-error", !okC);
      return okC;
    }
    var val = (input.value || "").trim();
    var ok = true;
    if (input.hasAttribute("required") && !val) ok = false;
    else if (input.type === "email" && val && !EMAIL_RE.test(val)) ok = false;
    else if (input.type === "tel" && val && !PHONE_RE.test(val)) ok = false;
    setError(field, !ok);
    return ok;
  }

  function wireForm(formId, successId, isModal) {
    var form = doc.getElementById(formId);
    var success = doc.getElementById(successId);
    if (!form) return;

    // live-clear errors as the user fixes them
    form.querySelectorAll("input, textarea").forEach(function (input) {
      input.addEventListener("input", function () {
        var field = input.closest(".field") || input.closest(".checkbox");
        if (field && field.classList.contains("has-error")) validateField(input);
      });
      input.addEventListener("change", function () {
        if (input.type === "checkbox") validateField(input);
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var valid = true;
      var firstBad = null;
      form.querySelectorAll("input, textarea").forEach(function (input) {
        if (input.type === "checkbox" || input.hasAttribute("required") || input.value.trim()) {
          var ok = validateField(input);
          if (!ok && !firstBad) firstBad = input;
          valid = valid && ok;
        }
      });
      if (!valid) { if (firstBad) firstBad.focus(); return; }

      var btn = form.querySelector("button[type='submit']");
      if (btn) { btn.classList.add("is-loading"); btn.disabled = true; }

      // Simulated async submit (no backend wired yet).
      setTimeout(function () {
        if (btn) { btn.classList.remove("is-loading"); btn.disabled = false; }
        form.classList.add("is-submitted");
        if (success) success.classList.add("is-visible");
        form.reset();
        if (isModal) {
          setTimeout(function () {
            closeModal();
            // reset modal back to form state for next open
            setTimeout(function () {
              form.classList.remove("is-submitted");
              if (success) success.classList.remove("is-visible");
            }, 400);
          }, 2600);
        }
      }, 1100);
    });
  }

  wireForm("quoteForm", "quoteSuccess", false);
  wireForm("popupForm", "popupSuccess", true);

})();
