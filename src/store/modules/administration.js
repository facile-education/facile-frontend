import administrationService from '@/api/administration.service'

const GET_ADMIN_SCHOOLS = 'getAdministrationSchools'

export default {
  state: {
    schools: undefined,
    allSchools: undefined
  },
  mutations: {
    [GET_ADMIN_SCHOOLS] (state, payload) {
      state.schools = payload
    }
  },
  actions: {
    [GET_ADMIN_SCHOOLS] ({ commit, state }) {
      administrationService.getAdministrationSchools().then((data) => {
        commit(GET_ADMIN_SCHOOLS, data.etabList)
      })
    }
  },
  getters: {

  }
}
