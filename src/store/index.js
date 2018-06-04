import Vue from 'vue'
import Vuex from 'vuex'
import mutations from '@/store/mutations'
import actions from '@/store/actions'
import currentUser from '@/store/modules/currentUser'
import applicationManager from '@/store/modules/applicationManager'
import administration from '@/store/modules/administration'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    schools: [{
      id: 0,
      name: 'Lg Elise De La Croix',
      link: 'https://google.fr'
    }]
  },
  mutations: mutations,
  actions: actions,
  modules: {
    currentUser,
    applicationManager,
    administration
  }
})
