import Vue from 'vue'
import userService from '@/api/user.service'
import NeroUtils from '@/utils/nero.utils'

export default {
  namespaced: true,
  state: {
    userId: 0,
    firstName: '',
    lastName: '',
    picture: '/image/user_male_portrait?img_id=3274117&t=1546588956172',
    themeColor: '#99B9E9',
    isAdministrator: false,
    isLocalAdmin: false,
    isENTAdmin: false,
    isPersonnel: false,
    isStudent: false,
    isTeacher: false,
    isParent: false,
    schools: [],
    details: {}
  },
  mutations: {
    initUserInformations (state, payload) {
      state.userId = payload.userId
      state.firstName = payload.firstName
      state.lastName = payload.lastName
      state.picture = payload.picture
      state.themeColor = payload.themeColor

      state.isAdministrator = payload.isAdministrator
      state.isLocalAdmin = payload.isLocalAdmin
      state.isPersonnel = payload.isPersonnel
      state.isStudent = payload.isStudent
      state.isTeacher = payload.isTeacher
      state.isParent = payload.isParent

      state.schools = payload.schools
    },
    hack (state, payload) {
      if (payload.isAdministrator || payload.isLocalAdmin ||
          payload.isENTAdmin || payload.isUser) {
        Vue.set(state, 'isAdministrator', payload.isAdministrator)
        Vue.set(state, 'isLocalAdmin', payload.isLocalAdmin)
        Vue.set(state, 'isENTAdmin', payload.isENTAdmin)
      } else {
        Vue.set(state, 'isPersonnel', payload.isPersonnel)
        Vue.set(state, 'isStudent', payload.isStudent)
        Vue.set(state, 'isTeacher', payload.isTeacher)
        Vue.set(state, 'isParent', payload.isParent)
      }
    },
    updateUserDetails (state, payload) {
      Vue.set(state.details, 'address', payload.address)
      Vue.set(state.details, 'firstName', payload.firstName)
      Vue.set(state.details, 'homePhoneNumber', payload.homePhone)
      Vue.set(state.details, 'lastName', payload.lastName)
      Vue.set(state.details, 'emailAddress', payload.mail)
      Vue.set(state.details, 'mobilePhoneNumber', payload.mobilePhone)
      Vue.set(state.details, 'officePhoneNumber', payload.proPhone)
      Vue.set(state.details, 'smsPhoneNumber', payload.SMSPhone)
    }
  },
  actions: {
    getPersonalDetails ({ commit }) {
      userService.getPersonalDetails().then(
        (data) => {
          commit('updateUserDetails', data)
        },
        (err) => {
          // TODO toastr
          console.log(err)
        })
    },
    initUserInformations ({ state, commit }) {
      userService.getUserInformations().then(
        (data) => {
          // TODO get all from back
          data.user.isAdministrator = true
          data.user.isLocalAdmin = false
          data.user.isPersonnel = true
          data.user.isStudent = false
          data.user.isTeacher = false
          data.user.schools = [{ homeSchool: true, link: 'google.fr', name: 'Lg Elise De La Croix' }]

          data.user.themeColor = '#' + data.user.themeColor
          if (data.user.themeColor !== state.themeColor) {
            NeroUtils.Theme.updateColor(state.themeColor, data.user.themeColor)
          }
          console.log(data)
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
