import communicationManagerService from '@/api/communicationManager.service'

export default {
  state: {
    selectedSchoolId: undefined,
    roleList: undefined,
    CMInternalRights: undefined,
    CMExternalRights: undefined
  },
  mutations: {
    setSelectedSchoolId (state, payload) {
      state.selectedSchoolId = payload
    },
    initCommunicationManagerRoleList (state, payload) {
      state.roleList = payload
    },
    initInternalRights (state, payload) {
      state.CMInternalRights = { ...payload }
    },
    initExternalRights (state, payload) {
      state.CMExternalRights = { ...payload }
    }
  },
  actions: {
    setCommunicationManagerSelectedSchoolId ({ commit }, { schoolId }) {
      commit('setSelectedSchoolId', schoolId)
    },
    initCommunicationManagerRoleList ({ commit }) {
      communicationManagerService.getCommunicationRoleList().then((data) => {
        if (data.success) {
          commit('initCommunicationManagerRoleList', data.roles)
        }
        // TODO else toastr err
      },
      (err) => {
        // TODO toastr
        console.log(err)
      })
    },
    getSchoolInternalCommunicationRights ({ commit }, { schoolId }) {
      communicationManagerService.getInternalCommunicationRights(schoolId).then((data) => {
        if (data.success) {
          commit('initInternalRights', data)
        }
        // TODO else toastr err
      },
      (err) => {
        // TODO toastr
        console.log(err)
      })
    },
    updateSchoolInternalCommunicationRights ({ commit }, { schoolId, rightList }) {
      communicationManagerService.setInternalCommunicationRights(schoolId, rightList).then((data) => {
        if (data.success) {
          commit('initInternalRights', rightList)
        }
        // TODO else toastr err
      },
      (err) => {
        // TODO toastr
        console.log(err)
      })
    },
    getSchoolExternalCommunicationRights ({ commit }, { schoolId }) {
      communicationManagerService.getExternalCommunicationRights(schoolId).then((data) => {
        if (data.success) {
          commit('initExternalRights', data)
        }
        // TODO else toastr err
      },
      (err) => {
        // TODO toastr
        console.log(err)
      })
    },
    updateSchoolExternalCommunicationRights ({ commit }, { schoolId, rightList }) {
      communicationManagerService.setExternalCommunicationRights(schoolId, rightList).then((data) => {
        if (data.success) {
          commit('initExternalRights', data)
        }
        // TODO else toastr err
      },
      (err) => {
        // TODO toastr
        console.log(err)
      })
    }
  },
  getters: {

  }
}
