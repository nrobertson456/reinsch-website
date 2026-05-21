(function () {
  var header = document.querySelector(".site-header");
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  var yearEl = document.getElementById("year");

  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  /* —— Scroll reveal & stat count-up —— */
  var panelWrapEarly = document.getElementById("property-detail-panel");
  if (panelWrapEarly) {
    panelWrapEarly.classList.remove("is-open");
    panelWrapEarly.setAttribute("aria-hidden", "true");
  }

  function prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function assignRevealIndices(group) {
    var items = group.querySelectorAll(":scope > .reveal");
    items.forEach(function (item, i) {
      item.style.setProperty("--reveal-index", String(i));
    });
  }

  function animateStatNumber(el) {
    if (!el || el.dataset.counted === "true") return;

    var target = parseInt(el.getAttribute("data-count"), 10);
    if (isNaN(target)) return;

    var suffix = el.getAttribute("data-suffix") || "";
    el.dataset.counted = "true";
    el.classList.add("is-counting");

    if (prefersReducedMotion()) {
      el.textContent = String(target) + suffix;
      return;
    }

    var duration = 2200;
    var startTime = null;

    function tick(now) {
      if (!startTime) startTime = now;
      var progress = Math.min((now - startTime) / duration, 1);
      var value = Math.round(easeOutCubic(progress) * target);
      el.textContent = String(value) + suffix;
      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = String(target) + suffix;
        el.classList.remove("is-counting");
      }
    }

    el.textContent = "0" + suffix;
    requestAnimationFrame(tick);
  }

  function animateStatsInGroup(group) {
    group.querySelectorAll(".stat-number[data-count]").forEach(function (stat, i) {
      window.setTimeout(function () {
        animateStatNumber(stat);
      }, i * 180);
    });
  }

  function revealElement(el) {
    if (!el || el.classList.contains("is-visible")) return;
    el.classList.add("is-visible");

    if (el.classList.contains("reveal-group")) {
      el.querySelectorAll(":scope > .reveal").forEach(function (child) {
        child.classList.add("is-visible");
      });
    }
  }

  function initPageFadeIn() {
    if (prefersReducedMotion()) {
      document.documentElement.classList.add("is-ready");
      return;
    }

    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(function () {
        document.documentElement.classList.add("is-ready");
      });
    });
  }

  function initStatsCountUp() {
    var statsGroup = document.getElementById("about-stats");
    if (!statsGroup) return;

    var statEls = statsGroup.querySelectorAll(".stat-number[data-count]");
    statEls.forEach(function (el) {
      if (el.dataset.counted === "true") return;
      var suffix = el.getAttribute("data-suffix") || "";
      el.textContent = "0" + suffix;
    });

    var statsObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          if (prefersReducedMotion()) {
            statEls.forEach(function (el) {
              var target = parseInt(el.getAttribute("data-count"), 10);
              var suffix = el.getAttribute("data-suffix") || "";
              el.textContent = String(target) + suffix;
              el.dataset.counted = "true";
            });
          } else {
            animateStatsInGroup(statsGroup);
          }
          statsObserver.unobserve(entry.target);
        });
      },
      {
        threshold: 0.45,
        rootMargin: "0px 0px -10% 0px",
      }
    );

    statsObserver.observe(statsGroup);
  }

  function initHeroReveal() {
    var heroItems = document.querySelectorAll(".reveal--hero");
    if (!heroItems.length) return;

    if (prefersReducedMotion()) {
      heroItems.forEach(function (el) {
        el.classList.add("is-visible");
      });
      return;
    }

    heroItems.forEach(function (el) {
      el.classList.remove("is-visible");
    });

    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(function () {
        heroItems.forEach(function (el) {
          el.classList.add("is-visible");
        });
      });
    });
  }

  function revealFailsafe() {
    document.querySelectorAll(".reveal:not(.is-visible)").forEach(function (el) {
      el.classList.add("is-visible");
    });
    document.querySelectorAll(".reveal-group:not(.is-visible)").forEach(function (group) {
      group.classList.add("is-visible");
      group.querySelectorAll(":scope > .reveal").forEach(function (child) {
        child.classList.add("is-visible");
      });
    });
  }

  function initScrollReveals() {
    var reduced = prefersReducedMotion();
    var revealEls = document.querySelectorAll(".reveal:not(.reveal--hero)");
    var groups = document.querySelectorAll(".reveal-group");

    groups.forEach(assignRevealIndices);

    if (reduced) {
      revealEls.forEach(function (el) {
        el.classList.add("is-visible");
      });
      groups.forEach(function (group) {
        revealElement(group);
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          revealElement(entry.target);
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -6% 0px",
      }
    );

    revealEls.forEach(function (el) {
      if (el.closest(".reveal-group")) return;
      observer.observe(el);
    });

    groups.forEach(function (group) {
      observer.observe(group);
    });
  }

  initPageFadeIn();
  document.documentElement.classList.add("js-scroll-reveal");
  initHeroReveal();
  initScrollReveals();
  initStatsCountUp();
  window.setTimeout(revealFailsafe, 2500);

  function setScrolled() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 24);
  }

  setScrolled();
  window.addEventListener("scroll", setScrolled, { passive: true });

  function closeNav() {
    if (!header || !toggle) return;
    header.classList.remove("nav-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
    document.body.style.overflow = "";
  }

  function openNav() {
    if (!header || !toggle) return;
    header.classList.add("nav-open");
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Close menu");
    document.body.style.overflow = "hidden";
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      if (header.classList.contains("nav-open")) {
        closeNav();
      } else {
        openNav();
      }
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeNav);
    });

    window.addEventListener("resize", function () {
      if (window.matchMedia("(min-width: 769px)").matches) {
        closeNav();
      }
    });
  }

  /* —— Property data —— */
  function buildPropertyGallery(propertyId) {
    var rooms = [
      { key: "exterior", label: "Building exterior" },
      { key: "living", label: "Living room" },
      { key: "bedroom", label: "Bedroom" },
      { key: "kitchen", label: "Kitchen" },
    ];
    return rooms.map(function (room) {
      var seed = propertyId + "-" + room.key;
      return {
        label: room.label,
        url: "https://picsum.photos/seed/" + seed + "/1200/800",
        thumb: "https://picsum.photos/seed/" + seed + "/400/280",
      };
    });
  }

  var PROPERTY_DATA = {
    "dorchester-towers": {
      name: "Dorchester Towers",
      addressLines: ["2001 Columbia Pike", "Arlington, VA 22204"],
      mapsQuery: "2001 Columbia Pike, Arlington, VA 22204",
      description:
        "Dorchester Towers offers elevated living along Columbia Pike in a secure, professionally managed mid-rise. Residents enjoy the convenience of an elevator building, reserved parking, and thoughtfully updated apartment homes—ideal for commuters and anyone who values a well-kept community with a long-term landlord who answers the phone.",
      amenities: [
        "Controlled building access",
        "Elevator service",
        "Updated kitchens and baths (select homes)",
        "On-site laundry centers",
        "Reserved parking available",
        "Professional on-site management",
        "Responsive maintenance team",
        "Transit-oriented Columbia Pike location",
      ],
      units: [
        { label: "Studio", range: "$1,595 – $1,895 / mo" },
        { label: "1 bedroom", range: "$1,795 – $2,150 / mo" },
        { label: "2 bedroom", range: "$2,050 – $2,450 / mo" },
      ],
    },
    "dorchester-apartments": {
      name: "Dorchester Apartments",
      addressLines: ["2040 Columbia Pike", "Arlington, VA 22204"],
      mapsQuery: "2040 Columbia Pike, Arlington, VA 22204",
      description:
        "Dorchester Apartments pairs classic Arlington charm with modern touches—hardwood-style flooring, refreshed kitchens, and a peaceful courtyard setting. It is a walkable, neighborly community where management knows residents by name and takes pride in keeping common areas immaculate year-round.",
      amenities: [
        "Hardwood-style flooring",
        "Modern kitchen appliances",
        "Courtyard and landscaped entries",
        "Laundry facilities on site",
        "Generous closet and storage space",
        "Responsive on-site management team",
        "Pet-friendly options (restrictions apply)",
        "Easy access to shops and transit along the Pike",
      ],
      units: [
        { label: "1 bedroom", range: "$1,525 – $1,895 / mo" },
        { label: "2 bedroom", range: "$1,795 – $2,195 / mo" },
      ],
    },
    "oakland-apartments": {
      name: "Oakland Apartments",
      addressLines: ["3710 Columbia Pike", "Arlington, VA 22204"],
      mapsQuery: "3710 Columbia Pike, Arlington, VA 22204",
      description:
        "Oakland Apartments is known for bright, efficient layouts and a friendly, diverse community. Renovated baths, bicycle storage, and a location steps from Columbia Pike transit make it a practical choice for professionals and students alike—backed by the same family ownership that has served Arlington for generations.",
      amenities: [
        "Efficiency through two-bedroom layouts",
        "Renovated bathrooms in select homes",
        "Community laundry facilities",
        "Bicycle storage",
        "Transit-friendly Columbia Pike corridor",
        "Pet-friendly options (restrictions apply)",
        "Attentive maintenance",
        "Long-term neighborhood presence",
      ],
      units: [
        { label: "Efficiency", range: "$1,395 – $1,595 / mo" },
        { label: "1 bedroom", range: "$1,595 – $1,895 / mo" },
        { label: "2 bedroom", range: "$1,795 – $2,075 / mo" },
      ],
    },
    "westmont-gardens": {
      name: "Westmont Gardens",
      addressLines: ["3860 Columbia Pike", "Arlington, VA 22204"],
      mapsQuery: "3860 Columbia Pike, Arlington, VA 22204",
      description:
        "Westmont Gardens offers some of our most spacious floor plans—including rare three-bedroom homes—wrapped in mature landscaping and a calm residential atmosphere. Updated HVAC, dedicated parking, and multiple laundry centers support comfortable everyday living for families and roommates who want room to grow without leaving Arlington.",
      amenities: [
        "Landscaped grounds and garden courtyards",
        "Spacious 1, 2, and 3 bedroom plans",
        "Updated heating and cooling (select homes)",
        "Multiple laundry centers",
        "Dedicated resident parking",
        "Professional management",
        "Quiet, established neighborhood",
        "Pet-friendly options (restrictions apply)",
      ],
      units: [
        { label: "1 bedroom", range: "$1,675 – $1,995 / mo" },
        { label: "2 bedroom", range: "$1,995 – $2,495 / mo" },
        { label: "3 bedroom", range: "$2,350 – $2,895 / mo" },
      ],
    },
    "arlington-boulevard": {
      name: "Arlington Boulevard Apartments",
      addressLines: ["1534 16th Rd N", "Arlington, VA 22209"],
      mapsQuery: "1534 16th Rd N, Arlington, VA 22209",
      description:
        "Tucked on a quiet North Arlington street, Arlington Boulevard Apartments combines renovated studio and one-bedroom homes with unbeatable access to Rosslyn, the District, and major commuter routes. Laundry on every level and a residential setting away from the noise of main arteries make it a refined choice for those who prioritize location and peace of mind.",
      amenities: [
        "North Arlington / Rosslyn corridor",
        "Quiet residential street",
        "Renovated interiors (select homes)",
        "Laundry on every level",
        "Studio and one-bedroom layouts",
        "Easy access to Metro and major roads",
        "Attentive management and maintenance",
        "Controlled access (where applicable)",
      ],
      units: [
        { label: "Studio", range: "$1,645 – $1,995 / mo" },
        { label: "1 bedroom", range: "$1,895 – $2,275 / mo" },
      ],
    },
  };

  Object.keys(PROPERTY_DATA).forEach(function (id) {
    PROPERTY_DATA[id].gallery = buildPropertyGallery(id);
  });

  var panelWrap = document.getElementById("property-detail-panel");
  var detailTitle = document.getElementById("property-detail-title");
  var detailDesc = document.getElementById("property-detail-desc");
  var detailAmenities = document.getElementById("property-detail-amenities");
  var detailPricing = document.getElementById("property-detail-pricing");
  var detailAddress = document.getElementById("property-detail-address");
  var detailMaps = document.getElementById("property-detail-maps");
  var detailEmail = document.getElementById("property-detail-email");
  var detailApply = document.getElementById("property-detail-apply");
  var detailClose = document.getElementById("property-detail-close");
  var cards = document.querySelectorAll(".property-card[data-property]");
  var galleryModal = document.getElementById("gallery-modal");
  var applicationModal = document.getElementById("application-modal");

  var currentId = null;
  var swapTimer = null;

  function buildMapsUrl(query) {
    return (
      "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(query)
    );
  }

  function fillPanel(id) {
    var data = PROPERTY_DATA[id];
    if (!data || !detailTitle) return;

    detailTitle.textContent = data.name;
    detailDesc.textContent = data.description;

    detailAmenities.innerHTML = "";
    data.amenities.forEach(function (text) {
      var li = document.createElement("li");
      li.textContent = text;
      detailAmenities.appendChild(li);
    });

    detailPricing.innerHTML = "";
    data.units.forEach(function (u) {
      var li = document.createElement("li");
      var spanLabel = document.createElement("span");
      spanLabel.className = "pricing-unit";
      spanLabel.textContent = u.label;
      var spanRange = document.createElement("span");
      spanRange.className = "pricing-range";
      spanRange.textContent = u.range;
      li.appendChild(spanLabel);
      li.appendChild(spanRange);
      detailPricing.appendChild(li);
    });

    detailAddress.innerHTML = "";
    data.addressLines.forEach(function (line, i) {
      if (i > 0) detailAddress.appendChild(document.createElement("br"));
      detailAddress.appendChild(document.createTextNode(line));
    });

    detailMaps.href = buildMapsUrl(data.mapsQuery);
    detailMaps.setAttribute(
      "aria-label",
      "Open Google Maps for " + data.name
    );

    var subject = "Inquiry: " + data.name;
    detailEmail.href =
      "mailto:info@egreinsch.com?subject=" + encodeURIComponent(subject);
    detailEmail.setAttribute(
      "aria-label",
      "Email about " + data.name
    );

    if (detailApply) {
      detailApply.setAttribute("data-property", id);
      detailApply.setAttribute("aria-label", "Apply now for " + data.name);
    }
  }

  function setCardsActive(id) {
    cards.forEach(function (card) {
      var pid = card.getAttribute("data-property");
      var isSel = pid === id;
      card.classList.toggle("is-active", isSel);
      card.setAttribute("aria-expanded", isSel ? "true" : "false");
    });
  }

  function clearCardsActive() {
    cards.forEach(function (card) {
      card.classList.remove("is-active");
      card.setAttribute("aria-expanded", "false");
    });
  }

  function scrollToPanel() {
    if (!panelWrap) return;
    panelWrap.scrollIntoView({
      behavior: prefersReducedMotion() ? "auto" : "smooth",
      block: "start",
    });
  }

  function openProperty(id, opts) {
    opts = opts || {};
    var isSwap =
      opts.swap &&
      currentId &&
      currentId !== id &&
      panelWrap &&
      panelWrap.classList.contains("is-open");

    function reveal() {
      fillPanel(id);
      currentId = id;
      panelWrap.classList.remove("is-content-swap");
    }

    if (!panelWrap) return;

    setCardsActive(id);

    if (swapTimer) {
      clearTimeout(swapTimer);
      swapTimer = null;
    }

    if (isSwap && !prefersReducedMotion()) {
      panelWrap.classList.add("is-content-swap");
      swapTimer = window.setTimeout(function () {
        reveal();
        swapTimer = null;
      }, 220);
    } else {
      panelWrap.classList.remove("is-content-swap");
      reveal();
    }

    panelWrap.classList.add("is-open");
    panelWrap.setAttribute("aria-hidden", "false");

    if (!opts.skipScroll) {
      window.requestAnimationFrame(function () {
        scrollToPanel();
      });
    }
  }

  function closePropertyPanel(opts) {
    opts = opts || {};
    if (!panelWrap) return;

    panelWrap.classList.remove("is-open");
    panelWrap.classList.remove("is-content-swap");
    panelWrap.setAttribute("aria-hidden", "true");
    currentId = null;
    clearCardsActive();

    if (swapTimer) {
      clearTimeout(swapTimer);
      swapTimer = null;
    }

    if (opts.returnFocus && opts.card) {
      opts.card.focus();
    }
  }

  if (panelWrap && cards.length && detailClose) {
    if (detailApply) {
      detailApply.addEventListener("click", function (e) {
        e.stopPropagation();
        var id = currentId || detailApply.getAttribute("data-property");
        var data = id && PROPERTY_DATA[id];
        if (data) {
          openApplication(data.name, detailApply);
        }
      });
    }

    cards.forEach(function (card) {
      card.addEventListener("click", function () {
        var id = card.getAttribute("data-property");
        if (!id || !PROPERTY_DATA[id]) return;
        var already = currentId === id && panelWrap.classList.contains("is-open");
        if (already) {
          if (swapTimer) {
            clearTimeout(swapTimer);
            swapTimer = null;
          }
          panelWrap.classList.remove("is-content-swap");
          scrollToPanel();
          return;
        }
        var isOpen = panelWrap.classList.contains("is-open");
        openProperty(id, { swap: isOpen });
      });

      card.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          var id = card.getAttribute("data-property");
          if (!id || !PROPERTY_DATA[id]) return;
          var already = currentId === id && panelWrap.classList.contains("is-open");
          if (already) {
            if (swapTimer) {
              clearTimeout(swapTimer);
              swapTimer = null;
            }
            panelWrap.classList.remove("is-content-swap");
            scrollToPanel();
            return;
          }
          var isOpen = panelWrap.classList.contains("is-open");
          openProperty(id, { swap: isOpen });
        }
      });
    });

    detailClose.addEventListener("click", function () {
      var toFocus = document.querySelector(".property-card.is-active");
      closePropertyPanel({ returnFocus: true, card: toFocus });
    });

    document.addEventListener("keydown", function (e) {
      if (e.key !== "Escape") return;
      if (applicationModal && applicationModal.classList.contains("is-open")) return;
      if (galleryModal && galleryModal.classList.contains("is-open")) return;
      if (!panelWrap || !panelWrap.classList.contains("is-open")) return;
      var toFocus = document.querySelector(".property-card.is-active");
      closePropertyPanel({ returnFocus: true, card: toFocus });
    });
  }

  /* —— Rental application modal —— */
  var applicationForm = document.getElementById("rental-application-form");
  var applicationThanks = document.getElementById("application-thanks");
  var applicationPropertyField = document.getElementById("app-desired-property");
  var applicationPropertySubtitle = document.getElementById("application-modal-property");
  var applicationCloseBtn = document.getElementById("application-modal-close");
  var applicationThanksClose = document.getElementById("application-thanks-close");

  var applicationTriggerEl = null;

  function releaseBodyScrollLock() {
    var navOpen = header && header.classList.contains("nav-open");
    var galleryOpen = galleryModal && galleryModal.classList.contains("is-open");
    var appOpen =
      applicationModal && applicationModal.classList.contains("is-open");
    if (!navOpen && !galleryOpen && !appOpen) {
      document.body.style.overflow = "";
    }
  }

  function resetApplicationView() {
    if (applicationForm) {
      applicationForm.reset();
      applicationForm.hidden = false;
    }
    if (applicationThanks) {
      applicationThanks.hidden = true;
    }
  }

  function openApplication(propertyName, trigger) {
    if (!applicationModal || !propertyName) return;

    applicationTriggerEl = trigger || null;
    resetApplicationView();

    if (applicationPropertyField) {
      applicationPropertyField.value = propertyName;
    }
    if (applicationPropertySubtitle) {
      applicationPropertySubtitle.textContent = propertyName;
    }

    applicationModal.removeAttribute("hidden");
    applicationModal.setAttribute("aria-hidden", "false");
    applicationModal.classList.add("is-open");
    document.body.style.overflow = "hidden";

    window.requestAnimationFrame(function () {
      var first = applicationForm && applicationForm.querySelector("input, select, textarea");
      if (first) {
        first.focus();
      } else if (applicationCloseBtn) {
        applicationCloseBtn.focus();
      }
    });
  }

  function closeApplication(opts) {
    opts = opts || {};
    if (!applicationModal || !applicationModal.classList.contains("is-open")) return;

    applicationModal.classList.remove("is-open");
    applicationModal.setAttribute("aria-hidden", "true");
    applicationModal.setAttribute("hidden", "");
    resetApplicationView();
    releaseBodyScrollLock();

    if (opts.returnFocus && applicationTriggerEl) {
      applicationTriggerEl.focus();
    }
    applicationTriggerEl = null;
  }

  function showApplicationThanks() {
    if (applicationForm) {
      applicationForm.hidden = true;
    }
    if (applicationThanks) {
      applicationThanks.hidden = false;
    }
    if (applicationThanksClose) {
      applicationThanksClose.focus();
    }
  }

  function bindApplyButton(btn, propertyId) {
    if (!btn || !propertyId || !PROPERTY_DATA[propertyId]) return;
    var data = PROPERTY_DATA[propertyId];
    btn.setAttribute("data-property", propertyId);
    btn.setAttribute("aria-label", "Apply now for " + data.name);

    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      openApplication(data.name, btn);
    });
  }

  function initPropertyApplyButtons() {
    cards.forEach(function (card) {
      var id = card.getAttribute("data-property");
      if (!id || !PROPERTY_DATA[id]) return;

      var apply = card.querySelector(".property-card-apply");
      if (!apply) {
        apply = document.createElement("button");
        apply.type = "button";
        apply.className = "btn btn-apply btn-block property-card-apply property-apply-btn";
        apply.textContent = "Apply Now";
        var hint = card.querySelector(".property-card-hint");
        if (hint) {
          card.insertBefore(apply, hint);
        } else {
          card.appendChild(apply);
        }
      }

      bindApplyButton(apply, id);
    });
  }

  if (cards.length) {
    initPropertyApplyButtons();
  }

  if (applicationModal && applicationForm) {
    applicationForm.addEventListener("submit", function (e) {
      e.preventDefault();
      showApplicationThanks();
    });

    if (applicationCloseBtn) {
      applicationCloseBtn.addEventListener("click", function () {
        closeApplication({ returnFocus: true });
      });
    }

    if (applicationThanksClose) {
      applicationThanksClose.addEventListener("click", function () {
        closeApplication({ returnFocus: true });
      });
    }

    applicationModal.querySelectorAll("[data-application-close]").forEach(function (el) {
      el.addEventListener("click", function () {
        closeApplication({ returnFocus: true });
      });
    });

    document.addEventListener("keydown", function (e) {
      if (!applicationModal.classList.contains("is-open")) return;
      if (e.key === "Escape") {
        e.preventDefault();
        closeApplication({ returnFocus: true });
      }
    });
  }

  /* —— Property photo gallery modal —— */
  var galleryTitle = document.getElementById("gallery-modal-title");
  var galleryMainImage = document.getElementById("gallery-main-image");
  var galleryCaptionLabel = document.getElementById("gallery-caption-label");
  var galleryCaptionCount = document.getElementById("gallery-caption-count");
  var galleryThumbs = document.getElementById("gallery-thumbs");
  var galleryPrev = document.getElementById("gallery-prev");
  var galleryNext = document.getElementById("gallery-next");
  var galleryCloseBtn = document.getElementById("gallery-modal-close");

  var galleryItems = [];
  var galleryIndex = 0;
  var galleryTriggerEl = null;

  function initCardGalleryThumbs() {
    cards.forEach(function (card) {
      var id = card.getAttribute("data-property");
      var data = PROPERTY_DATA[id];
      var thumbImg = card.querySelector(".property-gallery-thumb");
      if (!data || !data.gallery || !data.gallery[0] || !thumbImg) return;
      var first = data.gallery[0];
      thumbImg.src = first.thumb;
      thumbImg.alt = first.label + " at " + data.name;
    });
  }

  function setGalleryNavState() {
    if (!galleryPrev || !galleryNext) return;
    var atStart = galleryIndex <= 0;
    var atEnd = galleryIndex >= galleryItems.length - 1;
    galleryPrev.disabled = atStart;
    galleryNext.disabled = atEnd;
  }

  function setGallerySlide(index) {
    if (!galleryItems.length || !galleryMainImage) return;
    galleryIndex = Math.max(0, Math.min(index, galleryItems.length - 1));
    var item = galleryItems[galleryIndex];

    galleryMainImage.classList.add("is-loading");
    galleryMainImage.onload = function () {
      galleryMainImage.classList.remove("is-loading");
    };
    galleryMainImage.src = item.url;
    galleryMainImage.alt = item.label + " at " + (galleryTitle ? galleryTitle.textContent : "");

    if (galleryCaptionLabel) {
      galleryCaptionLabel.textContent = item.label;
    }
    if (galleryCaptionCount) {
      galleryCaptionCount.textContent =
        String(galleryIndex + 1) + " of " + String(galleryItems.length);
    }

    if (galleryThumbs) {
      galleryThumbs.querySelectorAll(".gallery-thumb-btn").forEach(function (btn, i) {
        var isActive = i === galleryIndex;
        btn.classList.toggle("is-active", isActive);
        btn.setAttribute("aria-selected", isActive ? "true" : "false");
        if (isActive) {
          btn.scrollIntoView({
            behavior: prefersReducedMotion() ? "auto" : "smooth",
            block: "nearest",
            inline: "center",
          });
        }
      });
    }

    setGalleryNavState();
  }

  function buildGalleryThumbs() {
    if (!galleryThumbs) return;
    galleryThumbs.innerHTML = "";
    galleryItems.forEach(function (item, i) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "gallery-thumb-btn";
      btn.setAttribute("role", "tab");
      btn.setAttribute("aria-label", item.label);
      btn.setAttribute("aria-selected", i === galleryIndex ? "true" : "false");
      var img = document.createElement("img");
      img.src = item.thumb;
      img.alt = "";
      img.width = 88;
      img.height = 60;
      img.loading = "lazy";
      btn.appendChild(img);
      btn.addEventListener("click", function () {
        setGallerySlide(i);
      });
      galleryThumbs.appendChild(btn);
    });
  }

  function openGallery(id, trigger) {
    var data = PROPERTY_DATA[id];
    if (!data || !data.gallery || !galleryModal) return;

    galleryItems = data.gallery;
    galleryIndex = 0;
    galleryTriggerEl = trigger || null;

    if (galleryTitle) {
      galleryTitle.textContent = data.name;
    }

    buildGalleryThumbs();
    setGallerySlide(0);

    galleryModal.removeAttribute("hidden");
    galleryModal.setAttribute("aria-hidden", "false");
    galleryModal.classList.add("is-open");
    document.body.style.overflow = "hidden";

    window.requestAnimationFrame(function () {
      if (galleryCloseBtn) {
        galleryCloseBtn.focus();
      }
    });
  }

  function closeGallery(opts) {
    opts = opts || {};
    if (!galleryModal || !galleryModal.classList.contains("is-open")) return;

    galleryModal.classList.remove("is-open");
    galleryModal.setAttribute("aria-hidden", "true");
    galleryModal.setAttribute("hidden", "");

    releaseBodyScrollLock();

    galleryItems = [];
    galleryIndex = 0;

    if (opts.returnFocus && galleryTriggerEl) {
      galleryTriggerEl.focus();
    }
    galleryTriggerEl = null;
  }

  if (cards.length) {
    initCardGalleryThumbs();

    cards.forEach(function (card) {
      var trigger = card.querySelector(".property-gallery-trigger");
      if (!trigger) return;

      trigger.addEventListener("click", function (e) {
        e.stopPropagation();
        var id = card.getAttribute("data-property");
        if (!id || !PROPERTY_DATA[id]) return;
        openGallery(id, trigger);
      });

      trigger.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.stopPropagation();
        }
      });
    });
  }

  if (galleryModal && galleryCloseBtn) {
    galleryCloseBtn.addEventListener("click", function () {
      closeGallery({ returnFocus: true });
    });

    galleryModal.querySelectorAll("[data-gallery-close]").forEach(function (el) {
      el.addEventListener("click", function () {
        closeGallery({ returnFocus: true });
      });
    });

    if (galleryPrev) {
      galleryPrev.addEventListener("click", function () {
        setGallerySlide(galleryIndex - 1);
      });
    }

    if (galleryNext) {
      galleryNext.addEventListener("click", function () {
        setGallerySlide(galleryIndex + 1);
      });
    }

    document.addEventListener("keydown", function (e) {
      if (!galleryModal.classList.contains("is-open")) return;
      if (applicationModal && applicationModal.classList.contains("is-open")) return;

      if (e.key === "Escape") {
        e.preventDefault();
        closeGallery({ returnFocus: true });
        return;
      }

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        setGallerySlide(galleryIndex - 1);
        return;
      }

      if (e.key === "ArrowRight") {
        e.preventDefault();
        setGallerySlide(galleryIndex + 1);
      }
    });
  }
})();
