"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const previewData = {
  gipa: {
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=560&h=320&fit=crop",
    title: "GIPA",
    subtitle: "Georgian University of Public Affairs",
  },
  metu: {
    image:
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=560&h=320&fit=crop",
    title: "METU University",
    subtitle: "Exchange semester in visual storytelling, animation, and modeling",
  },
};

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap');

  .cheko-hover-preview {
    position: relative;
    width: min(calc(100% - 40px), 1280px);
    margin: 0 auto;
    padding: clamp(8px, 1vw, 18px) 0 clamp(48px, 5vw, 72px);
    font-family: 'DM Sans', sans-serif;
  }

  .cheko-hover-preview__layout {
    display: grid;
    grid-template-columns: minmax(220px, 0.86fr) minmax(320px, 544px);
    justify-content: space-between;
    align-items: start;
    gap: clamp(28px, 5vw, 96px);
  }

  .cheko-hover-preview__media {
    position: relative;
    display: grid;
    gap: clamp(18px, 2vw, 28px);
    padding-top: clamp(12px, 2vw, 28px);
    opacity: 0;
    transform: translate3d(-28px, 42px, 0) rotate(-4deg);
    transition: opacity 0.85s ease, transform 1s cubic-bezier(0.22, 1, 0.36, 1);
  }

  .cheko-hover-preview.is-visible .cheko-hover-preview__media {
    opacity: 1;
    transform: translate3d(0, 0, 0) rotate(-2deg);
  }

  .cheko-hover-preview__media-frame {
    width: min(100%, 392px);
    margin-right: auto;
    overflow: hidden;
    box-shadow:
      0 28px 60px rgba(0, 0, 0, 0.24),
      0 0 0 1px rgba(255, 255, 255, 0.08);
    background: rgba(255, 255, 255, 0.04);
  }

  .cheko-hover-preview__media-frame.is-secondary {
    width: min(88%, 332px);
    margin-left: clamp(28px, 5vw, 82px);
    transform: rotate(2.6deg);
  }

  .cheko-hover-preview__media-frame img {
    display: block;
    width: 100%;
    height: auto;
    object-fit: cover;
    will-change: transform;
  }

  .cheko-hover-preview__text {
    width: min(100%, 544px);
    margin-left: auto;
    font-size: clamp(1.1rem, 2vw, 1.65rem);
    line-height: 1.62;
    letter-spacing: -0.03em;
    color: var(--muted-strong, rgba(248, 247, 243, 0.82));
    text-wrap: pretty;
  }

  .cheko-hover-preview__text p {
    margin: 0;
    opacity: 0;
    transform: translate3d(0, 28px, 0);
    transition: opacity 0.8s ease, transform 0.9s cubic-bezier(0.22, 1, 0.36, 1);
  }

  .cheko-hover-preview__text p + p {
    margin-top: 1.15em;
    transition-delay: 0.14s;
  }

  .cheko-hover-preview__text p:nth-child(2) {
    position: relative;
    z-index: 1;
  }

  .cheko-hover-preview.is-visible .cheko-hover-preview__text p {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }

  .cheko-hover-preview__link {
    color: var(--text, #f8f7f3);
    font-weight: 500;
    cursor: pointer;
    position: relative;
    display: inline-block;
    transition: opacity 0.28s ease;
  }

  .cheko-hover-preview__link::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: -0.08em;
    width: 100%;
    height: 1px;
    background: currentColor;
    opacity: 0.45;
    transform: scaleX(0.24);
    transform-origin: left center;
    transition: transform 0.34s ease, opacity 0.34s ease;
  }

  .cheko-hover-preview__link:hover::after {
    opacity: 0.9;
    transform: scaleX(1);
  }

  .cheko-hover-preview__card {
    position: fixed;
    inset: auto auto 0 0;
    width: min(320px, calc(100vw - 32px));
    pointer-events: none;
    z-index: 1001;
    opacity: 0;
    transform: translate3d(0, 10px, 0) scale(0.96);
    transition: opacity 0.22s ease, transform 0.26s cubic-bezier(0.22, 1, 0.36, 1);
    will-change: transform, opacity;
  }

  .cheko-hover-preview__card.is-visible {
    opacity: 1;
    transform: translate3d(0, 0, 0) scale(1);
  }

  .cheko-hover-preview__card-inner {
    background: rgba(16, 16, 18, 0.88);
    border-radius: 18px;
    padding: 8px;
    box-shadow:
      0 24px 60px rgba(0, 0, 0, 0.34),
      0 0 0 1px rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(16px);
    overflow: hidden;
  }

  body[data-theme="light"] .cheko-hover-preview__card-inner {
    background: rgba(248, 247, 243, 0.92);
    box-shadow:
      0 24px 60px rgba(15, 15, 15, 0.14),
      0 0 0 1px rgba(15, 15, 15, 0.08);
  }

  .cheko-hover-preview__card img {
    width: 100%;
    aspect-ratio: 16 / 10;
    object-fit: cover;
    display: block;
    border-radius: 12px;
  }

  .cheko-hover-preview__meta {
    padding: 12px 8px 8px;
  }

  .cheko-hover-preview__title {
    margin: 0;
    font-size: 0.95rem;
    line-height: 1.2;
    color: var(--text, #f8f7f3);
    font-weight: 500;
  }

  .cheko-hover-preview__subtitle {
    margin: 6px 0 0;
    font-size: 0.82rem;
    line-height: 1.45;
    color: var(--muted, rgba(248, 247, 243, 0.6));
  }

  body[data-theme="light"] .cheko-hover-preview__subtitle {
    color: rgba(17, 17, 17, 0.58);
  }

  @media (max-width: 720px) {
    .cheko-hover-preview {
      width: min(calc(100% - 32px), 1280px);
      padding-bottom: 40px;
    }

    .cheko-hover-preview__layout {
      grid-template-columns: 1fr;
      gap: 24px;
    }

    .cheko-hover-preview__media {
      padding-top: 0;
      transform: translate3d(0, 24px, 0);
    }

    .cheko-hover-preview.is-visible .cheko-hover-preview__media {
      transform: translate3d(0, 0, 0);
    }

    .cheko-hover-preview__media-frame {
      width: min(100%, 360px);
    }

    .cheko-hover-preview__text {
      width: 100%;
      margin-left: 0;
    }

    .cheko-hover-preview__card {
      display: none;
    }
  }
`;

function HoverLink({ previewKey, children, onHoverStart, onHoverMove, onHoverEnd }) {
  return (
    <span
      className="cheko-hover-preview__link"
      onMouseEnter={(event) => onHoverStart(previewKey, event)}
      onMouseMove={onHoverMove}
      onMouseLeave={onHoverEnd}
    >
      {children}
    </span>
  );
}

export function HoverPreview() {
  const [activePreview, setActivePreview] = useState(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [imageOffset, setImageOffset] = useState(0);
  const sectionRef = useRef(null);

  useEffect(() => {
    Object.values(previewData).forEach((item) => {
      const image = new Image();
      image.src = item.image;
    });
  }, []);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.22 }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const updateParallax = () => {
      const node = sectionRef.current;
      if (!node) return;

      const rect = node.getBoundingClientRect();
      const viewportHeight = window.innerHeight || 1;
      const progress = (viewportHeight - rect.top) / (viewportHeight + rect.height);
      const eased = Math.max(-1, Math.min(1, progress - 0.5));
      setImageOffset(eased * 36);
    };

    updateParallax();
    window.addEventListener("scroll", updateParallax, { passive: true });
    window.addEventListener("resize", updateParallax);

    return () => {
      window.removeEventListener("scroll", updateParallax);
      window.removeEventListener("resize", updateParallax);
    };
  }, []);

  const updatePosition = useCallback((event) => {
    const cardWidth = 320;
    const cardHeight = 270;
    const gap = 20;

    let x = event.clientX - cardWidth / 2;
    let y = event.clientY - cardHeight - gap;

    if (x + cardWidth > window.innerWidth - 16) {
      x = window.innerWidth - cardWidth - 16;
    }

    if (x < 16) {
      x = 16;
    }

    if (y < 16) {
      y = event.clientY + gap;
    }

    setPosition({ x, y });
  }, []);

  const handleHoverStart = useCallback(
    (key, event) => {
      setActivePreview(previewData[key] || null);
      updatePosition(event);
      setIsVisible(true);
    },
    [updatePosition]
  );

  const handleHoverMove = useCallback(
    (event) => {
      if (!isVisible) return;
      updatePosition(event);
    },
    [isVisible, updatePosition]
  );

  const handleHoverEnd = useCallback(() => {
    setIsVisible(false);
  }, []);

  return (
    <>
      <style>{styles}</style>
      <section
        ref={sectionRef}
        className={`cheko-hover-preview${isInView ? " is-visible" : ""}`}
        aria-label="About me details"
      >
        <div className="cheko-hover-preview__layout">
          <div className="cheko-hover-preview__media" aria-hidden="true">
            <div className="cheko-hover-preview__media-frame">
              <img
                src="https://acelimjeofnokdaxogal.supabase.co/storage/v1/object/public/photos/about%20me/1.jpg"
                alt=""
                style={{ transform: `translate3d(0, ${imageOffset}px, 0) scale(1.02)` }}
              />
            </div>
            <div className="cheko-hover-preview__media-frame is-secondary">
              <img
                src="https://acelimjeofnokdaxogal.supabase.co/storage/v1/object/public/photos/about%20me/Budapest.jpg"
                alt=""
                style={{ transform: `translate3d(0, ${imageOffset * 0.72}px, 0) scale(1.02)` }}
              />
            </div>
          </div>

          <div className="cheko-hover-preview__text">
            <p>
              I’m Mariam, known as Cheko, a third-year Visual Communications student at{" "}
              <HoverLink
                previewKey="gipa"
                onHoverStart={handleHoverStart}
                onHoverMove={handleHoverMove}
                onHoverEnd={handleHoverEnd}
              >
                GIPA (Georgian University of Public Affairs)
              </HoverLink>
              . My focus is to apply my skills thoughtfully to communicate clear, meaningful ideas
              through visual storytelling, with the intention of offering something genuine to the
              audience. My creative practice includes digital and traditional painting, graphic
              design, 3D modeling, and branding. I am committed to engaging with a fast-paced
              contemporary world while actively contributing to and supporting my surroundings.
            </p>

            <p>
              I’ve had an exchange semester at{" "}
              <HoverLink
                previewKey="metu"
                onHoverStart={handleHoverStart}
                onHoverMove={handleHoverMove}
                onHoverEnd={handleHoverEnd}
              >
                METU University
              </HoverLink>
              , where I learned more about visual storytelling, animation, and modeling. One of the
              most valuable experiences was meeting new people and experiencing a new culture.
            </p>
          </div>
        </div>

        {activePreview ? (
          <div
            className={`cheko-hover-preview__card${isVisible ? " is-visible" : ""}`}
            style={{ left: `${position.x}px`, top: `${position.y}px` }}
          >
            <div className="cheko-hover-preview__card-inner">
              <img src={activePreview.image} alt={activePreview.title} referrerPolicy="no-referrer" />
              <div className="cheko-hover-preview__meta">
                <p className="cheko-hover-preview__title">{activePreview.title}</p>
                <p className="cheko-hover-preview__subtitle">{activePreview.subtitle}</p>
              </div>
            </div>
          </div>
        ) : null}
      </section>
    </>
  );
}

export default HoverPreview;
