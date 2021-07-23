import applicationManagerService from '@/api/applicationManager.service'

export const state = {
  applicationList: undefined,
  selectedApplication: undefined,
  showBroadcastModal: false,
  showEditionModal: false
}
export const mutations = {
  addApplication (state, payload) {
    state.applicationList.push({ app: payload })
  },
  getSchoolApplicationList (state, payload) {
    state.applicationList = payload
  },
  removeApplication (state) {
    const index = state.applicationList.indexOf(state.selectedApplication)
    state.applicationList.splice(index, 1)
  },
  setSelectedApplication (state, payload) {
    state.selectedApplication = payload
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
      const index = state.applicationList.indexOf(state.selectedApplication)
      state.applicationList.splice(index, 1)
      state.applicationList.push({ app: payload })
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
          if (data.service.etabFilters.length === 0) {
            commit('addApplication', data.service)
          } else {
            for (let idx = 0; idx < data.service.etabFilters.length; ++idx) {
              if (data.service.etabFilters[idx].schoolId === school.schoolId) {
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
  exportApplicationUserList ({ state }, { school, role }) {
    applicationManagerService.exportApplicationUserList(school.schoolId,
      state.selectedApplication.serviceId, role).then((data) => {
      if (data.success) {
        console.log(data)
      }
    })
  },
  getApplicationDefaultRoleList ({ state, commit }) {
    applicationManagerService.getApplicationDefaultRoleList(state.selectedApplication.serviceId).then(
      (data) => {
        if (data.success) {
          commit('updateApplication', { property: 'roleList', value: data.defaultRoles })
        }
      },
      (err) => {
        // TODO toastr
        console.error(err)
      })
  },
  getSchoolApplicationList ({ commit }, school) {
    applicationManagerService.getSchoolApplications(school.schoolId).then(
      (data) => {
        if (data.success) {
          commit('getSchoolApplicationList', data.serviceList)
        }
      },
      (err) => {
        // TODO toastr
        console.error(err)
      })
  },
  getApplicationBroadcastScope ({ state, commit }) {
    applicationManagerService.getApplicationBroadcastScope(state.selectedApplication.serviceId).then(
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
    applicationManagerService.removeApplication(state.selectedApplication.serviceId).then(
      (data) => {
        if (data.success) {
          commit('removeApplication')
        }
      },
      (err) => {
        // TODO toastr
        console.error(err)
      })
  },
  resetApplication ({ commit }) {
    commit('setSelectedApplication', {
      etabFilters: [],
      exportParent: false,
      exportStudent: false,
      exportTeacher: false,
      exportUser: false,
      image: undefined,
      globalUrl: '',
      hasCustomUrl: false,
      hasGlobalUrl: false,
      portletId: undefined,
      roleList: [],
      serviceName: '',
      serviceKey: '',
      serviceCategory: ''
    })
  },
  selectApplication ({ commit, dispatch }, application) {
    commit('setSelectedApplication', application)
    dispatch('getApplicationBroadcastScope')
  },
  updateApplication ({ commit, dispatch }, application) {
    applicationManagerService.updateApplication(application).then(
      (data) => {
        if (data.success) {
          commit('updateApplication', application)
          if (application.rules === undefined || application.rules.length === 0) {
            dispatch('closeEditionModal')
          }
        }
      },
      (err) => {
        // TODO toastr
        console.error(err)
      })
  },
  updateBroadcastScope ({ state, commit, dispatch }, { school, ruleList, ruleIdList }) {
    applicationManagerService.updateBroadcastScope(school.schoolId,
      state.selectedApplication.serviceId, ruleIdList).then(
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
  updateBroadcastStatus ({ state, commit }, { school, isAvailable }) {
    applicationManagerService.updateBroadcastStatus(school.schoolId,
      state.selectedApplication.serviceId, isAvailable).then(
      (data) => {
        if (data.success) {
          commit('updateApplication', { property: 'isAvailable', value: isAvailable })
        }
      },
      (err) => {
        // TODO toastr
        console.error(err)
      })
  },
  updateURL ({ state, commit }, { school, applicationURL }) {
    applicationManagerService.updateURL(school.schoolId,
      state.selectedApplication.serviceId, applicationURL).then(
      (data) => {
        if (data.success) {
          commit('updateApplication', { property: 'serviceUrl', value: applicationURL })
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
      const app = state.applicationList[index].app
      if (categoryList.indexOf(app.serviceCategory) === -1) {
        categoryList.push(app.serviceCategory)
      }
    }
    return categoryList.sort()
  }
}
