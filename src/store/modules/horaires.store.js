import scheduleService from '@/api/schedule.service'
import groupService from '@/api/groups.service'
import i18n from '@/i18n'

const defaultGroup = { groupId: 0, groupName: 'Groupe' }
const manageSessionsOptions = (sessions) => {
  sessions.forEach(event => {
    event.options = []
    if (event.canSaveTeacherSubstitute) {
      event.options.push({
        name: 'saveTeacherSubstitute',
        label: i18n.global.t('CalendarEventOptions.saveTeacherSubstitute'),
        icon: require('@/assets/icons/pencil.svg')
      })
    }
  })
}

export const state = {
  startDate: undefined,
  endDate: undefined,
  groupList: undefined,
  isLoading: false,
  selectedGroup: defaultGroup,
  selectedUser: { userId: 0 },
  sessionList: [],
  isCreateSessionModalDisplayed: false,
  configuration: undefined
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
  },
  setConfiguration (state, payload) {
    state.configuration = payload
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
      if (targetUserId !== 0) {
        scheduleService.getUserSessions(targetUserId, state.startDate, state.endDate).then(
          (data) => {
            if (data.success) {
              const sessions = [...data.sessions, ...data.schoollifeSessions]
              manageSessionsOptions(sessions)
              commit('setSessionList', sessions)
            }
            commit('endLoading')
          },
          (err) => {
            commit('endLoading')
            // TODO toastr
            console.error(err)
          }
        )
      } else {
        scheduleService.getGroupSessions(state.selectedGroup.groupId, state.startDate, state.endDate).then(
          (data) => {
            if (data.success) {
              const sessions = [...data.sessions, ...data.schoollifeSessions]
              manageSessionsOptions(sessions)
              commit('setSessionList', sessions)
            }
            commit('endLoading')
          },
          (err) => {
            commit('endLoading')
            // TODO toastr
            console.error(err)
          }
        )
      }
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
  },
  getConfiguration ({ commit, dispatch }) {
    scheduleService.getConfiguration().then(
      (data) => {
        if (data.success) {
          commit('setConfiguration', data.configuration)
          commit('setDates', { startDate: data.startDate, endDate: data.endDate })
        } else {
          console.error('Cannot get cdt config')
        }
      },
      (err) => {
        // TODO toastr
        console.error(err)
      }
    )
  }
}
