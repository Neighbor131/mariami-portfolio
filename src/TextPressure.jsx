import { useCallback, useEffect, useMemo, useRef, useState } from "react";

function dist(a, b) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return Math.sqrt(dx * dx + dy * dy);
}

function getAttr(distance, maxDist, minVal, maxVal) {
  const val = maxVal - Math.abs((maxVal * distance) / maxDist);
  return Math.max(minVal, val + minVal);
}

function debounce(func, delay) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => {
      func(...args);
    }, delay);
  };
}

export default function TextPressure({
  text = "CHEKO'S SPACE",
  fontFamily = "Compressa VF",
  fontUrl = "https://res.cloudinary.com/dr6lvwubh/raw/upload/v1529908256/CompressaPRO-GX.woff2",
  width = true,
  weight = true,
  italic = true,
  alpha = false,
  flex = true,
  stroke = false,
  scale = false,
  textColor = "#ffffff",
  strokeColor = "#5227FF",
  className = "",
  minFontSize = 36,
  letterSpacing = "0",
}) {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const spansRef = useRef([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const cursorRef = useRef({ x: 0, y: 0 });

  const [fontSize, setFontSize] = useState(minFontSize);
  const [scaleY, setScaleY] = useState(1);
  const [lineHeight, setLineHeight] = useState(1);

  const chars = text.split("");

  useEffect(() => {
    const handleMouseMove = (event) => {
      cursorRef.current.x = event.clientX;
      cursorRef.current.y = event.clientY;
    };

    const handleTouchMove = (event) => {
      const touch = event.touches[0];
      cursorRef.current.x = touch.clientX;
      cursorRef.current.y = touch.clientY;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    if (containerRef.current) {
      const { left, top, width: boxWidth, height: boxHeight } =
        containerRef.current.getBoundingClientRect();
      mouseRef.current.x = left + boxWidth / 2;
      mouseRef.current.y = top + boxHeight / 2;
      cursorRef.current.x = mouseRef.current.x;
      cursorRef.current.y = mouseRef.current.y;
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  const setSize = useCallback(() => {
    if (!containerRef.current || !titleRef.current) return;

    const { width: containerWidth, height: containerHeight } =
      containerRef.current.getBoundingClientRect();

    let nextFontSize = containerWidth / (chars.length / 1.45);
    nextFontSize = Math.max(nextFontSize, minFontSize);

    setFontSize(nextFontSize);
    setScaleY(1);
    setLineHeight(1);

    window.requestAnimationFrame(() => {
      if (!titleRef.current) return;
      const textRect = titleRef.current.getBoundingClientRect();

      if (scale && textRect.height > 0) {
        const yRatio = containerHeight / textRect.height;
        setScaleY(yRatio);
        setLineHeight(yRatio);
      }
    });
  }, [chars.length, minFontSize, scale]);

  useEffect(() => {
    const debouncedSetSize = debounce(setSize, 100);
    debouncedSetSize();
    window.addEventListener("resize", debouncedSetSize);
    return () => window.removeEventListener("resize", debouncedSetSize);
  }, [setSize]);

  useEffect(() => {
    let rafId;

    const animate = () => {
      mouseRef.current.x += (cursorRef.current.x - mouseRef.current.x) / 15;
      mouseRef.current.y += (cursorRef.current.y - mouseRef.current.y) / 15;

      if (titleRef.current) {
        const titleRect = titleRef.current.getBoundingClientRect();
        const maxDist = titleRect.width / 2;

        spansRef.current.forEach((span) => {
          if (!span) return;

          const rect = span.getBoundingClientRect();
          const charCenter = {
            x: rect.x + rect.width / 2,
            y: rect.y + rect.height / 2,
          };

          const distance = dist(mouseRef.current, charCenter);
          const wdth = width ? Math.floor(getAttr(distance, maxDist, 5, 200)) : 100;
          const wght = weight ? Math.floor(getAttr(distance, maxDist, 100, 900)) : 400;
          const italVal = italic ? getAttr(distance, maxDist, 0, 1).toFixed(2) : 0;
          const alphaVal = alpha ? getAttr(distance, maxDist, 0, 1).toFixed(2) : 1;

          span.style.fontVariationSettings = `'wght' ${wght}, 'wdth' ${wdth}, 'ital' ${italVal}`;

          if (alpha) {
            span.style.opacity = alphaVal;
          }
        });
      }

      rafId = window.requestAnimationFrame(animate);
    };

    animate();
    return () => window.cancelAnimationFrame(rafId);
  }, [alpha, italic, weight, width]);

  const styleElement = useMemo(
    () => (
      <style>{`
        ${fontUrl
          ? `
        @font-face {
          font-family: '${fontFamily}';
          src: url('${fontUrl}') format('woff2');
          font-style: normal;
          font-display: swap;
        }`
          : ""}

        .text-pressure-flex {
          display: flex;
          justify-content: space-between;
        }

        .text-pressure-stroke span {
          position: relative;
          color: ${textColor};
        }

        .text-pressure-stroke span::after {
          content: attr(data-char);
          position: absolute;
          left: 0;
          top: 0;
          color: transparent;
          z-index: -1;
          -webkit-text-stroke-width: 3px;
          -webkit-text-stroke-color: ${strokeColor};
        }

        .text-pressure-title {
          color: ${textColor};
        }
      `}</style>
    ),
    [fontFamily, fontUrl, strokeColor, textColor]
  );

  const dynamicClassName = [
    className,
    flex ? "text-pressure-flex" : "",
    stroke ? "text-pressure-stroke" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        background: "transparent",
      }}
    >
      {styleElement}
      <h1
        ref={titleRef}
        className={`text-pressure-title ${dynamicClassName}`}
        style={{
          fontFamily,
          textTransform: "uppercase",
          fontSize,
          lineHeight,
          transform: `scale(1, ${scaleY})`,
          transformOrigin: "center top",
          margin: 0,
          textAlign: "center",
          userSelect: "none",
          whiteSpace: "nowrap",
          fontWeight: 300,
          width: "100%",
          letterSpacing,
        }}
      >
        {chars.map((char, index) => (
          <span
            key={`${char}-${index}`}
            ref={(element) => {
              spansRef.current[index] = element;
            }}
            data-char={char}
            style={{
              display: "inline-block",
              color: stroke ? undefined : textColor,
            }}
          >
            {char}
          </span>
        ))}
      </h1>
    </div>
  );
}
