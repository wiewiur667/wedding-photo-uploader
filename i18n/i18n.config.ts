import { Settings } from 'luxon'
import pl from './locales/pl.json'

Settings.defaultLocale = navigator.language ?? 'pl'

export default defineI18nConfig(() => ({
  legacy: false,
  locale: navigator.language ?? 'pl',
  messages: {
    pl,
  },

}))
