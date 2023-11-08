import { getFullName } from '@utils/commons.util'

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
        }
      }, (err) => {
        reject(err)
        console.error(err)
      })
    })
  }
}
