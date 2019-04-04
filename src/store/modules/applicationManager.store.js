import applicationManagerService from '@/api/applicationManager.service'

export default {
  namespaced: true,
  state: {
    applicationList: undefined,
    application: undefined,
    showBroadcastModal: false,
    showEditionModal: false
  },
  mutations: {
    getSchoolApplicationList (state, payload) {
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
    getSchoolApplicationList ({ commit }, school) {
      applicationManagerService.getSchoolApplications(school.schoolId).then(
        (data) => {
          if (data.success) {
            commit('getSchoolApplicationList', data.serviceList)
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
    categoryList (state) {
      if (state.applicationList === undefined) {
        return undefined
      }

      var categoryList = []
      for (var index = 0; index < state.applicationList.length; ++index) {
        var app = state.applicationList[index].app
        if (categoryList.indexOf(app.serviceCategory) === -1) {
          categoryList.push(app.serviceCategory)
        }
      }
      return categoryList.sort()
    }
  }
}
