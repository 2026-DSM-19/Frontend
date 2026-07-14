import { defineConfig } from "vite";
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'

export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],

  server: {
    proxy: {
      "/vworld-api": {
        target: "https://api.vworld.kr",
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/vworld-api/, ""),
      },
    },
  },
});
