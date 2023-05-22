import { getSchoolAccesses } from '@/api/access.service'
import { sortAccesses } from '@utils/accessUtils'
import { getBroadcastRoleList } from '@/api/role.service'

export const state = {
  isLoading: false,
  error: false,
  selectedSchool: undefined,
  initialCategoryList: [],
  categoryList: [],
  draggedAccess: undefined,
  isUserAccessModalOpen: false,
  roleList: []
}

export const mutations = {
  setLoading (state, payload) {
    state.isLoading = payload
  },
  setError (state, payload) {
    state.error = payload
  },
  setDraggedAccess (state, payload) {
    state.draggedAccess = payload
  },
  setSchool (state, payload) {
    state.selectedSchool = payload
  },
  setInitialCategoryList (state, payload) {
    state.initialCategoryList = payload
  },
  setCategoryList (state, payload) {
    state.categoryList = payload
  },
  setIsUserAccessModalOpen (state, payload) {
    state.isUserAccessModalOpen = payload
  },
  setRoleList (state, payload) {
    state.roleList = payload
  }
}

export const actions = {
  setDraggedAccess ({ commit }, access) {
    commit('setDraggedAccess', access)
  },
  setSelectedSchool ({ commit }, school) {
    commit('setSchool', school)
  },
  getSchoolAccesses ({ commit, state, getters }) {
    commit('setLoading', true)
    getSchoolAccesses(state.selectedSchool.schoolId).then((data) => {
      commit('setLoading', false)
      if (data.success) {
        commit('setError', false)
        const sortedAccesses = sortAccesses(data.accesses)
        addRoleLabel(sortedAccesses, getters) // Assume that store.roleList is set
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
  getRoleList ({ commit }) {
    getBroadcastRoleList().then((data) => {
      if (data.success) {
        commit('setRoleList', data.roles)
      } else {
        console.error('Error while getting users', data.error)
      }
    })
  },
  setCategoryList ({ commit }, categoryList) {
    commit('setCategoryList', categoryList)
  },
  openAccessModal ({ commit }) {
    commit('setIsUserAccessModalOpen', true)
  },
  closeAccessModal ({ commit }) {
    commit('setIsUserAccessModalOpen', false)
  }
}

export const getters = {
  getRoleName: (state) => (roleId) => {
    for (let i = 0; i < state.roleList.length; ++i) {
      if (state.roleList[i].roleId === roleId) {
        return state.roleList[i].displayText
      }
    }
    return 'Unknown role name'
  }
}

const addRoleLabel = (categoryList, getters) => {
  categoryList.forEach(category => {
    category.accessList.forEach(access => {
      for (let i = 0; i < access.profiles.length; i++) {
        const profileId = access.profiles[i]
        access.profiles[i] = { roleId: profileId, displayText: getters.getRoleName(profileId) }
      }
    })
  })
}
