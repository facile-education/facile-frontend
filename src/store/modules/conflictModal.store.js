export const state = {
  conflictList: []
}

export const mutations = {
  addConflict (state, payload) {
    state.conflictList.push(payload)
  },
  removeFirstConflict (state) { // remove the first item of the list
    state.conflictList.splice(0, 1)
  }
}

export const actions = {
  addConflict ({ commit }, conflict) {
    commit('addConflict', conflict)
  },
  removeFirstConflict ({ commit }) {
    commit('removeFirstConflict')
  }
}

export const getters = {
  firstConflict (state) {
    return state.conflictList[0]
  },
  isConflictModalDisplayed (state, getters) {
    return getters.firstConflict !== undefined
  }
}
