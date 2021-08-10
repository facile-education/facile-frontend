// import application from '@/store/modules/user.application.store'
import PentilaUtils from 'pentila-utils'
import userService from '@/api/user.service'

export const state = {
  userId: undefined,
  firstName: '',
  lastName: '',
  picture: '/image/user_male_portrait?img_id=3274117&t=1546588956172',
  themeColor: '#99B9E9',
  isAdministrator: true,
  isLocalAdmin: false,
  isENTAdmin: false,
  isPersonal: false,
  isDoyen: false,
  isDirectionMember: false,
  isSecretariat: false,
  isStudent: false,
  isTeacher: false,
  isParent: false,
  hasWebdavEnabled: false,
  serviceList: undefined,
  schoolList: [],
  details: {},
  selectedSchool: undefined
}
export const mutations = {
  initUserInformations (state, payload) {
    state.userId = payload.userId
    state.firstName = payload.firstName
    state.lastName = payload.lastName
    state.picture = payload.picture
    state.themeColor = payload.themeColor

    state.isAdministrator = payload.isAdministrator
    state.isLocalAdmin = payload.isLocalAdmin
    state.isPersonal = payload.isPersonal
    state.isDoyen = payload.isDoyen
    state.isDirectionMember = payload.isDirectionMember
    state.isSecretariat = payload.isSecretariat
    state.isStudent = payload.isStudent
    state.isTeacher = payload.isTeacher
    state.isParent = payload.isParent

    state.hasWebdavEnabled = payload.hasWebdavEnabled
  },
  initServiceList (state, payload) {
    state.serviceList = payload
  },
  hack (state, payload) {
    if (payload.isAdministrator || payload.isLocalAdmin ||
          payload.isENTAdmin || payload.isUser) {
      state.isAdministrator = payload.isAdministrator
      state.isLocalAdmin = payload.isLocalAdmin
      state.isENTAdmin = payload.isENTAdmin
    } else {
      state.isPersonal = payload.isPersonal
      state.isStudent = payload.isStudent
      state.isTeacher = payload.isTeacher
      state.isParent = payload.isParent
    }
  },
  setSelectedSchool (state, payload) {
    state.selectedSchool = payload
  },
  updateInterfacePreferences (state, payload) {
    state.themeColor = payload.themeColor
  },
  updatePicture (state, payload) {
    state.picture = payload
  },
  updateUserDetails (state, payload) {
    state.details.address = payload.address
    state.details.firstName = payload.firstName
    state.details.homePhoneNumber = payload.homePhone
    state.details.lastName = payload.lastName
    state.details.emailAddress = payload.mail
    state.details.mobilePhoneNumber = payload.mobilePhone
    state.details.officePhoneNumber = payload.proPhone
    state.details.smsPhoneNumber = payload.SMSPhone
    state.schoolList = payload.userSchools
    state.selectedSchool = payload.userSchools[0]
  }
}
export const actions = {
  getPersonalDetails ({ commit, dispatch }) {
    this.dispatch('currentActions/addAction', { name: 'getPersonalDetails' })
    userService.getPersonalDetails().then(
      (data) => {
        this.dispatch('currentActions/removeAction', { name: 'getPersonalDetails' })
        if (data.success) {
          commit('updateUserDetails', data)
          if (data.themeColor && data.themeColor !== '' && data.themeColor !== 'FFFFFF') {
            dispatch('theme/updateMainColor', data.themeColor, { root: true })
          }
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
    this.dispatch('currentActions/addAction', { name: 'getUserInformations' })
    userService.getUserInformations().then(
      (data) => {
        this.dispatch('currentActions/removeAction', { name: 'getUserInformations' })
        if (data.success) {
          // Handle theme color
          if (data.themeColor && data.themeColor !== '') {
            if (data.themeColor.indexOf('#') === -1) {
              data.themeColor = '#' + data.themeColor
            }
            if (data.themeColor !== state.themeColor) {
              PentilaUtils.Theme.updateColor(state.themeColor, data.themeColor)
            }
          }
          commit('initUserInformations', data)
        } else {
          commit('initUserInformations', { userId: 0 })
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
}

export const getters = {
  homeSchool (state) {
    for (let index = 0; index < state.schoolList.length; ++index) {
      if (state.schoolList[index].homeSchool) {
        return state.schoolList[index]
      }
    }
  }
}
