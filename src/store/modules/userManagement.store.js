import {
  getManualUsers, getAffectedUsers
} from '@/api/userManagement.service'

export const state = {
  isSearchLocked: false,
  manualUserList: [],
  nbItemsPerPage: 20,
  nbTotalResults: 0,
  affectedUsers: []
}

export const mutations = {
  addAffectedUsers (state, users) {
    users.forEach(user => {
      if (user.affectations === undefined) {
        user.affectations = []
      }
    })
    state.affectedUsers = state.affectedUsers.concat(users)
  },
  emptyAffectedUserList (state) {
    state.affectedUsers.length = 0
  },
  addUserAffectation (state, payload) {
    console.log('add payload=', payload)
    const affectation = { orgId: payload.orgId, orgName: payload.orgName }
    // Search user in affectedUsers
    const user = state.affectedUsers.find(affectedUser => affectedUser.userId === payload.userId)
    if (user !== undefined) {
      user.affectations = user.affectations.concat(affectation)
    }
  },
  removeUserAffectation (state, payload) {
    // Search user in affectedUsers
    const user = state.affectedUsers.find(affectedUser => affectedUser.userId === payload.userId)
    if (user !== undefined) {
      const affectationIndex = user.affectations.findIndex(affectation => affectation.orgId === payload.orgId)
      if (affectationIndex !== -1) {
        user.affectations.splice(affectationIndex, 1)
      }
    }
  },
  setManualUserList (state, users) {
    Array.prototype.push.apply(state.manualUserList, users)
  },
  setNbTotalResults (state, nbTotalResults) {
    state.nbTotalResults = nbTotalResults
  },
  addNbTotalResults (state, nbNewUsers) {
    state.nbTotalResults += nbNewUsers
  },
  emptyManualUserList (state) {
    state.isSearchLocked = false
    state.manualUserList.length = 0
  },
  setSearchLock (state, payload) {
    state.isSearchLocked = payload
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
  toggleExpandedSchool (state, payload) {
    const schoolIndex = state.schools.map(school => school.schoolId).indexOf(payload.schoolId)
    if (schoolIndex !== -1) {
      state.schools[schoolIndex].isExpanded = !state.schools[schoolIndex].isExpanded
    }
  }
}

export const actions = {
  getManualUsers ({ commit }, { schoolId, query, pageNb, nbItemsPerPage }) {
    getManualUsers(schoolId, query, pageNb, nbItemsPerPage).then(
      (data) => {
        if (data.success) {
          commit('setManualUserList', data.users)
          if (pageNb === 0) {
            commit('setNbTotalResults', data.nbTotalUsers)
          }
          if (data.users.length < data.nbItemsPerPage) {
            commit('setSearchLock', true)
          }
        }
      }
    )
  },
  getAffectedUsers ({ commit }, { schoolId, query }) {
    getAffectedUsers(schoolId, query).then(
      (data) => {
        if (data.success) {
          commit('addAffectedUsers', data.users)
        }
      }
    )
  },
  addManualUser ({ commit }, user) {
    commit('addUser', user)
    commit('addNbTotalResults', 1)
  },
  editManualUser ({ commit }, user) {
    commit('editUser', user)
  },
  removeManualUser ({ commit }, user) {
    commit('removeUser', user)
    commit('addNbTotalResults', -1)
  },
  addAffectedUsers ({ commit }, users) {
    commit('addAffectedUsers', users)
  },
  addUserAffectation ({ commit }, { userId, orgId, orgName }) {
    commit('addUserAffectation', { userId: userId, orgId: orgId, orgName: orgName })
  },
  removeUserAffectation ({ commit }, { userId, orgId }) {
    commit('removeUserAffectation', { userId: userId, orgId: orgId })
  },
  toggleExpandedSchool ({ commit }, { schoolId }) {
    commit('toggleExpandedSchool', schoolId)
  }
}
