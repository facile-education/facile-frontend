import './registerServiceWorker'

import BannerLayout from '@layouts/BannerLayout.vue'
import EmptyLayout from '@layouts/EmptyLayout.vue'
import { changeDayJsLocale } from '@utils/i18n.util.js'
import axios from 'axios'
import dayjs from 'dayjs'
import { createApp, defineAsyncComponent } from 'vue'
import VueMatomo from 'vue-matomo'
import { Vue3Mq } from 'vue3-mq'
import Vue3TouchEvents from 'vue3-touch-events'

import constants, { LOCAL_STORAGE_DATE_FORMAT } from '@/api/constants'
import i18n from '@/i18n'
import router from '@/router'
import store from '@/store'

import App from './Facile.vue'

const PublicLayout = defineAsyncComponent(() => import(`@layouts/${import.meta.env.VITE_CLIENT}PublicLayout.vue`))

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
    // Disabled automatic router push so that we have control over the dimensions in index.js
    // router: router,
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

app.component('BannerLayout', BannerLayout)
app.component('PublicLayout', PublicLayout)
app.component('EmptyLayout', EmptyLayout)

const calendar = require('dayjs/plugin/calendar')
dayjs.extend(calendar)

const updateLocale = require('dayjs/plugin/updateLocale')
dayjs.extend(updateLocale)

dayjs.updateLocale('en', {
  calendar: {
    sameDay: 'h:mm A',
    nextDay: '[Tomorrow]',
    nextWeek: 'dddd',
    lastDay: '[Yesterday]',
    lastWeek: '[Last] dddd',
    sameElse: 'DD/MM/YYYY'
  }
})
dayjs.updateLocale('fr', {
  calendar: {
    sameDay: 'HH:mm',
    nextDay: '[Demain]',
    nextWeek: 'dddd',
    lastDay: '[Hier]',
    lastWeek: 'dddd [dernier]',
    sameElse: 'DD/MM/YYYY'
  }
})
console.log('Init dayjs locale with navigator language, for public pages')
changeDayJsLocale(navigator.language)

axios.interceptors.request.use(async (config) => {
  // Store the last webservice call date
  store.dispatch('user/setLastActionDate', dayjs())
  // Share last action date to other tabs that share locale storage
  localStorage.setItem('lastActionDate', dayjs().format(LOCAL_STORAGE_DATE_FORMAT))

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
axios.interceptors.response.use(undefined, async (error) => {
  if (error.response.status === 403 && error.response.config && !error.response.config.__isRetryRequest) {
    let newPAuth = store.state.user.pauth

    await fetch(constants.P_AUTH_URL).then(response => response.text()).then(response => { newPAuth = response.trim() })

    if (store.state.user.pauth !== newPAuth) {
      console.log('p_auth has changed -> retry request')
      store.commit('user/setPAuth', newPAuth)
      return axios.request(error.config)
    }

    // If you ever get an unauthorized, re-init layout and redirect to error page
    store.commit('theme/setLayout', 'div')
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

app.mount('#app')
