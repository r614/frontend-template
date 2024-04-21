import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { TanStackRouterVite } from "@tanstack/router-vite-plugin";
import { resolve as pathResolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": pathResolve(__dirname, "src"),
    },
  },
  plugins: [react(), TanStackRouterVite()],
});
