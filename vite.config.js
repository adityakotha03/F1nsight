import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import { VitePWA } from "vite-plugin-pwa";
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    svgr(),
    VitePWA({
      registerType: "prompt",
      includeAssets: [
        "favicon.ico", 
        "apple-touch-icon.png", 
        "android-chrome-192x192.png", 
        "android-chrome-512x512.png"
      ],
      manifestFilename: "manifest.json",
      manifest: {
        name: "F1-Telemetry",
        short_name: "F1-Telemetry",
        description: "In-depth Formula One Telemetry and Analysis",
        theme_color: "#000000",
        background_color: "#000000",
        display: "standalone",
        start_url: "/",
        scope: "/",
        orientation: "any",
        icons: [
          {
            src: "android-chrome-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "android-chrome-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "android-chrome-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
      workbox: {
        maximumFileSizeToCacheInBytes: 6 * 1024 * 1024,
        cleanupOutdatedCaches: true,
        skipWaiting: false,
        clientsClaim: true,
        inlineWorkboxRuntime: true,
        navigateFallbackDenylist: [
          /^\/openf1/, 
          /^https:\/\/(www|region1)\.google-analytics\.com/,
          /^https:\/\/www\.googletagmanager\.com/
        ],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/(www|region1)\.google-analytics\.com\/.*/i,
            handler: 'NetworkOnly',
          },
          {
            urlPattern: /^https:\/\/www\.googletagmanager\.com\/.*/i,
            handler: 'NetworkOnly',
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|webp|ico|glb|bin)$/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'assets-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30,
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            },
          }
        ]
      },
      devOptions: {
        enabled: false,
        suppressWarnings: true,
        type: 'module',
        navigateFallback: "index.html"
      },
    }),
  ],
  build: {
    outDir: "build",
    chunkSizeWarningLimit: 2500,
    rolldownOptions: {
      checks: {
        eval: false,
        pluginTimings: false,
      },
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("three")) return "vendor-three";
            if (
              id.includes("react") ||
              id.includes("react-dom") ||
              id.includes("react-router-dom")
            )
              return "vendor-react";
            if (
              id.includes("flowbite") ||
              id.includes("framer-motion") ||
              id.includes("classnames")
            )
              return "vendor-ui";
            if (id.includes("d3") || id.includes("recharts"))
              return "vendor-charts";
            if (
              id.includes("axios") ||
              id.includes("lottie-web") ||
              id.includes("google/model-viewer")
            )
              return "vendor-heavy";
            return "vendor";
          }
        },
      },
    },
  },
  base: "/",
  server: {
    port: 3006,
    strictPort: true,
    open: true,
    proxy: {
      "/openf1": {
        target: "https://api.openf1.org",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/openf1/, ""),
      },
    },
  },
  optimizeDeps: {
    include: ["flowbite-react"],
  },
});
