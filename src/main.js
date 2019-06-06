import './registerServiceWorker'
import axios from 'axios'
import i18n from './lang/lang.js'
import moment from 'moment'
import Nero from './Nero.vue'
import router from './router'
import store from './store/index'
import Vuelidate from 'vuelidate'
import Vue from 'vue'
import VueMq from 'vue-mq'
import PentilaComponents from 'pentila-components'
import 'pentila-components/dist/pentila-components.css'

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

// Moment lang
moment.locale('fr')

// Vue global config
Vue.config.productionTip = false

// Form validation
Vue.use(Vuelidate)

// Responsive breakpoints
Vue.use(VueMq)

// Register Pentila components globally
Object.keys(PentilaComponents).forEach(name => {
  Vue.component(name, PentilaComponents[name])
})

new Vue({
  router,
  store,
  i18n,
  render: h => h(Nero)
}).$mount('#app')
