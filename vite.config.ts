/* eslint-disable import/no-named-as-default */
/* eslint-disable import/no-unresolved */

// vite.example.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import compression from "vite-plugin-compression";
import detect from "detect-port";

// ---- Auto port detection (top-level await, no async defineConfig) ----
const DEFAULT_DEV_PORT = Number(process.env.EXAMPLE_DEV_PORT || 5173);
const DEFAULT_PREVIEW_PORT = Number(process.env.EXAMPLE_PREVIEW_PORT || 4173);

let DEV_PORT = DEFAULT_DEV_PORT;
let PREVIEW_PORT = DEFAULT_PREVIEW_PORT;

try {
  DEV_PORT = await detect(DEFAULT_DEV_PORT);
} catch {
  DEV_PORT = DEFAULT_DEV_PORT;
}
try {
  PREVIEW_PORT = await detect(DEFAULT_PREVIEW_PORT);
} catch {
  PREVIEW_PORT = DEFAULT_PREVIEW_PORT;
}
// ---------------------------------------------------------------------

const ROOT = path.resolve(__dirname, "example");
const OUT_DIR = path.resolve(__dirname, "docs");

export default defineConfig(({ mode }) => {
  const isProd = mode === "production";

  return {
    root: ROOT,

    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },

    plugins: [
      react(),
      // Production-only precompression
      isProd &&
      compression({
        verbose: false,
        threshold: 1024,
        algorithm: "gzip",
        ext: ".gz",
      }),
      isProd &&
      compression({
        verbose: false,
        threshold: 1024,
        algorithm: "brotliCompress",
        ext: ".br",
      }),
    ].filter(Boolean),

    server: {
      host: "0.0.0.0",
      port: DEV_PORT,       // auto-picked free port
      strictPort: false,    // if busy, Vite will still try next; DEV_PORT is already free though
      open: true,
    },

    preview: {
      port: PREVIEW_PORT,   // auto-picked free port for preview server
      open: false,
    },

    build: {
      outDir: OUT_DIR,
      emptyOutDir: true,
      target: "es2019",
      sourcemap: !isProd,
      minify: isProd ? "terser" : false,
      terserOptions: isProd
        ? {
          compress: {
            drop_console: true,
            drop_debugger: true,
            passes: 3,
          },
          mangle: true,
          format: { comments: false },
        }
        : {},
      rollupOptions: {
        output: {
          // manualChunks(id) {
          //   if (id.includes("node_modules")) {
          //     if (id.includes("react") || id.includes("react-dom") || id.includes("scheduler")) {
          //       return "vendor.react";
          //     }
          //     if (id.includes("react-bootstrap") || id.includes("bootstrap")) {
          //       return "vendor.bootstrap";
          //     }
          //     return "vendor";
          //   }
          // },
          // chunkFileNames: "assets/js/[name]-[hash].js",
          // entryFileNames: "assets/js/[name]-[hash].js",
          // assetFileNames: ({ name }) =>
          //   name && name.endsWith(".css")
          //     ? "assets/css/[name]-[hash][extname]"
          //     : name && /\.(png|jpe?g|svg|webp|avif)$/.test(name)
          //     ? "assets/img/[name]-[hash][extname]"
          //     : "assets/[name]-[hash][extname]",
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return 'vendor';
            }
          },
          chunkFileNames: "assets/js/[name]-[hash].js",
          entryFileNames: "assets/js/[name]-[hash].js",
          assetFileNames: ({ name }) => {
            if (name && name.endsWith('.css')) return "assets/css/[name]-[hash][extname]";
            if (name && /\.(png|jpe?g|svg|webp|avif)$/.test(String(name))) return "assets/img/[name]-[hash][extname]";
            return "assets/[name]-[hash][extname]";
          },
        },
      },
      assetsInlineLimit: 4096,
    },

    optimizeDeps: {
      include: ["react", "react-dom", "react-bootstrap"],
    },

    logLevel: "info",
  };
});
