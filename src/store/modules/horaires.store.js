import cdtService from '@/api/cdt.service'
import groupService from '@/api/groups.service'

const defaultGroup = { groupId: 0, groupName: 'Groupe' }

export const state = {
  endDate: undefined,
  groupList: undefined,
  isLoading: false,
  selectedGroup: defaultGroup,
  selectedUser: { userId: 0 },
  sessionList: [],
  startDate: undefined,
  isCreateSessionModalDisplayed: false
}

export const mutations = {
  endLoading (state) {
    state.isLoading = false
  },
  loading (state) {
    state.isLoading = true
  },
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
  },
  setCreateSessionModalDisplayed (state, payload) {
    state.isCreateSessionModalDisplayed = payload
  }
}
export const actions = {
  getGroupList ({ commit, rootState }) {
    commit('loading')
    groupService.getUserGroups((rootState.user.selectedSchool.schoolId !== undefined) ? rootState.user.selectedSchool.schoolId : 0, true, false, false).then(
      (data) => {
        if (data.success) {
          commit('setGroupList', data.groups)
        }
        commit('endLoading')
      },
      (err) => {
        commit('endLoading')
        // TODO toastr
        console.error(err)
      }
    )
  },
  getSessionList ({ state, commit, rootState }) {
    if (state.startDate && state.endDate &&
        (state.selectedUser.userId !== 0 ||
          state.selectedGroup.groupId !== 0 ||
          (rootState.user.selectedChild !== undefined && rootState.user.selectedChild.userId !== 0) ||
          (rootState.user.isStudent))) {
      commit('loading')
      let targetUserId = 0
      if (rootState.user.isStudent) {
        targetUserId = rootState.user.userId
      } else if (rootState.user.selectedChild !== undefined && rootState.user.selectedChild.userId !== 0) {
        targetUserId = rootState.user.selectedChild.userId
      } else {
        targetUserId = state.selectedUser.userId
      }
      cdtService.getSessions(targetUserId, state.selectedGroup.groupId, state.startDate, state.endDate).then(
        (data) => {
          if (data.success) {
            commit('setSessionList', [...data.sessions, ...data.schoollifeSessions])
          }
          commit('endLoading')
        },
        (err) => {
          commit('endLoading')
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
    commit('setSelectedUser', { userId: 0 })
    if (group.groupId !== undefined) {
      commit('setSelectedGroup', group)
      dispatch('getSessionList')
    } else {
      // Happens when new school is selected
      commit('setSelectedGroup', defaultGroup)
    }
  },
  selectUser ({ commit, dispatch }, user) {
    commit('setSelectedGroup', defaultGroup)
    commit('setSelectedUser', user)
    dispatch('getSessionList')
  },
  setCreateSessionModalDisplayed ({ commit }, isDisplayed) {
    commit('setCreateSessionModalDisplayed', isDisplayed)
  }
}
