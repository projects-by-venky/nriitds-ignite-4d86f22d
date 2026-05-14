import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { execSync } from "child_process";

// Regenerates public/sitemap.xml before dev/build so it never goes stale.
function sitemapPlugin(): Plugin {
  const run = () => {
    try {
      execSync("npx tsx scripts/generate-sitemap.ts", { stdio: "inherit" });
    } catch (e) {
      console.warn("[sitemap] generation failed:", (e as Error).message);
    }
  };
  return {
    name: "generate-sitemap",
    apply: () => true,
    buildStart() {
      run();
    },
    configureServer() {
      run();
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), sitemapPlugin(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
