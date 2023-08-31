export const state = {
  isAContextMenuDisplayed: false,
  isSubMenuDisplay: false,
  askForDeploySubMenu: false,
  contextMenuPosition: {
    x: 0,
    y: 0
  },
  contextMenuOptions: []
}

export const mutations = {
  closeMenus (state) {
    state.isAContextMenuDisplayed = false
    state.isSubMenuDisplay = false
    state.askForDeploySubMenu = false
  },
  updateContextMenuPosition (state, payload) {
    state.isAContextMenuDisplayed = true
    state.contextMenuPosition.x = payload.x
    state.contextMenuPosition.y = payload.y
  },
  updateContextMenuOptions (state, payload) {
    state.contextMenuOptions = payload
  },
  updateIsSubMenuDisplayStatus (state, payload) {
    state.isSubMenuDisplay = payload
  },
  updateAskForDeploySubMenuStatus (state, payload) {
    state.askForDeploySubMenu = payload
  }
}

export const actions = {
  closeMenus ({ commit }) {
    commit('closeMenus')
  },
  openContextMenu ({ commit }, { event, options }) {
    if (!this.state.contextMenu.isAContextMenuDisplayed) {
      event.stopPropagation() // avoid close menu when right click event reach windows element
      commit('updateContextMenuPosition', { x: event.x, y: event.y })
      commit('updateContextMenuOptions', options)
    }
  },
  setContextMenuPosition ({ commit }, { x, y }) {
    commit('updateContextMenuPosition', { x, y })
  },
  setContextMenuOptions ({ commit }, options) {
    commit('updateContextMenuOptions', options)
  },
  setIsSubMenuDisplay ({ commit }, value) {
    commit('updateIsSubMenuDisplayStatus', value)
  },
  setAskForDeploySubMenu ({ commit }, value) {
    commit('updateAskForDeploySubMenuStatus', value)
  }
}
