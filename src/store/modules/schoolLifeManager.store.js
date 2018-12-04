import schoolLifeManagerService from '@/api/schoolLifeManager.service'

export default {
  namespaced: true,
  state: {
    isAgendaSynchronizationActive: false,
    isMembershipsSynchronizationActive: false,
    isNotebookSynchronizationActive: false,
    isSynchronized: false,
    isUploaded: false,
    lastSynchronizationDate: undefined,
    lastUploadDate: undefined,
    synchronizationType: undefined
  },
  mutations: {
    updateSynchronizationInformations (state, payload) {
      state.contactList = payload
      state.lastSynchronizationDate = payload.latestsynchroday + ' ' + payload.latestsynchrohour
      state.lastUploadDate = payload.latestuploadday + ' ' + payload.latestuploadhour
      state.isAgendaSynchronizationActive = payload.doSyncAgenda
      state.isMembershipsSynchronizationActive = payload.doSyncMemberships
      state.isNotebookSynchronizationActive = payload.doSyncCDT
      // isUploaded: true,
      // isSynchronized: true
    },
    updateSynchronizationType (state, payload) {
      state.synchronizationType = payload
    }
  },
  actions: {
    getSynchronizationInformations ({ commit }) {
      schoolLifeManagerService.getSynchronizationInformations().then(
        (data) => {
          if (data.success) {
            commit('updateSynchronizationInformations', data)
          }
        },
        (err) => {
          // TODO toastr
          console.log(err)
        })
    },
    getSynchronizationType ({ commit }, school) {
      // TODO Params
      schoolLifeManagerService.getSynchronizationType().then(
        (data) => {
          if (data.success) {
            commit('updateSynchronizationType', data.type)
          }
        },
        (err) => {
          // TODO toastr
          console.log(err)
        })
    },
    updateSynchronizationType ({ commit }, type) {
      schoolLifeManagerService.updateSynchronizationType(type).then(
        (data) => {
          if (data.success) {
            commit('updateSynchronizationType', type)
          }
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
