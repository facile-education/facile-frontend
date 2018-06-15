import applicationManagerService from '@/api/applicationManager.service'

export default {
  state: {
    applicationList: undefined,
    application: undefined,
    showBroadcastModal: false,
    showEditionModal: false
  },
  mutations: {
    getSchoolApplications (state, payload) {
      state.applicationList = payload
    },
    getApplicationBroadcastScope (state, payload) {
      state.rules = ''
    },
    updateApplication (state, payload) {
      state.application = payload
    },
    toggleBroadcastModal (state, show) {
      state.showBroadcastModal = show
    },
    toggleEditionModal (state, show) {
      state.showEditionModal = show
    }
  },
  actions: {
    getSchoolApplications ({ commit }, school) {
      applicationManagerService.getSchoolApplications(school.schoolId).then(
        (data) => {
          if (data.success) {
            commit('getSchoolApplications', data.serviceList)
          }
        },
        (err) => {
          // TODO toastr
          console.log(err)
        })
    },
    getApplicationBroadcastScope () {
      applicationManagerService.getApplicationBroadcastScope().then(
        (data) => {
          console.log(data)
          // commit('getApplicationBroadcastScope', data.serviceList)
        },
        (err) => {
          // TODO toastr
          console.log(err)
        })
    },
    openBroadcastModal ({ commit }) {
      commit('toggleBroadcastModal', true)
    },
    closeBroadcastModal ({ commit }) {
      commit('toggleBroadcastModal', false)
    },
    openEditionModal ({ commit }) {
      commit('toggleEditionModal', true)
    },
    closeEditionModal ({ commit }) {
      commit('toggleEditionModal', false)
    },
    updateApplication ({ commit }, application) {
      commit('updateApplication', application)
    },
    resetApplication ({ dispatch }) {
      dispatch('updateApplication', {
        image: undefined,
        serviceName: '',
        serviceKey: '',
        serviceCategory: '',
        etabFilters: [],
        portletId: undefined,
        globalUrl: '',
        exportUser: false,
        exportParent: false,
        exportStudent: false,
        exportTeacher: false,
        hasCustomUrl: false,
        hasGlobalUrl: false
      })
    }
  },
  getters: {
    categories (state) {
      if (state.applicationList === undefined) {
        return undefined
      }

      var categories = []
      for (var index = 0; index < state.applicationList.length; ++index) {
        var app = state.applicationList[index].app
        if (categories.indexOf(app.serviceCategory) === -1) {
          categories.push(app.serviceCategory)
        }
      }
      return categories.sort()
    }
  }
}
