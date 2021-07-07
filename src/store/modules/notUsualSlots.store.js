import schoolLifeService from '@/api/schoolLife-portlet.service'

function getNonUsualSlots (store) {
  store.dispatch('currentActions/addAction', { name: 'getNonUsualSlots' })
  schoolLifeService.getWeekSession(store.state.notUsualSlots.currentSlotType.type, store.state.notUsualSlots.displayedDates.startDate).then(
    (data) => {
      store.dispatch('currentActions/removeAction', { name: 'getNonUsualSlots' })
      if (data.success) {
        store.commit('notUsualSlots/setCurrentNonUsualSlots', data.sessions)
      } else {
        console.error('Cannot get slots for type ' + store.state.notUsualSlots.currentSlotType.type)
      }
    },
    (err) => {
      // TODO toastr
      console.error(err)
    }
  )
}

function getStudentSessions (store) {
  store.dispatch('currentActions/addAction', { name: 'getStudentSessions' })
  schoolLifeService.getStudentSessions(store.state.notUsualSlots.queriedUser, store.state.notUsualSlots.displayedDates.startDate, store.state.notUsualSlots.displayedDates.endDate).then(
    (data) => {
      store.dispatch('currentActions/removeAction', { name: 'getStudentSessions' })
      if (data.success) {
        store.commit('notUsualSlots/setUserSlots', data.sessions)
      } else {
        console.error('Cannot get user slots')
      }
    },
    (err) => {
      console.error(err)
    }
  )
}

export const state = {
  currentSlotType: undefined,
  displayedDates: {
    startDate: undefined,
    endDate: undefined
  },
  queriedUser: undefined,
  currentStartDate: undefined,
  currentEndDate: undefined,
  currentNonUsualSlots: [],
  userSlots: [],
  selectedSchool: undefined
}

export const mutations = {
  setCurrentSlotType (state, slotType) {
    state.currentSlotType = slotType
  },
  setDisplayedDate (state, { startDate, endDate }) {
    state.displayedDates.startDate = startDate
    state.displayedDates.endDate = endDate
  },
  setQueriedUser (state, queriedUser) {
    state.queriedUser = queriedUser
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
}
export const actions = {
  setCurrentSlotType ({ commit }, slotType) {
    commit('setCurrentSlotType', slotType)
    getNonUsualSlots(this)
  },
  setQueriedUser ({ commit }, user) {
    commit('setQueriedUser', user)
    if (this.state.notUsualSlots.queriedUser !== undefined) {
      getStudentSessions(this)
    } else {
      this.dispatch('notUsualSlots/resetUserSlots')
    }
  },
  setDisplayedDates ({ commit }, { startDate, endDate }) {
    commit('setDisplayedDate', { startDate, endDate })
    this.dispatch('notUsualSlots/refreshCalendar')
  },
  refreshCalendar () {
    // Update displayedSlots
    if (this.state.notUsualSlots.currentSlotType !== undefined) {
      getNonUsualSlots(this)
    }
    if (this.state.notUsualSlots.queriedUser !== undefined) {
      getStudentSessions(this)
    }
  },
  setSelectedSchool ({ commit }, selectedSchool) {
    commit('setSelectedSchool', selectedSchool)
  },
  resetUserSlots ({ commit }) {
    commit('setUserSlots', [])
  }
}
