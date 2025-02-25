export default defineNuxtConfig({
  // Having SSR allows us to use `nuxt generate`, turn it off if you don't care
  modules: [
    // 'nuxt-vuefire',
    '@vueuse/nuxt',
    '@unocss/nuxt',
    '@nuxtjs/color-mode',
    '@nuxt/eslint',
    '@nuxt/icon',
    '@formkit/auto-animate/nuxt',
    '@vite-pwa/nuxt',
    '@nuxt/fonts',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
    '@vee-validate/nuxt',
    'vuetify-nuxt-module',
  ],

  // ssr: false,

  devtools: { enabled: true },

  app: {
    head: {
      viewport: 'width=device-width,initial-scale=1',
      link: [
        { rel: 'icon', href: '/favicon.ico', sizes: 'any' },
        { rel: 'icon', type: 'image/svg+xml', href: '/nuxt.svg' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
      ],
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover' },
        { name: 'description', content: 'TEST' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
        { name: 'theme-color', media: '(prefers-color-scheme: light)', content: 'white' },
        { name: 'theme-color', media: '(prefers-color-scheme: dark)', content: '#222222' },
      ],
    },
  },

  css: [
    '@unocss/reset/tailwind.css',
  ],

  colorMode: {
    classSuffix: '',
  },

  // // since we are only using SSR for generation, we can only use a few of these rules effectively
  // // https://nuxt.com/docs/guide/concepts/rendering#hybrid-rendering
  // routeRules: {
  //   '/': { ispr: true },
  //   // Make some pages client only (since we have an SPA)
  //   // useful for authenticated pages that require the user to be logged in to be
  //   // displayed
  //   '/admin': { ssr: false },
  //   '/users': { ssr: false },
  //   '/posts/new': { ssr: false },
  //   '/emoji-panel': { ssr: false },
  //   '/login': { ssr: false },
  // },

  experimental: {
    payloadExtraction: false,
  },

  compatibilityDate: '2025-02-06',

  nitro: {
    // NOTE: we don't want to use the firebase preset because this is a static website and the firebase preset is for SSR
    storage: {
      fs: {
        driver: 'fs',
        base: './data',
      },
    },
    experimental: {
      database: true,
      tasks: true,
    },
  },

  // hooks: {
  //   close: (nuxt) => {
  //     // FIXME: workaround for https://github.com/nuxt/cli/issues/193
  //     if (!nuxt.options._prepare) {
  //       setTimeout(() => {
  //         process.exit(0)
  //       }, 500)
  //     }
  //   },
  // },

  eslint: {
    config: {
      standalone: false,
      nuxt: {
        sortConfigKeys: true,
      },
    },
  },
  pwa: {
    disable: true,
    devOptions: {
      enabled: true,
    },
  },

  vuetify: {
    vuetifyOptions: {
      icons: {
        defaultSet: 'custom',
      },
    },
  },
})
