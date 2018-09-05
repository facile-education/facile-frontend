import Vue from 'vue'
import Vuex from 'vuex'
import mutations from '@/store/mutations'
import actions from '@/store/actions'

import nero from '@/store/modules/nero.store'
import currentUser from '@/store/modules/currentUser.store'

import workspace from '@/store/modules/workspace.store'

import administration from '@/store/modules/administration.store'
import applicationManager from '@/store/modules/applicationManager.store'
import communicationManager from '@/store/modules/communicationManager.store'
import dashboardManager from '@/store/modules/dashboardManager.store'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {

  },
  mutations: mutations,
  actions: actions,
  modules: {
    nero,
    currentUser,
    workspace,
    administration,
    applicationManager,
    communicationManager,
    dashboardManager
  }
})
