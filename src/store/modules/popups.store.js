const maxPopupInTime = 5

const generateUniquePopupId = () => { return Math.floor(Math.random() * 10000) + 1 } // Because lot of time messages are the same

export const state = {
  // current popup format: {message: "", type: "['success', 'info', 'warning', 'error']"}
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
    action.popupId = generateUniquePopupId()

    if (this.state.popups.currentPopupList.length === maxPopupInTime) {
      commit('popPopup')
    }

    commit('pushPopup', action)
  },
  popPopup ({ commit }) {
    commit('popPopup')
  }
}
