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

dayjs.locale(fr)
