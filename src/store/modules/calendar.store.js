import scheduleService from '@/api/schedule.service'

export const state = {
  configuration: undefined
}
export const mutations = {
  setConfiguration (state, payload) {
    state.configuration = payload
  }
}
export const actions = {
  getConfiguration ({ commit }) {
    scheduleService.getConfiguration().then((data) => {
      if (data.success) {
        commit('setConfiguration', data.configuration)
      } else {
        console.error('Cannot get calendar config')
      }
    },
    (err) => {
      console.error(err)
    })
  }
}
