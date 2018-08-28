import neroService from '@/api/nero.service'

export default {
  namespaced: true,
  state: {
    menu: undefined,
    menuExpanded: undefined,
    activeRoute: undefined,
    notifications: {
      contacts: undefined,
      messaging: undefined,
      dropbox: undefined
    }
  },
  mutations: {
    initSideMenu (state, payload) {
      state.menu = payload.menu
      state.menuExpanded = payload.expanded
    },
    toggleMenu (state) {
      state.menuExpanded = !state.menuExpanded
    },
    updateActiveRoute (state, payload) {
      state.activeRoute = payload
    }
  },
  actions: {
    initUserMenu ({ commit }) {
      return neroService.getUserMenu().then(
        (data) => {
          if (data.success) {
            commit('initSideMenu', {menu: data.menu, expanded: data.expanded})
          }
          // TODO else toastr
        },
        (err) => {
          // TODO toastr
          console.log(err)
        })
    },
    toggleSideMenu ({ commit }) {
      commit('toggleMenu')
    },
    updateActiveRoute ({ commit }, service) {
      commit('updateActiveRoute', service)
    }
  },
  getters: {

  }
}
