// import PentilaUtils from 'pentila-utils'
import userService from '@/api/user.service'
import { getUserApplications } from '@/api/applicationManager.service'

export const state = {
  userId: undefined,
  // TODO merge fields that are in 'details' object (like firstName, etc...)
  firstName: '',
  lastName: '',
  picture: '/image/user_male_portrait?img_id=3274117&t=1546588956172',
  isAdministrator: false,
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
  schoolList: [],
  details: {},
  selectedSchool: undefined,
  serviceList: undefined,
  children: [],
  selectedChild: undefined
}
export const mutations = {
  initServiceList (state, payload) {
    state.serviceList = payload
  },
  initUserInformations (state, payload) {
    state.userId = payload.userId
    state.lastName = payload.lastName
    state.firstName = payload.firstName
    state.picture = payload.picture
    state.themeColor = payload.themeColor
    state.hasWebdavEnabled = payload.hasWebdavEnabled

    state.isAdministrator = payload.isAdministrator
    state.isLocalAdmin = payload.isLocalAdmin
    state.isPersonal = payload.isPersonal
    state.isDoyen = payload.isDoyen
    state.isDirectionMember = payload.isDirectionMember
    state.isSecretariat = payload.isSecretariat
    state.isStudent = payload.isStudent
    state.isTeacher = payload.isTeacher
    state.isParent = payload.isParent

    if (payload.userSchools) {
      state.schoolList = payload.userSchools
      state.selectedSchool = payload.userSchools[0]
    }

    if (payload.children) {
      state.children = payload.children
      state.selectedChild = payload.children[0]
    }
  },
  setSelectedSchool (state, payload) {
    state.selectedSchool = payload
  },
  setSelectedChild (state, payload) {
    state.selectedChild = payload
  },
  updateInterfacePreferences (state, payload) {
    state.themeColor = payload.themeColor
  },
  updatePicture (state, payload) {
    state.picture = payload
  },
  updateUserDetails (state, payload) {
    state.details.address = payload.address
    state.details.homePhoneNumber = payload.homePhone
    state.details.emailAddress = payload.mail
    state.details.mobilePhoneNumber = payload.mobilePhone
    state.details.officePhoneNumber = payload.proPhone
    state.details.smsPhoneNumber = payload.SMSPhone
    state.details.isLocalUser = payload.isLocalUser
    state.details.reportFrequency = payload.reportFrequency
    state.details.webdavUrl = payload.webdavUrl
  }
}
export const actions = {
  getPersonalDetails ({ commit }) {
    this.dispatch('currentActions/addAction', { name: 'getPersonalDetails' })
    userService.getPersonalDetails().then(
      (data) => {
        this.dispatch('currentActions/removeAction', { name: 'getPersonalDetails' })
        if (data.success) {
          commit('updateUserDetails', data)
        }
      },
      (err) => {
        // TODO toastr
        console.error(err)
      })
  },
  updatePersonalDetails ({ commit }, data) {
    commit('updateUserDetails', data)
  },
  getServiceList ({ commit }) {
    getUserApplications().then((data) => {
      if (data.success) {
        commit('initServiceList', data.services)
      }
    })
  },
  initUserInformations ({ rootState, commit, dispatch }) {
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
            if (data.themeColor !== rootState.theme.themeColor && data.themeColor !== 'FFFFFF') {
              dispatch('theme/updateMainColor', data.themeColor, { root: true })
            }
          }
          commit('initUserInformations', data)
        } else {
          commit('initUserInformations', { userId: 0 })
        }
      },
      (err) => {
        // TODO toastr
        console.error(err)
      })
  },
  removePicture ({ commit }) {
    userService.removeUserPicture().then(
      (data) => {
        if (data.success) {
          console.log('TODO get default img dynamiccaly')
          commit('updatePicture', '/image/user_male_portrait?img_id=3274117&t=1546588956172')
        }
      },
      (err) => {
        // TODO toastr
        console.error(err)
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
        console.error(err)
      })
  },
  saveProfilePicture ({ commit }, formData) {
    userService.updateUserPicture(formData).then(
      (data) => {
        if (data.success) {
          commit('updatePicture', data.imageUrl)
        }
      },
      (err) => {
        // TODO toastr
        console.error(err)
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
  },
  adminSchoolList (state) {
    const adminSchoolList = []
    state.schoolList.forEach(school => {
      if (school.isAdmin) {
        adminSchoolList.push(school)
      }
    })
    return adminSchoolList
  }
}
