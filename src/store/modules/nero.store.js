import neroService from '@/api/nero.service'
import router from '@/router'

export const state = {
  activeRoute: undefined,
  isMobileMenuDisplayed: false,
  isMenuExpandedOnLoad: undefined,
  menu: undefined,
  menuExpanded: undefined,
  notifications: {
    // contacts: undefined,
    messaging: undefined
    // dropbox: undefined
  }
}

export const mutations = {
  initSideMenu (state, payload) {
    state.menu = payload.menu
    state.menuExpanded = payload.expanded
    state.isMenuExpandedOnLoad = payload.expanded
  },
  toggleMenu (state) {
    state.menuExpanded = !state.menuExpanded
  },
  toggleMobileMenu (state) {
    state.isMobileMenuDisplayed = !state.isMobileMenuDisplayed
  },
  updateActiveRoute (state, payload) {
    state.activeRoute = payload
  }
}

export const actions = {
  initUserMenu ({ commit }) {
    return neroService.getUserMenu().then(
      (data) => {
        if (data.success) {
          // TODO when full Vue
          // router.createRoutes(data.menu) -> addRoute({ path: '/about', component: About })
          commit('initSideMenu', { menu: data.menu, expanded: data.expanded })
        }
        // TODO else toastr
      },
      (err) => {
        // TODO toastr
        console.error(err)
      })
  },
  toggleMobileMenu ({ commit }) {
    commit('toggleMobileMenu')
  },
  toggleSideMenu ({ commit }) {
    commit('toggleMenu')
  },
  updateActiveRoute ({ commit }, service) {
    commit('updateActiveRoute', service)
  }
}

export const getters = {
  getMobileMenu (state) {
    return router.getMobileMenu(state.menu).sort((itemA, itemB) => {
      return (itemA.mobileOrder > itemB.mobileOrder) ? 1 : -1
    })
  }
}
