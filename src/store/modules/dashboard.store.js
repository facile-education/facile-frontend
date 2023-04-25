import {
  initDashboard, getGroupActivities
} from '@/api/dashboard.service'
import {
  getSchoolNews, addNews, editNews, deleteNews
} from '@/api/dashboard/news.service'
import { nbActivityPerPage } from '@/constants/activityConstants'
import dayjs from 'dayjs'
import { getFullName } from '@utils/commons.util'

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
  groupActivities: [],
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
    // payload is the newsId
    let newsIndex = state.groupActivities.map(activity => activity.newsId).indexOf(payload.news.newsId)
    if (newsIndex !== -1) {
      state.editedNews = state.groupActivities[newsIndex]
    } else {
      newsIndex = state.schoolNews.map(news => news.newsId).indexOf(payload.news.newsId)
      if (newsIndex !== -1) {
        state.editedNews = state.schoolNews[newsIndex]
      }
    }
  },
  deleteNews (state, payload) {
    let newsIndex
    if (payload.isGroupNews) {
      newsIndex = state.groupActivities.map(activity => activity.newsId).indexOf(payload.newsId)
      if (newsIndex !== -1) {
        state.groupActivities.splice(newsIndex, 1)
      }
    } else {
      newsIndex = state.schoolNews.map(news => news.newsId).indexOf(payload.newsId)
      if (newsIndex !== -1) {
        state.schoolNews.splice(newsIndex, 1)
      }
    }
  },
  setNewsDetails (state, payload) {
    let newsIndex = state.groupActivities.map(activity => activity.newsId).indexOf(payload.news.newsId)
    if (newsIndex !== -1) {
      state.groupActivities[newsIndex].groups = payload.groups
      state.groupActivities[newsIndex].attachFiles = payload.attachFiles
      if (payload.doSetEditedNews) {
        state.editedNews = state.groupActivities[newsIndex]
      }
    } else {
      newsIndex = state.schoolNews.map(news => news.newsId).indexOf(payload.news.newsId)
      if (newsIndex !== -1) {
        state.schoolNews[newsIndex].groups = payload.groups
        state.schoolNews[newsIndex].attachFiles = payload.attachFiles
        if (payload.doSetEditedNews) {
          state.editedNews = state.schoolNews[newsIndex]
        }
      }
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
  },
  getGroupActivities ({ commit }, { maxDate, nbActivities }) {
    getGroupActivities(maxDate, nbActivities).then(
      (data) => {
        if (data.success) {
          commit('addGroupNews', data.activities)
        }
      },
      (err) => {
        console.error(err)
      })
  },
  getSchoolNews ({ commit }, { maxDate, nbNews, importantOnly, unreadOnly }) {
    getSchoolNews(maxDate, nbNews, importantOnly, unreadOnly).then(
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
  setEditedNews ({ commit }, { newsId }) {
    commit('setEditedNews', newsId)
  },
  addNews ({ commit, dispatch }, { title, content, isSchoolNews, isImportant, imageId, publicationDate, expirationDate, population, attachFiles }) {
    addNews(title, content, isSchoolNews, isImportant, imageId, publicationDate, expirationDate, population, attachFiles).then(
      (data) => {
        if (data.success) {
          commit('addGroupNews', [data.newsCreated])
          dispatch('getGroupActivities', { maxDate: dayjs().format('YYYY-MM-DD HH:mm'), nbActivities: nbActivityPerPage })
        }
      },
      (err) => {
        console.error(err)
      })
  },
  editNews ({ commit }, { newsId, title, content, isSchoolNews, isImportant, imageId, publicationDate, expirationDate, population, attachFiles }) {
    editNews(newsId, title, content, isSchoolNews, isImportant, imageId, publicationDate, expirationDate, population, attachFiles).then(
      (data) => {
        if (data.success) {
          commit('addGroupNews', data.news)
        }
      },
      (err) => {
        console.error(err)
      })
  },
  deleteNews ({ commit }, { newsId, isGroupNews }) {
    deleteNews(newsId).then(
      (data) => {
        if (data.success) {
          commit('deleteNews', newsId, isGroupNews)
        }
      },
      (err) => {
        console.error(err)
      })
  },
  setNewsDetails ({ commit }, { news, groups, attachFiles, doSetEditedNews }) {
    commit('setNewsDetails', { news: news, groups: groups, attachFiles: attachFiles, doSetEditedNews: doSetEditedNews })
  }
}
