// @ts-check
import antfu from '@antfu/eslint-config'
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  antfu({
    // ...@antfu/eslint-config options
    formatters: true,
    unocss: true,
    vue: {
      overrides: {
        'vue/attributes-order': 'error',
        'vue/max-attributes-per-line': ['error', {
          multiline: 1,
          singleline: 1,
        }],
      },
    },
  }),
  // ...your other rules
)
