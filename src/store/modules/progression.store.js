import {
  addProgression, deleteProgression, getProgressionList, updateProgression, getProgressionContent, addFolder,
  updateFolder, addItem, updateItem, addItemContent, updateItemContent, deleteFolder, deleteItem, getFolderContent,
  getItemContents, deleteItemContent, addAssignment, deleteAssignment
} from '@/api/progression.service'
import { getSubjects } from '@/api/userManagement.service'
import { getSchoolVoleeList } from '@/api/organization.service'
import { getCoursList, getSessions } from '@/api/cdt.service'

export const helperMethods = {
  getFolderByFolderId (progression, folderId) {
    // Loop over progression to add the created folder
    if (folderId === 0) {
      return progression
    } else {
      const sectionIndex = progression.sections.map(section => section.folderId).indexOf(folderId)
      if (sectionIndex !== -1) {
        // This is a section
        return progression.sections[sectionIndex]
      } else {
        // This is a sub-section
        for (let idx = 0; idx < progression.sections.length; ++idx) {
          const section = progression.sections[idx]
          const subSectionIndex = section.subSections.map(subSection => subSection.folderId).indexOf(folderId)
          if (subSectionIndex !== -1) {
            return section.subSections[subSectionIndex]
          }
        }
      }
    }
  },
  getItemByItemId (progression, itemId) {
    // Loop over progression
    for (let idx = 0; idx < progression.sections.length; ++idx) {
      const section = progression.sections[idx]
      // Loop over section items
      const itemIndex = section.items.map(item => item.itemId).indexOf(itemId)
      if (itemIndex !== -1) {
        return section.items[itemIndex]
      }
      // Loop over sub-sections
      for (let subIdx = 0; idx < section.subSections.length; ++subIdx) {
        const subSection = section.subSections[subIdx]
        const itemIndex = subSection.items.map(item => item.itemId).indexOf(itemId)
        if (itemIndex !== -1) {
          return subSection.items[itemIndex]
        }
      }
    }
  }
}

export const state = {
  isLoading: false,
  subjectList: undefined,
  voleeList: undefined,
  coursList: undefined,
  progressionList: undefined,
  currentProgression: undefined,
  currentFolder: undefined,
  currentItem: undefined,
  isListMode: true,
  isEditMode: true,
  isCreateMenuDisplayed: false,
  isCalendarPickerMode: false,
  isHomeworkAssignmentMode: false,
  affectedItem: undefined,
  selectedSessions: [],
  startDate: undefined,
  endDate: undefined,
  sessionList: [],
  filterFolder: { name: 'Toute la progression', folderId: 0 },
  filterCours: { groupName: 'Tous les cours', groupId: 0 }
}

export const mutations = {
  addProgression (state, payload) {
    state.progressionList.push(payload)
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
  setCoursList (state, payload) {
    // Loop over schools to get groups only
    state.coursList = []
    for (let idx = 0; idx < payload.length; ++idx) {
      const school = payload[idx]
      for (let j = 0; j < school.groups.length; j++) {
        state.coursList.push(school.groups[j])
      }
    }
  },
  updateProgression (state, payload) {
    const index = state.progressionList.map(item => item.progressionId).indexOf(payload.progressionId)
    state.progressionList[index] = payload
  },
  setCurrentProgression (state, payload) {
    state.currentProgression = payload
  },
  setCurrentProgressionContent (state, payload) {
    state.currentProgression.sections = payload.sections
    state.currentProgression.items = payload.items
  },
  setCurrentFolder (state, payload) {
    state.currentFolder = payload
  },
  setCurrentItem (state, payload) {
    state.currentItem = payload
  },
  setEditMode (state, payload) {
    state.isEditMode = payload
  },
  setListMode (state, payload) {
    state.isListMode = payload
  },
  setFilterFolder (state, payload) {
    state.filterFolder = payload
  },
  setFilterCours (state, payload) {
    state.filterCours = payload
  },
  setCreateMenuDisplayed (state, payload) {
    state.isCreateMenuDisplayed = payload
  },
  setCalendarPickerMode (state, payload) {
    state.isCalendarPickerMode = payload
  },
  setHomeworkAssignmentMode (state, payload) {
    state.isHomeworkAssignmentMode = payload
  },
  setAffectedItem (state, payload) {
    state.affectedItem = payload
  },
  addSelectedSession (state, payload) {
    state.selectedSessions.push(payload)
  },
  removeSelectedSession (state, payload) {
    state.selectedSessions.splice(payload, 1)
  },
  setFolderContent (state, payload) {
    const folder = helperMethods.getFolderByFolderId(state.currentProgression, payload.folderId)
    folder.folders = payload.folders
    folder.items = payload.items
  },
  setItemContents (state, payload) {
    // Loop over progression to add the created folder
    const folder = helperMethods.getFolderByFolderId(state.currentProgression, payload.folderId)
    const itemIndex = folder.items.map(item => item.itemId).indexOf(payload.itemId)
    folder.items[itemIndex].contents = payload.contents
  },
  addFolder (state, payload) {
    // Loop over progression to add the created folder
    if (payload.parentId === 0) {
      state.currentProgression.sections.push(payload)
    } else {
      const sectionIndex = state.currentProgression.sections.map(section => section.folderId).indexOf(payload.parentId)
      if (sectionIndex !== -1) {
        state.currentProgression.sections[sectionIndex].subSections.push(payload)
      }
    }
  },
  removeFolder (state, payload) {
    const sectionIndex = state.currentProgression.sections.map(section => section.folderId).indexOf(payload.folderId)
    if (sectionIndex !== -1) {
      // This is a folder
      state.currentProgression.sections.splice(sectionIndex, 1)
    } else {
      // This is sub-folder
      for (let idx = 0; idx < state.currentProgression.sections.length; ++idx) {
        const section = state.currentProgression.sections[idx]
        const subSectionIndex = section.subSections.map(subSection => subSection.folderId).indexOf(payload.folderId)
        if (subSectionIndex !== -1) {
          section.subSections.splice(subSectionIndex, 1)
        }
      }
    }
  },
  updateFolderName (state, payload) {
    const folder = helperMethods.getFolderByFolderId(state.currentProgression, payload.folderId)
    folder.name = payload.newFolderName
  },
  addItem (state, payload) {
    const sectionIndex = state.currentProgression.sections.map(section => section.folderId).indexOf(payload.parentId)
    if (sectionIndex !== -1) {
      // This is a section item
      state.currentProgression.sections[sectionIndex].items.push(payload.item)
    } else {
      // This is a sub-section item
      for (let idx = 0; idx < state.currentProgression.sections.length; ++idx) {
        const section = state.currentProgression.sections[idx]
        if (section.subSections !== undefined) {
          const subSectionIndex = section.subSections.map(subSection => subSection.folderId).indexOf(payload.parentId)
          if (subSectionIndex !== -1) {
            section.subSections[subSectionIndex].items.push(payload.item)
          }
        }
      }
    }
  },
  updateItem (state, payload) {
    const folder = helperMethods.getFolderByFolderId(state.currentProgression, payload.folderId)
    const itemIndex = folder.items.map(item => item.itemId).indexOf(payload.itemId)
    if (itemIndex !== -1) {
      const item = folder.items[itemIndex]
      item.folderId = payload.folderId
      item.name = payload.name
      item.type = payload.type
      item.order = payload.order
      item.contents = payload.contents
    }
  },
  addItemContent (state, payload) {
    for (let sectionIdx = 0; sectionIdx < state.currentProgression.sections.length; ++sectionIdx) {
      const section = state.currentProgression.sections[sectionIdx]
      const itemIndex = section.items.map(item => item.itemId).indexOf(payload.itemId)
      if (itemIndex !== -1) {
        // This is a section item
        section.items[itemIndex].contents.push(payload)
      }
      for (let subIdx = 0; subIdx < section.subSections.length; ++subIdx) {
        const subSection = section.subSections[subIdx]
        const subItemIndex = subSection.items.map(item => item.itemId).indexOf(payload.itemId)
        if (subItemIndex !== -1) {
          // This is a sub-section item
          subSection.items[subItemIndex].contents.push(payload)
        }
      }
    }
  },
  removeItem (state, payload) {
    // Loop over section's items
    for (let idx = 0; idx < state.currentProgression.sections.length; ++idx) {
      const section = state.currentProgression.sections[idx]
      const index = section.items.indexOf(payload)
      if (index !== -1) {
        section.items.splice(index, 1)
      }

      // Loop over subSection's items
      for (let idx = 0; idx < section.subSections.length; ++idx) {
        const subSection = section.subSections[idx]
        const subIndex = subSection.items.indexOf(payload)
        if (subIndex !== -1) {
          subSection.items.splice(subIndex, 1)
        }
      }
    }
  },
  removeContent (state, payload) {
    // Loop over section's items
    for (let idx = 0; idx < state.currentProgression.sections.length; ++idx) {
      const section = state.currentProgression.sections[idx]

      // Loop over section's items
      for (let itemIdx = 0; itemIdx < section.items.length; ++itemIdx) {
        const item = section.items[itemIdx]
        const contentIndex = item.contents.map(content => content.contentId).indexOf(payload)
        if (contentIndex !== -1) {
          item.contents.splice(contentIndex, 1)
        }
      }

      // Loop over subSections
      for (let subIdx = 0; subIdx < section.subSections.length; ++subIdx) {
        const subSection = section.subSections[subIdx]

        // Loop over subSection's items
        for (let itemIdx = 0; itemIdx < subSection.items.length; ++itemIdx) {
          const item = subSection.items[itemIdx]
          const contentIndex = item.contents.map(content => content.contentId).indexOf(payload)
          if (contentIndex !== -1) {
            item.contents.splice(contentIndex, 1)
          }
        }
      }
    }
  },
  endLoading (state) {
    state.isLoading = false
  },
  loading (state) {
    state.isLoading = true
  },
  setDates (state, { start, end }) {
    state.startDate = start
    state.endDate = end
  },
  setSessionList (state, payload) {
    state.sessionList = payload
  },
  addAssignment (state, payload) {
    const item = helperMethods.getItemByItemId(state.currentProgression, payload.itemId)
    item.assignments.push(payload)
  },
  deleteAssignment (state, payload) {
    const item = helperMethods.getItemByItemId(state.currentProgression, payload.itemId)
    const assignmentIndex = item.assignments.map(assignment => assignment.sessionId).indexOf(payload.sessionId)
    if (assignmentIndex !== -1) {
      item.assignments.splice(assignmentIndex, 1)
    }
  }
}
export const actions = {
  addProgression ({ commit }, progression) {
    addProgression(progression).then(
      (data) => {
        if (data.success) {
          commit('addProgression', data.progression)
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
  initCoursList ({ commit }) {
    getCoursList().then(
      (data) => {
        if (data.success) {
          commit('setCoursList', data.cours)
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
    commit('setCurrentFolder', undefined)
  },
  setCurrentFolder ({ commit }, folder) {
    commit('setCurrentFolder', folder)
    commit('setCurrentItem', undefined)
  },
  setCurrentItem ({ commit }, item) {
    commit('setCurrentItem', item)
    commit('setCurrentFolder', undefined)
  },
  setEditMode ({ commit }, isEditMode) {
    commit('setEditMode', isEditMode)
  },
  setListMode ({ commit }, isListMode) {
    commit('setListMode', isListMode)
  },
  setCalendarPickerMode ({ commit }, isCalendarPickerMode) {
    commit('setCalendarPickerMode', isCalendarPickerMode)
  },
  setHomeworkAssignmentMode ({ commit }, isHomeworkAssignment) {
    commit('setHomeworkAssignmentMode', isHomeworkAssignment)
  },
  setCreateMenuDisplayed ({ commit }, isCreateMenuDisplayed) {
    commit('setCreateMenuDisplayed', isCreateMenuDisplayed)
  },
  setFilterFolder ({ commit }, folder) {
    commit('setFilterFolder', folder)
  },
  setFilterCours ({ commit }, cours) {
    commit('setFilterCours', cours)
  },
  setAffectedItem ({ commit }, affectedItem) {
    commit('setAffectedItem', affectedItem)
  },
  addSelectedSession ({ commit }, session) {
    commit('addSelectedSession', session)
  },
  removeSelectedSession ({ commit }, session) {
    commit('removeSelectedSession', session)
  },
  getProgressionContent ({ commit, dispatch }, progressionId) {
    getProgressionContent(progressionId).then(
      (data) => {
        if (data.success) {
          commit('setCurrentProgressionContent', data)
          // Set default folder
          if (data.sections !== undefined && data.sections.length > 0) {
            commit('setCurrentFolder', data.sections[0])
            dispatch('getFolderContent', data.sections[0].folderId)
          }
        }
      },
      (err) => {
        // TODO toastr
        console.error(err)
      })
  },
  getFolderContent ({ commit }, folderId) {
    getFolderContent(folderId).then(
      (data) => {
        if (data.success) {
          data.folderId = folderId
          commit('setFolderContent', data)
        }
      },
      (err) => {
        // TODO toastr
        console.error(err)
      })
  },
  getItemContents ({ commit }, item) {
    getItemContents(item.itemId).then(
      (data) => {
        if (data.success) {
          commit('setItemContents', { itemId: item.itemId, folderId: item.folderId, contents: data.contents })
        }
      },
      (err) => {
        // TODO toastr
        console.error(err)
      })
  },
  addFolder ({ commit, state }, parentFolderId) {
    addFolder(state.currentProgression.progressionId, parentFolderId).then(
      (data) => {
        if (data.success) {
          data.folder.items = []
          if (parentFolderId === 0) {
            data.folder.subSections = []
          }
          commit('addFolder', data.folder)
          commit('setCurrentFolder', data.folder)
          commit('setCurrentItem', undefined)
        }
      },
      (err) => {
        // TODO toastr
        console.error(err)
      })
  },
  updateFolderName ({ commit }, { folder, newFolderName }) {
    updateFolder(folder.folderId, folder.parentId, newFolderName, folder.order).then(
      (data) => {
        if (data.success) {
          commit('updateFolderName', { folderId: folder.folderId, newFolderName: newFolderName })
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
          commit('removeFolder', folder)
          getProgressionContent(folder.progressionId)
          // TODO set new current folder
        }
      },
      (err) => {
        // TODO toastr
        console.error(err)
      })
  },
  addItem ({ commit, state }, { itemName, isHomework, type, order }) {
    const currentFolderId = (state.currentFolder !== undefined ? state.currentFolder.folderId : 0)
    addItem(state.currentProgression.progressionId, currentFolderId, itemName, isHomework, type, '', order).then(
      (data) => {
        if (data.success) {
          commit('addItem', { item: data.item, parentId: currentFolderId })
          commit('setCurrentFolder', undefined)
          commit('setCurrentItem', data.item)
        }
      },
      (err) => {
        // TODO toastr
        console.error(err)
      })
  },
  updateItem ({ commit }, { itemId, folderId, name, type, duration, order }) {
    updateItem(itemId, folderId, name, type, duration, order).then(
      (data) => {
        if (data.success) {
          commit('updateItem', data.item)
        }
      },
      (err) => {
        // TODO toastr
        console.error(err)
      })
  },
  deleteItem ({ commit }, item) {
    deleteItem(item.itemId).then(
      (data) => {
        if (data.success) {
          commit('removeItem', item)
        }
      },
      (err) => {
        // TODO toastr
        console.error(err)
      })
  },
  addItemContent ({ commit }, { itemId, contentType, contentName, contentValue, fileEntryId = 0, isToBeCompleted = false }) {
    this.dispatch('currentActions/addAction', { name: 'addItemContent' })
    addItemContent(itemId, contentType, contentName, contentValue, fileEntryId, isToBeCompleted).then(
      (data) => {
        this.dispatch('currentActions/removeAction', { name: 'addItemContent' })
        if (data.success) {
          commit('addItemContent', data.content)
        }
      },
      (err) => {
        // TODO toastr
        console.error(err)
      })
  },
  updateItemContent ({ commit }, { contentId, contentName, contentValue, order }) {
    updateItemContent(contentId, contentName, contentValue, order).then(
      (data) => {
        if (data.success) {
          // Returned object is the parent item (for re-ordering)
          commit('updateItem', data.item)
        }
      },
      (err) => {
        // TODO toastr
        console.error(err)
      })
  },
  deleteItemContent ({ commit }, contentId) {
    deleteItemContent(contentId).then(
      (data) => {
        if (data.success) {
          commit('removeContent', contentId)
        }
      },
      (err) => {
        // TODO toastr
        console.error(err)
      })
  },
  selectDates ({ commit, dispatch }, { start, end }) {
    commit('setDates', { start, end })
    dispatch('getSessionList')
  },
  getSessionList ({ state, commit, rootState }) {
    if (state.startDate && state.endDate) {
      commit('loading')
      getSessions(rootState.user.userId, 0, state.startDate, state.endDate).then(
        (data) => {
          if (data.success) {
            commit('setSessionList', [...data.sessions])
          }
          commit('endLoading')
        },
        (err) => {
          commit('endLoading')
          // TODO toastr
          console.error(err)
        }
      )
    } else if (state.sessionList.length) {
      commit('setSessionList', [])
    }
  },
  addAssignment ({ commit }, { itemId, sessionId }) {
    addAssignment(itemId, sessionId, 0).then(
      (data) => {
        if (data.success) {
          commit('addAssignment', data.assignment)
        }
      },
      (err) => {
        // TODO toastr
        console.error(err)
      })
  },
  deleteAssignment ({ commit }, { itemId, sessionId }) {
    deleteAssignment(itemId, sessionId).then(
      (data) => {
        if (data.success) {
          commit('deleteAssignment', { itemId: itemId, sessionId: sessionId })
        }
      },
      (err) => {
        // TODO toastr
        console.error(err)
      })
  }
}
