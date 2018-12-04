import Vue from 'vue'
import Vuex from 'vuex'
import mutations from '@/store/mutations'
import actions from '@/store/actions'

import nero from '@/store/modules/nero.store'
import currentUser from '@/store/modules/currentUser.store'

import contacts from '@/store/modules/contacts.store'
import forums from '@/store/modules/forums'
import workspace from '@/store/modules/workspace.store'
import messaging from '@/store/modules/messaging.store'

import administration from '@/store/modules/administration.store'
import applicationManager from '@/store/modules/applicationManager.store'
import communicationManager from '@/store/modules/communicationManager.store'
import dashboardManager from '@/store/modules/dashboardManager.store'
import schoolLifeManager from '@/store/modules/schoolLifeManager.store'

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
    messaging,
    contacts,
    forums,
    administration,
    applicationManager,
    communicationManager,
    dashboardManager,
    schoolLifeManager
  }
})
