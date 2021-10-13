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
import { VueHammer } from '@/utils/vuehammer'
// import axios from 'axios'

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
  .use(VueHammer, {
    threshold: 200
  })

// Register Pentila components globally
Object.keys(PentilaComponents).forEach(name => {
  app.component(name, PentilaComponents[name])
})

app.mount('#app')

const calendar = require('dayjs/plugin/calendar')
dayjs.extend(calendar)
dayjs.locale(fr)

// TODO: to translate
dayjs().calendar(null, {
  sameDay: '[Today at] h:mm A', // The same day ( Today at 2:30 AM )
  nextDay: '[Tomorrow]', // The next day ( Tomorrow at 2:30 AM )
  nextWeek: 'dddd', // The next week ( Sunday at 2:30 AM )
  lastDay: '[Yesterday]', // The day before ( Yesterday at 2:30 AM )
  lastWeek: '[Last] dddd', // Last week ( Last Monday at 2:30 AM )
  sameElse: 'DD/MM/YYYY' // Everything else ( 7/10/2011 )
})

if (window.Cypress) {
  // only available during E2E tests
  window.store = store
  window.router = router
}
