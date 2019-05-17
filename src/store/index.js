import Vue from 'vue'
import Vuex from 'vuex'
import mutations from '@/store/mutations'
import actions from '@/store/actions'

import nero from '@/store/modules/nero.store'
import information from '@/store/modules/information.store'
import user from '@/store/modules/user.store'

import administration from '@/store/modules/administration.store'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {

  },
  mutations: mutations,
  actions: actions,
  modules: {
    nero,
    user,
    administration,
    information
  }
})
