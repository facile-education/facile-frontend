const INIT_CURRENT_USER = 'INIT_CURRENT_USER'

export default {
  state: {
    id: 0,
    firstName: '',
    lastName: '',
    picture: ''
  },
  mutations: {
    [INIT_CURRENT_USER] (state, user) {
      state.id = user.id
      state.firstName = user.firstName
      state.lastName = user.lastName
      state.picture = user.picture
    }
  },
  actions: {
    // TODO axios get infos
    [INIT_CURRENT_USER] ({ commit, state }) {
      setTimeout(() => {
        var user = {
          id: 0,
          firstName: 'Jean',
          lastName: 'Bombeur',
          picture: '/public/img/logo.png'
        }

        commit(INIT_CURRENT_USER, user)
      }, 1000)
    }
  },
  getters: {

  }
}
