import Lenis from "lenis";
import initSplashCursor from "./src/splashCursor.js";
import {
  caseStudies,
  contact,
  findCaseStudy,
  findWorkCategory,
  projects,
  spotifyPreviewTracks,
} from "./data.js";

const path = window.location.pathname.replace(/\/+$/, "") || "/";
const themeStorageKey = "chekos-space-theme";

const navConfig = [
  { href: "/", label: "Home" },
  { href: "/works/", label: "Works" },
  { href: "/contact/", label: "Contact" },
];

const homeGalleryItems = [
  {
    src: "https://acelimjeofnokdaxogal.supabase.co/storage/v1/object/public/photos/roboti/1.png",
    title: "3D Works",
    description: "A selection of my 3D work—exploring form, depth, and visual storytelling",
    path: "/works/3d-works/",
  },
  ...projects.slice(0, 6).map((project) => ({
    src: project.cover,
    title: project.title,
    description: project.intro,
    path: project.path,
  })),
];

function normalizeHref(href) {
  return href === "/" ? "/" : href.replace(/\/+$/, "");
}

function createMedia(source, altText) {
  return source.includes(".mp4")
    ? `<video src="${source}" autoplay muted loop playsinline></video>`
    : `<img src="${source}" alt="${altText}" loading="lazy">`;
}

function ensureFonts() {
  const fontPreconnects = [
    "https://fonts.googleapis.com",
    "https://fonts.gstatic.com",
  ];

  fontPreconnects.forEach((href) => {
    if (document.head.querySelector(`link[href="${href}"]`)) return;
    const link = document.createElement("link");
    link.rel = "preconnect";
    link.href = href;
    if (href.includes("gstatic")) {
      link.crossOrigin = "anonymous";
    }
    document.head.append(link);
  });

  if (!document.head.querySelector('link[data-site-fonts="true"]')) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;700&display=swap";
    link.dataset.siteFonts = "true";
    document.head.append(link);
  }
}

function setTheme(theme) {
  document.body.dataset.theme = theme;
  localStorage.setItem(themeStorageKey, theme);

  const toggle = document.querySelector("[data-theme-toggle]");
  if (!toggle) return;

  const isLight = theme === "light";
  toggle.setAttribute("aria-label", isLight ? "Switch dark mode" : "Switch light mode");
  const label = toggle.querySelector(".theme-toggle-label");
  if (label) {
    label.textContent = isLight ? "Dark" : "Light";
  }
}

function setupThemeToggle() {
  const savedTheme = localStorage.getItem(themeStorageKey);
  setTheme(savedTheme === "light" ? "light" : "dark");

  const toggle = document.querySelector("[data-theme-toggle]");
  if (!toggle) return;

  toggle.addEventListener("click", () => {
    const nextTheme = document.body.dataset.theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
  });
}

function syncSiteChrome() {
  document.querySelectorAll(".brand span:last-child").forEach((node) => {
    node.textContent = "Cheko's Space";
  });

  document.querySelectorAll("[data-nav-toggle]").forEach((toggle) => {
    toggle.setAttribute("aria-label", "Open menu");
    if (toggle.querySelector("span")) return;
    toggle.innerHTML = "<span aria-hidden=\"true\"></span><span aria-hidden=\"true\"></span>";
  });

  document.querySelectorAll("[data-nav]").forEach((nav) => {
    nav.innerHTML = navConfig
      .map(({ href, label }) => `<a href="${href}" data-nav-link>${label}</a>`)
      .join("");
  });

  document.querySelectorAll(".footer-bottom").forEach((node) => {
    const isContactOnly = path === "/contact/";
    const links = isContactOnly
      ? [
          { href: "/", label: "Home" },
        ]
      : [
          { href: "/contact/", label: "Contact" },
        ];

    node.innerHTML = `
      <p>Cheko's Space</p>
      <div class="footer-links">
        ${links.map(({ href, label }) => `<a href="${href}">${label}</a>`).join("")}
      </div>
    `;
  });
}

function setActiveNav() {
  document.querySelectorAll("[data-nav-link]").forEach((link) => {
    const href = normalizeHref(link.getAttribute("href") || "");
    if (href === path || (href !== "/" && path.startsWith(href))) {
      link.setAttribute("aria-current", "page");
    }
  });
}

function setupMenu() {
  const toggle = document.querySelector("[data-nav-toggle]");
  const nav = document.querySelector("[data-nav]");
  const shell = document.querySelector("[data-menu-shell]");
  const closeLayer = document.querySelector("[data-menu-close]");
  if (!toggle || !nav || !shell) return;

  const closeMenu = () => {
    nav.classList.remove("is-open");
    shell.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");
  };

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    shell.classList.toggle("is-open", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
    document.body.classList.toggle("menu-open", isOpen);
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  document.addEventListener("click", (event) => {
    if (!nav.classList.contains("is-open")) return;
    if (nav.contains(event.target) || toggle.contains(event.target)) return;
    closeMenu();
  });

  closeLayer?.addEventListener("click", closeMenu);
}

function setupHeaderGlass() {
  const applyGlass = () => {
    const shell = document.querySelector(".site-header-inner");
    const bar = document.querySelector(".menu-bar");
    const background = document.querySelector(".menu-background");

    if (shell) {
      shell.style.backdropFilter = "blur(16px)";
      shell.style.webkitBackdropFilter = "blur(16px)";
    }

    if (bar) {
      bar.style.backdropFilter = "blur(10px)";
      bar.style.webkitBackdropFilter = "blur(10px)";
    }

    if (background) {
      background.style.backdropFilter = "blur(14px)";
      background.style.webkitBackdropFilter = "blur(14px)";
    }
  };

  applyGlass();

  const themeToggle = document.querySelector("[data-theme-toggle]");
  themeToggle?.addEventListener("click", () => {
    window.requestAnimationFrame(applyGlass);
  });
}

function setupReveal() {
  const nodes = document.querySelectorAll(".reveal");
  if (!nodes.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );

  nodes.forEach((node) => observer.observe(node));
}

function chip(label) {
  return `<span class="chip">${label}</span>`;
}

function workListCard(project) {
  return `
    <a class="work-list-item reveal" href="${project.path}" data-cursor-label="View">
      ${createMedia(project.cover, project.title)}
      <div class="work-list-copy">
        <p>${project.category}</p>
        <h3>${project.title}</h3>
        <p>${project.intro}</p>
        <div class="meta-row">
          ${chip(project.year)}
          ${chip(project.role)}
        </div>
      </div>
    </a>
  `;
}

function renderHome() {
  const gallery = document.querySelector("[data-home-gallery]");
  if (!gallery) return;

  gallery.innerHTML = homeGalleryItems
    .map(
      (item, index) => `
        <a
          class="gallery-item${index === 0 ? " is-active" : ""}"
          href="${item.path}"
          data-gallery-item
          data-cursor-label="Open"
        >
          <div class="gallery-item-media">
            ${createMedia(item.src, item.title)}
          </div>
          <div class="gallery-item-overlay">
            <h3 class="gallery-item-title">${item.title}</h3>
            <p class="gallery-item-description">${item.description}</p>
          </div>
        </a>
      `
    )
    .join("");
}

function setupGalleryInteractions() {
  const items = Array.from(document.querySelectorAll("[data-gallery-item]"));
  if (!items.length) return;

  const setActiveItem = (activeItem) => {
    items.forEach((item) => {
      item.classList.toggle("is-active", item === activeItem);
    });
  };

  items.forEach((item) => {
    item.addEventListener("mouseenter", () => setActiveItem(item));
    item.addEventListener("focus", () => setActiveItem(item));
  });

  const gallery = items[0].parentElement;
  gallery?.addEventListener("mouseleave", () => setActiveItem(items[0]));
}

function renderWorksPage() {
  const workRoot = document.querySelector("[data-work-list]");
  if (!workRoot) return;
  workRoot.innerHTML = projects.map(workListCard).join("");
}

function renderProjectPage() {
  const slug = document.body.dataset.project;
  if (!slug) return;

  const project = projects.find((item) => item.slug === slug);
  if (!project) return;

  document.title = `Cheko's Space - ${project.title}`;
  const titleNode = document.querySelector("[data-project-title]");
  const introNode = document.querySelector("[data-project-intro]");
  const descNode = document.querySelector("[data-project-description]");
  const storyNode = document.querySelector("[data-project-story]");
  const metaNode = document.querySelector("[data-project-meta]");
  const galleryNode = document.querySelector("[data-project-gallery]");
  const relatedNode = document.querySelector("[data-related-grid]");

  if (titleNode) titleNode.textContent = project.title;
  if (introNode) introNode.textContent = project.intro;
  if (descNode) descNode.textContent = project.description;
  if (storyNode) storyNode.textContent = project.story;

  if (metaNode) {
    metaNode.innerHTML = `
      <div class="detail-meta-item">
        <span>Category</span>
        <strong>${project.category}</strong>
      </div>
      <div class="detail-meta-item">
        <span>Year</span>
        <strong>${project.year}</strong>
      </div>
      <div class="detail-meta-item">
        <span>Role</span>
        <strong>${project.role}</strong>
      </div>
    `;
  }

  if (galleryNode) {
    const galleryMedia = [project.cover, project.altCover, project.accent];
    galleryNode.innerHTML = galleryMedia
      .map((source, index) => {
        const media = createMedia(source, `${project.title} frame ${index + 1}`);
        return `<figure class="${index === 1 ? "tall" : ""}">${media}</figure>`;
      })
      .join("");
  }

  if (relatedNode) {
    const related = projects.filter((item) => item.slug !== project.slug).slice(0, 2);
    relatedNode.innerHTML = related
      .map(
        (item) => `
          <a href="${item.path}" data-cursor-label="Open">
            <p>${item.category}</p>
            <h3>${item.title}</h3>
            <p>${item.intro}</p>
          </a>
        `
      )
      .join("");
  }
}

function renderCategoryPage() {
  const slug = document.body.dataset.category;
  const root = document.querySelector("[data-category-page]");
  if (!slug || !root) return;

  const category = findWorkCategory(slug);
  if (!category) return;

  document.title = `Cheko's Space - ${category.title}`;

  const cardsMarkup = category.cards
    .map(
      (card, index) => {
        const variants = [
          "is-wide",
          "is-offset",
          "is-compact",
          "is-tall-offset",
        ];
        const variant = variants[index % variants.length];
        const revealDelay = index * 90;

        return `
        <article class="category-archive-item ${variant} reveal category-card-reveal" style="--card-reveal-delay: ${revealDelay}ms;">
          <a class="category-archive-link" href="${card.href || "#"}" ${card.href ? "" : 'aria-disabled="true"'}>
            <p class="category-archive-index">[${String(index + 1).padStart(2, "0")}]</p>
            <figure class="category-archive-media">
              <img
                src="${card.image}"
                alt="${card.title}"
                loading="lazy"
                style="object-position: ${card.imagePosition};"
              >
            </figure>
            <h2 class="category-archive-title">(${card.title}.)</h2>
            <p class="category-archive-meta">${(card.meta || card.tags.join(" / "))}</p>
          </a>
        </article>
      `;
      }
    )
    .join("");

  root.innerHTML = `
    <section class="category-landing reveal">
      <div class="category-shell">
        <header class="category-page-header">
          <div class="category-page-title-wrap">
            <h1 class="category-page-title">${category.title}</h1>
          </div>
          <p class="category-page-description">${category.intro}</p>
        </header>

        <section class="category-archive" aria-labelledby="category-archive-title">
          <h2 id="category-archive-title" class="sr-only">Selected work</h2>
          <div class="category-archive-grid">
            ${cardsMarkup}
          </div>
        </section>
      </div>
    </section>
  `;
}

function renderCaseStudyPage() {
  const slug = document.body.dataset.caseStudy;
  const root = document.querySelector("[data-case-study-page]");
  if (!slug || !root) return;

  const study = findCaseStudy(slug);
  if (!study) return;

  document.title = `Cheko's Space - ${study.title}`;

  const galleryMarkup = study.gallery
    .map(
      (item, index) => `
        <button
          class="case-study-thumb${index === 0 ? " is-active" : ""}"
          type="button"
          data-case-thumb
          data-index="${index}"
          data-image="${item.src}"
          data-alt="${item.alt}"
          aria-label="Show ${item.alt}"
        >
          <img src="${item.src}" alt="" loading="lazy">
        </button>
      `
    )
    .join("");

  const otherStudies = caseStudies.filter((item) => item.slug !== study.slug).slice(0, 3);
  const relatedMarkup = otherStudies
    .map(
      (item, index) => `
        <a class="case-study-more-item" href="${item.path}">
          <span>[${String(index + 1).padStart(2, "0")}]</span>
          <strong>${item.title}</strong>
        </a>
      `
    )
    .join("");

  root.innerHTML = `
    <section class="case-study-page reveal">
      <div class="case-study-shell">
        <header class="case-study-headline">
          <p class="case-study-kicker">(3D Works.)</p>
          <h1 class="case-study-title">${study.title}</h1>
          <p class="case-study-intro">${study.intro}</p>
        </header>

        <div class="case-study-header">
          <div class="case-study-header-copy"></div>
          <div class="case-study-stage">
            <div class="case-study-gallery">
              <button
                class="case-study-gallery-main"
                type="button"
                data-case-open-gallery
                aria-label="Image 1 of ${study.gallery.length}; Open gallery"
              >
                <figure class="case-study-hero-media">
                  <img
                    src="${study.heroImage}"
                    alt="${study.title}"
                    loading="eager"
                    data-case-main-image
                    style="object-position: ${study.heroImagePosition};"
                  >
                </figure>
              </button>
              <div class="case-study-gallery-controls">
                <div class="case-study-thumbs" aria-label="Project gallery">
                  ${galleryMarkup}
                </div>
                <div class="case-study-gallery-nav">
                  <p class="case-study-gallery-count" data-case-inline-count>1 / ${study.gallery.length}</p>
                  <div class="case-study-gallery-nav-buttons">
                    <button class="case-study-gallery-arrow" type="button" data-case-inline-prev aria-label="Previous image">Prev</button>
                    <button class="case-study-gallery-arrow" type="button" data-case-inline-next aria-label="Next image">Next</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section class="case-study-body" aria-labelledby="case-study-body-title">
          <h2 id="case-study-body-title" class="sr-only">Project description</h2>
          <div class="case-study-body-copy">
            <p>${study.description.replace(/\n\n/g, "</p><p>")}</p>
          </div>
        </section>

        <div class="case-study-lightbox" data-case-lightbox hidden>
          <button class="case-study-lightbox-close" type="button" data-case-close aria-label="Close gallery">Close</button>
          <button class="case-study-lightbox-nav is-prev" type="button" data-case-prev aria-label="Previous image">Prev</button>
          <figure class="case-study-lightbox-media">
            <img src="${study.heroImage}" alt="${study.title}" data-case-lightbox-image>
          </figure>
          <button class="case-study-lightbox-nav is-next" type="button" data-case-next aria-label="Next image">Next</button>
          <p class="case-study-lightbox-count" data-case-count>1 / ${study.gallery.length}</p>
        </div>

        <section class="case-study-more" aria-labelledby="case-study-more-title">
          <div class="case-study-more-head">
            <h2 id="case-study-more-title">More Projects</h2>
          </div>
          <div class="case-study-more-list">
            ${relatedMarkup}
          </div>
        </section>
      </div>
    </section>
  `;
}

function setupCaseStudyGallery() {
  const mainImage = document.querySelector("[data-case-main-image]");
  const thumbs = Array.from(document.querySelectorAll("[data-case-thumb]"));
  const lightbox = document.querySelector("[data-case-lightbox]");
  const lightboxImage = document.querySelector("[data-case-lightbox-image]");
  const countNode = document.querySelector("[data-case-count]");
  const inlineCountNode = document.querySelector("[data-case-inline-count]");
  const closeButton = document.querySelector("[data-case-close]");
  const prevButton = document.querySelector("[data-case-prev]");
  const nextButton = document.querySelector("[data-case-next]");
  const inlinePrevButton = document.querySelector("[data-case-inline-prev]");
  const inlineNextButton = document.querySelector("[data-case-inline-next]");
  const openTrigger = document.querySelector("[data-case-open-gallery]");
  if (!mainImage || !thumbs.length) return;

  let activeIndex = 0;

  const syncActive = (index) => {
    const item = thumbs[index];
    if (!item) return;
    activeIndex = index;
    mainImage.src = item.dataset.image || mainImage.src;
    mainImage.alt = item.dataset.alt || mainImage.alt;
    thumbs.forEach((node, nodeIndex) => node.classList.toggle("is-active", nodeIndex === index));
    if (lightboxImage) {
      lightboxImage.src = item.dataset.image || lightboxImage.src;
      lightboxImage.alt = item.dataset.alt || lightboxImage.alt;
    }
    if (countNode) {
      countNode.textContent = `${index + 1} / ${thumbs.length}`;
    }
    if (inlineCountNode) {
      inlineCountNode.textContent = `${index + 1} / ${thumbs.length}`;
    }
    if (openTrigger) {
      openTrigger.setAttribute("aria-label", `Image ${index + 1} of ${thumbs.length}; Open gallery`);
    }
    item.scrollIntoView({
      block: "nearest",
      inline: "nearest",
      behavior: "smooth",
    });
  };

  const openLightbox = (index = activeIndex) => {
    if (!lightbox) return;
    syncActive(index);
    lightbox.hidden = false;
    document.body.classList.add("lightbox-open");
  };

  const closeLightbox = () => {
    if (!lightbox) return;
    lightbox.hidden = true;
    document.body.classList.remove("lightbox-open");
  };

  const step = (direction) => {
    const nextIndex = (activeIndex + direction + thumbs.length) % thumbs.length;
    syncActive(nextIndex);
  };

  thumbs.forEach((thumb, index) => {
    thumb.addEventListener("click", () => {
      syncActive(index);
      openLightbox(index);
    });
  });

  openTrigger?.addEventListener("click", () => openLightbox(activeIndex));
  closeButton?.addEventListener("click", closeLightbox);
  prevButton?.addEventListener("click", () => step(-1));
  nextButton?.addEventListener("click", () => step(1));
  inlinePrevButton?.addEventListener("click", () => step(-1));
  inlineNextButton?.addEventListener("click", () => step(1));
  lightbox?.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", (event) => {
    if (!lightbox || lightbox.hidden) return;
    if (event.key === "Escape") closeLightbox();
    if (event.key === "ArrowLeft") step(-1);
    if (event.key === "ArrowRight") step(1);
  });

  syncActive(0);
}

function hydrateContactInfo() {
  document.querySelectorAll("[data-contact-email]").forEach((node) => {
    node.textContent = contact.email;
    node.href = `mailto:${contact.email}`;
  });
  document.querySelectorAll("[data-contact-phone]").forEach((node) => {
    node.textContent = contact.phone;
    node.href = `tel:${contact.phone.replace(/\s+/g, "")}`;
  });
  document.querySelectorAll("[data-contact-telegram]").forEach((node) => {
    node.textContent = contact.telegram;
    node.href = `https://${contact.telegram}`;
  });
  document.querySelectorAll("[data-contact-location]").forEach((node) => {
    node.textContent = contact.location;
  });
}

function setupContactForm() {
  const form = document.querySelector("[data-contact-form]");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const submit = form.querySelector('button[type="submit"]');
    const emailInput = form.querySelector('input[name="email"]');
    const subjectInput = form.querySelector('input[name="subject"]');
    const messageInput = form.querySelector('textarea[name="message"]');
    if (!submit || !emailInput || !subjectInput || !messageInput) return;

    const currentLabel = submit.textContent;
    submit.textContent = "Opening mail";
    submit.setAttribute("disabled", "true");

    const sender = String(emailInput.value || "").trim();
    const subject = String(subjectInput.value || "").trim();
    const message = String(messageInput.value || "").trim();
    const body = [`From: ${sender}`, "", message].join("\n");

    window.location.href = `mailto:${contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    window.setTimeout(() => {
      submit.textContent = currentLabel;
      submit.removeAttribute("disabled");
    }, 1200);
  });
}

function setupLenis() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const lenis = new Lenis({
    duration: 1.15,
    smoothWheel: true,
    wheelMultiplier: 0.9,
    touchMultiplier: 1.2,
  });

  function raf(time) {
    lenis.raf(time);
    window.requestAnimationFrame(raf);
  }

  window.requestAnimationFrame(raf);
}

function setupCursor() {
  initSplashCursor();
}

function setupHeroSurface() {
  const hero = document.querySelector("[data-hero-surface]");
  if (!hero) return;

  hero.addEventListener("mousemove", (event) => {
    const rect = hero.getBoundingClientRect();
    document.documentElement.style.setProperty("--cursor-x", `${event.clientX}px`);
    document.documentElement.style.setProperty("--cursor-y", `${event.clientY}px`);
    hero.style.setProperty("--hero-local-x", `${event.clientX - rect.left}px`);
    hero.style.setProperty("--hero-local-y", `${event.clientY - rect.top}px`);
  });
}

function formatTime(seconds) {
  const safe = Number.isFinite(seconds) ? Math.max(0, Math.floor(seconds)) : 0;
  const minutes = Math.floor(safe / 60);
  const secs = safe % 60;
  return `${minutes}:${String(secs).padStart(2, "0")}`;
}

function setupAboutPlayer() {
  const root = document.querySelector("[data-music-player]");
  if (!root || !spotifyPreviewTracks.length) return;

  const audio = root.querySelector("[data-player-audio]");
  const timeNode = root.querySelector("[data-player-time]");
  const durationNode = root.querySelector("[data-player-duration]");
  const coverNode = root.querySelector("[data-player-cover]");
  const trackNode = root.querySelector("[data-player-track]");
  const artistNode = root.querySelector("[data-player-artist]");
  const progressFill = root.querySelector("[data-player-progress-fill]");
  const progressThumb = root.querySelector("[data-player-progress-thumb]");
  if (!audio || !timeNode || !durationNode || !coverNode || !trackNode || !progressFill || !progressThumb) return;

  let index = 0;

  const applyTrack = (track) => {
    coverNode.src = track.cover;
    trackNode.textContent = track.title;
    if (artistNode) artistNode.textContent = track.artist;
    durationNode.textContent = `/ ${track.duration}`;
    timeNode.textContent = "0:00";
    progressFill.style.width = "0%";
    progressThumb.style.left = "0%";
    audio.src = track.previewUrl;
    audio.muted = true;
    audio.load();
    const playAttempt = audio.play();
    if (playAttempt && typeof playAttempt.catch === "function") {
      playAttempt.catch(() => {});
    }
  };

  const setProgress = () => {
    const currentTime = audio.currentTime || 0;
    const duration = audio.duration || 30;
    const progress = duration > 0 ? Math.min(1, currentTime / duration) : 0;
    timeNode.textContent = formatTime(currentTime);
    progressFill.style.width = `${progress * 100}%`;
    progressThumb.style.left = `${progress * 100}%`;
  };

  const nextTrack = () => {
    index = (index + 1) % spotifyPreviewTracks.length;
    applyTrack(spotifyPreviewTracks[index]);
  };

  audio.addEventListener("timeupdate", setProgress);
  audio.addEventListener("loadedmetadata", setProgress);
  audio.addEventListener("ended", nextTrack);

  document.addEventListener(
    "visibilitychange",
    () => {
      if (document.hidden) {
        audio.pause();
        return;
      }
      const playAttempt = audio.play();
      if (playAttempt && typeof playAttempt.catch === "function") {
        playAttempt.catch(() => {});
      }
    },
    { passive: true }
  );

  applyTrack(spotifyPreviewTracks[index]);
}

ensureFonts();
setupThemeToggle();
syncSiteChrome();
setActiveNav();
setupMenu();
setupHeaderGlass();
renderHome();
setupGalleryInteractions();
renderWorksPage();
renderProjectPage();
renderCategoryPage();
renderCaseStudyPage();
setupCaseStudyGallery();
hydrateContactInfo();
setupContactForm();
setupReveal();
setupLenis();
setupCursor();
setupHeroSurface();
setupAboutPlayer();
