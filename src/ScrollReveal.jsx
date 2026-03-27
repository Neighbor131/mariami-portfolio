import React, { useEffect, useRef } from "react";

import "./ScrollReveal.css";

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export default function ScrollReveal({
  children,
  enableBlur = true,
  baseOpacity = 0.1,
  baseRotation = 3,
  blurStrength = 4,
  revealStart = 0.92,
  revealEnd = 0.3,
  containerClassName = "",
  textClassName = "",
}) {
  const containerRef = useRef(null);

  const text = typeof children === "string" ? children : "";
  const words = text.split(/(\s+)/);

  useEffect(() => {
    const element = containerRef.current;

    if (!element) {
      return undefined;
    }

    const wordElements = Array.from(element.querySelectorAll("[data-scroll-word]"));
    let frameId = 0;

    const update = () => {
      frameId = 0;

      const rect = element.getBoundingClientRect();
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      const start = viewportHeight * revealStart;
      const end = viewportHeight * revealEnd;
      const revealProgress = clamp((start - rect.top) / Math.max(1, start - end), 0, 1);
      const rotationProgress = clamp((viewportHeight - rect.top) / viewportHeight, 0, 1);

      element.style.setProperty(
        "--scroll-reveal-rotation",
        `${baseRotation * (1 - rotationProgress)}deg`
      );

      const staggerStep = wordElements.length > 1 ? 0.45 / wordElements.length : 0;
      const revealWindow = Math.max(0.28, 1 - staggerStep * Math.max(wordElements.length - 1, 0));

      wordElements.forEach((wordElement, index) => {
        const start = staggerStep * index;
        const localProgress = clamp((revealProgress - start) / revealWindow, 0, 1);
        const opacity = baseOpacity + (1 - baseOpacity) * localProgress;
        const blurValue = enableBlur ? blurStrength * (1 - localProgress) : 0;

        wordElement.style.opacity = `${opacity}`;
        wordElement.style.filter = blurValue > 0 ? `blur(${blurValue}px)` : "blur(0px)";
      });
    };

    const requestUpdate = () => {
      if (frameId) {
        return;
      }

      frameId = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);

      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, [baseOpacity, baseRotation, blurStrength, enableBlur, revealStart, revealEnd]);

  return (
    <div ref={containerRef} className={`scroll-reveal ${containerClassName}`}>
      <p className={`scroll-reveal-text ${textClassName}`}>
        {words.map((chunk, index) =>
          /^\s+$/.test(chunk) ? (
            chunk
          ) : (
            <span data-scroll-word className="scroll-reveal-word" key={`${chunk}-${index}`}>
              {chunk}
            </span>
          )
        )}
      </p>
    </div>
  );
}
