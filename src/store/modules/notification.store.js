// Toastr store
export default {
  namespaced: true,
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
  actions: {},
  getters: {
  }
}
