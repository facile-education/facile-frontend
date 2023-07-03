import './registerServiceWorker'

import axios from 'axios'
import dayjs from 'dayjs'
import fr from 'dayjs/locale/fr'
import PentilaComponents from 'pentila-components'
import { createApp } from 'vue'
import VueMatomo from 'vue-matomo'
import { Vue3Mq } from 'vue3-mq'
import Vue3TouchEvents from 'vue3-touch-events'

import constants from '@/api/constants'
import i18n from '@/i18n'
import router from '@/router'
import store from '@/store'

import App from './Nero.vue'

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
  .use(VueMatomo, {
    host: '/matomo',
    siteId: 1,
    router: router,
    requireConsent: false,
    disableCookies: false,
    requireCookieConsent: false,
    enableHeartBeatTimer: false,
    heartBeatTimerInterval: 15,
    debug: false,
    cookieDomain: undefined,
    domains: undefined,
    trackSiteSearch: false
  })
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
  // Store the last webservice call date
  store.commit('user/setLastActionDate', dayjs())

  if (store.state.user.pauth === undefined) {
    await fetch(constants.P_AUTH_URL).then(response => response.text()).then(response => { store.commit('user/setPAuth', response.trim()) })
  }

  config.params = { ...config.params, p_auth: store.state.user.pauth }

  // Do as user param
  if (router.currentRoute._value.query.doAsUserId) {
    config.params = { ...config.params, doAsUserId: router.currentRoute._value.query.doAsUserId }
  }

  return config
})

// Catch 403 error to display unauthenticated error
axios.interceptors.response.use(undefined, (error) => {
  if (error.response.status === 403 && error.response.config && !error.response.config.__isRetryRequest) {
    // If you ever get an unauthorized, redirect to error page
    router.push({ name: 'AuthenticationRequired' })
  }

  // Do something with response error
  return Promise.reject(error)
})

if (window.Cypress) {
  // only available during E2E tests
  window.store = store
  window.router = router
}
