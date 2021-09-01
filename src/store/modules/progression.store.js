import { deleteProgression, getProgressionList } from '@/api/progression.service'

export const state = {
  progressionList: undefined
}

export const mutations = {
  removeProgression (state, payload) {
    const index = state.progressionList.indexOf(payload)
    state.progressionList.splice(index, 1)
  },
  setProgressionList (state, payload) {
    state.progressionList = payload
  }
}
export const actions = {
  deleteProgression ({ commit }, progression) {
    deleteProgression(progression.progressionId).then(
      (data) => {
        if (data.success) {
          commit('removeProgression', progression)
        }
      },
      (err) => {
        // TODO toastr
        console.error(err)
      })
  },
  initProgressionList ({ commit }) {
    getProgressionList().then(
      (data) => {
        if (data.success) {
          commit('setProgressionList', data.progressions)
        }
      },
      (err) => {
        // TODO toastr
        console.error(err)
      })
  }
}
