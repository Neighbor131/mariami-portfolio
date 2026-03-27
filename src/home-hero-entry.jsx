import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { ShaderGradient, ShaderGradientCanvas } from "@shadergradient/react";
import Galaxy from "./Galaxy.jsx";
import ScrollReveal from "./ScrollReveal.jsx";
import TextPressure from "./TextPressure.jsx";
import ToolLoop from "./ToolLoop.jsx";

function HomeBackground() {
  const [theme, setTheme] = useState(document.body.dataset.theme || "dark");

  useEffect(() => {
    const body = document.body;
    const observer = new MutationObserver(() => {
      setTheme(body.dataset.theme || "dark");
    });

    observer.observe(body, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, []);

  if (theme === "light") {
    return (
      <ShaderGradientCanvas
        style={{ position: "absolute", inset: 0 }}
        pixelDensity={1}
        fov={45}
      >
        <ShaderGradient
          animate="on"
          axesHelper="off"
          bgColor1="#000000"
          bgColor2="#000000"
          brightness={1.5}
          cAzimuthAngle={60}
          cDistance={7.1}
          cPolarAngle={90}
          cameraZoom={15.3}
          color1="#ff7a33"
          color2="#33a0ff"
          color3="#ffc53d"
          destination="onCanvas"
          embedMode="off"
          envPreset="dawn"
          format="gif"
          frameRate={10}
          gizmoHelper="hide"
          grain="off"
          lightType="3d"
          positionX={0}
          positionY={-0.15}
          positionZ={0}
          range="disabled"
          rangeEnd={40}
          rangeStart={0}
          reflection={0.1}
          rotationX={0}
          rotationY={0}
          rotationZ={0}
          shader="defaults"
          type="sphere"
          uAmplitude={1.4}
          uDensity={1.1}
          uFrequency={5.5}
          uSpeed={0.1}
          uStrength={0.4}
          uTime={0}
          wireframe={false}
        />
      </ShaderGradientCanvas>
    );
  }

  return (
      <Galaxy
        mouseRepulsion
        mouseInteraction
        density={1.2}
        glowIntensity={0.25}
        saturation={0.45}
        hueShift={140}
        twinkleIntensity={0.1}
        rotationSpeed={0.08}
        repulsionStrength={0.15}
        autoCenterRepulsion={0}
        starSpeed={0.42}
        speed={0.65}
        transparent={false}
      />
  );
}

function HomeHeroHeadline() {
  return (
    <TextPressure
      text="CHEKO'S SPACE"
      fontFamily="DM Sans"
      fontUrl=""
      flex={false}
      alpha={false}
      stroke={false}
      width
      weight
      italic={false}
      textColor="#ffffff"
      strokeColor="#5227FF"
      minFontSize={24}
    />
  );
}

function AboutToolLoop() {
  return <ToolLoop />;
}

function AboutScrollText() {
  return (
    <ScrollReveal
      baseOpacity={0.12}
      enableBlur
      baseRotation={3}
      blurStrength={4}
      revealStart={0.9}
      revealEnd={0.52}
      containerClassName="about-scroll-reveal"
      textClassName="about-scroll-reveal-text"
    >
      Hey there! Welcome to my world. When it comes to work, I believe we should always
      do what we enjoy and share it with others. For me, that joy is turning ideas and
      emotions into reality. I love experimenting with different fields and constantly
      growing my skills and capabilities. Have fun exploring!
    </ScrollReveal>
  );
}

const backgroundMountNode = document.getElementById("home-galaxy-bg");
const headlineMountNode = document.getElementById("home-hero-text");
const aboutTextMountNode = document.getElementById("about-main-text");
const toolLoopMountNode = document.getElementById("about-tool-loop");

if (backgroundMountNode) {
  createRoot(backgroundMountNode).render(
    <React.StrictMode>
      <HomeBackground />
    </React.StrictMode>
  );
}

if (headlineMountNode) {
  createRoot(headlineMountNode).render(
    <React.StrictMode>
      <HomeHeroHeadline />
    </React.StrictMode>
  );
}

if (aboutTextMountNode) {
  createRoot(aboutTextMountNode).render(
    <React.StrictMode>
      <AboutScrollText />
    </React.StrictMode>
  );
}

if (toolLoopMountNode) {
  createRoot(toolLoopMountNode).render(
    <React.StrictMode>
      <AboutToolLoop />
    </React.StrictMode>
  );
}
