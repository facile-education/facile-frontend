export default {
  state: {
    currentSlotType: undefined,
    currentNonClassicalSlots: [],
    userSlots: []
  },
  mutations: {
    setCurrentSlotType (state, slotType) {
      state.currentSlotType = slotType
    }
  },
  actions: {
    setCurrentSlotType ({ commit }, slotType) {
      commit('setCurrentSlotType', slotType)
    }
  }
}
