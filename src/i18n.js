import { createI18n } from 'vue-i18n'

import fr from '@/locales/fr'

// function loadLocaleMessages () {
//   const locales = require.context('./locales', true, /[A-Za-z0-9-_,\s]+\.json$/i)
//   const messages = {}
//   locales.keys().forEach(key => {
//     const matched = key.match(/([A-Za-z0-9-_]+)\./i)
//     if (matched && matched.length > 1) {
//       const locale = matched[1]
//       messages[locale] = { default: locales(key) }
//     }
//   })
//   return messages
// }

const messages = {}
messages.fr = fr

// console.log(loadLocaleMessages(), messages)

const i18n = createI18n({
  locale: process.env.VUE_APP_I18N_LOCALE || 'en',
  fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || 'en',
  messages
})

export default i18n
