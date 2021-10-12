
export const state = {
  isAContextMenuDisplayed: false,
  contextMenuPosition: {
    x: 0,
    y: 0
  },
  contextMenuOptions: []
}

export const mutations = {
  closeMenus (state) {
    state.isAContextMenuDisplayed = false
  },
  updateContextMenuPosition (state, payload) {
    state.isAContextMenuDisplayed = true
    state.contextMenuPosition.x = payload.x
    state.contextMenuPosition.y = payload.y
  },
  updateContextMenuOptions (state, payload) {
    state.contextMenuOptions = payload
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
  }
}
