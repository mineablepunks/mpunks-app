import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // web3-react v6 uses Node's EventEmitter in the browser.
      events: "events/",
      "@react95/core": fileURLToPath(new URL("./node_modules/@react95/core/esm/index.js", import.meta.url)),
    },
  },
  // Preserve the existing public RPC setting for deployed environments.
  envPrefix: ["VITE_", "REACT_APP_"],
  build: { outDir: "build" },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/setupTests.ts"],
    clearMocks: true,
    mockReset: true,
    server: { deps: { inline: [/@react95\//] } },
  },
});
