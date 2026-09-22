import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import path from "node:path";
import { defineConfig, loadEnv } from "vite";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const apiTarget = env.VITE_API_PROXY_TARGET || env.API_PROXY_TARGET || "http://localhost:3000";

  return {
    resolve: {
      alias: {
        "@": path.resolve(import.meta.dirname, "./src"),
      },
    },
    plugins: [react(), tailwindcss(), babel({ presets: [reactCompilerPreset()] })],
    define: {
      // Expose the proxy target to client code so production (which has no dev
      // proxy) calls the real API server instead of the static host.
      "import.meta.env.VITE_API_PROXY_TARGET": JSON.stringify(apiTarget),
    },
    server: {
      proxy: {
        "/api": apiTarget,
      },
    },
    preview: {
      proxy: {
        "/api": apiTarget,
      },
    },
  };
});
