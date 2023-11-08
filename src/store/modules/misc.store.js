// All the states common to the application

export const state = {
  draggedEntities: [],
  isThereDocumentDrag: false,
  nbOpenModals: 0,
  isMobileApp: false
}

export const mutations = {
  setIsMobileApp (state, payload) {
    state.isMobileApp = payload
  },
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
  },
  setIsMobileApp ({ commit }, status) {
    commit('setIsMobileApp', status)
  }
}
