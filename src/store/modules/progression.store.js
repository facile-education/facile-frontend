import { addProgression, deleteProgression, getProgressionList, updateProgression, getProgressionContent, addFolder, updateFolder, addItem, addItemContent, deleteFolder, deleteItem, getFolderContent, getItemContents, deleteItemContent } from '@/api/progression.service'
import { getSubjects } from '@/api/userManagement.service'
import { getSchoolVoleeList } from '@/api/organization.service'

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
  }
}

export const state = {
  subjectList: undefined,
  voleeList: undefined,
  progressionList: undefined,
  isListMode: true,
  isEditMode: true,
  currentProgression: undefined,
  currentFolder: undefined,
  currentItem: undefined
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
      state.currentProgression.sections.push(payload.folder)
    } else {
      const sectionIndex = state.currentProgression.sections.map(section => section.folderId).indexOf(payload.parentId)
      if (sectionIndex !== -1) {
        state.currentProgression.sections[sectionIndex].subSections.push(payload.folder)
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
    console.log('updateFolderName payload=', payload)
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
        const subSectionIndex = section.subSections.map(subSection => subSection.folderId).indexOf(payload.parentId)
        if (subSectionIndex !== -1) {
          section.subSections[subSectionIndex].items.push(payload.item)
        }
      }
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
      const sectionItemIndex = section.items.map(item => item.itemId).indexOf(payload.itemId)
      if (sectionItemIndex !== -1) {
        const contentIndex = section.items[idx].contents.map(content => content.contentId).indexOf(payload.contentId)
        section.items[idx].contents.splice(contentIndex, 1)
      }

      // Loop over subSection's items
      for (let idx = 0; idx < section.subSections.length; ++idx) {
        const subSection = section.subSections[idx]
        const sectionItemIndex = subSection.items.map(item => item.itemId).indexOf(payload.itemId)
        if (sectionItemIndex !== -1) {
          const contentIndex = subSection.items[idx].contents.map(content => content.contentId).indexOf(payload.contentId)
          subSection.items[idx].contents.splice(contentIndex, 1)
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
  getFolderContent ({ commit }, folderId) {
    getFolderContent(folderId).then(
      (data) => {
        if (data.success) {
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
  addFolder ({ commit, state }) {
    const currentFolderId = (state.currentFolder !== undefined ? state.currentFolder.folderId : 0)
    addFolder(state.currentProgression.progressionId, currentFolderId).then(
      (data) => {
        if (data.success) {
          data.folder.items = []
          commit('addFolder', { folder: data.folder, parentId: currentFolderId })
          commit('setCurrentFolder', data.folder)
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
  addItem ({ commit, state }, { itemName, isHomework, type, order }) {
    const currentFolderId = (state.currentFolder !== undefined ? state.currentFolder.folderId : 0)
    addItem(state.currentProgression.progressionId, currentFolderId, itemName, isHomework, type, '', order).then(
      (data) => {
        if (data.success) {
          commit('addItem', { item: data.item, parentId: currentFolderId })
        }
      },
      (err) => {
        // TODO toastr
        console.error(err)
      })
  },
  addItemContent ({ commit }, { itemId, contentType }) {
    addItemContent(itemId, contentType, '', '', '', 0, false).then(
      (data) => {
        if (data.success) {
          commit('addItemContent', data.content)
        }
      },
      (err) => {
        // TODO toastr
        console.error(err)
      })
  },
  addLink ({ commit }, { itemId, linkName, linkUrl }) {
    addItemContent(itemId, 3, linkName, linkUrl, '', 0, false).then(
      (data) => {
        if (data.success) {
          commit('addItemContent', data.content)
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
  deleteItemContent ({ commit }, content) {
    deleteItemContent(content.contentId).then(
      (data) => {
        if (data.success) {
          commit('removeContent', content)
        }
      },
      (err) => {
        // TODO toastr
        console.error(err)
      })
  }
}
