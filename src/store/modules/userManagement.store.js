import {
  getAffectedUsers,
  getManualUsers
} from '@/api/userManagement.service'

export const state = {
  isSearchLocked: false,
  manualUserList: undefined,
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
  setUserAffectations (state, payload) {
    // Search user in affectedUsers
    const user = state.affectedUsers.find(affectedUser => affectedUser.userId === payload.userId)
    if (user !== undefined) {
      user.affectations = payload.affectations
    }
  },
  setManualUserList (state, users) {
    if (!state.manualUserList) {
      state.manualUserList = []
    }
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
    state.manualUserList = undefined
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
    this.dispatch('currentActions/addAction', { name: 'loadUsers' })
    getManualUsers(schoolId, query, pageNb, nbItemsPerPage).then((data) => {
      this.dispatch('currentActions/removeAction', { name: 'loadUsers' })
      if (data.success) {
        commit('setManualUserList', data.users)
        if (pageNb === 0) {
          commit('setNbTotalResults', data.nbTotalUsers)
        }
        if (data.users.length < nbItemsPerPage) {
          commit('setSearchLock', true)
        }
      }
    }, (err) => {
      console.error(err)
      this.dispatch('currentActions/removeAction', { name: 'loadUsers' })
    })
  },
  getAffectedUsers ({ commit }, { schoolId, query }) {
    this.dispatch('currentActions/addAction', { name: 'loadUsers' })
    getAffectedUsers(schoolId, query).then((data) => {
      this.dispatch('currentActions/removeAction', { name: 'loadUsers' })
      if (data.success) {
        commit('addAffectedUsers', data.users)
      }
    }, (err) => {
      console.error(err)
      this.dispatch('currentActions/removeAction', { name: 'loadUsers' })
    })
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
  setUserAffectations ({ commit }, { userId, affectations }) {
    commit('setUserAffectations', { userId, affectations })
  },
  toggleExpandedSchool ({ commit }, { schoolId }) {
    commit('toggleExpandedSchool', schoolId)
  }
}
