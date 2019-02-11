import Vue from 'vue'
import Nero from './Nero.vue'
import router from './router'
import store from './store/index'
import i18n from './lang/lang.js'
import VueMq from 'vue-mq'
import './registerServiceWorker'
import axios from 'axios'

// Catch 401 unauthorized error and redirect user to public home page
axios.interceptors.response.use(undefined, (error) => {
  if (error.response.status === 401 && error.response.config && !error.response.config.__isRetryRequest) {
    // if you ever get an unauthorized, logout the user
    // this.$store.dispatch(AUTH_LOGOUT)
    // Redirect
    window.location.href = '/'
  }

  // Do something with response error
  return Promise.reject(error)
})

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
