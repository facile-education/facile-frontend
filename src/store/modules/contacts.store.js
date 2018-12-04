import contactsService from '@/api/contacts.service'

export default {
  namespaced: true,
  state: {
    contactList: undefined
  },
  mutations: {
    updateContactList (state, payload) {
      state.contactList = payload
    }
  },
  actions: {
    getContactList ({ commit }, school) {
      // TODO params
      contactsService.getContactList().then(
        (data) => {
          if (data.success) {
            commit('updateContactList', data.contacts)
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
