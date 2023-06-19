import scheduleService from '@/api/schedule.service'

let isLoadingConfig = false
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
    if (!isLoadingConfig) {
      isLoadingConfig = true
      scheduleService.getConfiguration().then((data) => {
        isLoadingConfig = false
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
}
