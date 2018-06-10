export default {
  state: {
    // Type is 'error', 'success' or 'information'
    type: undefined,
    message: ''
  },
  mutations: {
    updateNotification (state, payload) {
      state.type = payload.type
      state.message = payload.message
    }
  },
  actions: {
    getSchoolServices ({ commit, state }, notification) {
      commit('updateNotification', notification)
    }
  },
  getters: {
  }
}
