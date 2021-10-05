import { addProgression, deleteProgression, getProgressionList, updateProgression, getProgressionContent, addFolder, addItem, deleteFolder } from '@/api/progression.service'
import { getSubjects } from '@/api/userManagement.service'
import { getSchoolVoleeList } from '@/api/organization.service'

export const state = {
  subjectList: undefined,
  voleeList: undefined,
  progressionList: undefined,
  isListMode: true,
  isEditMode: true,
  currentProgression: undefined,
  currentFolder: undefined
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
    console.log('setCurrentProgression for ', payload)
  },
  setCurrentProgressionContent (state, payload) {
    state.currentProgression.sections = payload.sections
    state.currentProgression.items = payload.items
  },
  setCurrentFolder (state, payload) {
    state.currentFolder = payload
  },
  setEditMode (state, payload) {
    state.isEditMode = payload
  },
  setListMode (state, payload) {
    state.isListMode = payload
  },
  addFolder (state, payload) {
    // Loop over progression to add the created folder
    if (payload.parentId === 0) {
      state.currentProgression.sections.push(payload)
    } else {
      for (let idx = 0; idx < state.currentProgression.sections.length; ++idx) {
        const section = state.currentProgression.sections[idx]
        if (section.folderId === payload.parentId) {
          if (section.subSections === undefined) {
            section.subSections = []
          }
          section.subSections.push(payload)
        }
      }
    }
  },
  addItem (state, payload) {
    console.log('addItem payload=', payload)
    const sectionIndex = state.currentProgression.sections.map(section => section.folderId).indexOf(payload.parentId)
    if (sectionIndex !== -1) {
      // This is a section item
      state.currentProgression.sections[sectionIndex].items.push(payload)
    } else {
      // This is a sub-section item
      for (let idx = 0; idx < state.currentProgression.sections.length; ++idx) {
        const section = state.currentProgression.sections[idx]
        const subSectionIndex = section.subSections.map(subSection => subSection.folderId).indexOf(payload.parentId)
        if (subSectionIndex !== -1) {
          section.subSections[subSectionIndex].items.push(payload)
        }
      }
    }
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
    commit('setCurrentFolder', undefined) // root folder
  },
  setCurrentFolder ({ commit }, folder) {
    commit('setCurrentFolder', folder)
  },
  setEditMode ({ commit }, isEditMode) {
    commit('setEditMode', isEditMode)
  },
  setListMode ({ commit }, isListMode) {
    commit('setListMode', isListMode)
  },
  getProgressionContent ({ commit }, progressionId) {
    getProgressionContent(progressionId).then(
      (data) => {
        if (data.success) {
          commit('setCurrentProgressionContent', data)
        }
      },
      (err) => {
        // TODO toastr
        console.error(err)
      })
  },
  addFolder ({ commit, state }, { folderName, order }) {
    const currentFolderId = (state.currentFolder !== undefined ? state.currentFolder.folderId : 0)
    console.log('addFolder with ', state.currentProgression.progressionId, ' and ', currentFolderId, ' and ', folderName, ' and ', order)
    addFolder(state.currentProgression.progressionId, currentFolderId, folderName, order).then(
      (data) => {
        if (data.success) {
          commit('addFolder', { folderName: folderName, order: order, folderId: data.folderId, parentId: currentFolderId, progressionId: state.currentProgression.progressionId })
        }
      },
      (err) => {
        // TODO toastr
        console.error(err)
      })
  },
  addItem ({ commit, state }, { itemName, isHomework, type, order }) {
    const currentFolderId = (state.currentFolder !== undefined ? state.currentFolder.folderId : 0)
    console.log('addItem with ', state.currentProgression.progressionId, ' and ', currentFolderId)
    addItem(state.currentProgression.progressionId, currentFolderId, itemName, isHomework, type, '', order).then(
      (data) => {
        if (data.success) {
          commit('addItem', { name: itemName, order: order, itemId: data.itemId, parentId: currentFolderId, progressionId: state.currentProgression.progressionId })
        }
      },
      (err) => {
        // TODO toastr
        console.error(err)
      })
  },
  deleteFolder ({ commit }, folder) {
    deleteFolder(folder.folderId).then(
      (data) => {
        if (data.success) {
          getProgressionContent(folder.progressionId)
        }
      },
      (err) => {
        // TODO toastr
        console.error(err)
      })
  }
}
