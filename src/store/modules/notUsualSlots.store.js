export default {
  state: {
    currentSlotType: undefined,
    currentNonClassicalSlots: [],
    userSlots: [],
    selectedSchool: undefined
  },
  mutations: {
    setCurrentSlotType (state, slotType) {
      state.currentSlotType = slotType
    },
    setSelectedSchool (state, payload) {
      state.selectedSchool = payload
    }
  },
  actions: {
    setCurrentSlotType ({ commit }, slotType) {
      commit('setCurrentSlotType', slotType)
    },
    setSelectedSchool ({ commit }, selectedSchool) {
      commit('setSelectedSchool', selectedSchool)
    }
  }
}
