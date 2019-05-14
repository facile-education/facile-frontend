import updatesService from '@/api/updates.service'

export default {
  namespaced: true,
  state: {
    versionList: undefined
  },
  mutations: {
    initVersionList (state, payload) {
      state.versionList = payload
    }
  },
  actions: {
    getVersionList ({ commit }) {
      updatesService.getVersionList().then((data) => {
        if (data.success) {
          commit('initVersionList', data.versions)
        }
      })
    }
  },
  getters: {
  }
}
