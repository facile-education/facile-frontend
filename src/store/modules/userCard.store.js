export const state = {
  userToDisplay: undefined
}

export const mutations = {
  setUserToDisplay (state, user) {
    state.userToDisplay = user
  }
}

export const actions = {
  initUserCard ({ commit }, user) {
    commit('setUserToDisplay', user)
  }
}
