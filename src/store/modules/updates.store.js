import updatesService from '@/api/updates.service'

export default {
  namespaced: true,
  state: {
    versionList: undefined,
    versionDetails: undefined,
    createVersionMessage: undefined
  },
  mutations: {
    initVersionList (state, payload) {
      state.versionList = payload
    },
    initVersionDetails (state, payload) {
      state.versionDetails = payload
    },
    initCreateVersionMessage (state, payload) {
      state.createVersionMessage = payload
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
    },
    createVersion ({ commit }, { number, details }) {
      updatesService.createVersion(number, details).then((data) => {
        if (data.success) {
          commit('initCreateVersionMessage', data.success)
          // Si l'ajout c'est bien passé, on met à jour la liste des versions
          this.dispatch('updates/getVersionList')
        } else {
          commit('initCreateVersionMessage', data.codeErreur)
        }
      })
    }
  },
  getters: {
  }
}
