// All the states common to the application

export const state = {
  draggedEntities: [],
  isThereDocumentDrag: false
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
  }
}
