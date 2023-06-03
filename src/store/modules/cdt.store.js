import cdtService from '@/api/cdt.service'

export const state = {
  configuration: {
    endDateSchool: '',
    startDateSchool: '',
    startDayTime: '7h30',
    endDayTime: '18h00',
    schoolDays: [1, 2, 3, 4, 5]
  }
}

export const mutations = {
  setConfiguration (state, payload) {
    state.configuration.endDateSchool = payload.endDateSchool
    state.configuration.startDateSchool = payload.startDateSchool
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
