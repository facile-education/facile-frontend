// All the states common to the application

export const state = {
  draggedEntities: [],
  isThereDocumentDrag: false,
  nbOpenModals: 0
}

export const mutations = {
  addDraggedEntities (state, payload) {
    state.draggedEntities.push(...payload)
  },
  removeDraggedEntities (state) {
    state.draggedEntities = []
  },
  toggleDraggedEntity (state, payload) {
    state.isThereDocumentDrag = payload
  },
  incrementModalCount (state) {
    state.nbOpenModals = state.nbOpenModals + 1
  },
  decreaseModalCount (state) {
    state.nbOpenModals = state.nbOpenModals - 1
  }
}

export const actions = {
  addDraggedEntities ({ commit }, entities) {
    commit('toggleDraggedEntity', true)
    commit('addDraggedEntities', entities)
  },
  removeDraggedEntities ({ commit }) {
    commit('toggleDraggedEntity', false)
    commit('removeDraggedEntities')
  },
  incrementModalCount ({ commit }) {
    commit('incrementModalCount')
  },
  decreaseModalCount ({ commit }) {
    commit('decreaseModalCount')
  }
}
