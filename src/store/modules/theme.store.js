import { setMainColor } from '@/utils/theme.util'

export const state = {
  mainColor: '2982B9',
  fontColor: 'ffffff'
}

export const mutations = {
  setMainColor (state, payload) {
    state.mainColor = payload
  }
}

export const actions = {
  updateMainColor ({ commit }, payload) {
    setMainColor(payload)
    commit('setMainColor', payload)
  }
}
