import Vue from 'vue'
import Vuex from 'vuex'
import mutations from '@/store/mutations'
import actions from '@/store/actions'
import nero from '@/store/modules/nero'
import currentUser from '@/store/modules/currentUser'
import administration from '@/store/modules/administration'
import applicationManager from '@/store/modules/applicationManager'
import communicationManager from '@/store/modules/communicationManager'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {

  },
  mutations: mutations,
  actions: actions,
  modules: {
    nero,
    currentUser,
    administration,
    applicationManager,
    communicationManager
  }
})
