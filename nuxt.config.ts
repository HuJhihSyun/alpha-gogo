import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  app: {
    baseURL: '/alpha-gogo/',
    head: {
      titleTemplate: '%s｜Alpha GoGo',
      htmlAttrs: { lang: 'zh-Hant' },
      meta: [
        { name: 'description', content: '2026 阿拉法節校園足跡傳道活動 — 記錄禱告與傳道足跡，解鎖台大、師大、台科大三所學校明信片！' },
        { name: 'theme-color', content: '#6AB04C' },
        { name: 'mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
        { name: 'apple-mobile-web-app-title', content: 'Alpha GoGo' },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'Alpha GoGo' },
        { property: 'og:title', content: 'Alpha GoGo — 2026 阿拉法節校園足跡傳道活動' },
        { property: 'og:description', content: '記錄禱告與傳道足跡，解鎖三所大學明信片！' },
        { property: 'og:image', content: '/alpha-gogo/title-logo.png' },
        { name: 'twitter:card', content: 'summary' },
        { name: 'twitter:title', content: 'Alpha GoGo — 2026 阿拉法節校園足跡傳道活動' },
        { name: 'twitter:description', content: '記錄禱告與傳道足跡，解鎖三所大學明信片！' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/alpha-gogo/favicon.webp' },
      ]
    }
  },
  modules: [
    '@vueuse/nuxt'
  ],
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE
    }
  },
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: [
        'leaflet',
        'openapi-fetch'
      ]
    }
  },
  nitro: {
    prerender: {
      autoSubfolderIndex: false
    }
  }
})
