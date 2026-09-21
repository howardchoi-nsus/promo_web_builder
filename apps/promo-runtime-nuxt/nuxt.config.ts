import { resolve } from "node:path";
import { defineNuxtConfig } from "nuxt/config";

const repositoryRoot = resolve(__dirname, "../..");

export default defineNuxtConfig({
  compatibilityDate: "2026-09-20",
  ssr: !["false", "0", "off", "disabled"].includes(String(process.env.NUXT_SSR_ENABLED || "true").toLowerCase()),
  devtools: { enabled: false },
  css: [resolve(repositoryRoot, "visual-editor/src/promo-renderer.css")],
  alias: {
    "#promo-contracts": resolve(repositoryRoot, "packages/promo-contracts/src"),
    "#promo-renderer": resolve(repositoryRoot, "visual-editor/src/runtime"),
  },
  runtimeConfig: {
    promoApiBaseUrl: process.env.PROMO_API_BASE_URL || "http://localhost:3000",
    revalidateSecret: process.env.NUXT_REVALIDATE_SECRET || "",
    public: {
      defaultLocale: process.env.PROMO_DEFAULT_LOCALE || "ko-KR",
    },
  },
  routeRules: {
    "/promotions/**": { swr: 300 },
    "/preview/**": {
      headers: {
        "cache-control": "private, no-store",
        "referrer-policy": "no-referrer",
        "x-robots-tag": "noindex, nofollow",
      },
    },
  },
  vite: {
    server: {
      fs: { allow: [repositoryRoot] },
    },
  },
  typescript: {
    strict: true,
    typeCheck: false,
  },
});
