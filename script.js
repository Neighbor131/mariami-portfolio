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
  { href: "/#works", label: "Works" },
  { href: "/about/", label: "About Me" },
  { href: "/contact/", label: "Contact" },
];

const footerSocialLinks = [
  {
    href: "https://www.linkedin.com/in/mchekurishvili04/",
    label: "LinkedIn",
    icon: `
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M6.94 8.5H3.56V20h3.38V8.5ZM5.25 3A2.02 2.02 0 0 0 3.2 5.02c0 1.11.9 2.01 2 2.01h.03c1.13 0 2.03-.9 2.03-2A2.01 2.01 0 0 0 5.25 3ZM20.8 13.02c0-3.5-1.87-5.13-4.37-5.13-2.01 0-2.9 1.1-3.4 1.88V8.5H9.65c.04.84 0 11.5 0 11.5h3.38v-6.42c0-.34.03-.67.13-.91.27-.67.87-1.36 1.88-1.36 1.33 0 1.86 1.01 1.86 2.5V20H20.8v-6.98Z"></path>
      </svg>
    `,
  },
  {
    href: "https://www.behance.net/mariamchekuri2",
    label: "Behance",
    icon: `
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M9.44 11.05c1.3-.62 1.94-1.7 1.94-3.21C11.38 5.1 9.63 4 7.12 4H2v16h5.31c2.8 0 4.76-1.3 4.76-4.09 0-1.94-.95-3.34-2.63-3.86ZM5.1 6.47h1.8c.95 0 1.5.38 1.5 1.24 0 .95-.71 1.26-1.71 1.26H5.1V6.47Zm1.96 11.05H5.1v-3.1h2.04c1.15 0 2.05.38 2.05 1.52 0 1.1-.83 1.58-2.13 1.58ZM18.35 7.87c-3.44 0-5.11 2.56-5.11 5.83 0 3.4 1.61 5.8 5.27 5.8 2.64 0 4.37-1.24 4.96-3.55h-2.76c-.2.69-.72 1.32-2.1 1.32-1.43 0-2.23-.9-2.3-2.56H24c.1-3.88-1.83-6.84-5.65-6.84Zm-1.98 4.77c.15-1.36.96-2.45 2.18-2.45 1.37 0 2.04 1.02 2.12 2.45h-4.3ZM15.46 4.75h5.55V6.1h-5.55V4.75Z"></path>
      </svg>
    `,
  },
  {
    href: "https://www.instagram.com/mchekko/",
    label: "Instagram",
    icon: `
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.9A3.85 3.85 0 0 0 3.9 7.75v8.5A3.85 3.85 0 0 0 7.75 20.1h8.5a3.85 3.85 0 0 0 3.85-3.85v-8.5A3.85 3.85 0 0 0 16.25 3.9h-8.5Zm8.97 1.42a1.14 1.14 0 1 1 0 2.28 1.14 1.14 0 0 1 0-2.28ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.9A3.1 3.1 0 1 0 12 15.1 3.1 3.1 0 0 0 12 8.9Z"></path>
      </svg>
    `,
  },
];

const homeGalleryItems = [
  {
    src: "https://acelimjeofnokdaxogal.supabase.co/storage/v1/object/public/photos/roboti/1.png",
    title: "3D Works",
    description: "A selection of my 3D work—exploring form, depth, and visual storytelling",
    path: "/works/3d-works/",
  },
  {
    src: "https://acelimjeofnokdaxogal.supabase.co/storage/v1/object/public/photos/Untitled/1_Untitled.jpg",
    title: "2D Paintings",
    description: "Explore my collection of 2d paintings.",
    path: "/works/2d-paintings/",
  },
  {
    src: "https://acelimjeofnokdaxogal.supabase.co/storage/v1/object/public/photos/Branding/Orta%20brdzola/1.png",
    title: "Branding",
    description: "Explore my designs for branding and packaging.",
    path: "/works/branding/",
  },
  {
    src: "https://acelimjeofnokdaxogal.supabase.co/storage/v1/object/public/photos/ux%20ui/Audo/Refnverse.png",
    title: "UX/UI",
    description: "A selection of UX/UI studies focused on interface flow, clarity, and digital experience design.",
    path: "/works/ux-ui/",
  },
  {
    src: "https://acelimjeofnokdaxogal.supabase.co/storage/v1/object/public/photos/digital%20works/typography.png",
    title: "Digital Works",
    description: "A collection of digital works exploring typography, composition, and graphic expression.",
    path: "/works/digital-works/",
  },
  {
    src: "/project-media/glance.mp4.png",
    title: "Motion Media",
    description: "some of my selected motion studies",
    path: "/works/motion-media/",
  },
  ...projects.slice(0, 1).map((project) => ({
    src: project.cover,
    title: project.title,
    description: project.intro,
    path: project.path,
  })),
];

const aboutMoodPhotos = [
  {
    src: "https://cdn.prod.website-files.com/68f5e7e733480946aa936748/6974289622893ca412fddeb9_DSC_1952.avif",
    alt: "Portrait study",
    aspect: "portrait",
  },
  {
    src: "https://acelimjeofnokdaxogal.supabase.co/storage/v1/object/public/photos/cat/hf_20260327_084358_74f397ae-6c1b-4b63-a3e1-0dce5186ffe9.png",
    alt: "Kitty render",
    aspect: "portrait",
  },
  {
    src: "https://acelimjeofnokdaxogal.supabase.co/storage/v1/object/public/photos/roboti/1.png",
    alt: "Robot render",
    aspect: "portrait",
  },
  {
    src: "https://acelimjeofnokdaxogal.supabase.co/storage/v1/object/public/photos/trash%20can/1.jpg",
    alt: "Trash can asset",
    aspect: "portrait",
  },
  {
    src: "https://acelimjeofnokdaxogal.supabase.co/storage/v1/object/public/photos/table/6.png",
    alt: "Desk asset",
    aspect: "landscape",
  },
  {
    src: "https://acelimjeofnokdaxogal.supabase.co/storage/v1/object/public/photos/weapons/01_Cover%20image.jpg",
    alt: "Weapons study",
    aspect: "landscape",
  },
  {
    src: "https://acelimjeofnokdaxogal.supabase.co/storage/v1/object/public/photos/objects/8.png",
    alt: "Object study",
    aspect: "portrait",
  },
  {
    src: "https://acelimjeofnokdaxogal.supabase.co/storage/v1/object/public/photos/roboti/5.png",
    alt: "Robot detail",
    aspect: "portrait",
  },
  {
    src: "https://acelimjeofnokdaxogal.supabase.co/storage/v1/object/public/photos/table/8.png",
    alt: "Desk detail",
    aspect: "landscape",
  },
  {
    src: "https://acelimjeofnokdaxogal.supabase.co/storage/v1/object/public/photos/objects/13.png",
    alt: "Material practice",
    aspect: "portrait",
  },
];

function normalizeHref(href) {
  return href === "/" ? "/" : href.replace(/\/+$/, "");
}

function createMedia(source, altText) {
  return source.includes(".mp4")
    ? `<video src="${source}" autoplay muted loop playsinline></video>`
    : `<img src="${source}" alt="${altText}" loading="lazy">`;
}

function isVideoSource(source = "") {
  return /\.(mp4|webm|ogg)(\?.*)?$/i.test(source);
}

function getMediaType(item = {}) {
  if (item.type) return item.type;
  return isVideoSource(item.src || "") ? "video" : "image";
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
          { href: "/about/", label: "About Me" },
        ]
      : [
          { href: "/about/", label: "About Me" },
          { href: "/contact/", label: "Contact" },
        ];

    node.innerHTML = `
      <p>Cheko's Space</p>
      <div class="footer-links">
        ${links.map(({ href, label }) => `<a href="${href}">${label}</a>`).join("")}
      </div>
    `;
  });

  document.querySelectorAll('.footer-nav-block .footer-links').forEach((node) => {
    const aboutLink = node.querySelector('a[href="/about/"]');
    if (aboutLink) {
      aboutLink.textContent = "About Me";
    } else {
      node.insertAdjacentHTML("afterbegin", '<a href="/about/">About Me</a>');
    }
  });

  document.querySelectorAll(".footer-side").forEach((node) => {
    if (node.querySelector(".footer-social")) return;
    node.insertAdjacentHTML(
      "beforeend",
      `
        <div class="footer-social" aria-label="Social links">
          ${footerSocialLinks
            .map(
              ({ href, label, icon }) => `
                <a href="${href}" class="footer-social-link" target="_blank" rel="noreferrer" aria-label="${label}">
                  ${icon}
                </a>
              `
            )
            .join("")}
        </div>
      `
    );
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
            ${
              card.meta || (card.tags && card.tags.length)
                ? `<p class="category-archive-meta">${(card.meta || card.tags.join(" / "))}</p>`
                : ""
            }
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
  const category = findWorkCategory(study.categorySlug);
  const initialIndex = Math.max(
    0,
    study.gallery.findIndex((item) => item.src === study.heroImage)
  );

  document.title = `Cheko's Space - ${study.title}`;

  const galleryMarkup = study.gallery
    .map(
      (item, index) => `
        <button
          class="case-study-thumb${index === initialIndex ? " is-active" : ""}"
          type="button"
          data-case-thumb
          data-index="${index}"
          data-src="${item.src}"
          data-alt="${item.alt}"
          data-type="${getMediaType(item)}"
          data-poster="${item.poster || ""}"
          aria-label="Show ${item.alt}"
        >
          ${
            getMediaType(item) === "video"
              ? `<img src="${item.poster || study.heroImage}" alt="" loading="lazy">`
              : `<img src="${item.src}" alt="" loading="lazy">`
          }
        </button>
      `
    )
    .join("");

  const otherStudies = caseStudies
    .filter((item) => item.categorySlug === study.categorySlug && item.slug !== study.slug)
    .slice(0, 3);
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

  const introMarkup = study.intro
    ? `<p class="case-study-intro">${study.intro}</p>`
    : "";
  const bodyMarkup = study.description
    ? `
        <section class="case-study-body" aria-labelledby="case-study-body-title">
          <h2 id="case-study-body-title" class="sr-only">Project description</h2>
          <div class="case-study-body-copy">
            <p>${study.description.replace(/\n\n/g, "</p><p>")}</p>
          </div>
        </section>
      `
    : "";
  const figmaEmbedUrls =
    Array.isArray(study.figmaEmbedUrls) && study.figmaEmbedUrls.length
      ? study.figmaEmbedUrls
      : study.figmaEmbedUrl
        ? [study.figmaEmbedUrl]
        : [];
  const mediaMarkup =
    study.presentation === "figma-frame" && figmaEmbedUrls.length
      ? `
          <div class="case-study-figma-wrap">
            ${figmaEmbedUrls
              .map(
                (url, index) => `
                  <iframe
                    class="case-study-figma-frame"
                    src="${url}"
                    title="${study.title}${figmaEmbedUrls.length > 1 ? ` ${index + 1}` : ""}"
                    loading="lazy"
                    allowfullscreen
                  ></iframe>
                `
              )
              .join("")}
          </div>
        `
      : `
          <div class="case-study-gallery" data-case-gallery>
            <div
              class="case-study-gallery-main"
              aria-label="Media 1 of ${study.gallery.length}"
            >
              <figure class="case-study-hero-media" data-case-hero-media></figure>
            </div>
            <div class="case-study-gallery-controls">
              <div class="case-study-thumbs" aria-label="Project gallery">
                ${galleryMarkup}
              </div>
              <div class="case-study-gallery-nav">
                <p class="case-study-gallery-count" data-case-inline-count>1 / ${study.gallery.length}</p>
                <div class="case-study-gallery-nav-buttons">
                  <button class="case-study-gallery-arrow" type="button" data-case-inline-prev aria-label="Previous image">‹</button>
                  <button class="case-study-gallery-arrow" type="button" data-case-inline-next aria-label="Next image">›</button>
                </div>
              </div>
            </div>
          </div>
        `;

  root.innerHTML = `
    <section class="case-study-page reveal">
      <div class="case-study-shell">
        <header class="case-study-headline">
          <p class="case-study-kicker">(${category?.title || "Case Study"}.)</p>
          <h1 class="case-study-title">${study.title}</h1>
          ${introMarkup}
        </header>

        <div class="case-study-header">
          <div class="case-study-header-copy"></div>
          <div class="case-study-stage">
            ${mediaMarkup}
          </div>
        </div>

        ${bodyMarkup}

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
  const galleryRoot = document.querySelector("[data-case-gallery]");
  const heroMedia = document.querySelector("[data-case-hero-media]");
  const thumbs = Array.from(document.querySelectorAll("[data-case-thumb]"));
  const inlineCountNode = document.querySelector("[data-case-inline-count]");
  const inlinePrevButton = document.querySelector("[data-case-inline-prev]");
  const inlineNextButton = document.querySelector("[data-case-inline-next]");
  if (!heroMedia || !thumbs.length) return;

  const initialIndex = Math.max(
    0,
    thumbs.findIndex((thumb) => thumb.classList.contains("is-active"))
  );
  let activeIndex = initialIndex;

  const setOrientationState = (type, width, height) => {
    const ratio = width > 0 && height > 0 ? width / height : 1;
    const bucket =
      ratio >= 1.16 ? "is-landscape" : ratio <= 0.9 ? "is-portrait" : "is-square";
    if (!galleryRoot || !heroMedia) return;
    galleryRoot.classList.remove("is-landscape", "is-portrait", "is-square", "is-video");
    heroMedia.classList.remove("is-landscape", "is-portrait", "is-square", "is-video");
    galleryRoot.classList.add(bucket);
    heroMedia.classList.add(bucket);
    if (type === "video") {
      galleryRoot.classList.add("is-video");
      heroMedia.classList.add("is-video");
    }
  };

  const updateImageOrientation = (imageNode) => {
    if (!imageNode) return;
    const width = imageNode.naturalWidth || imageNode.width || 1;
    const height = imageNode.naturalHeight || imageNode.height || 1;
    setOrientationState("image", width, height);
  };

  const updateVideoOrientation = (videoNode) => {
    if (!videoNode) return;
    const width = videoNode.videoWidth || videoNode.clientWidth || 1;
    const height = videoNode.videoHeight || videoNode.clientHeight || 1;
    setOrientationState("video", width, height);
  };

  const renderActiveMedia = ({ type, src, alt, poster, objectPosition }, index) => {
    const fallbackLabel = `Media ${index + 1} of ${thumbs.length}`;

    if (type === "video") {
      heroMedia.innerHTML = `
        <video
          src="${src}"
          poster="${poster || ""}"
          controls
          autoplay
          muted
          loop
          playsinline
          preload="metadata"
          data-case-active-media
          aria-label="${alt || fallbackLabel}"
        ></video>
      `;

      const activeVideo = heroMedia.querySelector("video");
      if (!activeVideo) return;
      activeVideo.addEventListener("loadedmetadata", () => updateVideoOrientation(activeVideo), {
        once: true,
      });
      const playAttempt = activeVideo.play();
      if (playAttempt && typeof playAttempt.catch === "function") {
        playAttempt.catch(() => {});
      }
      updateVideoOrientation(activeVideo);
      return;
    }

    heroMedia.innerHTML = `
      <img
        src="${src}"
        alt="${alt || fallbackLabel}"
        loading="${index === 0 ? "eager" : "lazy"}"
        data-case-active-media
        style="${objectPosition ? `object-position: ${objectPosition};` : ""}"
      >
    `;

    const activeImage = heroMedia.querySelector("img");
    if (!activeImage) return;
    if (activeImage.complete) {
      updateImageOrientation(activeImage);
    } else {
      activeImage.addEventListener("load", () => updateImageOrientation(activeImage), {
        once: true,
      });
    }
  };

  const syncActive = (index) => {
    const item = thumbs[index];
    if (!item) return;
    activeIndex = index;
    const src = item.dataset.src || "";
    const alt = item.dataset.alt || "";
    const type = item.dataset.type || "image";
    const poster = item.dataset.poster || "";
    const objectPosition = item.dataset.objectPosition || "";

    renderActiveMedia({ type, src, alt, poster, objectPosition }, index);

    thumbs.forEach((node, nodeIndex) => node.classList.toggle("is-active", nodeIndex === index));

    if (inlineCountNode) {
      inlineCountNode.textContent = `${index + 1} / ${thumbs.length}`;
    }
    item.scrollIntoView({
      block: "nearest",
      inline: "nearest",
      behavior: "smooth",
    });
  };

  const step = (direction) => {
    const nextIndex = (activeIndex + direction + thumbs.length) % thumbs.length;
    syncActive(nextIndex);
  };

  thumbs.forEach((thumb, index) => {
    thumb.addEventListener("click", () => {
      syncActive(index);
    });
  });

  inlinePrevButton?.addEventListener("click", () => step(-1));
  inlineNextButton?.addEventListener("click", () => step(1));
  document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") step(-1);
    if (event.key === "ArrowRight") step(1);
  });

  syncActive(initialIndex);
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
  const toggle = root.querySelector("[data-player-toggle]");
  const timeNode = root.querySelector("[data-player-time]");
  const durationNode = root.querySelector("[data-player-duration]");
  const coverNode = root.querySelector("[data-player-cover]");
  const trackNode = root.querySelector("[data-player-track]");
  const artistNode = root.querySelector("[data-player-artist]");
  const progressFill = root.querySelector("[data-player-progress-fill]");
  const progressThumb = root.querySelector("[data-player-progress-thumb]");
  if (!audio || !timeNode || !durationNode || !coverNode || !trackNode || !progressFill || !progressThumb) return;

  let index = 0;
  let isRevealed = false;

  const syncRevealState = () => {
    root.classList.toggle("is-revealed", isRevealed);
    if (toggle) {
      toggle.setAttribute("aria-expanded", String(isRevealed));
      toggle.setAttribute(
        "aria-label",
        isRevealed ? "Hide player details" : "Reveal player details"
      );
    }
  };

  const applyTrack = (track) => {
    coverNode.src = track.cover;
    trackNode.textContent = track.title;
    if (artistNode) artistNode.textContent = track.artist;
    durationNode.textContent = `/ ${track.duration}`;
    timeNode.textContent = "0:00";
    progressFill.style.width = "0%";
    progressThumb.style.left = "0%";
    audio.src = track.previewUrl;
    audio.muted = !isRevealed;
    audio.load();
    if (isRevealed) {
      const playAttempt = audio.play();
      if (playAttempt && typeof playAttempt.catch === "function") {
        playAttempt.catch(() => {});
      }
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
      if (!isRevealed) return;
      const playAttempt = audio.play();
      if (playAttempt && typeof playAttempt.catch === "function") {
        playAttempt.catch(() => {});
      }
    },
    { passive: true }
  );

  toggle?.addEventListener("click", () => {
    isRevealed = !isRevealed;
    syncRevealState();
    audio.muted = !isRevealed;

    if (isRevealed) {
      const playAttempt = audio.play();
      if (playAttempt && typeof playAttempt.catch === "function") {
        playAttempt.catch(() => {});
      }
      return;
    }

    audio.pause();
  });

  syncRevealState();
  applyTrack(spotifyPreviewTracks[index]);
}

function setupAboutMePage() {
  const page = document.querySelector("[data-about-page]");
  const typedNode = document.querySelector("[data-about-typed]");
  if (!page || !typedNode) return;

  const typedText = "Hi, I'm Cheko";
  let typingIndex = 0;

  const typeIntro = () => {
    if (typingIndex > typedText.length) return;
    typedNode.textContent = typedText.slice(0, typingIndex);
    typingIndex += 1;
    if (typingIndex <= typedText.length) {
      window.setTimeout(typeIntro, typingIndex < typedText.length ? 82 : 180);
    }
  };
  typeIntro();
}

ensureFonts();
setupThemeToggle();
syncSiteChrome();
setActiveNav();
setupMenu();
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
setupAboutMePage();
