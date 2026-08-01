import { defineConfig } from "vite";

export default defineConfig({
  server: {
    port: 5500,
    strictPort: true,
    watch: {
      usePolling: true,
    },
    // This unlocks your SharedArrayBuffer
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin",
      "Cross-Origin-Embedder-Policy": "require-corp",
    },
  },
});
