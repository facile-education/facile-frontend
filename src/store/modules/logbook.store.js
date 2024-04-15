export const state = {
  isFiltersDisplayed: false,
  filterTypeSelected: undefined,
  isLoadAuthorEntries: true
}

export const mutations = {
  setIsFiltersDisplayed (state, value) {
    state.isFiltersDisplayed = value
  },
  setFilterType (state, value) {
    state.filterTypeSelected = value
  },
  setLoadAuthorEntries (state, value) {
    state.isLoadAuthorEntries = value
  }
}

export const actions = {
  displayFilters ({ commit }, value) {
    commit('setIsFiltersDisplayed', value)
  },
  addFilter ({ commit }, value) {
    commit('setFilterType', value)
  },
  handleLoadAuthorEntries ({ commit }, value) {
    commit('setLoadAuthorEntries', value)
  }
}
