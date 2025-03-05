import path from 'node:path'
import { fileURLToPath } from 'node:url'

export default defineNuxtConfig({
  modules: [
    '@vueuse/nuxt',
    '@unocss/nuxt',
    '@nuxtjs/color-mode',
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    '@formkit/auto-animate/nuxt',
    '@vite-pwa/nuxt',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
    '@vee-validate/nuxt',
    'vuetify-nuxt-module',
  ],

  ssr: false,

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

  experimental: {
    payloadExtraction: false,
  },

  compatibilityDate: '2025-02-06',

  nitro: {
    // NOTE: we don't want to use the firebase preset because this is a static website and the firebase preset is for SSR
    // preset: 'node',
    storage: {
      fs: {
        driver: 'fs',
        base: '.data/photos',
      },
    },
    experimental: {
      database: true,
    },
    azure: {
      config: {
        // ...
        platform: {
          apiRuntime: 'node:20',
        },
      },
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

  image: {
    presets: {
      avatar: {
        modifiers: {
          format: 'jpg',
          width: 300,
          height: 300,
        },
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
