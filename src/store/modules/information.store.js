import informationService from '@/api/information.service'

export default {
  namespaced: true,
  state: {
    termsOfUse: undefined,
    versionList: undefined,
    versionDetails: undefined,
    createVersionMessage: undefined
  },
  mutations: {
    initTermsOfUse (state, payload) {
      state.termsOfUse = payload
    },
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
    getTermsOfUse ({ commit }) {
      informationService.getTermsOfUse().then((data) => {
        if (data.success) {
          commit('initTermsOfUse', data.termsOfUse)
        }
      })
    },
    getVersionList ({ commit }) {
      informationService.getVersionList().then((data) => {
        if (data.success) {
          commit('initVersionList', data.versions)
        }
      })
    },
    getVersionDetails ({ commit }, version) {
      informationService.getVersionDetails(version.versionId).then((data) => {
        if (data.success) {
          commit('initVersionDetails', data.versionDetails)
        }
      })
    },
    createVersion ({ commit }, { number, details }) {
      informationService.createVersion(number, details).then((data) => {
        if (data.success) {
          commit('initCreateVersionMessage', data.success)
          // if success, update versionList
          this.dispatch('information/getVersionList')
          this.dispatch('nero/closeVersionEditionModal')
          // TODO popup message "success"
        } else {
          commit('initCreateVersionMessage', data.success)
          // TODO popup message "fail"
        }
      })
    }
  },
  getters: {
  }
}
