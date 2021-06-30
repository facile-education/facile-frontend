import schoolLifeService from '@/api/schoolLife-portlet.service'
import moment from 'moment'

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
    },
    setCurrentNonUsualSlots (state, slots) {
      state.currentNonUsualSlots = slots
    }
  },
  actions: {
    setCurrentSlotType ({ commit }, slotType) {
      commit('setCurrentSlotType', slotType)
      schoolLifeService.getWeekSession(slotType.type, moment()).then(
        (data) => {
          if (data.success) {
            commit('setCurrentNonUsualSlots', data.sessions)
          } else {
            console.error('Cannot get slots for type ' + slotType.label)
          }
        },
        (err) => {
          // TODO toastr
          console.error(err)
        }
      )
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
          console.error(err)
        }
      )
    },
    resetUserSlots ({ commit }) {
      commit('setUserSlots', [])
    }
  }
}
