export const state = {
  warningList: []
}

export const mutations = {
  addWarning (state, payload) {
    state.warningList.push(payload)
  },
  removeFirstWarning (state) { // remove the first item of the list
    state.warningList.splice(0, 1)
  }
}

export const actions = {
  addWarning ({ commit }, warning) {
    console.log('add warning store, warning=', warning)
    commit('addWarning', warning)
  },
  removeFirstWarning ({ commit }) {
    commit('removeFirstWarning')
  }
}

export const getters = {
  firstWarning (state) {
    return state.warningList[0]
  },
  isWarningModalDisplayed (state, getters) {
    return getters.firstWarning !== undefined
  }
}
