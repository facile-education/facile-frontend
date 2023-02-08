import { quickSearch } from '@/api/search.service'
import { quickSearchPaginationSize } from '@/constants/appConstants'

export const state = {
  searchInput: '',
  isHistoryOpen: false,
  isQuickSearchResultDisplayed: false,
  quickSearchResults: []
}

export const mutations = {
  setHistoryStatus (state, payload) {
    state.isHistoryOpen = payload
  },
  setQuickSearchResultDisplayed (state, payload) {
    state.isQuickSearchResultDisplayed = payload
  },
  setSearchInput (state, payload) {
    state.searchInput = payload
  },
  setQuickResults (state, payload) {
    state.quickSearchResults = payload
  },
  addQuickResults (state, payload) {
    state.quickSearchResults = state.quickSearchResults.concat(payload)
  }
}

export const actions = {
  openHistory ({ commit }) {
    commit('setHistoryStatus', true)
    commit('setQuickSearchResultDisplayed', false) // Reset search result status if we display history
  },
  closeHistory ({ commit }) {
    commit('setHistoryStatus', false)
  },
  openQuickSearchResultDisplayed ({ commit }) {
    commit('setHistoryStatus', false)
    commit('setQuickSearchResultDisplayed', true)
  },
  closeQuickSearchResultDisplayed ({ commit }) {
    commit('setQuickSearchResultDisplayed', false)
  },
  setSearchInput ({ commit }, query) {
    commit('setSearchInput', query)
  },
  quickSearch ({ commit }, resetResults = true) {
    const start = resetResults ? 0 : state.quickSearchResults.length

    this.dispatch('search/openQuickSearchResultDisplayed', { name: 'getQuickSearch' })
    this.dispatch('currentActions/addAction', { name: 'getQuickSearch' })
    quickSearch(state.searchInput, start, start + quickSearchPaginationSize).then((data) => {
      this.dispatch('currentActions/removeAction', { name: 'getQuickSearch' })
      if (data.success) {
        if (resetResults) {
          commit('setQuickResults', data.results)
        } else {
          commit('addQuickResults', data.results)
        }
      } else {
        console.error('Error while retrieving quickSearchResult')
      }
    })
  }
}
