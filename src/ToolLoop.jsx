import "./ToolLoop.css";

const tools = [
  {
    src: "/tool-logos/substance-painter.svg",
    name: "Adobe Substance Painter",
    href: "https://www.adobe.com/products/substance3d/apps/painter.html",
    width: 50,
  },
  {
    src: "/tool-logos/blender.svg",
    name: "Blender",
    href: "https://www.blender.org/",
    width: 148,
    darkInvert: true,
  },
  {
    src: "/tool-logos/houdini.svg",
    name: "Houdini",
    href: "https://www.sidefx.com/products/houdini/",
    width: 132,
    darkInvert: true,
  },
  {
    src: "/tool-logos/marmoset.avif",
    name: "Marmoset Toolbag",
    href: "https://marmoset.co/toolbag/",
    width: 58,
    darkInvert: true,
  },
  {
    src: "/tool-logos/unreal-engine.svg",
    name: "Unreal Engine",
    href: "https://www.unrealengine.com/",
    width: 136,
    darkInvert: true,
  },
];

const repeatedTools = [...tools, ...tools];

function ToolBadge({ src, name, href, width, darkInvert = false, hidden = false }) {
  return (
    <a
      className="tool-loop__item"
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      aria-label={name}
      aria-hidden={hidden}
      tabIndex={hidden ? -1 : 0}
      style={{ "--tool-logo-width": `${width}px` }}
    >
      <img
        className={`tool-loop__logo${darkInvert ? " tool-loop__logo--dark-invert" : ""}`}
        src={src}
        alt=""
        loading="lazy"
        decoding="async"
      />
    </a>
  );
}

export default function ToolLoop() {
  return (
    <div className="tool-loop-block">
      <p className="tool-loop__title">Tools I use</p>
      <div className="tool-loop tool-loop--fade" role="region" aria-label="Creative tool stack">
        <div className="tool-loop__track">
          {repeatedTools.map((tool, index) => (
            <ToolBadge key={`${tool.name}-${index}`} {...tool} hidden={index >= tools.length} />
          ))}
        </div>
      </div>
    </div>
  );
}
