import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
  ],
  build: {
    outDir: "dist",
    emptyOutDir: false,
    rollupOptions: {
      external: ["dotenv"], // ✅ add this
    },
  },
  ssr: {
    noExternal: ["react-router-dom"],
  },
});
