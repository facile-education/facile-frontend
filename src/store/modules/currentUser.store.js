import Vue from 'vue'
import userService from '@/api/user.service'

export default {
  state: {
    userId: 0,
    firstName: '',
    lastName: '',
    picture: '',
    isAdministrator: false,
    isLocalAdmin: false,
    isENTAdmin: false,
    isPersonnel: false,
    isStudent: false,
    isTeacher: false,
    isParent: false,
    schools: []
  },
  mutations: {
    initUserInformations (state, payload) {
      state.userId = payload.userId
      state.firstName = payload.firstName
      state.lastName = payload.lastName
      state.picture = payload.picture

      state.isAdministrator = payload.isAdministrator
      state.isLocalAdmin = payload.isLocalAdmin
      state.isPersonnel = payload.isPersonnel
      state.isStudent = payload.isStudent
      state.isTeacher = payload.isTeacher
      state.isParent = payload.isParent

      state.schools = payload.schools
    },
    hack (state, payload) {
      if (payload.isAdministrator ||
        payload.isLocalAdmin || payload.isUser) {
        Vue.set(state, 'isAdministrator', payload.isAdministrator)
        Vue.set(state, 'isLocalAdmin', payload.isLocalAdmin)
      } else {
        Vue.set(state, 'isPersonnel', payload.isPersonnel)
        Vue.set(state, 'isStudent', payload.isStudent)
        Vue.set(state, 'isTeacher', payload.isTeacher)
        Vue.set(state, 'isParent', payload.isParent)
      }
    }
  },
  actions: {
    initUserInformations ({ commit }) {
      userService.getUserInformations().then(
        (data) => {
          commit('initUserInformations', data.user)
        },
        (err) => {
          // TODO toastr
          console.log(err)
        })
    },
    hack ({ commit }, infos) {
      commit('hack', infos)
    }
  },
  getters: {
    homeSchool (state) {
      for (var index = 0; index < state.schools.length; ++index) {
        if (state.schools[index].homeSchool) {
          return state.schools[index]
        }
      }
    }
  }
}
