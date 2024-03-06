import messages from '@intlify/unplugin-vue-i18n/messages'
import { createI18n } from 'vue-i18n'

const i18n = createI18n({
  locale: navigator.language || import.meta.env.VITE_VUE_APP_I18N_LOCALE || 'en',
  fallbackLocale: navigator.language || import.meta.env.VITE_VUE_APP_I18N_FALLBACK_LOCALE || 'en',
  messages
})

export default i18n
