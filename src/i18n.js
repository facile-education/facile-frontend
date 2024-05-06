import messages from '@intlify/unplugin-vue-i18n/messages'
import { getI18nFrontKey } from '@utils/i18n.util.js'
import { createI18n } from 'vue-i18n'

const i18n = createI18n({
  locale: getI18nFrontKey(navigator.language) || import.meta.env.VITE_VUE_APP_I18N_LOCALE || 'en',
  fallbackLocale: getI18nFrontKey(navigator.language) || import.meta.env.VITE_VUE_APP_I18N_FALLBACK_LOCALE || 'en',
  messages
})

export default i18n
