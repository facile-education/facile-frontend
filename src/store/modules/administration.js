import administrationService from '@/api/administration.service'

export default {
  state: {
    schools: undefined,
    portlets: undefined
  },
  mutations: {
    getAdministrationSchools (state, payload) {
      state.schools = payload
    },
    getPortletList (state, payload) {
      state.portlets = payload
    }
  },
  actions: {
    getAdministrationSchools ({ commit }) {
      administrationService.getAdministrationSchools().then((data) => {
        if (data.success) {
          commit('getAdministrationSchools', data.etabList)
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
