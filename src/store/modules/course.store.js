import dayjs from 'dayjs'

import { deleteSessionContent, getSessionContents, getSessionDetails } from '@/api/course.service'
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
  selectedCourse: undefined,
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
  setSelectedCourse (state, payload) {
    state.selectedCourse = payload
  },
  setCreateSessionModalDisplayed (state, payload) {
    state.isCreateSessionModalDisplayed = payload
  },
  updateContent (state, payload) {
    state.selectedSession.sessionContent = payload
  },
  updateDetails (state, payload) {
    state.selectedSession = { ...state.selectedSession, ...payload }
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
    const details = getSessionDetails(session.sessionId)
    const content = getSessionContents(session.sessionId)

    Promise.all([details, content]).then(([detailsData, contentData]) => {
      if (detailsData.success && contentData.success) {
        session = {
          ...session,
          ...detailsData.sessionDetails,
          sessionContent: contentData
        }
        commit('setSelectedSession', session)
      }
    },
    (err) => {
      // TODO toastr
      console.error(err)
    })
  },
  setSelectedCourse ({ commit }, course) {
    commit('setSelectedCourse', course)
  },
  unselectSession ({ commit }) {
    commit('setSelectedSession', undefined)
  },
  updateSessionContent ({ commit, state }) {
    getSessionContents(state.selectedSession.sessionId).then((data) => {
      if (data.success) {
        commit('updateContent', {
          blocks: data.blocks,
          title: data.title,
          isDraft: data.isDraft,
          publicationDate: data.publicationDate
        })
      }
    },
    (err) => {
      // TODO toastr
      console.error(err)
    })
  },
  deleteSessionContent ({ commit, state }) {
    deleteSessionContent(state.selectedSession.sessionId).then((data) => {
      if (data.success) {
        this.dispatch('course/updateSessionContent')
        // commit('updateContent', {
        //   blocks: [],
        //   title: undefined,
        //   isDraft: undefined,
        //   publicationDate: undefined
        // })
      }
    },
    (err) => {
      // TODO toastr
      console.error(err)
    })
  },
  updateSessionDetails ({ commit, state }) {
    getSessionDetails(state.selectedSession.sessionId).then((data) => {
      if (data.success) {
        commit('updateDetails', data.sessionDetails)
      }
    },
    (err) => {
      // TODO toastr
      console.error(err)
    })
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
