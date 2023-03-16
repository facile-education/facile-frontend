import { createApp } from 'vue'
import App from './Nero.vue'
import './registerServiceWorker'
import router from '@/router'
import store from '@/store'
import i18n from '@/i18n'
import { Vue3Mq } from 'vue3-mq'
import PentilaComponents from 'pentila-components'
import dayjs from 'dayjs'
import fr from 'dayjs/locale/fr'
import Vue3TouchEvents from 'vue3-touch-events'
import axios from 'axios'

const app = createApp(App)
  .use(store)
  .use(router)
  .use(i18n)
  .use(Vue3Mq, { // Responsive breakpoints
    breakpoints: {
      phone: 0,
      tablet: 450,
      desktop: 800
    }
  })
  .use(Vue3TouchEvents)

// Register Pentila components globally
Object.keys(PentilaComponents).forEach(name => {
  app.component(name, PentilaComponents[name])
})

app.mount('#app')

const calendar = require('dayjs/plugin/calendar')
dayjs.extend(calendar)

const updateLocale = require('dayjs/plugin/updateLocale')
dayjs.extend(updateLocale)
dayjs.locale(fr)

dayjs.updateLocale('en', {
  calendar: {
    lastDay: '[Yesterday at] h:mm A',
    sameDay: '[Today at] h:mm A',
    nextDay: '[Tomorrow at] LT',
    lastWeek: '[last] dddd [at] LT',
    nextWeek: 'dddd [at] LT',
    sameElse: 'L'
  }
})

dayjs.updateLocale('fr', {
  calendar: {
    sameDay: 'HH:mm', // The same day ( 2:30 AM )
    nextDay: '[Demain]', // The next day ( Tomorrow at 2:30 AM )
    nextWeek: 'dddd', // The next week ( Sunday at 2:30 AM )
    lastDay: '[Hier]', // The day before ( Yesterday at 2:30 AM )
    lastWeek: 'dddd [dernier]', // Last week ( Last Monday at 2:30 AM )
    sameElse: 'DD/MM/YYYY' // Everything else ( 7/10/2011 )
  }
})

axios.interceptors.request.use(async (config) => {
  if (store.state.user.pauth === undefined) {
    await fetch('/p_auth_token.jsp').then(response => response.text()).then(response => { store.commit('user/setPAuth', response) })
  }

  config.params = { ...config.params, p_auth: store.state.user.pauth }
  return config
})

if (window.Cypress) {
  // only available during E2E tests
  window.store = store
  window.router = router
}
