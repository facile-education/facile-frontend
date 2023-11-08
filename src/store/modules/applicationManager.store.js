import WeprodeUtils from '@utils/weprode.utils'

import applicationManagerService from '@/api/applicationManager.service'

export const state = {
  applicationList: undefined,
  selectedApplication: undefined,
  showBroadcastModal: false,
  showEditionModal: false,
  isAdministratorMode: false
}
export const mutations = {
  addApplication (state, payload) {
    state.applicationList.push({ app: payload })
  },
  getSchoolApplicationList (state, payload) {
    state.applicationList = payload
  },
  removeApplication (state, payload) {
    const index = state.applicationList.map(item => item.applicationId).indexOf(payload.applicationId)
    state.applicationList.splice(index, 1)
  },
  setSelectedApplication (state, payload) {
    state.selectedApplication = payload
  },
  setAdministratorMode (state, payload) {
    state.isAdministratorMode = payload
  },
  toggleBroadcastModal (state, show) {
    state.showBroadcastModal = show
  },
  toggleEditionModal (state, show) {
    state.showEditionModal = show
  },
  updateApplication (state, payload) {
    if (payload.property !== undefined) {
      state.selectedApplication[payload.property] = payload.value
    } else {
      const index = state.applicationList.map(item => item.applicationId).indexOf(payload.applicationId)
      state.applicationList[index] = payload
    }
  }
}
export const actions = {
  closeBroadcastModal ({ commit }) {
    commit('toggleBroadcastModal', false)
  },
  closeEditionModal ({ commit }) {
    commit('toggleEditionModal', false)
  },
  createApplication ({ commit, dispatch }, { application, school }) {
    applicationManagerService.createApplication(application).then(
      (data) => {
        if (data.success) {
          // Add application to list if there is no school filter or if the selected school is targeted
          if (data.service.authorizedSchools.length === 0) {
            commit('addApplication', data.service)
          } else {
            for (let idx = 0; idx < data.service.authorizedSchools.length; ++idx) {
              if (data.service.authorizedSchools[idx].schoolId === school.schoolId) {
                commit('addApplication', data.service)
                break
              }
            }
          }
          dispatch('closeEditionModal')
        }
      },
      (err) => {
        // TODO toastr
        console.error(err)
      })
  },
  exportApplicationUserList ({ state }, { school, type }) {
    return applicationManagerService.exportApplicationUserList(school.schoolId,
      state.selectedApplication.applicationId, type).then((data) => {
      if (data.success) {
        return data.message
      }
    })
  },
  getSchoolApplicationList ({ commit }, school) {
    applicationManagerService.getSchoolApplications(school.schoolId).then(
      (data) => {
        if (data.success) {
          commit('getSchoolApplicationList', data.services)
        }
      },
      (err) => {
        // TODO toastr
        console.error(err)
      })
  },
  getApplicationBroadcastScope ({ state, commit }, school) {
    applicationManagerService.getApplicationBroadcastScope(state.selectedApplication.applicationId, school.schoolId).then(
      (data) => {
        if (data.success) {
          // TODO userFilters property ?
          commit('updateApplication', { property: 'rules', value: data.rules })
        }
      },
      (err) => {
        // TODO toastr
        console.error(err)
      })
  },
  openBroadcastModal ({ commit }) {
    commit('toggleBroadcastModal', true)
  },
  openEditionModal ({ commit }) {
    commit('toggleEditionModal', true)
  },
  removeApplication ({ state, commit }) {
    const app = WeprodeUtils.deepCopy(state.selectedApplication)
    applicationManagerService.removeApplication(state.selectedApplication.applicationId).then(
      (data) => {
        if (data.success) {
          commit('removeApplication', app)
        }
      },
      (err) => {
        // TODO toastr
        console.error(err)
      })
  },
  resetApplication ({ commit }) {
    commit('setSelectedApplication', {
      applicationName: '',
      applicationKey: '',
      category: '',
      roleList: [],
      authorizedSchools: [],
      globalUrl: '',
      hasCustomUrl: false,
      hasGlobalUrl: false,
      menuEntryId: -1,
      exportParent: false,
      exportStudent: false,
      exportTeacher: false,
      exportUser: false,
      exportOther: false,
      image: undefined
    })
  },
  selectApplication ({ commit, dispatch }, { application, school }) {
    commit('setSelectedApplication', application)
    dispatch('getApplicationBroadcastScope', school)
  },
  updateApplication ({ commit, dispatch }, application) {
    applicationManagerService.updateApplication(application).then(
      (data) => {
        if (data.success) {
          commit('updateApplication', application)
          dispatch('closeEditionModal')
        }
      },
      (err) => {
        // TODO toastr
        console.error(err)
      })
  },
  updateBroadcastScope ({ state, commit, dispatch }, { school, ruleList, ruleIdList }) {
    applicationManagerService.updateBroadcastScope(state.selectedApplication.applicationId, school.schoolId, ruleIdList).then(
      (data) => {
        if (data.success) {
          commit('updateApplication', { property: 'rules', value: ruleList })
          dispatch('closeBroadcastModal')
        }
      },
      (err) => {
        // TODO toastr
        console.error(err)
      })
  },
  updateBroadcast ({ state, commit }, { school, isBroadcasted }) {
    applicationManagerService.updateBroadcast(state.selectedApplication.applicationId, school.schoolId, isBroadcasted, state.selectedApplication.applicationURL === undefined ? '' : state.selectedApplication.applicationURL).then(
      (data) => {
        if (data.success) {
          commit('updateApplication', { property: 'isBroadcasted', value: isBroadcasted })
        }
      },
      (err) => {
        // TODO toastr
        console.error(err)
      })
  },
  updateURL ({ state, commit }, { school, applicationURL }) {
    applicationManagerService.updateBroadcast(state.selectedApplication.applicationId, school.schoolId, state.selectedApplication.isBroadcasted, applicationURL).then(
      (data) => {
        if (data.success) {
          commit('updateApplication', { property: 'applicationUrl', value: applicationURL })
        }
      },
      (err) => {
        // TODO toastr
        console.error(err)
      })
  }
}
export const getters = {
  categoryList (state) {
    if (state.applicationList === undefined) {
      return undefined
    }

    const categoryList = []
    for (let index = 0; index < state.applicationList.length; ++index) {
      const app = state.applicationList[index]
      if (categoryList.indexOf(app.category) === -1) {
        categoryList.push(app.category)
      }
    }
    return categoryList.sort()
  }
}
