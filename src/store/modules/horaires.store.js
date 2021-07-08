import cdtService from '@/api/cdt.service'

export const state = {
  endDate: undefined,
  groupList: undefined,
  selectedGroup: { groupId: 0 },
  selectedUser: { userId: 0 },
  sessionList: [],
  startDate: undefined
}

export const mutations = {
  setDates (state, { start, end }) {
    state.startDate = start
    state.endDate = end
  },
  setGroupList (state, payload) {
    state.groupList = payload
  },
  setSelectedGroup (state, payload) {
    state.selectedGroup = payload
  },
  setSelectedUser (state, payload) {
    state.selectedUser = payload
  },
  setSessionList (state, payload) {
    state.sessionList = payload
  }
}
export const actions = {
  getGroupList ({ commit }, userId) {
    cdtService.getGroups(userId).then(
      (data) => {
        if (data.success) {
          if (data.schools.length === 2) {
            commit('setGroupList', [...data.schools[0].groups, ...data.schools[1].groups])
          } else {
            commit('setGroupList', data.schools[0].groups)
          }
        } else {
          console.error('Cannot get sessions ')
        }
      },
      (err) => {
        // TODO toastr
        console.error(err)
      }
    )
  },
  getSessionList ({ state, commit }) {
    if (state.startDate && state.endDate &&
        (state.selectedUser.userId !== 0 || state.selectedGroup.groupId !== 0)) {
      cdtService.getSessions(state.selectedUser.userId, state.selectedGroup.groupId, state.startDate, state.endDate).then(
        (data) => {
          if (data.success) {
            commit('setSessionList', data.sessions)
          } else {
            console.error('Cannot get sessions ')
          }
        },
        (err) => {
          // TODO toastr
          console.error(err)
        }
      )
    } else if (state.sessionList.length) {
      commit('setSessionList', [])
    }
  },
  selectDates ({ commit, dispatch }, { start, end }) {
    commit('setDates', { start, end })
    dispatch('getSessionList')
  },
  selectGroup ({ commit, dispatch }, group) {
    commit('setSelectedGroup', group)
    dispatch('getSessionList')
  },
  selectUser ({ commit, dispatch }, user) {
    commit('setSelectedUser', user)
    dispatch('getGroupList', user.userId)
    dispatch('getSessionList')
  }
}
