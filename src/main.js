import { createApp } from 'vue'
import App from './Nero.vue'
import './registerServiceWorker'
import router from '@/router'
import store from '@/store'
import i18n from '@/i18n'
import VueMq from 'vue-mq'
import PentilaComponents from 'pentila-components'
import moment from 'moment'
import dayjs from 'dayjs'
import fr from 'dayjs/locale/fr'
import { VueHammer } from '@/utils/vuehammer'
// import axios from 'axios'

const app = createApp(App)
  .use(store)
  .use(router)
  .use(i18n)
  .use(VueMq, { // Responsive breakpoints
    breakpoints: {
      phone: 450,
      tablet: 800,
      desktop: Infinity
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

dayjs.locale(fr)
moment.updateLocale('fr', {
  calendar: {
    lastDay: '[' + i18n.global.t('Moment.yesterday') + '] LT',
    sameDay: 'LT',
    nextDay: '[' + i18n.global.t('Moment.tomorrow') + '] LT',
    lastWeek: 'dddd [' + i18n.global.t('Moment.at') + '] LT',
    nextWeek: 'LT',
    sameElse: 'L'
  }
})
