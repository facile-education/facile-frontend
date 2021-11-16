import {
  addProgression, deleteProgression, getProgressionList, updateProgression, getProgressionContent, addFolder,
  updateFolder, addItem, updateItem, addItemContent, updateItemContent, deleteFolder, deleteItem, getFolderContent,
  getItemContents, deleteItemContent, addSessionAssignment, addHomeworkAssignment, deleteAssignment
} from '@/api/progression.service'
import { getSubjects } from '@/api/userManagement.service'
import { getSchoolVoleeList } from '@/api/organization.service'
import { getTeacherGroups, getSessions } from '@/api/cdt.service'

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
  teacherGroups: undefined,
  progressionList: undefined,
  currentProgression: undefined,
  currentFolder: undefined,
  currentItem: undefined,
  isEditMode: true,
  isCreateMenuDisplayed: false,
  isCalendarPickerMode: false,
  isHomeworkAssignmentMode: false,
  assignedItem: undefined,
  addedAssignedSessions: [],
  removedAssignedSessions: [],
  startDate: undefined,
  endDate: undefined,
  sessionList: [],
  draggedContent: undefined,
  draggedItem: undefined,
  draggedSection: undefined,
  draggedSubsection: undefined,
  filterFolder: { name: 'Toute la progression', folderId: 0 },
  filterCours: { groupName: 'Tous les cours', groupId: 0 },
  haveToFocusFolderNameInput: false
}

export const mutations = {
  setHaveToFocusFolderNameInput (state, payload) {
    state.haveToFocusFolderNameInput = payload
  },
  setDraggedContent (state, payload) {
    state.draggedContent = payload
  },
  setDraggedItem (state, payload) {
    state.draggedItem = payload
  },
  setDraggedSection (state, payload) {
    state.draggedSection = payload
  },
  setDraggedSubsection (state, payload) {
    state.draggedSubsection = payload
  },
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
  setTeacherGroups (state, payload) {
    state.teacherGroups = payload
  },
  updateProgression (state, payload) {
    const index = state.progressionList.map(item => item.progressionId).indexOf(payload.progressionId)
    state.progressionList[index] = payload
  },
  setCurrentProgression (state, payload) {
    state.currentProgression = payload
    state.currentFolder = undefined
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
  setAssignedItem (state, payload) {
    state.assignedItem = payload
  },
  resetAffectedSessions (state) {
    state.addedAssignedSessions = []
    state.removedAssignedSessions = []
  },
  addAffectedSession (state, payload) {
    // Check if new session was initially affected or not
    const assignedIndex = state.assignedItem.assignments.map(assignment => assignment.sessionId).indexOf(payload.sessionId)
    if (assignedIndex === -1) {
      console.log('added session ' + payload.sessionId + ' to the toAdd list')
      state.addedAssignedSessions.push(payload)
    }
    // Remove it from the removed list if needed
    const removedIndex = state.removedAssignedSessions.map(session => session.sessionId).indexOf(payload.sessionId)
    if (removedIndex !== -1) {
      console.log('removed session ' + payload.sessionId + ' from the toRemove list')
      state.removedAssignedSessions.splice(removedIndex, 1)
    }
  },
  removeAffectedSession (state, payload) {
    // Check if removed sessionId was initially affected or not
    const assignedIndex = state.assignedItem.assignments.map(assignment => assignment.sessionId).indexOf(payload.sessionId)
    if (assignedIndex !== -1) {
      console.log('added session ' + payload.sessionId + ' to the toRemove list')
      state.removedAssignedSessions.push(payload)
    }
    // Remove it from the added list if needed
    const addedIndex = state.addedAssignedSessions.map(session => session.sessionId).indexOf(payload.sessionId)
    if (addedIndex !== -1) {
      console.log('removed session ' + payload.sessionId + ' from the toAdd list')
      state.addedAssignedSessions.splice(addedIndex, 1)
    }
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
  updateFolder (state, payload) {
    let hasBeenMoved = false
    let folderList = state.currentProgression.sections
    if (payload.parentId === 0) {
      const sectionIndex = state.currentProgression.sections.map(section => section.folderId).indexOf(payload.folderId)
      hasBeenMoved = (sectionIndex === -1 || (sectionIndex + 1) !== payload.order)
    } else {
      // This is sub-folder
      const parentSectionIndex = state.currentProgression.sections.map(section => section.folderId).indexOf(payload.parentId)
      const section = state.currentProgression.sections[parentSectionIndex]
      const subSectionIndex = section.subSections.map(subSection => subSection.folderId).indexOf(payload.folderId)
      folderList = section.subSections

      hasBeenMoved = (subSectionIndex === -1 || (subSectionIndex + 1) !== payload.order)
    }

    if (hasBeenMoved) {
      this.commit('progression/removeFolder', payload)
      folderList.splice((payload.order - 1), 0, payload)
    } else {
      const folder = helperMethods.getFolderByFolderId(state.currentProgression, payload.folderId)
      folder.name = payload.name
    }
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
    const hasBeenMoved = (itemIndex === -1 || (itemIndex + 1) !== payload.order)

    if (hasBeenMoved) {
      this.commit('progression/removeItem', payload)
      folder.items.splice((payload.order - 1), 0, payload)
    } else if (itemIndex !== -1) {
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
      const index = section.items.map(item => item.itemId).indexOf(payload.itemId)
      if (index !== -1) {
        section.items.splice(index, 1)
      }

      // Loop over subSection's items
      for (let idx = 0; idx < section.subSections.length; ++idx) {
        const subSection = section.subSections[idx]
        const subIndex = subSection.items.map(item => item.itemId).indexOf(payload.itemId)
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
    getTeacherGroups().then(
      (data) => {
        if (data.success) {
          commit('setTeacherGroups', data.groups)
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
  setAssignedItem ({ commit }, assignedItem) {
    commit('setAssignedItem', assignedItem)
  },
  addAffectedSession ({ commit }, session) {
    commit('addAffectedSession', session)
  },
  removeAffectedSession ({ commit }, session) {
    commit('removeAffectedSession', session)
  },
  resetAffectedSessions ({ commit }) {
    commit('resetAffectedSessions')
  },
  getProgressionContent ({ commit, dispatch }, progressionId) {
    getProgressionContent(progressionId).then(
      (data) => {
        if (data.success) {
          commit('setCurrentProgression', data.progression)
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
          commit('setHaveToFocusFolderNameInput', true)
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
  haveFocusedFolderNameInput ({ commit }) {
    commit('setHaveToFocusFolderNameInput', false)
  },
  updateFolder ({ commit }, folder) {
    updateFolder(folder).then(
      (data) => {
        if (data.success) {
          commit('updateFolder', folder)
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
          const nextSectionToSelect = this.getters['progression/nextSectionToSelect']
          this.dispatch('progression/setCurrentFolder', nextSectionToSelect)
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
          commit('setCurrentItem', undefined)
          const itemFolder = this.getters['progression/getItemFolder'](item)
          this.dispatch('progression/setCurrentFolder', itemFolder)
        }
      },
      (err) => {
        // TODO toastr
        console.error(err)
      })
  },
  addItemContent ({ commit }, { itemId, contentType, contentName, contentValue, fileEntryId = 0, isToBeCompleted = false }) {
    return new Promise((resolve, reject) => {
      this.dispatch('currentActions/addAction', { name: 'addItemContent' })
      addItemContent(itemId, contentType, contentName, contentValue, fileEntryId, isToBeCompleted).then(
        (data) => {
          this.dispatch('currentActions/removeAction', { name: 'addItemContent' })
          if (data.success) {
            commit('addItemContent', data.content)
            resolve()
          } else {
            reject(data.error)
          }
        },
        (err) => {
          // TODO toastr
          console.error(err)
        })
    })
  },
  updateItemContent ({ commit }, { contentId, contentName, contentValue, order }) {
    return new Promise((resolve, reject) => {
      updateItemContent(contentId, contentName, contentValue, order).then(
        (data) => {
          if (data.success) {
          // Returned object is the parent item (for re-ordering)
            commit('updateItem', data.item)
            resolve()
          } else {
            reject(data.error)
          }
        },
        (err) => {
        // TODO toastr
          console.error(err)
        })
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
  addSessionAssignment ({ commit }, { itemId, sessionId }) {
    addSessionAssignment(itemId, sessionId).then(
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
  addHomeworkAssignment ({ commit }, { itemId, homeworks }) {
    addHomeworkAssignment(itemId, homeworks).then(
      (data) => {
        if (data.success) {
          // Add new assignments only
          for (let i = 0; i < data.createdAssignments.length; i++) {
            commit('addAssignment', data.createdAssignments[i])
          }
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

export const getters = {
  getItemFolder: (state) => (item) => {
    for (let i = 0; i < state.currentProgression.sections.length; ++i) {
      const section = state.currentProgression.sections[i]
      if (section.folderId === item.folderId) {
        return section
      } else {
        for (let j = 0; j < section.subSections.length; ++j) {
          const subSection = section.subSections[j]
          if (subSection.folderId === item.folderId) {
            return subSection
          }
        }
      }
    }
    return undefined
  },

  sectionIndex: (state) => (folderId) => { // /!\ doesn't works with sub-section
    return state.currentProgression.sections.map(section => section.folderId).indexOf(folderId)
  },

  // Return the next section to select after a deletion
  nextSectionToSelect (state, getters) {
    if (state.currentFolder && state.currentProgression && state.currentProgression.sections.length > 0) {
      if (state.currentFolder.parentId !== 0) {
        const parentSectionIndex = getters.sectionIndex(state.currentFolder.parentId)
        return state.currentProgression.sections[parentSectionIndex]
      } else {
        return state.currentProgression.sections[0] // Return the first section of the progression (specified like that)
      }
    } else {
      return undefined
    }
  }
}
