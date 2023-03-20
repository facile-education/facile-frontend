import contactService from '@/api/contact.service'
import groupsService from '@/api/groups.service'

export const state = {
  schools: [],
  communities: [],
  searchResults: [],
  nbResults: 0
}

export const mutations = {
  setSchools (state, payload) {
    state.schools = payload
  },
  setCommunities (state, payload) {
    state.communities = payload
  },
  setSearchResults (state, payload) {
    state.searchResults = payload
  },
  setNbResults (state, payload) {
    state.nbResults = payload
  },
  toggleSchool (state, payload) {
    state.schools.forEach(school => {
      if (school.schoolOrgId === payload) {
        school.isExpanded = !school.isExpanded
      }
    })
  }
}

export const actions = {
  setContactTree ({ commit }, categories) {
    const schools = []
    categories.forEach(school => {
      if (school.schoolOrgId !== 0) {
        schools.push(school)
      } else {
        commit('setCommunities', school.groups)
      }
    })
    commit('setSchools', schools)
  },
  toggleSchool ({ commit }, schoolId) {
    commit('toggleSchool', schoolId)
  },
  getMembers ({ commit }, population) {
    console.log('get Members of population ', population)
    contactService.getOrgMembers(population.orgId, population.roleId).then(
      (data) => {
        if (data.success) {
          commit('setSearchResults', data.users)
          commit('setNbResults', data.nbResults)
        }
      }
    )
  },
  getCommunityMembers ({ commit }, groupId) {
    console.log('get Members of community ', groupId)
    groupsService.getCommunityMembers(groupId).then(
      (data) => {
        if (data.success) {
          commit('setSearchResults', data.members)
          commit('setNbResults', data.members.length)
        }
      }
    )
  },
  searchDirectory ({ commit }, { query, roleId, schoolId }) {
    console.log('directory search')
    contactService.searchDirectory(query, roleId, schoolId).then(
      (data) => {
        if (data.success) {
          commit('setSearchResults', data.users)
          commit('setNbResults', data.users.length)
        }
      }
    )
  }
}
