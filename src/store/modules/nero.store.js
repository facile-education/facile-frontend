import Vue from 'vue'
import neroService from '@/api/nero.service'
import router from '@/router'

export default {
  namespaced: true,
  state: {
    activeRoute: undefined,
    confirmModal: {
      buttonLabel: '',
      isDisplayed: '',
      message: '',
      onConfirm: Function,
      title: ''
    },
    isMobileMenuDisplayed: false,
    isPreferencesModalDisplayed: false,
    menu: undefined,
    menuExpanded: undefined,
    notifications: {
      contacts: undefined,
      messaging: undefined,
      dropbox: undefined
    }
  },
  mutations: {
    closeConfirmModal (state) {
      Vue.set(state.confirmModal, 'isDisplayed', false)
    },
    initSideMenu (state, payload) {
      state.menu = payload.menu
      state.menuExpanded = payload.expanded
    },
    showConfirmModal (state) {
      Vue.set(state.confirmModal, 'isDisplayed', true)
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
    updatePreferencesModalState (state, payload) {
      state.isPreferencesModalDisplayed = payload
    },
    updateConfirmModalParameters (state, payload) {
      Vue.set(state.confirmModal, 'buttonLabel', payload.buttonLabel)
      Vue.set(state.confirmModal, 'message', payload.message)
      Vue.set(state.confirmModal, 'onConfirm', payload.onConfirm)
      Vue.set(state.confirmModal, 'title', payload.title)
    }
  },
  actions: {
    closeConfirmModal ({ commit }) {
      commit('closeConfirmModal')
    },
    closePreferencesModal ({ commit }) {
      commit('updatePreferencesModalState', false)
    },
    initUserMenu ({ commit }) {
      return neroService.getUserMenu().then(
        (data) => {
          if (data.success) {
            router.createRoutes(data.menu)
            commit('initSideMenu', { menu: data.menu, expanded: data.expanded })
          }
          // TODO else toastr
        },
        (err) => {
          // TODO toastr
          console.log(err)
        })
    },
    initMobileMenu ({ commit }) {
      neroService.getMobileMenu().then(
        (data) => {
          if (data.success) {
            commit('initMobileMenu', data.menu)
          }
        })
    },
    toggleMobileMenu ({ commit }) {
      commit('toggleMobileMenu')
    },
    toggleSideMenu ({ commit }) {
      commit('toggleMenu')
    },
    openPreferencesModal ({ commit }) {
      commit('updatePreferencesModalState', true)
    },
    updateActiveRoute ({ commit }, service) {
      commit('updateActiveRoute', service)
    },
    updateAndShowConfirmModal ({ commit }, payload) {
      commit('updateConfirmModalParameters', payload)
      commit('showConfirmModal')
    }
  },
  getters: {
    getMobileMenu (state) {
      return router.getMobileMenu(state.menu).sort((itemA, itemB) => {
        return (itemA.mobileOrder > itemB.mobileOrder) ? 1 : -1
      })
    }
  }
}
