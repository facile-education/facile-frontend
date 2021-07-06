import administrationService from '@/api/administration.service'

export const state = {
  classList: undefined,
  portletList: undefined,
  roleList: undefined,
  selectedSchool: undefined,
  schoolList: undefined
}
export const mutations = {
  initAdministeredSchoolList (state, payload) {
    state.schoolList = payload
  },
  initPortletList (state, payload) {
    state.portletList = payload
  },
  initRoleList (state, payload) {
    state.roleList = payload
  },
  setClassList (state, payload) {
    state.classList = payload
  },
  setSelectedSchool (state, payload) {
    state.selectedSchool = payload
  }
}
export const actions = {
  getAdministrationSchools ({ commit }) {
    administrationService.getAdministeredSchoolList().then((data) => {
      if (data.success) {
        commit('initAdministeredSchoolList', data.etabList)
      }
    })
  },
  getClassList ({ state, commit }) {
    administrationService.getClassList(state.selectedSchool.schoolId).then((data) => {
      if (data.success) {
        commit('setClassList', data.classList)
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
        // TODO move to back-end
        data.roleList.unshift({
          displayText: 'Tous les profils',
          roleId: 0,
          isForClasse: false
        })
        commit('initRoleList', data.roleList)
      }
    })
  },
  setSelectedSchool ({ commit }, school) {
    commit('setSelectedSchool', school)
  }
}
