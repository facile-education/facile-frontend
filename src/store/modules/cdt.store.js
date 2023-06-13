import cdtService from '@/api/schedule.service'

export const state = {
  configuration: {
    endDateSchool: '',
    endDayTime: '',
    startDateSchool: '',
    startDayTime: '',
    schoolDays: []
  }
}

export const mutations = {
  setConfiguration (state, payload) {
    state.configuration.endDateSchool = payload.endDateSchool
    state.configuration.endDayTime = payload.endDayTime
    state.configuration.startDateSchool = payload.startDateSchool
    state.configuration.startDayTime = payload.startDayTime
    state.configuration.schoolDays = payload.schoolDays
  }
}

export const actions = {
  getConfiguration ({ commit }) {
    cdtService.getConfiguration().then(
      (data) => {
        if (data.success) {
          commit('setConfiguration', data.configuration)
        } else {
          console.error('Cannot get cdt config')
        }
      },
      (err) => {
        // TODO toastr
        console.error(err)
      }
    )
  }
}
