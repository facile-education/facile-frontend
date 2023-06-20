import i18n from '@/i18n'
import { getSchoolClassList } from '@/api/organization.service'
import schoolLifeService from '@/api/schoolLife-portlet.service'
import cdtService from '@/api/schedule.service'
import notUsualSlotsConstants from '@/constants/notUsualSlots'

const formatNonUsualSlot = (sessions) => {
  sessions.forEach(event => {
    const slotType = notUsualSlotsConstants.getSlotTypeByNumber(event.type)
    event.title = slotType.label
    event.color = slotType.color

    event.options = []
    event.options.push({
      name: 'showStudentList',
      label: i18n.global.t('CalendarEventOptions.showStudentList'),
      icon: require('@/assets/icon_list.svg')
    })
    if (event.canUpdateSlot) {
      event.options.push({
        name: 'updateSlot',
        label: i18n.global.t('CalendarEventOptions.update'),
        icon: require('@/assets/icons/pencil.svg')
      })
    }
  })
}

const addRegisterOption = (sessions, getters) => {
  sessions.forEach(event => {
    if (event.canRegisterStudent && getters.isAlreadyRegister(event)) {
      event.options.push({
        name: 'registerStudent',
        label: i18n.global.t('CalendarEventOptions.registerStudent'),
        icon: require('@/assets/icons/add.svg') // TODO get icon
      })
    }
  })
}

const formatUsualSlot = (sessions) => {
  sessions.forEach(event => {
    event.grayed = true
  })
}

function getNonUsualSlots (store) {
  store.dispatch('currentActions/addAction', { name: 'getNonUsualSlots' })
  schoolLifeService.getWeekSession(store.state.user.selectedSchool.schoolId, store.state.notUsualSlots.currentSlotType.type, store.state.notUsualSlots.displayedDates.startDate).then(
    (data) => {
      store.dispatch('currentActions/removeAction', { name: 'getNonUsualSlots' })
      if (data.success) {
        formatNonUsualSlot(data.sessions)
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

function getSessions (store) {
  store.dispatch('currentActions/addAction', { name: 'getSessions' })
  const student = store.state.notUsualSlots.queriedUser || { studentId: 0 }
  if (student.studentId !== 0) {
    cdtService.getUserSessions(student.studentId, store.state.notUsualSlots.displayedDates.startDate, store.state.notUsualSlots.displayedDates.endDate).then(
      (data) => {
        store.dispatch('currentActions/removeAction', { name: 'getSessions' })
        if (data.success) {
          formatUsualSlot(data.sessions)
          data.sessions.forEach(slot => { slot.isUserSlot = true })
          store.commit('notUsualSlots/setUserSlots', data.sessions)
        } else {
          console.error('Cannot get user slots')
        }
      },
      (err) => {
        console.error(err)
      })
  } else {
    cdtService.getGroupSessions(store.state.notUsualSlots.selectedClass.orgId,
      store.state.notUsualSlots.displayedDates.startDate, store.state.notUsualSlots.displayedDates.endDate).then(
      (data) => {
        store.dispatch('currentActions/removeAction', { name: 'getSessions' })
        if (data.success) {
          data.sessions.forEach(slot => { slot.isUserSlot = true })
          store.commit('notUsualSlots/setUserSlots', data.sessions)
        } else {
          console.error('Cannot get user slots')
        }
      },
      (err) => {
        console.error(err)
      })
  }
}

const defaultClass = { orgId: 0, orgName: i18n.global.t('NotUsualSlots.classPlaceholder') }

export const state = {
  classList: undefined,
  currentEndDate: undefined,
  currentNonUsualSlots: [],
  currentSlotType: undefined,
  currentStartDate: undefined,
  displayedDates: {
    startDate: undefined,
    endDate: undefined
  },
  pendingFirings: [],
  queriedUser: undefined,
  selectedClass: defaultClass,
  userSlots: []
}

export const mutations = {
  setClassList (state, payload) {
    state.classList = payload
  },
  setCurrentSlotType (state, slotType) {
    state.currentSlotType = slotType
  },
  setPendingFirings (state, payload) {
    state.pendingFirings = payload
  },
  removePendingFirings (state, firingToRemove) {
    const index = state.pendingFirings.findIndex((firing) => (firing.studentId === firingToRemove.studentId) && (firing.schoollifeSessionId === firingToRemove.schoollifeSessionId)) // 2 primary keys
    state.pendingFirings.splice(index, 1)
  },
  setDisplayedDate (state, { startDate, endDate }) {
    state.displayedDates.startDate = startDate
    state.displayedDates.endDate = endDate
  },
  setQueriedUser (state, queriedUser) {
    state.queriedUser = queriedUser

    if (queriedUser !== undefined) {
      addRegisterOption(state.currentNonUsualSlots, getters)
    }
  },
  setSelectedClass (state, payload) {
    state.selectedClass = payload
  },
  setUserSlots (state, slots) {
    state.userSlots = slots
  },
  setCurrentNonUsualSlots (state, slots) {
    state.currentNonUsualSlots = slots
  }
}
export const actions = {
  getClassList ({ commit }, schoolId) {
    getSchoolClassList(schoolId, false).then(
      (data) => {
        if (data.success) {
          commit('setClassList', data.orgs)
        } else {
          console.error('Cannot get school orgs')
        }
      },
      (err) => {
        // TODO toastr
        console.error(err)
      }
    )
  },
  setCurrentSlotType ({ commit, state }, slotType) {
    if (state.selectedClass.orgId > 0) {
      commit('setSelectedClass', defaultClass)
      commit('setUserSlots', [])
    }
    commit('setCurrentSlotType', slotType)
    if (slotType !== undefined) {
      getNonUsualSlots(this)
    }
  },
  setPendingFirings ({ commit }, pendingFirings) {
    commit('setPendingFirings', pendingFirings)
  },
  removePendingFirings ({ commit }, pendingFiring) {
    commit('removePendingFirings', pendingFiring)
  },
  setQueriedUser ({ commit }, user) {
    if (user && state.selectedClass.orgId > 0) {
      commit('setSelectedClass', defaultClass)
    }
    commit('setQueriedUser', user)
    if (this.state.notUsualSlots.queriedUser !== undefined) {
      getSessions(this)
    } else {
      this.dispatch('notUsualSlots/resetUserSlots')
    }
  },
  setDisplayedDates ({ commit }, { startDate, endDate }) {
    commit('setDisplayedDate', { startDate, endDate })
    this.dispatch('notUsualSlots/refreshCalendar')
  },
  setSelectedClass ({ commit }, classObject) {
    commit('setQueriedUser', undefined)
    commit('setSelectedClass', classObject)
    getSessions(this)
  },
  refreshCalendar ({ state }) {
    // Update displayedSlots
    if (state.currentSlotType !== undefined) {
      getNonUsualSlots(this)

      if (state.selectedClass.orgId > 0 && state.currentSlotType.type === 5) {
        getSessions(this)
      }
    }
    if (state.queriedUser !== undefined) {
      getSessions(this)
    }
  },
  resetUserSlots ({ commit }) {
    commit('setUserSlots', [])
  }
}

export const getters = {
  isAlreadyRegister: (state) => (event) => {
    return state.userSlots.find(userSlot => userSlot.sessionId === event.schoollifeSessionId)
  }
}
