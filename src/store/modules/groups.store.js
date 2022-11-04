import { getUserCommunities, removeCommunity } from '@/api/groups.service'

export const state = {
  groupList: undefined,
  isPanelDisplayed: false,
  selectedGroup: undefined,
  currentFilter: {
    label: '',
    isCommunityActive: false,
    isInstitutionalActive: false,
    isPedagogicalActive: false
  }
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
  },
  setFilter (state, payload) {
    state.currentFilter = payload
  }
}

export const actions = {
  getGroupList ({ commit }, filter) {
    getUserCommunities(this.state.user.userId, filter).then((data) => {
      if (data.success) {
        commit('setSelectedGroup', undefined)
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
  },
  updateFilter ({ commit }, filter) {
    commit('setFilter', filter)
    // Refresh GroupList
    this.dispatch('groups/getGroupList', filter)
  },
  deleteGroup ({ commit }, group) {
    removeCommunity(group.groupId).then((data) => {
      if (data.success) {
        // Refresh interface
        commit('getGroupList', this.state.groups.currentFilter)
      } else {
        console.error('error in group deletion')
      }
    }, (err) => {
      console.error(err)
    })
  }
}
