import process from 'node:process'
import 'dotenv/config'

export default defineNuxtConfig({

  modules: [
    'nuxt-auth-utils',
    '@vueuse/nuxt',
    '@unocss/nuxt',
    '@nuxtjs/color-mode',
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxtjs/i18n',
    // '@formkit/auto-animate/nuxt',
    // '@vite-pwa/nuxt',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
    '@vee-validate/nuxt',
    'vuetify-nuxt-module',

  ],

  ssr: false,

  devtools: { enabled: true },

  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    layoutTransition: { name: 'layout', mode: 'out-in' },
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

  eslint: {
    config: {
      standalone: false,
    },
  },

  colorMode: {
    classSuffix: '',
  },
  runtimeConfig: {
    userCode: process.env.USER_CODE,
    adminCode: process.env.ADMIN_CODE,
  },

  devServer: {
    host: '192.168.1.195',
    port: 3000,
  },

  compatibilityDate: '2025-02-06',

  nitro: {

    storage: {
      fs: {
        driver: 'fs',
        base: process.env.UPLOADS_DIR,
      },
    },
    experimental: {
      database: true,
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
  // pwa: {
  //   disable: true,
  //   devOptions: {
  //     enabled: true,
  //   },
  // },

  vuetify: {
    vuetifyOptions: {
      icons: {
        defaultSet: 'custom',
      },
      theme: {
        defaultTheme: 'wedding',
        themes: {
          wedding: {
            colors: {
              primary: '#1e3a8a',
            },
          },
        },
      },
    },
  },

  i18n: {
    vueI18n: './i18n.config.ts', // if you are using custom path, default
  },
})
