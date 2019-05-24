import supportService from '@/api/support.service'

export default {
  namespaced: true,
  state: {
    fileList: []
  },
  mutations: {
    addFile (state, payload) {
      state.fileList.push(payload)
    }
  },
  actions: {
    addScreenShot ({ commit }, { image }) {
      supportService.addScreenShot(image).then((data) => {
        if (data.success) {
          const file = {
            type: 'Fichier',
            id: data.fileId
          }
          commit('addFile', file)
        } else {
        }
      })
    },
    createMessage ({ commit }, { subjectField, contentField, mail, attachFiles, isUsurpationAllowed }) {
      supportService.createMessage(subjectField, contentField, mail, attachFiles, isUsurpationAllowed).then((data) => {
        if (data.success) {
          this.dispatch('nero/closeSupportModal')
          // TODO popup message "success"
        } else {
          // TODO popup message "fail"
        }
      })
    }
  }
}