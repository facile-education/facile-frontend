import navigationService from '@/api/documents/folder.service'
import documentService from '@/api/documents/document.service'
import i18n from '@/i18n'

export const state = {
  breadcrumb: [],
  lastSelectedEntity: undefined,
  selectedEntities: [],
  currentFolderId: {},
  folderContent: {},
  folderHistory: [],
  cutSourceFolder: {},
  isCurrentlyLoading: false,
  isDocumentPanelDisplayed: false
}

export const mutations = {
  addToHistory (state, folder) {
    state.folderHistory.push({ id: folder.id, name: folder.name })
  },
  goBackInHistory (state) {
    state.folderHistory.pop()
  },
  setSelectedEntities (state, documents) {
    state.selectedEntities = documents
  },
  addSelectedEntity (state, file) {
    state.selectedEntities.push(file)
  },
  removeSelectedEntity (state, file) {
    for (let i = 0; i < state.selectedEntities.length; ++i) {
      if (state.selectedEntities[i].id === file.id) {
        state.selectedEntities.splice(i, 1)
        break
      }
    }
  },
  setBreadcrumb (state, payload) {
    if (payload[0].name === '_PRIVATE_') {
      payload[0].name = i18n.global.t('AppCommonsLabels.Documents.privateFolderName') // TODO change it
    }
    state.breadcrumb = payload
  },
  setCurrentFolderId (state, payload) {
    state.currentFolderId = payload
  },
  setFolderContent (state, payload) {
    state.folderContent = payload
  },
  updateLastSelectedEntity (state, file) {
    state.lastSelectedEntity = file
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
  changeDirectory ({ commit, state }, folderId) {
    // commit('setDocumentPanelDisplayed', false) // confirm ergonomic
    commit('setCurrentFolderId', folderId)
    this.dispatch('documents/cleanSelectedEntities')
    commit('updateLastSelectedEntity', undefined)
    this.dispatch('documents/updateBreadcrumb', folderId)
    this.dispatch('documents/getEntities', folderId)
  },
  cleanSelectedEntities ({ commit }) {
    commit('setSelectedEntities', [])
  },
  closeDocumentPanel ({ commit }) {
    commit('setDocumentPanelDisplayed', false)
  },
  getEntities ({ commit }, folderId) {
    return new Promise((resolve) => {
      navigationService.getAllEntities(folderId, true).then((data) => {
        if (data.success) {
          commit('setFolderContent', { subFolders: data.subFolders, files: data.files })
          resolve({ subFolders: data.subFolders, files: data.files })
        } else {
          console.error('Unable to get entities from backend for folder id ' + folderId)
        }
      })
    })
  },
  goInDocumentRoot ({ commit }) {
    navigationService.getSpacesFolders().then((data) => {
      this.dispatch('documents/changeDirectory', data.private.id)
    })
  },
  openDocumentPanel ({ commit }) {
    commit('setDocumentPanelDisplayed', true)
  },
  refreshCurrentFolder ({ state }) {
    this.dispatch('documents/updateBreadcrumb', state.currentFolderId)
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
          this.dispatch('documents/refreshCurrentFolder')
          resolve()
        } else {
          console.error('Error when trying to rename entity ' + name)
        }
        resolve()
      })
    })
  },
  updateBreadcrumb ({ commit }, folderId) {
    navigationService.getFolderBreadcrumb(folderId).then((data) => {
      if (data.breadcrumb) {
        for (let i = 0; i < data.breadcrumb.length; ++i) { // Because all documents in breadcrumb are folders, add folder icon
          data.breadcrumb[i].icon = require('@assets/documentIcons/icon_dossier_neutre.svg')
        }
        commit('setBreadcrumb', data.breadcrumb)
      } else {
        console.error('Unable to get breadcrumb for folder id ' + folderId)
      }
    })
  },

  // Selection
  selectAll () {
    const currentDocuments = [...state.folderContent.subFolders, ...state.folderContent.files]
    this.dispatch('documents/selectManyDocuments', currentDocuments)
  },
  selectManyDocuments ({ commit }, listDocuments) {
    commit('setSelectedEntities', listDocuments)
  },
  selectOneDocument ({ commit }, document) {
    return new Promise((resolve) => {
      commit('setSelectedEntities', [document])
      commit('updateLastSelectedEntity', document)
      resolve()
    })
  },
  updateCtrlSelectedDocument ({ commit }, document) {
    const isAlreadySelected = this.state.documents.selectedEntities.find(selectedEntity => selectedEntity.id === document.id) !== undefined

    if (isAlreadySelected) {
      commit('removeSelectedEntity', document)
    } else {
      commit('addSelectedEntity', document)
      commit('updateLastSelectedEntity', document)
    }
  },
  updateLastSelectedEntity ({ commit }, document) {
    commit('updateLastSelectedEntity', document)
  }
}
