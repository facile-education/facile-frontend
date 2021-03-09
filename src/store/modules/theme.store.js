import { setMainColor } from '@/utils/theme.util'

export default {
  state: {
    mainColor: '2E6E95',
    fontColor: 'ffffff'
  },
  mutations: {
    setMainColor (state, payload) {
      state.mainColor = payload
    }
  },
  actions: {
    updateMainColor ({ commit }, payload) {
      setMainColor(payload)
      commit('setMainColor', payload)
    }
  }
}
