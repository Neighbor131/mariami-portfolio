import React from "react";
import { createRoot } from "react-dom/client";
import AnimatedShaderBackground from "../components/ui/animated-shader-background.jsx";

const contactMountNode = document.getElementById("contact-shader-background");

if (contactMountNode) {
  createRoot(contactMountNode).render(
    <React.StrictMode>
      <AnimatedShaderBackground />
    </React.StrictMode>
  );
}
