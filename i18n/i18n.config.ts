import { Settings } from 'luxon'
import pl from './locales/pl.json'

Settings.defaultLocale = 'pl'

export default defineI18nConfig(() => ({
  legacy: false,
  locale: 'pl',
  messages: {
    pl,
  },

}))
