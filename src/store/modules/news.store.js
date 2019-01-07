import newsService from '@/api/news.service'

export default {
  namespaced: true,
  state: {
    editedNews: undefined,
    isNewsEditionModalDisplayed: false,
    newsList: undefined,
    newsHMList: undefined
  },
  mutations: {
    hideWidgetEditionModalDisplayed (state) {
      state.isNewsEditionModalDisplayed = false
    },
    showWidgetEditionModalDisplayed (state, payload) {
      state.editedNews = payload
      state.isNewsEditionModalDisplayed = true
    },
    updateNewsList (state, payload) {
      state.newsList = payload
    },
    updateNewsHMList (state, payload) {
      state.newsHMList = payload
    }
  },
  actions: {
    getNewsList ({ commit }, isHeadMaster) {
      newsService.getNewsList(isHeadMaster, 0, 10).then(
        (data) => {
          if (data.success) {
            console.log(data, isHeadMaster)
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
    openEditionModal ({ commit }, editedNews) {
      commit('showWidgetEditionModalDisplayed', editedNews)
    }
  },
  getters: {
  }
}
