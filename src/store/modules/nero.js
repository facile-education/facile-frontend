import neroService from '@/api/nero.service'

export default {
  state: {
    user: undefined,
    menu: undefined
  },
  mutations: {
    initUserMenu (state, payload) {
      state.menu = payload
    }
  },
  actions: {
    initUserMenu ({ commit }) {
      return neroService.getUserMenu().then(
        (data) => {
          if (data.success) {
            commit('initUserMenu', data.menu)
          }
          // TODO else toastr
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
