(function () {
  var header = document.querySelector(".site-header");
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  var yearEl = document.getElementById("year");

  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

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
  var detailClose = document.getElementById("property-detail-close");
  var cards = document.querySelectorAll(".property-card[data-property]");

  var currentId = null;
  var swapTimer = null;

  function prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

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
      if (galleryModal && galleryModal.classList.contains("is-open")) return;
      if (!panelWrap || !panelWrap.classList.contains("is-open")) return;
      var toFocus = document.querySelector(".property-card.is-active");
      closePropertyPanel({ returnFocus: true, card: toFocus });
    });
  }

  /* —— Property photo gallery modal —— */
  var galleryModal = document.getElementById("gallery-modal");
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

    if (!header || !header.classList.contains("nav-open")) {
      document.body.style.overflow = "";
    }

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
