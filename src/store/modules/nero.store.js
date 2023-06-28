import neroService from '@/api/nero.service'
import { updateSideMenuState } from '@/api/user.service'
import i18n from '@/i18n'
import router from '@/router'

function getRoute (entry) {
  return {
    name: entry.i18nKey,
    path: `/${i18n.global.t('Menu.route.' + entry.i18nKey)}`, // localized path
    meta: { id: entry.id },
    component: () => import(`../../router/views/${entry.component}.vue`)
  }
}

export const state = {
  activeRoute: undefined,
  isMobileMenuDisplayed: false,
  isMenuExpandedOnLoad: undefined,
  menu: undefined,
  menuExpanded: undefined,
  notifications: {
    messaging: 0,
    courses: 0,
    schoollife: 0
  },
  sessionTimeout: 900000, // 15 min, Liferay default
  sessionTimeoutWarning: 60000 // 1 min, Liferay default
}

export const mutations = {
  initSideMenu (state, payload) {
    state.menu = payload.menu
    state.menuExpanded = payload.expanded
    state.isMenuExpandedOnLoad = payload.expanded
    state.sessionTimeout = payload.sessionTimeout
    state.sessionTimeoutWarning = payload.sessionTimeoutWarning
    state.notifications = payload.notifications
  },
  toggleMenu (state) {
    state.menuExpanded = !state.menuExpanded
  },
  toggleMobileMenu (state) {
    state.isMobileMenuDisplayed = !state.isMobileMenuDisplayed
  },
  updateActiveRoute (state, payload) {
    state.activeRoute = payload
  },
  updateMessagingNotification (state, payload) {
    state.notifications.messaging -= payload
  },
  updateCoursesNotification (state, payload) {
    state.notifications.courses -= payload
  },
  updateSchoollifeNotification (state, payload) {
    state.notifications.schoollife -= payload
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
          commit('initSideMenu', { menu: data.menu, expanded: data.expanded, sessionTimeout: data.sessionTimeout, sessionTimeoutWarning: data.sessionTimeoutWarning, notifications: data.notifications })
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
  toggleSideMenu ({ commit, state }) {
    commit('toggleMenu')
    updateSideMenuState(state.menuExpanded)
  },
  updateActiveRoute ({ commit }, service) {
    commit('updateActiveRoute', service)
  },
  updateMessagingNotification ({ commit }, nbRead) {
    commit('updateMessagingNotification', nbRead)
  },
  updateCoursesNotification ({ commit }, nbRead) {
    commit('updateCoursesNotification', nbRead)
  },
  updateSchoollifeNotification ({ commit }, nbRead) {
    commit('updateSchoollifeNotification', nbRead)
  }
}

export const getters = {
  getMobileMenu (state) {
    return router.getMobileMenu(state.menu).sort((itemA, itemB) => {
      return (itemA.mobileOrder > itemB.mobileOrder) ? 1 : -1
    })
  }
}
