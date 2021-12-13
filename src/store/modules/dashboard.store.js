import {
  initDashboard, getGroupActivities
} from '@/api/dashboard.service'
import {
  getSchoolNews, addNews, editNews
} from '@/api/news.service'

export const state = {
  hasGroupNewsWidget: false,
  hasHomeworkWidget: false,
  hasEDTWidget: false,
  hasSchoolNewsWidget: false,
  hasMyGroupsOnly: false,
  canAddGroupNews: false,
  canAddSchoolNews: false,
  canDelegateHM: false,
  isNewsModalDisplayed: false,
  groupActivities: [],
  editedNews: {},
  schoolNews: [],
  homeworks: [],
  schedule: []
}

export const mutations = {
  initDashboard (state, payload) {
    state.hasHomeworkWidget = payload.hasHomeworkWidget
    state.hasEDTWidget = payload.hasEDTWidget
    state.hasSchoolNewsWidget = payload.hasSchoolNewsWidget
    state.hasMyGroupsOnly = payload.hasMyGroupsOnly
    state.hasGroupNewsWidget = true
    state.canAddGroupNews = payload.canAddGroupNews
    state.canAddSchoolNews = payload.canAddHMNews
    state.canDelegateHM = payload.canDelegateHM
  },
  addGroupNews (state, payload) {
    for (let idx = 0; idx < payload.length; ++idx) {
      state.groupActivities.push(payload[idx])
    }
  },
  addSchoolNews (state, payload) {
    for (let idx = 0; idx < payload.length; ++idx) {
      state.schoolNews.push(payload[idx])
    }
  },
  openNewsModal (state, payload) {
    state.isNewsModalDisplayed = true
  },
  setEditedNews (state, payload) {
    state.editedNews = payload
  }
}

export const actions = {
  initDashboard ({ commit }) {
    initDashboard().then(
      (data) => {
        if (data.success) {
          commit('initDashboard', data)
        }
      },
      (err) => {
        console.error(err)
      })
  },
  getGroupActivities ({ commit }, { startIndex, endIndex }) {
    getGroupActivities(startIndex, endIndex).then(
      (data) => {
        if (data.success) {
          commit('addGroupNews', data.activities)
        }
      },
      (err) => {
        console.error(err)
      })
  },
  getSchoolNews ({ commit }, { startIndex, endIndex }) {
    getSchoolNews(startIndex, endIndex).then(
      (data) => {
        if (data.success) {
          commit('addSchoolNews', data.news)
        }
      },
      (err) => {
        console.error(err)
      })
  },
  openNewsModal ({ commit }, { news }) {
    commit('openNewsModal', news)
  },
  setEditedNews ({ commit }, { news }) {
    commit('setEditedNews', news)
  },
  addNews ({ commit }, { title, content, isSchoolNews, isHighPriority, imageId, releaseDateStr, expirationDateStr, populationStr, attachFilesStr }) {
    addNews(title, content, isSchoolNews, isHighPriority, imageId, releaseDateStr, expirationDateStr, populationStr, attachFilesStr).then(
      (data) => {
        if (data.success) {
          commit('addGroupNews', [data.newsCreated])
        }
      },
      (err) => {
        console.error(err)
      })
  },
  editNews ({ commit }, { blogEntryInfoId, title, content, isSchoolNews, isHighPriority, imageId, releaseDateStr, expirationDateStr, populationStr, existingAttachFilesStr, newAttachFilesStr }) {
    editNews(blogEntryInfoId, title, content, isSchoolNews, isHighPriority, imageId, releaseDateStr, expirationDateStr, populationStr, existingAttachFilesStr, newAttachFilesStr).then(
      (data) => {
        if (data.success) {
          commit('addGroupNews', data.news)
        }
      },
      (err) => {
        console.error(err)
      })
  }
}
