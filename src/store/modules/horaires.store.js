import scheduleService from '@/api/schedule.service'
import notUsualSlotsConstants from '@/constants/notUsualSlots'
import i18n from '@/i18n'

const manageSessionsOptions = (sessions) => {
  sessions.forEach(event => {
    event.options = []
    if (event.canSaveTeacherSubstitute) {
      event.options.push({
        name: 'saveTeacherSubstitute',
        label: i18n.global.t('CalendarEventOptions.saveTeacherSubstitute'),
        icon: 'fa-pencil-alt'
      })
    }
  })
}

const formatNonUsualSlots = (sessions) => {
  sessions.forEach(event => {
    const slotType = notUsualSlotsConstants.getSlotTypeByNumber(event.type)
    event.title = slotType.label
    event.color = slotType.color
    event.capacity = undefined
    event.nbRegisteredStudents = undefined
  })
}

export const state = {
  selectedDate: undefined,
  selectedUser: undefined,
  selectedGroup: undefined,
  sessionList: [],
  isLoading: false,
  error: false,
  isCreateSessionModalDisplayed: false
}

export const mutations = {
  setSelectedDate (state, payload) {
    state.selectedDate = payload
  },
  setSelectedUser (state, payload) {
    state.selectedUser = payload
  },
  setSelectedGroup (state, payload) {
    state.selectedGroup = payload
  },
  setLoading (state, payload) {
    state.isLoading = payload
  },
  setError (state, payload) {
    state.error = true
  },
  setSessionList (state, payload) {
    state.sessionList = payload
  },
  setCreateSessionModalDisplayed (state, payload) {
    state.isCreateSessionModalDisplayed = payload
  }
}
export const actions = {
  setSelectedDate ({ commit }, date) {
    commit('setSelectedDate', date)
  },
  setSelectedUser ({ commit }, user) {
    commit('setSelectedUser', user)
    commit('setSelectedGroup', undefined) // To keep separation
  },
  setSelectedGroup ({ commit }, group) {
    commit('setSelectedUser', undefined)
    commit('setSelectedGroup', group) // To keep separation
  },
  resetSessions ({ commit }) {
    commit('setSessionList', [])
  },
  getUserSessions ({ state, commit }) {
    const startDate = state.selectedDate.startOf('week')
    const endDate = state.selectedDate.endOf('week')
    commit('setLoading', true)
    scheduleService.getUserSessions(state.selectedUser.userId, startDate, endDate).then((data) => {
      commit('setLoading', false)
      if (data.success) {
        commit('setError', false)
        formatNonUsualSlots(data.schoollifeSessions)
        const sessions = [...data.sessions, ...data.schoollifeSessions]
        manageSessionsOptions(sessions)
        commit('setSessionList', sessions)
      } else {
        commit('setError', true)
      }
    },
    (err) => {
      commit('endLoading')
      commit('setError', true)
      console.error(err)
    })
  },
  getGroupSessions ({ state, commit }) {
    const startDate = state.selectedDate.startOf('week')
    const endDate = state.selectedDate.endOf('week')
    commit('setLoading', true)
    scheduleService.getGroupSessions(state.selectedGroup.groupId, startDate, endDate).then((data) => {
      commit('setLoading', false)
      if (data.success) {
        commit('setError', false)
        const sessions = data.sessions
        manageSessionsOptions(sessions)
        commit('setSessionList', sessions)
      } else {
        commit('setError', true)
      }
    },
    (err) => {
      commit('endLoading')
      commit('setError', true)
      console.error(err)
    })
  },
  setCreateSessionModalDisplayed ({ commit }, isDisplayed) {
    commit('setCreateSessionModalDisplayed', isDisplayed)
  }
}
