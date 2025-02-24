import type { IconOptions } from 'vuetify'
import { aliases, nuxtIcon } from './'

const defaultSet = 'custom'
const svgNuxtIcon = nuxtIcon()

const icons = {
  defaultSet,
  aliases,
  sets: { custom: svgNuxtIcon },
} as IconOptions

export { icons }
