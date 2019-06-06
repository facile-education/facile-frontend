import application from '@/store/modules/user.application.store'
import PentilaUtils from 'pentila-utils'
import userService from '@/api/user.service'
import Vue from 'vue'

export default {
  namespaced: true,
  modules: {
    application
  },
  state: {
    userId: 0,
    firstName: '',
    lastName: '',
    picture: '/image/user_male_portrait?img_id=3274117&t=1546588956172',
    themeColor: '#99B9E9',
    isAdministrator: false,
    isLocalAdmin: false,
    isENTAdmin: false,
    isPersonal: false,
    isStudent: false,
    isTeacher: false,
    isParent: false,
    hasWebdavEnabled: false,
    serviceList: undefined,
    schoolList: [],
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
      state.isPersonal = payload.isPersonal
      state.isStudent = payload.isStudent
      state.isTeacher = payload.isTeacher
      state.isParent = payload.isParent

      state.hasWebdavEnabled = payload.hasWebdavEnabled

      state.schoolList = payload.schoolList
    },
    initServiceList (state, payload) {
      state.serviceList = payload
    },
    hack (state, payload) {
      if (payload.isAdministrator || payload.isLocalAdmin ||
          payload.isENTAdmin || payload.isUser) {
        Vue.set(state, 'isAdministrator', payload.isAdministrator)
        Vue.set(state, 'isLocalAdmin', payload.isLocalAdmin)
        Vue.set(state, 'isENTAdmin', payload.isENTAdmin)
      } else {
        Vue.set(state, 'isPersonal', payload.isPersonal)
        Vue.set(state, 'isStudent', payload.isStudent)
        Vue.set(state, 'isTeacher', payload.isTeacher)
        Vue.set(state, 'isParent', payload.isParent)
      }
    },
    updateInterfacePreferences (state, payload) {
      state.themeColor = payload.themeColor
    },
    updatePicture (state, payload) {
      state.picture = payload
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
          if (data.success) {
            commit('updateUserDetails', data)
          }
        },
        (err) => {
          // TODO toastr
          console.log(err)
        })
    },
    getServiceList ({ commit }) {
      userService.getServiceList().then((data) => {
        if (data.success) {
          commit('initServiceList', data.items)
        }
      })
    },
    initUserInformations ({ state, commit }) {
      userService.getUserInformations().then(
        (data) => {
          if (data.success) {
            // Handle theme color
            if (data.user.themeColor !== '') {
              if (data.user.themeColor.indexOf('#') === -1) {
                data.user.themeColor = '#' + data.user.themeColor
              }
              if (data.user.themeColor !== state.themeColor) {
                PentilaUtils.Theme.updateColor(state.themeColor, data.user.themeColor)
              }
            }

            commit('initUserInformations', data.user)
          }
        },
        (err) => {
          // TODO toastr
          console.log(err)
        })
    },
    hack ({ commit }, infos) {
      commit('hack', infos)
    },
    removePicture ({ commit }) {
      userService.removePicture().then(
        (data) => {
          if (data.success) {
            console.log('TODO get default img dynamiccaly')
            commit('updatePicture', '/image/user_male_portrait?img_id=3274117&t=1546588956172')
          }
        },
        (err) => {
          // TODO toastr
          console.log(err)
        })
    },
    saveInterfacePreferences ({ commit }, preferences) {
      userService.updateInterfacePreferences(preferences).then(
        (data) => {
          if (data.success) {
            commit('updateInterfacePreferences', preferences)
          }
        },
        (err) => {
          // TODO toastr
          console.log(err)
        })
    },
    saveProfilePicture ({ commit }, formData) {
      userService.uploadProfilePicture(formData).then(
        (data) => {
          if (data.success) {
            commit('updatePicture', data.urlThumb)
          }
        },
        (err) => {
          // TODO toastr
          console.log(err)
        })
    }
  },
  getters: {
    homeSchool (state) {
      for (var index = 0; index < state.schoolList.length; ++index) {
        if (state.schoolList[index].homeSchool) {
          return state.schoolList[index]
        }
      }
    }
  }
}
