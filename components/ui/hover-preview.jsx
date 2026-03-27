"use client";

import { useCallback, useEffect, useState } from "react";

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

  .cheko-hover-preview__text {
    max-width: 76rem;
    font-size: clamp(1.1rem, 2vw, 1.65rem);
    line-height: 1.62;
    letter-spacing: -0.03em;
    color: var(--muted-strong, rgba(248, 247, 243, 0.82));
  }

  .cheko-hover-preview__text p {
    margin: 0;
    opacity: 0;
    transform: translateY(22px);
    animation: chekoHoverPreviewFade 0.8s ease forwards;
  }

  .cheko-hover-preview__text p + p {
    margin-top: 1.15em;
    animation-delay: 0.18s;
  }

  @keyframes chekoHoverPreviewFade {
    from {
      opacity: 0;
      transform: translateY(22px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
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

  useEffect(() => {
    Object.values(previewData).forEach((item) => {
      const image = new Image();
      image.src = item.image;
    });
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
      <section className="cheko-hover-preview" aria-label="About me details">
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
