import supportService from '@/api/support.service'

export default {
  namespaced: true,
  state: {
  },
  mutations: {
  },
  actions: {
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
