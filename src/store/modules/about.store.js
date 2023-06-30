import aboutService from '@/api/about.service'

export const state = {
  versionList: undefined,
  versionDetails: undefined,
  createVersionMessage: undefined
}

export const mutations = {
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
}

export const actions = {
  getVersionList ({ commit }) {
    aboutService.getVersionList().then((data) => {
      if (data.success) {
        commit('initVersionList', data.versions)
      }
    })
  },
  getVersionDetails ({ commit }, version) {
    aboutService.getVersionDetails(version.versionId).then((data) => {
      if (data.success) {
        commit('initVersionDetails', data.versionDetails)
      }
    })
  },
  createVersion ({ commit }, { number, details }) {
    aboutService.createVersion(number, details).then((data) => {
      if (data.success) {
        commit('initCreateVersionMessage', data.success)
        // if success, update versionList
        this.dispatch('about/getVersionList')
        this.dispatch('menu/closeVersionEditionModal')
        // TODO popup message "success"
      } else {
        commit('initCreateVersionMessage', data.success)
        // TODO popup message "fail"
      }
    })
  }
}

export const getters = {}
