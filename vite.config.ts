import babel from "@rolldown/plugin-babel";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), babel({ presets: [reactCompilerPreset()] })],
  server: {
    proxy: {
      "/vworld-api": {
        target: "https://api.vworld.kr",
        changeOrigin: true,
        secure: true,
        rewrite: (path: string): string => path.replace(/^\/vworld-api/, ""),
      },
    },
  },
});
