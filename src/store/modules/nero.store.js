import Vue from 'vue'
import neroService from '@/api/nero.service'
import router from '@/router'

export default {
  namespaced: true,
  state: {
    activeRoute: undefined,
    confirmModal: {
      buttonLabel: '',
      isDisplayed: false,
      message: '',
      onConfirm: Function,
      title: ''
    },
    imagePickerModal: {
      isDisplayed: false,
      onConfirm: Function
    },
    isMobileMenuDisplayed: false,
    isPreferencesModalDisplayed: false,
    isInformationModalDisplayed: false,
    isVersionEditionModalDisplayed: false,
    isMenuExpandedOnLoad: undefined,
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
      state.isMenuExpandedOnLoad = payload.expanded
    },
    openConfirmModal (state, payload) {
      Vue.set(state.confirmModal, 'title', payload.title)
      Vue.set(state.confirmModal, 'message', payload.message)
      Vue.set(state.confirmModal, 'buttonLabel', payload.buttonLabel)
      Vue.set(state.confirmModal, 'onConfirm', payload.onConfirm)
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
    updateImagePickerModalState (state, payload) {
      Vue.set(state.imagePickerModal, 'onConfirm', payload.onConfirm)
      Vue.set(state.imagePickerModal, 'isDisplayed', payload.show)
    },
    updatePreferencesModalState (state, payload) {
      state.isPreferencesModalDisplayed = payload
    },
    updateInformationModalState (state, payload) {
      state.isInformationModalDisplayed = payload
    },
    updateVersionEditionModalState (state, payload) {
      state.isVersionEditionModalDisplayed = payload
    }
  },
  actions: {
    closeConfirmModal ({ commit }) {
      commit('closeConfirmModal')
    },
    closeImagePickerModal ({ commit }) {
      commit('updateImagePickerModalState', { show: false })
    },
    closePreferencesModal ({ commit }) {
      commit('updatePreferencesModalState', false)
    },
    closeInformationModal ({ commit }) {
      commit('updateInformationModalState', false)
    },
    closeVersionEditionModal ({ commit }) {
      commit('updateVersionEditionModalState', false)
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
    openConfirmModal ({ commit }, payload) {
      commit('openConfirmModal', payload)
    },
    openImagePickerModal ({ commit }, payload) {
      commit('updateImagePickerModalState', { show: true, ...payload })
    },
    openPreferencesModal ({ commit }) {
      commit('updatePreferencesModalState', true)
    },
    openInformationModal ({ commit }) {
      commit('updateInformationModalState', true)
    },
    openVersionEditionModal ({ commit }) {
      commit('updateVersionEditionModalState', true)
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
  },
  getters: {
    getMobileMenu (state) {
      return router.getMobileMenu(state.menu).sort((itemA, itemB) => {
        return (itemA.mobileOrder > itemB.mobileOrder) ? 1 : -1
      })
    }
  }
}
