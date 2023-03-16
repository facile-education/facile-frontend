import neroService from '@/api/nero.service'
import i18n from '@/i18n'
import router from '@/router'

function capitalize (string) {
  return string.charAt(0).toUpperCase() + string.slice(1).replaceAll('-', ' ')
}

function getRoute (entry) {
  return {
    name: capitalize(i18n.global.t('Menu.route.' + entry.i18nKey)),
    path: `/${i18n.global.t('Menu.route.' + entry.i18nKey)}`,
    component: () => import('@/router/views/' + entry.component + '.vue')
  }
}

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
          data.menu.forEach(entry => {
            if (entry.component !== undefined) {
              router.addRoute(getRoute(entry))
            } else {
              entry.menu.forEach(entry => {
                router.addRoute(getRoute(entry))
              })
            }
          })
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
