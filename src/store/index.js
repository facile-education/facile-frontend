import Vue from 'vue'
import Vuex from 'vuex'
import mutations from '@/store/mutations'
import actions from '@/store/actions'
import currentUser from '@/store/modules/currentUser'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    schools: [{
      name: 'Lg Elise De La Croix'
    }]
  },
  mutations: mutations,
  actions: actions,
  modules: {
    currentUser
  }
})
