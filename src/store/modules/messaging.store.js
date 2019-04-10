import messagingService from '@/api/messaging.service'

export default {
  namespaced: true,
  state: {
    messageList: undefined,
    boxList: undefined,
    selectedMessageList: []
  },
  mutations: {
    updateMessageList (state, payload) {
      state.messageList = payload
    },
    updateBoxList (state, payload) {
      state.boxList = payload
    },
    clearSelectedMessageList (state) {
      state.selectedMessageList.splice(0)
    },
    addToMessageSelection (state, payload) {
      if (Array.isArray(payload)) {
        state.selectedMessageList.concat(payload)
      } else {
        state.selectedMessageList.push(payload)
      }
    },
    removeFromMessageSelection (state, payload) {
      var idx = state.selectedMessageList.indexOf(payload)
      state.selectedMessageList.splice(idx, 1)
    }
  },
  actions: {
    initMessageList ({ commit }) {
      return messagingService.getMessageList().then(
        (data) => {
          if (data.success) {
            commit('updateMessageList', data.messages)
          }
          // TODO else toastr
        },
        (err) => {
          // TODO toastr
          console.log(err)
        })
    },
    initBoxList ({ commit }) {
      return messagingService.getBoxList().then(
        (data) => {
          if (data.success) {
            commit('updateBoxList', data.categories)
          }
          // TODO else toastr
        },
        (err) => {
          // TODO toastr
          console.log(err)
        })
    },
    selectMessage ({ commit }, message) {
      commit('clearSelectedMessageList')
      commit('addToMessageSelection', message)
    },
    addToMessageSelection ({ commit }, value) {
      commit('addToMessageSelection', value)
    }
  },
  getters: {
    getCurrentSelectedMessage (state) {
      if (state.selectedMessageList.length > 0) {
        return state.selectedMessageList[0]
      } else {
        return undefined
      }
    }
  }
}
