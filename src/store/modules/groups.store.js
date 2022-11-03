import { getUserCommunities } from '@/api/groups.service'

export const state = {
  groupList: undefined,
  isPanelDisplayed: false,
  selectedGroup: undefined
}

export const mutations = {
  setGroupList (state, payload) {
    state.groupList = payload
  },
  setSelectedGroup (state, payload) {
    state.selectedGroup = payload
  },
  setPanel (state, payload) {
    state.isPanelDisplayed = payload
  }
}

export const actions = {
  getGroupList ({ commit }, filter) {
    getUserCommunities(this.state.user.userId, filter).then((data) => {
      if (data.success) {
        commit('setGroupList', data.groups)
      }
    }, (err) => {
      console.error(err)
    })
  },
  displayPanel ({ commit }) {
    commit('setPanel', true)
  },
  closePanel ({ commit }) {
    commit('setPanel', false)
  },
  setSelectedGroup ({ commit }, group) {
    commit('setSelectedGroup', group)
    commit('setPanel', true)
  }
}
