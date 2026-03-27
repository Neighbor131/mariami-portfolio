import { createRoot } from "react-dom/client";
import HoverPreview from "../components/ui/hover-preview.jsx";

const mountNode = document.getElementById("about-hover-preview");

if (mountNode) {
  createRoot(mountNode).render(<HoverPreview />);
}
