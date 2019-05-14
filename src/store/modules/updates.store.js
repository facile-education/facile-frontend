import updatesService from '@/api/updates.service'

export default {
  namespaced: true,
  state: {
    versionList: undefined,
    versionDetails: undefined
  },
  mutations: {
    initVersionList (state, payload) {
      state.versionList = payload
    },
    initVersionDetails (state, payload) {
      state.versionDetails = payload
    }
  },
  actions: {
    getVersionList ({ commit }) {
      updatesService.getVersionList().then((data) => {
        if (data.success) {
          commit('initVersionList', data.versions)
        }
      })
    },
    getVersionDetails ({ commit }, version) {
      updatesService.getVersionDetails(version.versionId).then((data) => {
        if (data.success) {
          commit('initVersionDetails', data.versionDetails)
        }
      })
    }
  },
  getters: {
  }
}
