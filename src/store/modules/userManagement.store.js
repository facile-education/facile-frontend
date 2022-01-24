import store from '@/store'
import {
  getManualUsers, getRoles, createManualUser, editManualUser, removeManualUser, getSchoolOrgs
} from '@/api/userManagement.service'

export const state = {
  isSearchLocked: false,
  manualUserList: [],
  roles: []
}

export const mutations = {
  setManualUserList (state, users) {
    Array.prototype.push.apply(state.manualUserList, users)
  },
  emptyManualUserList (state) {
    state.isSearchLocked = false
    state.manualUserList.length = 0
  },
  setSearchLock (state, payload) {
    state.isSearchLocked = payload
  },
  setRoles (state, roles) {
    state.roles = roles
  },
  addUser (state, user) {
    state.manualUserList.push(user)
  },
  editUser (state, user) {
    const userIndex = state.manualUserList.map(user => user.userId).indexOf(user.userId)
    if (userIndex !== -1) {
      state.manualUserList[userIndex] = user
    }
  },
  removeUser (state, user) {
    const index = state.manualUserList.map(u => u.userId).indexOf(user.userId)
    if (index !== -1) {
      state.manualUserList.splice(index, 1)
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
  getManualUsers ({ commit }, { schoolId, query, pageNb }) {
    getManualUsers(schoolId, query, pageNb).then(
      (data) => {
        if (data.success) {
          commit('setManualUserList', data.users)
          if (data.users.length < 50) {
            commit('setSearchLock', true)
          }
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
  createManualUser ({ commit }, { lastName, firstName, email, roleId, schoolId }) {
    createManualUser(lastName, firstName, email, roleId, schoolId).then(
      (data) => {
        if (data.success) {
          commit('addUser', data.user)
        } else {
          store.dispatch('popups/pushPopup', { type: 'error', message: 'L\'e-mail de cet utilisateur existe déjà dans l\'ENT.' })
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
  removeManualUser ({ commit }, user) {
    removeManualUser(user.userId).then(
      (data) => {
        if (data.success) {
          commit('removeUser', user)
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
