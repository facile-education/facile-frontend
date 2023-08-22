import { getHelpMenu } from '@/api/help.service'

export const state = {
  isHelpModalDisplayed: false,
  isMobileMenuDisplayed: false,
  helpMenu: undefined,
  isSearchResult: false,
  selectedItem: undefined,
  currentArticle: undefined
}

export const mutations = {
  cleanState (state) {
    state.isMobileMenuDisplayed = false
    state.selectedItem = undefined
    state.helpMenu = undefined
  },
  setIsHelpModalDisplayed (state, payload) {
    state.isHelpModalDisplayed = payload
  },
  setIsMobileMenuDisplayed (state, payload) {
    state.isMobileMenuDisplayed = payload
  },
  toggleIsMobileMenuDisplayed (state) {
    state.isMobileMenuDisplayed = !state.isMobileMenuDisplayed
  },
  setHelpMenu (state, payload) {
    state.helpMenu = payload
  },
  setIsSearchResult (state, payload) {
    state.isSearchResult = payload
  },
  setSelectedItem (state, payload) {
    state.selectedItem = payload
  },
  selectItem (state, itemId) {
    if (getters.allMenuItems(state).length > 0) {
      const index = getters.allMenuItems(state).map(item => item.itemId).indexOf(itemId)
      if (index !== -1) {
        state.selectedItem = getters.allMenuItems(state)[index]
      } else {
        console.error('the given item id (' + itemId + ') doesn\'t map an available item in menu')
      }
    } else {
      console.error('No menu item available to select')
    }
  },
  setCurrentArticle (state, payload) {
    state.currentArticle = payload
  }
}

export const actions = {
  openHelpModal ({ commit }) {
    commit('setIsHelpModalDisplayed', true)
  },
  closeHelpModal ({ commit }) {
    commit('setIsHelpModalDisplayed', false)
    commit('cleanState')
  },
  openMobileMenu ({ commit }) {
    commit('setIsMobileMenuDisplayed', true)
  },
  closeMobileMenu ({ commit }) {
    commit('setIsMobileMenuDisplayed', false)
  },
  toggleMobileMenu ({ commit }) {
    commit('toggleIsMobileMenuDisplayed')
  },
  selectDefaultItem ({ commit, state }) {
    // Find the first itemId of helpMenu
    if (getters.allMenuItems(state).length > 0) {
      const firstItemId = getters.allMenuItems(state)[0].itemId
      commit('selectItem', firstItemId)
    } else {
      console.error('No menu item available to select')
    }
  },
  selectItem ({ commit }, itemId) {
    commit('selectItem', itemId)
  },
  refreshCurrentArticle ({ commit }) {
    // Unselect currentItem and re-select it to trigger the refresh
    const currentItem = { ...state.selectedItem }
    commit('setSelectedItem', undefined)
    commit('setSelectedItem', currentItem)
  },
  getHelpMenu ({ commit }, { query, menuEntryId }) {
    this.dispatch('currentActions/addAction', { name: 'getHelpMenu' })
    getHelpMenu(query).then((data) => {
      this.dispatch('currentActions/removeAction', { name: 'getHelpMenu' })
      if (data.success) {
        if (query !== '') {
          commit('setIsSearchResult', true)
          commit('setIsMobileMenuDisplayed', true)
        } else {
          commit('setIsSearchResult', false)
          commit('setIsMobileMenuDisplayed', false)
        }

        let itemIdToSelect
        // Sort categories and items inside category
        data.helpTree.sort((a, b) => { return a.position - b.position })
        data.helpTree.forEach((category) => {
          category.items.sort((a, b) => { return a.position - b.position })

          if (menuEntryId !== undefined && category.menuEntryId === menuEntryId &&
              category.items !== undefined && category.items.length > 0) {
            itemIdToSelect = category.items[0].itemId
          }
        })

        commit('setHelpMenu', data.helpTree)

        if (data.helpTree.length > 0) {
          if (itemIdToSelect !== undefined) {
            commit('selectItem', itemIdToSelect)
          } else {
            this.dispatch('help/selectDefaultItem')
          }
        }
      } else {
        console.error('Error while getting users', data.error)
      }
    }, (err) => {
      console.error(err)
      this.$store.dispatch('currentActions/removeAction', { name: 'getHelpMenu' })
    })
  },
  setSelectedItem ({ commit }, item) {
    commit('setSelectedItem', item)
  },
  setCurrentArticle ({ commit }, article) {
    commit('setCurrentArticle', article)
  }
}

export const getters = {
  allMenuItems (state) {
    if (state.helpMenu) {
      return [].concat(...state.helpMenu.map(category => category.items))
    } else {
      return []
    }
  }
}
