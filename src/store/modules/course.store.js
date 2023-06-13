import scheduleService from '@/api/schedule.service'
import dayjs from 'dayjs'
export const state = {
  isConfigurationLoaded: false,
  startDate: dayjs(),
  endDate: dayjs().add(1, 'day'),
  isLoading: false,
  sessionList: [],
  selectedSession: undefined,
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
    state.isConfigurationLoaded = true
  },
  setSessionList (state, payload) {
    state.sessionList = payload
  },
  setSelectedSession (state, payload) {
    state.selectedSession = payload
  },
  setCreateSessionModalDisplayed (state, payload) {
    state.isCreateSessionModalDisplayed = payload
  }
}
export const actions = {
  getSessionList ({ state, commit, rootState }) {
    console.log('getSessionList')
    commit('loading')
    let targetUserId = 0
    if (rootState.user.selectedChild !== undefined && rootState.user.selectedChild.userId !== 0) {
      targetUserId = rootState.user.selectedChild.userId
    } else {
      targetUserId = rootState.user.userId
    }
    if (targetUserId !== 0) {
      scheduleService.getUserSessions(targetUserId, state.startDate, state.endDate).then(
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
    } else {
      scheduleService.getGroupSessions(state.selectedGroup.groupId, state.startDate, state.endDate).then(
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
    }
  },
  selectSession ({ commit, dispatch }, session) {
    commit('setSelectedSession', session)
  },
  selectDates ({ commit, dispatch }, { start, end }) {
    commit('setDates', { start, end })
    dispatch('getSessionList')
  },
  setCreateSessionModalDisplayed ({ commit }, isDisplayed) {
    commit('setCreateSessionModalDisplayed', isDisplayed)
  }
}
