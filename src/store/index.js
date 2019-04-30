import Vue from 'vue'
import Vuex from 'vuex'
import mutations from '@/store/mutations'
import actions from '@/store/actions'

import nero from '@/store/modules/nero.store'
import user from '@/store/modules/user.store'

import contacts from '@/store/modules/contacts.store'
import forums from '@/store/modules/forums.store'
import workspace from '@/store/modules/workspace.store'
import messaging from '@/store/modules/messaging.store'
import news from '@/store/modules/news.store'

import administration from '@/store/modules/administration.store'
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
    user,
    workspace,
    messaging,
    news,
    contacts,
    forums,
    administration,
    communicationManager,
    dashboardManager,
    schoolLifeManager
  }
})
