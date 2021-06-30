import schoolLifeService from '@/api/schoolLife-portlet.service'

export default {
  state: {
    currentSlotType: undefined,
    currentNonUsualSlots: [],
    userSlots: [],
    selectedSchool: undefined
  },
  mutations: {
    setCurrentSlotType (state, slotType) {
      state.currentSlotType = slotType
    },
    setSelectedSchool (state, payload) {
      state.selectedSchool = payload
    },
    setUserSlots (state, slots) {
      state.userSlots = slots
    }
  },
  actions: {
    setCurrentSlotType ({ commit }, slotType) {
      commit('setCurrentSlotType', slotType)
    },
    setSelectedSchool ({ commit }, selectedSchool) {
      commit('setSelectedSchool', selectedSchool)
    },
    getStudentSessions ({ commit }, { user, minDate, maxDate }) {
      schoolLifeService.getStudentSessions(user, minDate, maxDate).then(
        (data) => {
          if (data.success) {
            commit('setUserSlots', data.sessions)
          } else {
            console.error('Cannot get user slots')
          }
        },
        (err) => {
          // TODO toastr
          console.error(err)
        }
      )
    },
    resetUserSlots ({ commit }) {
      commit('setUserSlots', [])
    }
  }
}
