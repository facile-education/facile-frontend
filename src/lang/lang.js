import Vue from 'vue'
import VueI18n from 'vue-i18n'
import fr from './locale/fr'

Vue.use(VueI18n)

const locale = 'fr'
const messages = {
  fr: fr
}

const i18n = new VueI18n({
  locale,
  messages
})

i18n.setLang = async function (locale) {
  if (locale in i18n.messages) {
    i18n.locale = locale
  } else {
    try {
      // const res = await axios.get(`/src/lang/locale/${locale}.json`)
      const res = await import(`@/lang/locale/${locale}`)

      i18n.setLocaleMessage(locale, res)
      i18n.locale = locale
    } catch (e) {
      console.log(e)
    }
  }
}

export default i18n
