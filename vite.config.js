import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

// Convert `import.meta.url` to a `__dirname` equivalent
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  
  // Include assets like images (Vite handles common image types by default)
  // assetsInclude: ["**/*.png", "**/*.jpg", "**/*.jpeg", "**/*.svg"], // This is often not needed for standard image types

  // Set up path aliasing
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // '@' refers to 'src' folder
    },
  },

  // Ensure assets and routes work correctly
  // Use "/" for root deployment, or specific path like "/my-app/" if deployed to a subfolder
  // Using "./" can sometimes cause issues with deep linking in SPAs depending on server config.
  // For GitHub Pages, you might need something like "/your-repo-name/"
  base: "/", // Changed to "/" for typical SPA deployment. Adjust if needed.

  // Configure Testing (Jest + Vitest)
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.js", // Ensure this file exists if specified
    coverage: {
      provider: "istanbul", 
      reporter: ["text", "json", "html"],
    },
    include: ["src/**/*.{test,spec}.{js,jsx,ts,tsx}"], 
  },
});