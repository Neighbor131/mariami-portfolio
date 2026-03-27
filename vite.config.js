import { readdirSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const rootDir = fileURLToPath(new URL(".", import.meta.url));

function collectHtmlFiles(directory, entries = {}) {
  for (const entry of readdirSync(directory)) {
    if (entry === "node_modules" || entry === "dist") continue;

    const fullPath = path.join(directory, entry);
    const stats = statSync(fullPath);

    if (stats.isDirectory()) {
      collectHtmlFiles(fullPath, entries);
      continue;
    }

    if (entry.endsWith(".html")) {
      const relativePath = path.relative(rootDir, fullPath);
      const key = relativePath.replace(/\.html$/, "");
      entries[key] = fullPath;
    }
  }

  return entries;
}

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: collectHtmlFiles(rootDir),
    },
  },
});
