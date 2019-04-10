import forumsService from '@/api/forums.service'

export default {
  namespaced: true,
  state: {
    forumList: undefined,
    selectedForumIndex: -1,
    entryList: undefined
  },
  mutations: {
    initForumList (state, payload) {
      state.forumList = payload
    },
    updateEntryList (state, payload) {
      state.entryList = payload
    }
  },
  actions: {
    initForumList ({ commit }) {
      return forumsService.getForumList().then(
        (data) => {
          if (data.success) {
            commit('initForumList', data.forumList)
          }
          // TODO else toastr
        },
        (err) => {
          // TODO toastr
          console.log(err)
        })
    },
    getForumEntryList ({ commit }) {
      return forumsService.getEntryList().then(
        (data) => {
          if (data.success) {
            commit('updateEntryList', data.entities)
          }
          // TODO else toastr
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
