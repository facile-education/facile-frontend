import applicationManagerService from '@/api/applicationManager.service'

const GET_SCHOOL_SERVICES = 'getSchoolServices'

export default {
  state: {
    selectedSchool: {},
    services: undefined
  },
  mutations: {
    [GET_SCHOOL_SERVICES] (state, payload) {
      state.services = payload
    }
  },
  actions: {
    [GET_SCHOOL_SERVICES] ({ commit, state }) {
      applicationManagerService.getSchoolServices().then((data) => {
        commit(GET_SCHOOL_SERVICES, data.serviceList)
      })
    }
  },
  getters: {
    categories (state) {
      if (state.services === undefined) {
        return undefined
      }

      var categories = []
      for (var index = 0; index < state.services.length; ++index) {
        var app = state.services[index].app
        if (categories.indexOf(app.serviceCategory) === -1) {
          categories.push(app.serviceCategory)
        }
      }
      return categories.sort()
    }
  }
}
