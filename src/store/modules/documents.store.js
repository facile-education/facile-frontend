import navigationService from '@/api/documents/folder.service'
import documentService from '@/api/documents/document.service'
import i18n from '@/i18n'

export const state = {
  breadcrumb: [],
  lastSelectedFile: {},
  lastClickDocument: undefined,
  selectedFiles: [],
  currentFolderId: {},
  folderContent: {},
  folderHistory: [],
  cutSourceFolder: {},
  isCurrentlyLoading: false,
  isDocumentPanelDisplayed: false,
  isMultiSelectionOptionsDisplayed: false
}

export const mutations = {
  updateMultiSelectionOptionsDisplayed (state, payload) {
    state.isMultiSelectionOptionsDisplayed = payload
  },
  updateLastClickDocument (state, payload) {
    state.lastClickDocument = payload
  },
  addSelectedFile (state, file) {
    state.selectedFiles.push(file)
  },
  addToHistory (state, folder) {
    state.folderHistory.push({ id: folder.id, name: folder.name })
  },
  cleanSelectedFiles (state) {
    state.selectedFiles = []
  },
  goBackInHistory (state) {
    state.folderHistory.pop()
  },
  removeSelectedFile (state, file) {
    for (let i = 0; i < state.selectedFiles.length; ++i) {
      if (state.selectedFiles[i].id === file.id) {
        state.selectedFiles.splice(i, 1)
        break
      }
    }
  },
  setBreadcrumb (state, payload) {
    if (payload[0].name === '_PRIVATE_') {
      payload[0].name = i18n.global.t('AppCommonsLabels.Documents.privateFolderName')
    }
    state.breadcrumb = payload
  },
  setCurrentFolderId (state, payload) {
    state.currentFolderId = payload
  },
  setFolderContent (state, payload) {
    state.folderContent = payload
  },
  updateEntityName (state, { entity, name }) {
    // Update breadCrumb
    if (entity.id === state.currentFolderId) {
      state.breadcrumb[state.breadcrumb.length - 1].name = name
    } else {
      // Update folderContent
      for (let i = 0; i < state.folderContent.subFolders.length; ++i) {
        if (entity.id === state.folderContent.subFolders[i].id) {
          state.folderContent.subFolders[i].name = name
          return
        }
      }
      for (let i = 0; i < state.folderContent.files.length; ++i) {
        if (entity.id === state.folderContent.files[i].id) {
          state.folderContent.files[i].name = name
          break
        }
      }
    }

    // Update selectedFile
    if (state.selectedFiles[0] && (state.selectedFiles[0].id === entity.id)) { // it's supposed to be the case
      state.selectedFiles[0].name = name
    }
  },
  updateLastSelectedFile (state, file) {
    state.lastSelectedFile = file
  },
  updateLoadingStatus (state, payload) {
    state.isCurrentlyLoading = payload
  },
  setCutSourceFolder (state, folder) {
    state.cutSourceFolder = folder
  },
  setDocumentPanelDisplayed (state, payload) {
    state.isDocumentPanelDisplayed = payload
  }
}

export const actions = {
  closeMultiSelectionOptions ({ commit }) {
    commit('updateMultiSelectionOptionsDisplayed', false)
  },
  toggleMultiSelectionOptions ({ commit }) {
    commit('updateMultiSelectionOptionsDisplayed', !this.state.files.isMultiSelectionOptionsDisplayed)
  },
  updateLastClickDocument ({ commit }, document) {
    commit('updateLastClickDocument', document)
  },
  addEntitiesInTree ({ commit }, { entitiesToAdd }) { // front update only
    const entities = JSON.parse(JSON.stringify(this.state.files.folderContent))
    for (let i = 0; i < entitiesToAdd.subFolders.length; ++i) {
      entities.subFolders.push(entitiesToAdd.subFolders[i])
    }
    for (let i = 0; i < entitiesToAdd.files.length; ++i) {
      entities.files.push(entitiesToAdd.files[i])
    }
    commit('setFolderContent', entities)
  },
  changeDirectory ({ commit, state }, folderId) {
    // commit('setDocumentPanelDisplayed', false) // confirm ergonomic
    commit('setCurrentFolderId', folderId)
    this.dispatch('documents/closeMultiSelectionOptions')
    this.dispatch('documents/cleanSelectedFiles', folderId)
    this.dispatch('documents/getEntities', folderId)
    this.dispatch('documents/updateBreadcrumb', folderId)
  },
  cleanSelectedFiles ({ commit }) {
    commit('cleanSelectedFiles')
  },
  closeDocumentPanel ({ commit }) {
    commit('setDocumentPanelDisplayed', false)
  },
  deleteEntitiesInTree ({ commit }, { entitiesToDelete }) { // front update only
    const entities = JSON.parse(JSON.stringify(this.state.files.folderContent))
    for (let i = 0; i < entitiesToDelete.subFolders.length; ++i) {
      for (let j = 0; j < entities.subFolders.length; ++j) {
        if (entities.subFolders[j].id === entitiesToDelete.subFolders[i].id) {
          entities.subFolders.splice(j, 1)
          break
        }
      }
    }
    for (let i = 0; i < entitiesToDelete.files.length; ++i) {
      for (let j = 0; j < entities.files.length; ++j) {
        if (entities.files[j].id === entitiesToDelete.files[i].id) {
          entities.files.splice(j, 1)
          break
        }
      }
    }
    commit('setFolderContent', entities)
  },
  getEntities ({ commit }, folderId) {
    return new Promise((resolve) => {
      navigationService.getAllEntities(folderId).then((data) => {
        if (data.success) {
          commit('setFolderContent', { subFolders: data.subFolders, files: data.files })
          resolve({ subFolders: data.subFolders, files: data.files })
        } else {
          console.error('Unable to get entities from backend for folder id ' + folderId)
        }
      })
    })
  },
  getSpacesFolders ({ commit }) {
    navigationService.getSpacesFolders().then((data) => {
      this.dispatch('documents/changeDirectory', data.private.id)
    })
  },
  openDocumentPanel ({ commit }) {
    commit('setDocumentPanelDisplayed', true)
  },
  refreshCurrentFolder ({ state }) {
    this.dispatch('documents/getEntities', state.currentFolderId)
  },
  goInParentFolder ({ state }) {
    if (state.breadcrumb.length < 2) {
      console.error('Cannot go backer in tree')
    } else {
      this.dispatch('documents/changeDirectory', state.breadcrumb[state.breadcrumb.length - 2].id)
    }
  },
  renameEntity ({ commit, getters }, { entity, name }) {
    return new Promise((resolve) => {
      documentService.renameEntity(entity, name).then((data) => {
        if (data.success) {
          commit('updateEntityName', { entity, name })
          resolve()
        } else {
          console.error('Error when trying to rename entity ' + name)
        }
        resolve()
      })
    })
  },
  selectAllFiles () {
    const currentDocuments = [...state.folderContent.subFolders, ...state.folderContent.files]
    this.dispatch('documents/selectManyFiles', currentDocuments)
  },
  selectManyFiles ({ commit }, listFiles) {
    commit('cleanSelectedFiles')
    for (let i = 0; i < listFiles.length; ++i) {
      commit('addSelectedFile', listFiles[i])
    }
  },
  selectOneFile ({ commit }, file) {
    return new Promise((resolve) => {
      commit('cleanSelectedFiles')
      commit('addSelectedFile', file)
      commit('updateLastSelectedFile', file)
      resolve()
    })
  },
  updateBreadcrumb ({ commit }, folderId) {
    navigationService.getFolderBreadcrumb(folderId).then((data) => {
      if (data.breadcrumb) {
        for (let i = 0; i < data.breadcrumb.length; ++i) { // Because all documents in breadcrumb are folders, add folder icon
          data.breadcrumb[i].icon = require('@assets/icon_dossier_neutre.svg')
        }
        commit('setBreadcrumb', data.breadcrumb)
      } else {
        console.error('Unable to get breadcrumb for folder id ' + folderId)
      }
    })
  },
  updateCtrlSelectedFiles ({ commit }, file) {
    let isSelected = false
    for (let i = 0; i < this.state.files.selectedFiles.length; ++i) {
      if (this.state.files.selectedFiles[i].id === file.id) {
        isSelected = true
        break
      }
    }
    if (isSelected) {
      commit('removeSelectedFile', file)
    } else {
      commit('addSelectedFile', file)
      commit('updateLastSelectedFile', file)
    }
  },
  updateLastSelectedFile ({ commit }, file) {
    commit('updateLastSelectedFile', file)
  }
}
