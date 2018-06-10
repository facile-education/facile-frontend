import administrationService from '@/api/administration.service'

const GET_ADMIN_SCHOOLS = 'getAdministrationSchools'

export default {
  state: {
    schools: undefined,
    portlets: undefined
  },
  mutations: {
    [GET_ADMIN_SCHOOLS] (state, payload) {
      state.schools = payload
    },
    getPortletList (state, payload) {
      state.portlets = payload
    }
  },
  actions: {
    [GET_ADMIN_SCHOOLS] ({ commit }) {
      administrationService.getAdministrationSchools().then((data) => {
        if (data.success) {
          commit(GET_ADMIN_SCHOOLS, data.etabList)
        }
      })
    },
    getPortletList ({ commit }) {
      administrationService.getPortlets().then((data) => {
        if (data.success) {
          commit('getPortletList', data.listPortlet)
        }
      })
    }
  },
  getters: {

  }
}
