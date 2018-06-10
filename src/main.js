import Vue from 'vue'
import Nero from './Nero.vue'
import router from './router'
import store from './store/index'
import i18n from './lang/lang.js'
import './registerServiceWorker'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  i18n,
  render: h => h(Nero)
}).$mount('#app')
