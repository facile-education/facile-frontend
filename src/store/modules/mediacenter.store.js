import { getGARManagerUIUrl, getResourceList, getSchoolAdminList, getUserSchoolList } from '@/api/mediacenter.service'

export const state = {
  adminList: [],
  managerUIUrl: undefined,
  resourceList: [],
  schoolList: []
}

export const mutations = {
  setAdminList (state, payload) {
    state.adminList = payload
  },
  setResourceList (state, payload) {
    state.resourceList = payload
  },
  setManagerUIUrl (state, payload) {
    state.managerUIUrl = payload
  },
  setSchoolList (state, payload) {
    state.schoolList = payload
  }
}

export const actions = {
  getAdminList ({ commit }, schoolId) {
    getSchoolAdminList(schoolId).then(
      (data) => {
        if (data.success) {
          commit('setAdminList', data.admins)
        }
      },
      (err) => {
        // TODO toastr
        console.error(err)
      }
    )
  },
  getManagerUIUrl ({ commit }) {
    getGARManagerUIUrl().then(
      (data) => {
        if (data.success) {
          commit('setManagerUIUrl', data.url)
        }
      },
      (err) => {
        // TODO toastr
        console.error(err)
      }
    )
  },
  getResourceList ({ commit }, schoolId) {
    getResourceList(schoolId).then(
      (data) => {
        if (data.success) {
          commit('setResourceList', data.resourceList)
        }
      },
      (err) => {
        // TODO toastr
        console.error(err)
      }
    )
  },
  getSchoolList ({ commit, dispatch }) {
    getUserSchoolList().then(
      (data) => {
        if (data.success) {
          commit('setSchoolList', data.schools)
          if (data.schools.length === 1) {
            dispatch('getResourceList', data.schools[0].schoolId)
          }
        }
      },
      (err) => {
        // TODO toastr
        console.error(err)
      }
    )
  }
}
