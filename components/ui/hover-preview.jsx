"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const previewData = {
  gipa: {
    image:
      "https://acelimjeofnokdaxogal.supabase.co/storage/v1/object/public/photos/about%20me/gipa%20crop.jpeg",
    title: "GIPA",
    subtitle: "Georgian University of Public Affairs",
  },
  metu: {
    image:
      "https://acelimjeofnokdaxogal.supabase.co/storage/v1/object/public/photos/about%20me/metu-crop.png",
    title: "METU University",
    subtitle: "Exchange semester in visual storytelling, animation, and modeling",
  },
};

const collageBlueprint = [
  {
    id: "a",
    src: "https://acelimjeofnokdaxogal.supabase.co/storage/v1/object/public/photos/about%20me/Friends.jpg",
    width: 232,
    x: 0.05,
    y: 0.04,
    rotation: -7,
    speed: 1.02,
  },
  {
    id: "b",
    src: "https://acelimjeofnokdaxogal.supabase.co/storage/v1/object/public/photos/about%20me/Haruka.jpg",
    width: 220,
    x: 0.52,
    y: 0.08,
    rotation: 5,
    speed: 0.86,
  },
  {
    id: "c",
    src: "https://acelimjeofnokdaxogal.supabase.co/storage/v1/object/public/photos/about%20me/Family.jpg",
    width: 210,
    x: 0.14,
    y: 0.38,
    rotation: 3,
    speed: 0.72,
  },
  {
    id: "d",
    src: "https://acelimjeofnokdaxogal.supabase.co/storage/v1/object/public/photos/about%20me/Haruka%20(1).jpg",
    width: 180,
    x: 0.6,
    y: 0.5,
    rotation: -6,
    speed: 1.1,
  },
  {
    id: "e",
    src: "https://acelimjeofnokdaxogal.supabase.co/storage/v1/object/public/photos/about%20me/1000013932.jpeg",
    width: 196,
    x: 0.04,
    y: 0.68,
    rotation: 7,
    speed: 0.94,
  },
];

const staticMediaBlueprint = [
  {
    id: "hero-a",
    src: "https://acelimjeofnokdaxogal.supabase.co/storage/v1/object/public/photos/about%20me/3.jpg",
    width: 392,
    x: 0,
    y: 0,
    rotation: -2,
    speed: 1.02,
    secondary: false,
  },
  {
    id: "hero-b",
    src: "https://acelimjeofnokdaxogal.supabase.co/storage/v1/object/public/photos/about%20me/Budapest.jpg",
    width: 360,
    x: 56,
    y: 320,
    rotation: 2.6,
    speed: 0.72,
    secondary: true,
  },
];

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap');

  .cheko-hover-preview {
    position: relative;
    width: min(calc(100% - 40px), 1280px);
    margin: 0 auto;
    padding: clamp(8px, 1vw, 18px) 0 clamp(64px, 6vw, 92px);
    font-family: 'DM Sans', sans-serif;
    display: grid;
    gap: clamp(56px, 7vw, 110px);
  }

  .cheko-hover-preview__section {
    display: grid;
    gap: clamp(28px, 5vw, 96px);
    align-items: start;
  }

  .cheko-hover-preview__section--static {
    grid-template-columns: minmax(220px, 0.86fr) minmax(320px, 544px);
  }

  .cheko-hover-preview__section--collage {
    grid-template-columns: minmax(320px, 544px) minmax(320px, 1fr);
  }

  .cheko-hover-preview__text {
    width: min(100%, 544px);
    font-size: 20px;
    font-weight: 400;
    line-height: 1.62;
    letter-spacing: -0.03em;
    color: var(--muted-strong, rgba(248, 247, 243, 0.82));
    text-wrap: pretty;
    opacity: 0;
    transform: translate3d(0, 28px, 0);
    transition: opacity 0.8s ease, transform 0.9s cubic-bezier(0.22, 1, 0.36, 1);
  }

  .cheko-hover-preview.is-visible .cheko-hover-preview__text {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }

  .cheko-hover-preview__section--static .cheko-hover-preview__text {
    margin-left: auto;
  }

  .cheko-hover-preview__section--collage .cheko-hover-preview__text {
    margin-right: auto;
  }

  .cheko-hover-preview__text p {
    margin: 0;
  }

  .cheko-hover-preview__media-stack {
    position: relative;
    min-height: 720px;
    opacity: 0;
    transform: translate3d(-28px, 42px, 0) rotate(-4deg);
    transition: opacity 0.85s ease, transform 1s cubic-bezier(0.22, 1, 0.36, 1);
  }

  .cheko-hover-preview.is-visible .cheko-hover-preview__media-stack {
    opacity: 1;
    transform: translate3d(0, 0, 0) rotate(-2deg);
  }

  .cheko-hover-preview__media-frame {
    position: absolute;
    margin-right: auto;
    overflow: hidden;
    box-shadow:
      0 28px 60px rgba(0, 0, 0, 0.24),
      0 0 0 1px rgba(255, 255, 255, 0.08);
    background: rgba(255, 255, 255, 0.04);
    border: 0;
    padding: 0;
    cursor: grab;
    touch-action: none;
    user-select: none;
    -webkit-user-select: none;
  }

  .cheko-hover-preview__media-frame.is-secondary {
    transform: rotate(2.6deg);
  }

  .cheko-hover-preview__media-frame.is-dragging {
    cursor: grabbing;
  }

  .cheko-hover-preview__media-frame img {
    display: block;
    width: 100%;
    height: auto;
    object-fit: cover;
    will-change: transform;
    pointer-events: none;
    -webkit-user-drag: none;
  }

  .cheko-hover-preview__collage {
    position: relative;
    min-height: clamp(640px, 72vw, 860px);
    opacity: 0;
    transform: translate3d(28px, 42px, 0);
    transition: opacity 0.85s ease, transform 1s cubic-bezier(0.22, 1, 0.36, 1);
  }

  .cheko-hover-preview.is-visible .cheko-hover-preview__collage {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }

  .cheko-hover-preview__canvas {
    position: relative;
    width: 100%;
    min-height: inherit;
  }

  .cheko-hover-preview__photo {
    position: absolute;
    border: 0;
    padding: 0;
    background: transparent;
    cursor: grab;
    touch-action: none;
    user-select: none;
    -webkit-user-select: none;
    box-shadow:
      0 28px 60px rgba(0, 0, 0, 0.22),
      0 0 0 1px rgba(255, 255, 255, 0.08);
    will-change: transform;
  }

  .cheko-hover-preview__photo.is-dragging {
    cursor: grabbing;
  }

  .cheko-hover-preview__photo img {
    display: block;
    width: 100%;
    height: auto;
    pointer-events: none;
    -webkit-user-drag: none;
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

  @media (max-width: 900px) {
    .cheko-hover-preview__section--static,
    .cheko-hover-preview__section--collage {
      grid-template-columns: 1fr;
      gap: 36px;
    }

    .cheko-hover-preview__section--static .cheko-hover-preview__text,
    .cheko-hover-preview__section--collage .cheko-hover-preview__text {
      margin-left: 0;
      margin-right: 0;
      width: 100%;
    }

    .cheko-hover-preview__collage {
      min-height: 620px;
    }

    .cheko-hover-preview__media-stack {
      min-height: 680px;
    }
  }

  @media (max-width: 720px) {
    .cheko-hover-preview {
      width: min(calc(100% - 32px), 1280px);
      padding-bottom: 40px;
    }

    .cheko-hover-preview__collage {
      min-height: 520px;
    }

    .cheko-hover-preview__media-stack {
      min-height: 620px;
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

function SharedText({ onHoverStart, onHoverMove, onHoverEnd, split }) {
  if (split === "first") {
    return (
      <>
        <p>
          I’m Mariam, known as Cheko, a third-year Visual Communications student at{" "}
          <HoverLink
            previewKey="gipa"
            onHoverStart={onHoverStart}
            onHoverMove={onHoverMove}
            onHoverEnd={onHoverEnd}
          >
            GIPA (Georgian University of Public Affairs)
          </HoverLink>
          . My focus is to apply my skills thoughtfully to communicate clear, meaningful ideas
          through visual storytelling, with the intention of offering something genuine to the
          audience. My creative practice includes digital and traditional painting, graphic design,
          3D modeling, and branding. I am committed to engaging with a fast-paced contemporary world
          while actively contributing to and supporting my surroundings.
        </p>
        <p>
          I’ve had an exchange semester at{" "}
          <HoverLink
            previewKey="metu"
            onHoverStart={onHoverStart}
            onHoverMove={onHoverMove}
            onHoverEnd={onHoverEnd}
          >
            METU University
          </HoverLink>
          , where I learned more about visual storytelling, animation, and modeling. One of the
          most valuable experiences was meeting new people and experiencing a new culture.
        </p>
      </>
    );
  }

  return (
    <>
      <p>
        As for my work experience, my first job was in sales at a bookstore, and the second was as
        an administrator at a coworking space. However, my most favorable working experiences were
        those closest to my field. I have done some freelancing, creating simple 3D assets for
        games and posts for social media.
      </p>
      <p>
        Outside of my academic work, I find relaxation through music and literature. My personal
        interests include working out, playing chess, creating music, reading, and loving my cat. I
        enjoy spending time with my friends and family, learning from their views. As an artist, it
        is important to collect meaningful stories and moments to bring emotions into your work.
      </p>
    </>
  );
}

export function HoverPreview() {
  const [activePreview, setActivePreview] = useState(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [imageOffset, setImageOffset] = useState(0);
  const [staticCanvasSize, setStaticCanvasSize] = useState({ width: 420, height: 720 });
  const [staticItems, setStaticItems] = useState([]);
  const [staticDraggingId, setStaticDraggingId] = useState(null);
  const [canvasSize, setCanvasSize] = useState({ width: 720, height: 760 });
  const [items, setItems] = useState([]);
  const [draggingId, setDraggingId] = useState(null);
  const sectionRef = useRef(null);
  const staticCanvasRef = useRef(null);
  const canvasRef = useRef(null);
  const staticDragStateRef = useRef(null);
  const dragStateRef = useRef(null);

  const derivedStaticItems = useMemo(
    () =>
      staticMediaBlueprint.map((item, index) => ({
        ...item,
        zIndex: index + 1,
      })),
    []
  );

  const derivedItems = useMemo(
    () =>
      collageBlueprint.map((item, index) => ({
        ...item,
        zIndex: index + 1,
        x: Math.max(0, canvasSize.width * item.x),
        y: Math.max(0, canvasSize.height * item.y),
      })),
    [canvasSize.height, canvasSize.width]
  );

  useEffect(() => {
    [...Object.values(previewData).map((item) => item.image), ...collageBlueprint.map((item) => item.src)].forEach(
      (src) => {
        const image = new Image();
        image.src = src;
      }
    );
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
      { threshold: 0.2 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvasNode = staticCanvasRef.current;
    if (!canvasNode) return;

    const updateCanvasSize = () => {
      setStaticCanvasSize({
        width: canvasNode.clientWidth || 420,
        height: canvasNode.clientHeight || 720,
      });
    };

    updateCanvasSize();
    const observer = new ResizeObserver(updateCanvasSize);
    observer.observe(canvasNode);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setStaticItems((current) => {
      if (!current.length) return derivedStaticItems;
      return derivedStaticItems.map((nextItem) => {
        const existing = current.find((item) => item.id === nextItem.id);
        if (!existing || !existing.hasMoved) return nextItem;
        return existing;
      });
    });
  }, [derivedStaticItems]);

  useEffect(() => {
    const canvasNode = canvasRef.current;
    if (!canvasNode) return;

    const updateCanvasSize = () => {
      setCanvasSize({
        width: canvasNode.clientWidth || 720,
        height: canvasNode.clientHeight || 760,
      });
    };

    updateCanvasSize();
    const observer = new ResizeObserver(updateCanvasSize);
    observer.observe(canvasNode);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setItems((current) => {
      if (!current.length) return derivedItems;
      return derivedItems.map((nextItem) => {
        const existing = current.find((item) => item.id === nextItem.id);
        if (!existing || !existing.hasMoved) return nextItem;
        return existing;
      });
    });
  }, [derivedItems]);

  useEffect(() => {
    const updateParallax = () => {
      const node = sectionRef.current;
      if (!node) return;

      const rect = node.getBoundingClientRect();
      const viewportHeight = window.innerHeight || 1;
      const progress = (viewportHeight - rect.top) / (viewportHeight + rect.height);
      const eased = Math.max(-1, Math.min(1, progress - 0.5));
      setImageOffset(eased * 28);
    };

    updateParallax();
    window.addEventListener("scroll", updateParallax, { passive: true });
    window.addEventListener("resize", updateParallax);
    return () => {
      window.removeEventListener("scroll", updateParallax);
      window.removeEventListener("resize", updateParallax);
    };
  }, []);

  useEffect(() => {
    const handlePointerMove = (event) => {
      const dragState = staticDragStateRef.current;
      const canvasNode = staticCanvasRef.current;
      if (!dragState || !canvasNode) return;

      const rect = canvasNode.getBoundingClientRect();
      const activeBlueprint = staticMediaBlueprint.find((item) => item.id === dragState.id);
      const cardWidth = activeBlueprint?.width || 320;
      const maxX = Math.max(0, rect.width - cardWidth);
      const maxY = Math.max(0, rect.height - 160);
      const nextX = Math.max(0, Math.min(maxX, event.clientX - rect.left - dragState.offsetX));
      const nextY = Math.max(0, Math.min(maxY, event.clientY - rect.top - dragState.offsetY));

      setStaticItems((current) =>
        current.map((item) =>
          item.id === dragState.id
            ? { ...item, x: nextX, y: nextY, zIndex: dragState.zIndex, hasMoved: true }
            : item
        )
      );
    };

    const handlePointerUp = () => {
      staticDragStateRef.current = null;
      setStaticDraggingId(null);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };

    if (staticDraggingId) {
      window.addEventListener("pointermove", handlePointerMove);
      window.addEventListener("pointerup", handlePointerUp);
    }

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [staticDraggingId]);

  useEffect(() => {
    const handlePointerMove = (event) => {
      const dragState = dragStateRef.current;
      const canvasNode = canvasRef.current;
      if (!dragState || !canvasNode) return;

      const rect = canvasNode.getBoundingClientRect();
      const activeBlueprint = collageBlueprint.find((item) => item.id === dragState.id);
      const cardWidth = activeBlueprint?.width || 220;
      const maxX = Math.max(0, rect.width - cardWidth);
      const maxY = Math.max(0, rect.height - 160);
      const nextX = Math.max(0, Math.min(maxX, event.clientX - rect.left - dragState.offsetX));
      const nextY = Math.max(0, Math.min(maxY, event.clientY - rect.top - dragState.offsetY));

      setItems((current) =>
        current.map((item) =>
          item.id === dragState.id
            ? { ...item, x: nextX, y: nextY, zIndex: dragState.zIndex, hasMoved: true }
            : item
        )
      );
    };

    const handlePointerUp = () => {
      dragStateRef.current = null;
      setDraggingId(null);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };

    if (draggingId) {
      window.addEventListener("pointermove", handlePointerMove);
      window.addEventListener("pointerup", handlePointerUp);
    }

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [draggingId]);

  const updatePosition = useCallback((event) => {
    const cardWidth = 320;
    const cardHeight = 270;
    const gap = 20;

    let x = event.clientX - cardWidth / 2;
    let y = event.clientY - cardHeight - gap;

    if (x + cardWidth > window.innerWidth - 16) x = window.innerWidth - cardWidth - 16;
    if (x < 16) x = 16;
    if (y < 16) y = event.clientY + gap;

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

  const handleDragStart = useCallback(
    (id, event) => {
      event.preventDefault();
      const item = items.find((entry) => entry.id === id);
      const canvasNode = canvasRef.current;
      if (!item || !canvasNode) return;

      const rect = canvasNode.getBoundingClientRect();
      const nextZIndex = Math.max(...items.map((entry) => entry.zIndex), 0) + 1;
      dragStateRef.current = {
        id,
        offsetX: event.clientX - rect.left - item.x,
        offsetY: event.clientY - rect.top - item.y,
        zIndex: nextZIndex,
      };
      setDraggingId(id);
      setItems((current) =>
        current.map((entry) => (entry.id === id ? { ...entry, zIndex: nextZIndex } : entry))
      );
    },
    [items]
  );

  const handleStaticDragStart = useCallback(
    (id, event) => {
      event.preventDefault();
      const item = staticItems.find((entry) => entry.id === id);
      const canvasNode = staticCanvasRef.current;
      if (!item || !canvasNode) return;

      const rect = canvasNode.getBoundingClientRect();
      const nextZIndex = Math.max(...staticItems.map((entry) => entry.zIndex), 0) + 1;
      staticDragStateRef.current = {
        id,
        offsetX: event.clientX - rect.left - item.x,
        offsetY: event.clientY - rect.top - item.y,
        zIndex: nextZIndex,
      };
      setStaticDraggingId(id);
      setStaticItems((current) =>
        current.map((entry) => (entry.id === id ? { ...entry, zIndex: nextZIndex } : entry))
      );
    },
    [staticItems]
  );

  return (
    <>
      <style>{styles}</style>
      <section
        ref={sectionRef}
        className={`cheko-hover-preview${isInView ? " is-visible" : ""}`}
        aria-label="About me details"
      >
        <div className="cheko-hover-preview__section cheko-hover-preview__section--static">
          <div ref={staticCanvasRef} className="cheko-hover-preview__media-stack" aria-hidden="true">
            {staticItems.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`cheko-hover-preview__media-frame${item.secondary ? " is-secondary" : ""}${staticDraggingId === item.id ? " is-dragging" : ""}`}
                style={{
                  width: `${item.width}px`,
                  left: `${Math.min(item.x, Math.max(0, staticCanvasSize.width - item.width))}px`,
                  top: `${item.y}px`,
                  zIndex: item.zIndex,
                }}
                onPointerDown={(event) => handleStaticDragStart(item.id, event)}
              >
                <img
                  src={item.src}
                  alt=""
                  draggable="false"
                  style={{ transform: `translate3d(0, ${imageOffset * item.speed}px, 0) scale(1.02)` }}
                />
              </button>
            ))}
          </div>

          <div className="cheko-hover-preview__text">
            <SharedText
              split="first"
              onHoverStart={handleHoverStart}
              onHoverMove={handleHoverMove}
              onHoverEnd={handleHoverEnd}
            />
          </div>
        </div>

        <div className="cheko-hover-preview__section cheko-hover-preview__section--collage">
          <div className="cheko-hover-preview__text">
            <SharedText
              split="second"
              onHoverStart={handleHoverStart}
              onHoverMove={handleHoverMove}
              onHoverEnd={handleHoverEnd}
            />
          </div>

          <div className="cheko-hover-preview__collage" aria-label="Draggable photo collage">
            <div ref={canvasRef} className="cheko-hover-preview__canvas">
              {items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`cheko-hover-preview__photo${draggingId === item.id ? " is-dragging" : ""}`}
                  style={{
                    width: `${item.width}px`,
                    left: `${item.x}px`,
                    top: `${item.y}px`,
                    zIndex: item.zIndex,
                    transform: `translate3d(0, ${imageOffset * item.speed}px, 0) rotate(${item.rotation}deg)`,
                  }}
                  onPointerDown={(event) => handleDragStart(item.id, event)}
                >
                  <img src={item.src} alt="" draggable="false" />
                </button>
              ))}
            </div>
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
