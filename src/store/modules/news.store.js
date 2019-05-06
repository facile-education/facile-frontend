import newsService from '@/api/news.service'
import Vue from 'vue'
import moment from 'moment'

export default {
  namespaced: true,
  state: {
    delegateList: undefined,
    delegationCandidateList: undefined,
    isDelegationModalDisplayed: false,
    isNewsEditionModalDisplayed: false,
    isNewsModalDisplayed: false,
    newsList: undefined,
    newsHMList: undefined,
    selectedNews: undefined
  },
  mutations: {
    addToDelegateList (state, payload) {
      state.delegateList.push(payload)
    },
    initDelegateList (state, payload) {
      state.delegateList = payload
    },
    initDelegationCandidateList (state, payload) {
      state.delegationCandidateList = payload
    },
    getSelectedNewsGroupList (state, payload) {
      if (state.selectedNews !== undefined) {
        Vue.set(state.selectedNews, 'broadcastedGroups', payload)
      }
    },
    hideNewsEditionModal (state) {
      state.isNewsEditionModalDisplayed = false
    },
    hideNewsModal (state) {
      state.isNewsModalDisplayed = false
    },
    setSelectedNews (state, payload) {
      state.selectedNews = payload
    },
    showNewsEditionModal (state) {
      state.isNewsEditionModalDisplayed = true
    },
    showNewsModal (state, payload) {
      state.isNewsModalDisplayed = true
    },
    updateDelegationModalStatus (state, payload) {
      state.isDelegationModalDisplayed = payload
    },
    updateNewsList (state, payload) {
      state.newsList = payload
    },
    updateNewsHMList (state, payload) {
      state.newsHMList = payload
    },
    removeFromDelegateList (state, payload) {
      var delegateIndex = state.delegateList.indexOf(payload)
      if (delegateIndex > -1) {
        state.delegateList.splice(delegateIndex, 1)
      }
    }
  },
  actions: {
    closeDelegationModal ({ commit }) {
      commit('updateDelegationModalStatus', false)
    },
    closeEditionModal ({ commit }) {
      commit('hideNewsEditionModal')
    },
    closeNewsModal ({ commit }) {
      commit('hideNewsModal')
    },
    getDelegateList ({ commit }) {
      newsService.getDelegateList().then(
        (data) => {
          if (data.success) {
            commit('initDelegateList', data.usersToDelegate)
          }
        },
        (err) => {
          // TODO toastr
          console.log(err)
        })
    },
    getNewsList ({ commit }, isHeadMaster) {
      newsService.getNewsList(isHeadMaster, 0, 10).then(
        (data) => {
          if (data.success) {
            if (isHeadMaster) {
              commit('updateNewsHMList', data.newsHM)
            } else {
              commit('updateNewsList', data.newsGroup)
            }
          }
        },
        (err) => {
          // TODO toastr
          console.log(err)
        })
    },
    getSelectedNewsGroupList ({ commit }, newsId) {
      newsService.getNewsBroadcastedGroups(newsId).then(
        (data) => {
          if (data.success) {
            commit('getSelectedNewsGroupList', data.broadcastedGroups)
          }
        },
        (err) => {
          // TODO toastr
          console.log(err)
        })
    },
    getDelegationCandidateList ({ commit }) {
      newsService.getDelegationCandidateList().then(
        (data) => {
          if (data.success) {
            commit('initDelegationCandidateList', data.usersPerSchool)
          }
        },
        (err) => {
          // TODO toastr
          console.log(err)
        })
    },
    openDelegationModal ({ commit }) {
      commit('updateDelegationModalStatus', true)
    },
    openEditionModal ({ commit }, selectedNews) {
      commit('showNewsEditionModal', selectedNews)
    },
    openNewsModal ({ commit }, selectedNews) {
      commit('showNewsModal', selectedNews)
    },
    selectEmptyNews ({ commit }) {
      commit('setSelectedNews', {
        author: '',
        attachFiles: [],
        date: '',
        content: '',
        ellipsise: '',
        expireDate: moment().add(1, 'months').format('DD/MM/YYYY HH:mm'),
        isActive: true,
        isAuthor: true,
        isEditor: true,
        isHighPrio: false,
        isPrio: false,
        releaseDate: moment().format('DD/MM/YYYY HH:mm'),
        title: '',
        thumbnail: {}
      })
    },
    updateDelegateList ({ commit, state }) {
      newsService.updateDelegateList(state.delegateList).then(
        (data) => {
          if (data.success) {
            commit('updateDelegationModalStatus', false)
          }
        },
        (err) => {
          // TODO toastr
          console.log(err)
        })
    }
  },
  getters: {
  }
}
