import dayjs from 'dayjs'

import { setHomeworkDoneStatus } from '@/api/homework.service'
import scheduleService from '@/api/schedule.service'

export const state = {
  isConfigurationLoaded: false,
  startDate: dayjs(),
  endDate: dayjs().add(1, 'day'),
  isLoading: false,
  homeworkList: [],
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
  setHomeworkList (state, payload) {
    state.homeworkList = payload
  },
  setSessionList (state, payload) {
    state.sessionList = payload
  },
  setSelectedSession (state, payload) {
    state.selectedSession = payload
  },
  setCreateSessionModalDisplayed (state, payload) {
    state.isCreateSessionModalDisplayed = payload
  },
  updateHomeworkDoneStatus (state, { homeworkId, isDone }) {
    const index = state.homeworkList.map(homework => homework.homeworkId).indexOf(homeworkId)
    if (index !== -1) {
      state.homeworkList[index].isDone = isDone
    }
  }
}
export const actions = {
  getSessionList ({ state, commit, rootState }) {
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
  selectSession ({ commit }, session) {
    commit('setSelectedSession', session)
  },
  selectDates ({ commit, dispatch }, { start, end }) {
    commit('setDates', { start, end })
    dispatch('getSessionList')
  },
  setCreateSessionModalDisplayed ({ commit }, isDisplayed) {
    commit('setCreateSessionModalDisplayed', isDisplayed)
  },
  setHomeworkDone ({ commit }, { homeworkId, isDone }) {
    setHomeworkDoneStatus(homeworkId, isDone).then(
      (data) => {
        if (data.success) {
          commit('updateHomeworkDoneStatus', { homeworkId, isDone })
        }
      },
      (err) => {
        // TODO toastr
        console.error(err)
      }
    )
  }
}
