import { defineConfig } from "vite";
import { fileURLToPath, URL } from "node:url";

import vue from "@vitejs/plugin-vue";
import path from "path";
import { PrimeVueResolver } from "@primevue/auto-import-resolver";
import Components from "unplugin-vue-components/vite";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          "vendor-vue": ["vue", "vue-router", "vuex", "vuex-persistedstate"],
          "vendor-primevue": [
            "primevue/config",
            "primevue/button",
            "primevue/card",
            "primevue/dialog",
            "primevue/inputtext",
            "primevue/progressspinner",
          ],
          "vendor-supabase": [
            "@supabase/supabase-js",
          ],
          "vendor-utils": ["axios"],

          // Application chunks
          "app-services": [
            "./src/services/api.js",
            "./src/services/auth.js",
            "./src/lib/supabase.js",
          ],
          "app-utils": [
            "./src/utils/dataMapUtils.ts",
            "./src/utils/validationUtils.ts",
          ],
          "app-config": ["./src/config/allFields30-17.ts"],
        },
        // Optimize chunk size
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId
            ? chunkInfo.facadeModuleId.split("/").pop()
            : "chunk";
          return `assets/js/${facadeModuleId}-[hash].js`;
        },
      },
    },
    // Enable minification
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    // Warn when chunks are too large
    chunkSizeWarningLimit: 500,
    // Enable source maps for production debugging
    sourcemap: false,
  },
  optimizeDeps: {
    include: ["vue", "vue-router", "vuex", "primevue/config"],
    exclude: [],
  },
  plugins: [
    vue(),
    Components({
      resolvers: [PrimeVueResolver()],
    }),
  ],
  test: {
    globals: true,
    environment: "happy-dom",
    setupFiles: ["src/__tests__/setup.simple.ts"],
    exclude: [
      "**/node_modules/**",
      "**/dist/**",
      "src/tests/**/*.spec.ts", // Exclude Playwright test files
      "src/tests/**/*.feature", // Exclude Cucumber feature files
      "**/*.config.*",
    ],
    reporters: ["default", "json"],
    outputFile: {
      json: "./test-results/vitest-results.json",
      html: "./test-results/vitest-report.html",
    },
    coverage: {
      enabled: false,
    },
    testTimeout: 10000,
    hookTimeout: 10000,
    teardownTimeout: 10000,
  },
});
