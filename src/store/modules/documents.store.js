import navigationService from '@/api/documents/folder.service'
import documentsService from '@/api/documents/documents.service'
import editService from '@/api/documents/edit.service'
import i18n from '@/i18n'
import groupService from '@/api/documents/group.service'

export const state = {
  breadcrumb: [],
  lastSelectedEntity: undefined,
  selectedEntities: [],
  currentFolderId: {},
  folderContent: {},
  folderHistory: [],
  cutSourceFolder: {},
  isCurrentlyLoading: false,
  isDocumentPanelDisplayed: false,
  openFiles: [],
  documentsProperties: {}
}

export const mutations = {
  openFile (state, file) {
    state.openFiles.push(file)
  },
  closeFile (state, file) {
    const index = state.openFiles.map(openFile => openFile.id).indexOf(file.id)
    if (index !== -1) {
      state.openFiles.splice(index, 1)
    } else {
      console.error('cannot close file ', file)
    }
  },
  addToHistory (state, folder) {
    state.folderHistory.push({ id: folder.id, name: folder.name })
  },
  goBackInHistory (state) {
    state.folderHistory.pop()
  },
  setSelectedEntities (state, documents) {
    state.selectedEntities = documents
  },
  setDocumentsProperties (state, payload) {
    state.documentsProperties = payload
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

    // Update selectedEntities (reselect the new entities based on the old selected ids)
    const oldSelectedEntitiesIds = state.selectedEntities.map(entity => entity.id)
    const newSelectedEntities = []
    oldSelectedEntitiesIds.forEach((oldSelectedEntityId) => {
      [...payload.files, ...payload.subFolders].forEach((newEntity) => {
        if (newEntity.id === oldSelectedEntityId) {
          newSelectedEntities.push(newEntity)
        }
      })
    })
    state.selectedEntities = newSelectedEntities
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
  },
  toggleDetails (state) {
    state.isDocumentPanelDisplayed = !state.isDocumentPanelDisplayed
  }
}

export const actions = {
  toggleDetails ({ commit }) {
    commit('toggleDetails')
  },
  openFile ({ commit }, file) {
    commit('openFile', file)
  },
  closeFile ({ commit }, file) {
    commit('closeFile', file)
  },
  changeDirectory ({ commit, state }, directory) {
    // commit('setDocumentPanelDisplayed', false) // confirm ergonomic
    commit('setCurrentFolderId', directory.id)
    this.dispatch('documents/cleanSelectedEntities')
    commit('updateLastSelectedEntity', undefined)
    if (directory.isGroupDirectory) {
      this.dispatch('documents/updateGroupBreadcrumb', directory.id)
      this.dispatch('documents/getGroupEntities', directory.id)
    } else {
      this.dispatch('documents/updateBreadcrumb', directory.id)
      this.dispatch('documents/getEntities', directory.id)
    }
  },
  cleanSelectedEntities ({ commit }) {
    commit('setSelectedEntities', [])
  },
  closeDocumentPanel ({ commit }) {
    commit('setDocumentPanelDisplayed', false)
  },
  getGlobalDocumentsProperties ({ commit }) {
    documentsService.getGlobalDocumentsProperties().then((data) => {
      commit('setDocumentsProperties', data)
    })
  },
  getEntities ({ commit }, folderId) {
    return new Promise((resolve) => {
      this.dispatch('currentActions/addAction', { name: 'getEntities' })
      navigationService.getAllEntities(folderId, true).then((data) => {
        this.dispatch('currentActions/removeAction', { name: 'getEntities' })
        if (data.success) {
          commit('setFolderContent', { subFolders: data.subFolders, files: data.files })
          resolve({ subFolders: data.subFolders, files: data.files })
        } else {
          console.error('Unable to get entities from backend for folder id ' + folderId)
        }
      })
    })
  },
  getGroupEntities ({ commit }, groupFolderId) {
    return new Promise((resolve) => {
      this.dispatch('currentActions/addAction', { name: 'getEntities' })
      groupService.getGroupEntities(groupFolderId).then((data) => {
        this.dispatch('currentActions/removeAction', { name: 'getEntities' })
        if (data.success) {
          data.folders.forEach(folder => { folder.isGroupDirectory = true })
          commit('setFolderContent', { subFolders: data.folders, files: data.files })
          resolve({ subFolders: data.folders, files: data.files })
        } else {
          console.error('Unable to get entities from backend for folder id ' + groupFolderId)
        }
      })
    })
  },
  goInDocumentRoot ({ state, commit }) {
    if (state.documentsProperties.private) {
      this.dispatch('documents/changeDirectory', { id: state.documentsProperties.private.id })
    } else {
      documentsService.getGlobalDocumentsProperties().then((data) => {
        commit('setDocumentsProperties', data)
        this.dispatch('documents/changeDirectory', { id: data.private.id })
      })
    }
  },
  goInGroupRoot ({ state, commit }) {
    this.dispatch('documents/changeDirectory', { id: 'groupEntities', isGroupDirectory: true }) // TODO get those key from documentsProperties
  },
  openDocumentPanel ({ commit }) {
    commit('setDocumentPanelDisplayed', true)
  },
  refreshCurrentFolder ({ state }) {
    if (getters.currentFolder(state).isGroupDirectory) {
      this.dispatch('documents/updateGroupBreadcrumb', state.currentFolderId)
      this.dispatch('documents/getGroupEntities', state.currentFolderId)
    } else {
      this.dispatch('documents/updateBreadcrumb', state.currentFolderId)
      this.dispatch('documents/getEntities', state.currentFolderId)
    }
  },
  renameEntity ({ commit, getters }, { entity, name }) {
    return new Promise((resolve) => {
      editService.renameEntity(entity, name).then((data) => {
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
  updateGroupBreadcrumb ({ commit }, groupFolderId) {
    groupService.getGroupFolderBreadcrumb(groupFolderId).then((data) => {
      if (data.breadCrumb) {
        for (let i = 0; i < data.breadCrumb.length; ++i) { // Because all documents in breadcrumb are folders, add folder icon
          data.breadCrumb[i].icon = require('@assets/documentIcons/icon_dossier_neutre.svg')
          data.breadCrumb[i].isGroupDirectory = true
        }
        commit('setBreadcrumb', data.breadCrumb)
      } else {
        console.error('Unable to get breadcrumb for folder id ' + groupFolderId)
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
    }
    commit('updateLastSelectedEntity', document)
  },
  updateLastSelectedEntity ({ commit }, document) {
    commit('updateLastSelectedEntity', document)
  }
}

export const getters = {
  currentFolder (state) {
    return state.breadcrumb.length > 0 ? state.breadcrumb[state.breadcrumb.length - 1] : undefined
  }
}
