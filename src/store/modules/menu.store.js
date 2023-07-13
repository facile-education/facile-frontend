import neroService from '@/api/nero.service'
import { updateSideMenuState } from '@/api/user.service'
import i18n from '@/i18n'
import router from '@/router'

function getRoute (entry) {
  return {
    name: entry.i18nKey,
    path: `/${i18n.global.t('Menu.route.' + entry.i18nKey)}${entry.param ? '/' + entry.param : ''}`, // localized path
    meta: { id: entry.id },
    component: () => import(`../../router/views/${entry.component}.vue`)
  }
}

export const state = {
  isLoadingMenu: false,
  menuError: false,
  activeRoute: undefined,
  isMobileMenuDisplayed: false,
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
  setIsLoadingMenu (state, payload) {
    state.isLoadingMenu = payload
  },
  setMenuError (state, payload) {
    state.menuError = payload
  },
  initSideMenu (state, payload) {
    state.menu = payload.menu
    state.menuExpanded = payload.expanded
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
    state.isMobileMenuDisplayed = false
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
    commit('setIsLoadingMenu', true)
    return neroService.getUserMenu().then((data) => {
      commit('setIsLoadingMenu', false)
      if (data.success) {
        commit('setMenuError', false)
        data.menu.forEach(entry => {
          if (entry.component !== undefined) {
            router.addRoute(getRoute(entry))
          } else {
            entry.menu.forEach(entry => {
              router.addRoute(getRoute(entry))
            })
          }
        })
        data.menu = data.menu.sort((a, b) => {
          return a.position > b.position
        })
        commit('initSideMenu', { menu: data.menu, expanded: data.expanded, sessionTimeout: data.sessionTimeout, sessionTimeoutWarning: data.sessionTimeoutWarning, notifications: data.notifications })
      } else {
        commit('setMenuError', true)
      }
    }, (err) => {
      commit('setIsLoadingMenu', false)
      commit('setMenuError', err)
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
