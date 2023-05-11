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
  emptyGroupList (state) {
    state.groupList = undefined
  },
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
  getGroupList ({ commit }, { filter, groupIdToSelect = undefined }) {
    commit('emptyGroupList')
    getUserCommunities(this.state.user.userId, filter).then((data) => {
      if (data.success) {
        commit('setGroupList', data.groups)

        // Select group if specified
        if (groupIdToSelect !== undefined) {
          const idx = data.groups.map(group => group.groupId).indexOf(groupIdToSelect)
          if (idx !== -1) {
            this.dispatch('groups/setSelectedGroup', data.groups[idx])
          } else {
            console.error('Cannot select groupId ' + groupIdToSelect + ' in ', data.groups)
          }
        } else {
          commit('setSelectedGroup', undefined)
        }
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
    this.dispatch('groups/getGroupList', { filter: filter })
  },
  deleteGroup ({ commit }, group) {
    removeCommunity(group.groupId).then((data) => {
      if (data.success) {
        // Refresh interface
        this.dispatch('groups/getGroupList', { filter: this.state.groups.currentFilter })
      } else {
        console.error('error in group deletion')
      }
    }, (err) => {
      console.error(err)
    })
  }
}
