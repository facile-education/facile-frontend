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
  async getAdministrationSchools ({ commit }) {
    await administrationService.getAdministeredSchoolList().then((data) => {
      if (data.success) {
        commit('initAdministeredSchoolList', data.schools)
        if (data.schools.length > 0) {
          // If schoolId 0 is present , choose it
          const adminSchool = data.schools.find(school => school.schoolId === 0)
          if (adminSchool !== undefined) {
            commit('setSelectedSchool', adminSchool)
            commit('applicationManager/setAdministratorMode', true, { root: true })
          } else {
            commit('setSelectedSchool', data.schools[0])
            commit('applicationManager/setAdministratorMode', false, { root: true })
          }
        }
      }
    })
  },
  getClassList ({ state, commit }) {
    administrationService.getClassList(state.selectedSchool.schoolId).then((data) => {
      if (data.success) {
        commit('setClassList', data.classes)
      }
    })
  },
  getPortletList ({ commit }) {
    administrationService.getPortletList().then((data) => {
      if (data.success) {
        commit('initPortletList', data.portlets)
      }
    })
  },
  getRoleList ({ commit }) {
    administrationService.getRoleList().then((data) => {
      if (data.success) {
        // TODO move to back-end
        data.roles.unshift({
          displayText: 'Tous les profils',
          roleId: 0,
          isForClasse: false
        })
        commit('initRoleList', data.roles)
      }
    })
  },
  setSelectedSchool ({ commit }, school) {
    commit('setSelectedSchool', school)
    if (school.schoolId === 0) {
      commit('applicationManager/setAdministratorMode', true, { root: true })
    } else {
      commit('applicationManager/setAdministratorMode', false, { root: true })
    }
  }
}
