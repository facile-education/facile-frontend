export const state = {
  // current format of action: {name: ""}
  currentActionsList: []
}

export const mutations = {
  addAction (state, payload) {
    state.currentActionsList.push(payload)
  },
  removeAction (state, actionName) {
    for (let i = 0; i < state.currentActionsList.length; ++i) {
      if (state.currentActionsList[i].name === actionName) {
        state.currentActionsList.splice(i, 1)
        break
      }
    }
  }
}

export const actions = {
  addAction ({ commit }, action) {
    commit('addAction', action)
  },
  removeAction ({ commit }, action) {
    commit('removeAction', action.name)
  }
}

export const getters = {
  areActionsInProgress (state) {
    return state.currentActionsList.length !== 0
  },
  isInProgress: (state) => (actionName) => {
    for (let i = 0; i < state.currentActionsList.length; ++i) {
      if (state.currentActionsList[i].name === actionName) {
        return true
      }
    }
    return false
  }
}
