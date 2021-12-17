import {
  getManualUsers, getSchoolUsers, getSchools, getRoles, createManualUser, editManualUser, getSchoolOrgs
} from '@/api/userManagement.service'

export const state = {
  isManualUsersMode: true,
  isPasswordMode: false,
  isManualAffectationMode: false,
  resultUsers: [],
  schools: [],
  roles: []
}

export const mutations = {
  setManualUsersMode (state, isManualUsers) {
    state.isManualUsersMode = isManualUsers
    state.isPasswordMode = false
    state.isManualAffectationMode = false
  },
  setChangePasswordMode (state, isChangePassword) {
    state.isPasswordMode = isChangePassword
    state.isManualUsersMode = false
    state.isManualAffectationMode = false
  },
  setManualAffectationMode (state, isManualAffectation) {
    state.isManualAffectationMode = isManualAffectation
    state.isPasswordMode = false
    state.isManualUsersMode = false
  },
  setResultUsers (state, users) {
    state.resultUsers = users
  },
  setSchools (state, schools) {
    state.schools = schools
  },
  setRoles (state, roles) {
    state.roles = roles
  },
  addUser (state, user) {
    state.manualUsers.push(user)
  },
  editUser (state, user) {
    const userIndex = state.manualUsers.map(user => user.userId).indexOf(user.userId)
    if (userIndex !== -1) {
      state.manualUsers[userIndex] = user
    }
  },
  setSchoolOrgs (state, payload) {
    const schoolIndex = state.schools.map(school => school.schoolId).indexOf(payload.schoolId)
    if (schoolIndex !== -1) {
      state.schools[schoolIndex].orgs = payload.orgs
    }
  },
  toggleExpandedSchool (state, payload) {
    const schoolIndex = state.schools.map(school => school.schoolId).indexOf(payload.schoolId)
    if (schoolIndex !== -1) {
      state.schools[schoolIndex].isExpanded = !state.schools[schoolIndex].isExpanded
    }
  }
}

export const actions = {
  getManualUsers ({ commit }, { schoolId, query }) {
    getManualUsers(schoolId, query).then(
      (data) => {
        if (data.success) {
          commit('setResultUsers', data.users)
        }
      }
    )
  },
  getSchoolUsers ({ commit }, { schoolId, query }) {
    getSchoolUsers(schoolId, query).then(
      (data) => {
        if (data.success) {
          commit('setResultUsers', data.users)
        }
      }
    )
  },
  getSchools ({ commit }) {
    getSchools().then(
      (data) => {
        if (data.success) {
          commit('setSchools', data.schools)
        }
      }
    )
  },
  getRoles ({ commit }) {
    getRoles().then(
      (data) => {
        if (data.success) {
          commit('setRoles', data.roles)
        }
      }
    )
  },
  setManualUsersMode ({ commit }) {
    commit('setManualUsersMode', true)
  },
  setChangePasswordMode ({ commit }) {
    commit('setChangePasswordMode', true)
  },
  setManualAffectationMode ({ commit }) {
    commit('setManualAffectationMode', true)
  },
  createManualUser ({ commit }, { lastName, firstName, email, roleId, schoolId }) {
    createManualUser(lastName, firstName, email, roleId, schoolId).then(
      (data) => {
        if (data.success) {
          commit('addUser', data.user)
        }
      }
    )
  },
  editManualUser ({ commit }, { userId, lastName, firstName, email, roleId, schoolId }) {
    editManualUser(userId, lastName, firstName, email, roleId, schoolId).then(
      (data) => {
        if (data.success) {
          commit('editUser', data.user)
        }
      }
    )
  },
  getSchoolOrgs ({ commit }, { schoolId }) {
    getSchoolOrgs(schoolId).then(
      (data) => {
        if (data.success) {
          commit('setSchoolOrgs', { schoolId: schoolId, orgs: data.orgs })
        }
      }
    )
  },
  toggleExpandedSchool ({ commit }, { schoolId }) {
    commit('toggleExpandedSchool', schoolId)
  }
}
