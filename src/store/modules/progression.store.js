import { addProgression, deleteProgression, getProgressionList, updateProgression } from '@/api/progression.service'
import { getSubjects } from '@/api/userManagement.service'
import { getSchoolVoleeList } from '@/api/organization.service'

export const state = {
  isListMode: true,
  isEditMode: true,
  currentProgression: undefined,
  progressionList: undefined,
  subjectList: undefined,
  voleeList: undefined
}

export const mutations = {
  addProgression (state, payload) {
    state.progressionList.unshift(payload)
  },
  removeProgression (state, payload) {
    const index = state.progressionList.indexOf(payload)
    state.progressionList.splice(index, 1)
  },
  setProgressionList (state, payload) {
    state.progressionList = payload
  },
  setSubjectList (state, payload) {
    state.subjectList = payload
  },
  setVoleeList (state, payload) {
    state.voleeList = payload
  },
  updateProgression (state, payload) {
    const index = state.progressionList.map(item => item.progressionId).indexOf(payload.progressionId)
    state.progressionList[index] = payload
  },
  setCurrentProgression (state, payload) {
    state.currentProgression = payload
  },
  setEditMode (state, payload) {
    state.isEditMode = payload
  },
  setListMode (state, payload) {
    state.isListMode = payload
  }
}
export const actions = {
  addProgression ({ commit }, progression) {
    addProgression(progression).then(
      (data) => {
        if (data.success) {
          progression.progressionId = data.progressionId
          commit('addProgression', progression)
        }
      },
      (err) => {
        console.error(err)
      })
  },
  deleteProgression ({ commit }, progression) {
    deleteProgression(progression.progressionId).then(
      (data) => {
        if (data.success) {
          commit('removeProgression', progression)
        }
      },
      (err) => {
        // TODO toastr
        console.error(err)
      })
  },
  initProgressionList ({ commit }) {
    getProgressionList().then(
      (data) => {
        if (data.success) {
          commit('setProgressionList', data.progressions)
        }
      },
      (err) => {
        // TODO toastr
        console.error(err)
      })
  },
  initSubjectList ({ commit }) {
    getSubjects().then(
      (data) => {
        if (data.success) {
          commit('setSubjectList', data.subjects)
        }
      },
      (err) => {
        // TODO toastr
        console.error(err)
      })
  },
  initVoleeList ({ commit }) {
    getSchoolVoleeList().then(
      (data) => {
        if (data.success) {
          commit('setVoleeList', data.volees)
        }
      },
      (err) => {
        // TODO toastr
        console.error(err)
      })
  },
  updateProgression ({ commit }, progression) {
    updateProgression(progression).then(
      (data) => {
        if (data.success) {
          commit('updateProgression', progression)
        }
      },
      (err) => {
        console.error(err)
      })
  },
  setCurrentProgression ({ commit }, progression) {
    commit('setCurrentProgression', progression)
  },
  setEditMode ({ commit }, isEditMode) {
    commit('setEditMode', isEditMode)
  },
  setListMode ({ commit }, isListMode) {
    commit('setListMode', isListMode)
  }
}
