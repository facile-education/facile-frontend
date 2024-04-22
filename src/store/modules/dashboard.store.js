import { getFullName } from '@utils/commons.util'
import dayjs from 'dayjs'

import { DATE_EXCHANGE_FORMAT } from '@/api/constants.js'
import { initDashboard } from '@/api/dashboard.service'

export const state = {
  hasActivityThreadWidget: false,
  hasHomeworkWidget: false,
  hasEDTWidget: false,
  hasDiaryWidget: false,
  hasSchoolNewsWidget: false,
  hasStatisticWidget: false,
  canAddGroupNews: undefined,
  canAddSchoolNews: undefined,
  canAddEvents: undefined,
  isNewsModalDisplayed: false,
  currentSession: undefined,
  editedNews: undefined,
  schoolNews: [],
  homeworks: [],
  childList: []
}

export const mutations = {
  initDashboard (state, payload) {
    state.hasHomeworkWidget = payload.hasHomeworkWidget
    state.hasEDTWidget = payload.hasEDTWidget
    state.hasDiaryWidget = payload.hasDiaryWidget
    state.hasSchoolNewsWidget = payload.hasSchoolNewsWidget
    state.hasActivityThreadWidget = payload.hasActivityThreadWidget
    state.hasStatisticWidget = payload.hasStatisticWidget
    state.canAddGroupNews = payload.canAddGroupNews
    state.canAddSchoolNews = payload.canAddSchoolNews
    state.canAddEvents = payload.canAddEvents
    state.currentSession = payload.currentSession
    if (payload.children) {
      payload.children.forEach((child) => {
        child.fullName = getFullName(child)
      })
      state.childList = payload.children
    }
  }
}

export const actions = {
  initDashboard ({ commit }) {
    return new Promise((resolve, reject) => {
      initDashboard().then((data) => {
        if (data.success) {
          resolve()
          commit('initDashboard', data)

          // If there is a current session, recall the init dashboard WS at the end of the session to refresh interface
          if (data.currentSession) {
            const timeBeforeSessionEnd = dayjs(data.currentSession.endDate, DATE_EXCHANGE_FORMAT).diff(dayjs(), 'millisecond')
            if (timeBeforeSessionEnd > 0) { // Prevent infinite calls if the result is <=0
              setTimeout(() => {
                this.dispatch('dashboard/initDashboard')
              }, timeBeforeSessionEnd + 30000) // Wait the next half-minute to reload
            }
          } else if (data.nextSession) {
            const timeBeforeSessionStart = dayjs(data.nextSession.startDate, DATE_EXCHANGE_FORMAT).diff(dayjs(), 'millisecond')
            if (timeBeforeSessionStart > 0) { // Prevent infinite calls if the result is <=0
              setTimeout(() => {
                this.dispatch('dashboard/initDashboard')
              }, timeBeforeSessionStart + 30000) // Wait the next half-minute to reload
            }
          }
        }
      }, (err) => {
        reject(err)
        console.error(err)
      })
    })
  }
}
