import administrationService from '@/api/administration.service'

export default {
  namespaced: true,
  state: {
    schoolList: undefined,
    portletList: undefined,
    roleList: undefined
  },
  mutations: {
    initAdministeredSchoolList (state, payload) {
      state.schoolList = payload
    },
    initPortletList (state, payload) {
      state.portletList = payload
    },
    initRoleList (state, payload) {
      state.roleList = payload
    }
  },
  actions: {
    getAdministrationSchools ({ commit }) {
      administrationService.getAdministeredSchoolList().then((data) => {
        if (data.success) {
          commit('initAdministeredSchoolList', data.etabList)
        }
      })
    },
    getPortletList ({ commit }) {
      administrationService.getPortletList().then((data) => {
        if (data.success) {
          commit('initPortletList', data.listPortlet)
        }
      })
    },
    getRoleList ({ commit }) {
      administrationService.getRoleList().then((data) => {
        if (data.success) {
          commit('initRoleList', data.roleList)
        }
      })
    }
  },
  getters: {

  }
}
