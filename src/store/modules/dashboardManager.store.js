import dashboardManagerService from '@/api/dashboardManager.service'
import Vue from 'vue'

export default {
  namespaced: true,
  state: {
    isWidgetEditionModalDisplayed: false,
    editedWidget: {},
    scopeList: {
      'PENTILA': 1,
      'ENT_ADMIN': 2,
      'USER_SCHOOL': 3,
      'SCHOOL': 4,
      'USER': 5,
      'SCHOOL_INSTANCE': 6,
      'ENT_ADMIN_INSTANCE': 7
    },
    widgetList: undefined
  },
  mutations: {
    initSchoolWidgetList (state, payload) {
      state.widgetList = payload
    },
    hideWidgetEditionModalDisplayed (state) {
      state.isWidgetEditionModalDisplayed = false
    },
    showWidgetEditionModalDisplayed (state, payload) {
      state.editedWidget = payload
      state.isWidgetEditionModalDisplayed = true
    },
    removeFromList (state, payload) {
      state.widgetList.splice(state.widgetList.indexOf(payload), 1)
    },
    updateWidgetList (state, payload) {
      var isWidgetCreated = true
      for (var idx = 0; idx < state.widgetList.length; ++idx) {
        if (payload.widgetId === state.widgetList[idx].widgetId) {
          Vue.set(state.widgetList, idx, payload)
          isWidgetCreated = false
        }
      }

      if (isWidgetCreated) state.widgetList.push(payload)
    }
  },
  actions: {
    closeEditionModal ({ commit }) {
      commit('hideWidgetEditionModalDisplayed')
    },
    deleteWidget ({ commit }, widget) {
      dashboardManagerService.deleteWidget(widget.widgetId).then(
        (data) => {
          if (data.success) {
            commit('removeFromList', widget)
          }
        },
        (err) => {
          // TODO toastr
          console.log(err)
        })
    },
    getSchoolWidgetList ({ commit }, school) {
      dashboardManagerService.getSchoolDMWidgetList(school.schoolId).then(
        (data) => {
          if (data.success) {
            commit('initSchoolWidgetList', data.widgets)
          }
        },
        (err) => {
          // TODO toastr
          console.log(err)
        })
    },
    openEditionModal ({ commit }, editedWidget) {
      commit('showWidgetEditionModalDisplayed', editedWidget)
    },
    saveWidget ({ commit }, widget) {
      dashboardManagerService.saveWidget(widget).then(
        (data) => {
          if (data.success) {
            if (data.widgetId) {
              widget.widgetId = data.widgetId
            }
            commit('updateWidgetList', widget)
            commit('hideWidgetEditionModalDisplayed')
          }
        },
        (err) => {
          // TODO toastr
          console.log(err)
        })
    }
  },
  getters: {
    typeList (state) {
      if (state.widgetList === undefined) {
        return undefined
      }

      var typeList = []
      for (var index = 0; index < state.widgetList.length; ++index) {
        var widget = state.widgetList[index]
        if (widget.scope === state.scopeList['USER_SCHOOL'] ||
            widget.scope === state.scopeList['SCHOOL']) {
          if (typeList.indexOf(widget.type) === -1) {
            typeList.push(widget.type)
          }
        }
      }
      return typeList.sort()
    }
  }
}
