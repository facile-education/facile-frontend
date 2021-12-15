import {
  initDashboard, getGroupActivities
} from '@/api/dashboard.service'
import {
  getSchoolNews, addNews, editNews, deleteNews
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
  editedNews: undefined,
  schoolNews: [],
  homeworks: []
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
    // payload is the blogEntryId
    let newsIndex = state.groupActivities.map(activity => activity.blogEntryId).indexOf(payload.news.blogEntryId)
    if (newsIndex !== -1) {
      state.editedNews = state.groupActivities[newsIndex]
    } else {
      newsIndex = state.schoolNews.map(news => news.blogEntryId).indexOf(payload.news.blogEntryId)
      if (newsIndex !== -1) {
        state.editedNews = state.schoolNews[newsIndex]
      }
    }
  },
  deleteNews (state, payload) {
    let newsIndex
    if (payload.isGroupNews) {
      newsIndex = state.groupActivities.map(activity => activity.blogEntryId).indexOf(payload.blogEntryId)
      if (newsIndex !== -1) {
        state.groupActivities.splice(newsIndex, 1)
      }
    } else {
      newsIndex = state.schoolNews.map(news => news.blogEntryId).indexOf(payload.blogEntryId)
      if (newsIndex !== -1) {
        state.schoolNews.splice(newsIndex, 1)
      }
    }
  },
  setNewsDetails (state, payload) {
    let newsIndex = state.groupActivities.map(activity => activity.blogEntryId).indexOf(payload.news.blogEntryId)
    if (newsIndex !== -1) {
      state.groupActivities[newsIndex].groups = payload.groups
      state.groupActivities[newsIndex].attachFiles = payload.attachFiles
      if (payload.doSetEditedNews) {
        state.editedNews = state.groupActivities[newsIndex]
      }
    } else {
      newsIndex = state.schoolNews.map(news => news.blogEntryId).indexOf(payload.news.blogEntryId)
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
  setEditedNews ({ commit }, { blogEntryId }) {
    commit('setEditedNews', blogEntryId)
  },
  addNews ({ commit, dispatch }, { title, content, isSchoolNews, isHighPriority, imageId, releaseDateStr, expirationDateStr, populationStr, attachFilesStr }) {
    addNews(title, content, isSchoolNews, isHighPriority, imageId, releaseDateStr, expirationDateStr, populationStr, attachFilesStr).then(
      (data) => {
        if (data.success) {
          commit('addGroupNews', [data.newsCreated])
          dispatch('getGroupActivities', 0, 10)
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
  },
  deleteNews ({ commit }, { blogEntryId, isGroupNews }) {
    deleteNews(blogEntryId).then(
      (data) => {
        if (data.success) {
          commit('deleteNews', blogEntryId, isGroupNews)
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
