import { createApp } from 'vue'
import App from './Nero.vue'
import './registerServiceWorker'
import router from '@/router'
import store from '@/store'
import i18n from '@/i18n'
import VueMq from 'vue-mq'
import PentilaComponents from 'pentila-components'
// import axios from 'axios'

const app = createApp(App)
  .use(store)
  .use(router)
  .use(i18n)
  .use(VueMq)

// Register Pentila components globally
Object.keys(PentilaComponents).forEach(name => {
  app.component(name, PentilaComponents[name])
})

app.mount('#app')
