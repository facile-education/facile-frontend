export const state = {
  // current popup format: {message: ""}
  currentPopupList: [] // FIFO
}

export const mutations = {
  pushPopup (state, popup) {
    state.currentPopupList.push(popup)
  },
  popPopup (state) {
    state.currentPopupList.shift()
  }
}

export const actions = {
  pushPopup ({ commit }, action) {
    commit('pushPopup', action)
  },
  popPopup ({ commit }) {
    commit('popPopup')
  }
}
