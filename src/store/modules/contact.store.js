import { addContactFieldsToContactList } from '@utils/contacts.utils'

import contactService from '@/api/contact.service'
import groupsService from '@/api/groups.service'

export const state = {
  userList: undefined,
  isLoadingUsers: false,
  error: undefined,
  isMobileUserListDisplayed: false,
  activeTab: 'addressBook'
}

export const mutations = {
  reset (state) {
    state.userList = undefined
    state.isLoadingUsers = false
    state.error = undefined
    state.isMobileUserListDisplayed = false
  },
  setSchools (state, payload) {
    state.schools = payload
  },
  setCommunities (state, payload) {
    state.communities = payload
  },
  setUserList (state, payload) {
    state.userList = payload
  },
  setIsLoadingUsers (state, payload) {
    state.isLoadingUsers = payload
  },
  setError (state, payload) {
    state.error = payload
  },
  setIsMobileUserListDisplayed (state, payload) {
    state.isMobileUserListDisplayed = payload
  },
  setActiveTab (state, payload) {
    state.activeTab = payload
  }
}

export const actions = {
  resetContactStore ({ commit }) {
    commit('reset')
  },
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
  getMembers ({ commit }, population) {
    commit('setIsLoadingUsers', true)
    contactService.getOrgMembers(population.orgId, population.roleId).then((data) => {
      commit('setIsLoadingUsers', false)

      if (data.success) {
        commit('setError', undefined)
        addContactFieldsToContactList(data.users)
        commit('setUserList', data.users)
      } else {
        commit('setError', true)
      }
    })
  },
  getCommunityMembers ({ commit }, groupId) {
    commit('setIsLoadingUsers', true)
    groupsService.getCommunityMembers(groupId).then((data) => {
      commit('setIsLoadingUsers', false)

      if (data.success) {
        commit('setError', undefined)
        addContactFieldsToContactList(data.members)
        commit('setUserList', data.members)
      } else {
        commit('setError', true)
      }
    })
  },
  getMyStudents ({ commit }) {
    commit('setIsLoadingUsers', true)
    contactService.getMyStudents().then((data) => {
      commit('setIsLoadingUsers', false)

      if (data.success) {
        addContactFieldsToContactList(data.users)
        commit('setUserList', data.users)
      } else {
        commit('setError', true)
      }
    })
  },
  getMyRelatives ({ commit }) {
    commit('setIsLoadingUsers', true)
    contactService.getMyRelatives().then((data) => {
      commit('setIsLoadingUsers', false)

      if (data.success) {
        addContactFieldsToContactList(data.users)
        commit('setUserList', data.users)
      } else {
        commit('setError', true)
      }
    }
    )
  },
  getUsersFromSearch ({ commit }, { query, roleId, schoolId }) {
    commit('setIsMobileUserListDisplayed', true)
    commit('setIsLoadingUsers', true)
    contactService.searchDirectory(query, roleId, schoolId).then((data) => {
      commit('setIsLoadingUsers', false)

      if (data.success) {
        commit('setError', undefined)
        addContactFieldsToContactList(data.users)
        commit('setUserList', data.users)
      } else {
        commit('setError', true)
      }
    })
  },
  openMobileUserList ({ commit }) {
    commit('setIsMobileUserListDisplayed', true)
  },
  closeMobileUserList ({ commit }) {
    commit('setIsMobileUserListDisplayed', false)
  },
  resetUserList ({ commit }) {
    commit('setUserList', undefined)
  },
  setActiveTab ({ commit }, tabName) {
    commit('setActiveTab', tabName)
  }
}
