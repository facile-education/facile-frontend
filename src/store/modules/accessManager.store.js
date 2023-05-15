import { getSchoolAccesses } from '@/api/access.service'
import { sortAccesses } from '@utils/accessUtils'

export const state = {
  isLoading: false,
  error: false,
  selectedSchool: undefined,
  initialCategoryList: [],
  categoryList: []
}

export const mutations = {
  setLoading (state, payload) {
    state.isLoading = payload
  },
  setError (state, payload) {
    state.error = payload
  },
  setSchool (state, payload) {
    state.selectedSchool = payload
  },
  setInitialCategoryList (state, payload) {
    state.initialCategoryList = payload
  },
  setCategoryList (state, payload) {
    state.categoryList = payload
  }
}

export const actions = {
  setSelectedSchool ({ commit }, school) {
    commit('setSchool', school)
  },
  getSchoolAccesses ({ commit, state }) {
    commit('setLoading', true)
    getSchoolAccesses(state.selectedSchool.schoolId).then((data) => {
      commit('setLoading', false)
      if (data.success) {
        commit('setError', false)
        const sortedAccesses = sortAccesses(data.accesses)
        commit('setInitialCategoryList', sortedAccesses)
        commit('setCategoryList', sortedAccesses)
      } else {
        commit('setError', true)
        console.error('Error')
      }
    }, (err) => {
      commit('setLoading', false)
      commit('setError', true)
      console.error(err)
    })
  },
  setCategoryList ({ commit }, categoryList) {
    commit('setCategoryList', categoryList)
  }
}
