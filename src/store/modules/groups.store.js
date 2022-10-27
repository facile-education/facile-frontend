import { getUserCommunities } from '@/api/groups.service'

export const state = {
  groupList: undefined
}

export const mutations = {
  setGroupList (state, payload) {
    state.groupList = payload
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
  }
}
