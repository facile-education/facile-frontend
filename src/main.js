import Vue from 'vue'
import Nero from './Nero.vue'
import router from './router'
import store from './store/index'
import i18n from './lang/lang.js'
import VueMq from 'vue-mq'
import './registerServiceWorker'

Vue.config.productionTip = false
Vue.use(VueMq, {
  breakpoints: { // default breakpoints - customize this
    phone: 450,
    tablet: 800,
    desktop: Infinity
  }
})

new Vue({
  router,
  store,
  i18n,
  render: h => h(Nero)
}).$mount('#app')
