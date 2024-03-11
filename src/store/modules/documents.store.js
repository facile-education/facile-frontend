import store from '@store/index.js'

import documentsService from '@/api/documents/documents.service'
import navigationService from '@/api/documents/folder.service'
import groupService from '@/api/documents/group.service'
import i18n from '@/i18n'

export const state = {
  currentDisplay: 'list',
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
  documentsProperties: undefined,
  loadDocumentsError: false
}

export const mutations = {
  updateDisplay (state, payload) {
    state.currentDisplay = payload
  },
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
    if (documents.length === 0) {
      state.selectedEntities.length = 0
    } else {
      state.selectedEntities = documents
    }
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
  emptyFolderContent (state) {
    state.folderContent = {}
  },
  setBreadcrumb (state, payload) {
    state.breadcrumb = payload
  },
  setCurrentDisplay (state, payload) {
    state.currentDisplay = payload
  },
  setCurrentFolderId (state, payload) {
    state.currentFolderId = payload
  },
  setFolderContent (state, payload) {
    state.folderContent = payload

    // Update selectedEntities (reselect the new entities based on the old selected ids)
    const oldSelectedEntitiesIds = state.selectedEntities.map(entity => entity.id)
    const newSelectedEntities = []
    if (payload.files === undefined) {
      payload.files = []
    }
    if (payload.subFolders === undefined) {
      payload.subFolders = []
    }
    oldSelectedEntitiesIds.forEach((oldSelectedEntityId) => {
      [...payload.files, ...payload.subFolders].forEach((newEntity) => {
        if (newEntity.id === oldSelectedEntityId) {
          newSelectedEntities.push(newEntity)
        }
      })
    })
    state.selectedEntities = newSelectedEntities
  },
  setLoadDocumentsError (state, payload) {
    state.loadDocumentsError = payload
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
  changeDirectory ({ commit, state }, params) {
    if (state.documentsProperties === undefined) {
      this.dispatch('documents/getGlobalDocumentsProperties')
    }
    // commit('setDocumentPanelDisplayed', false) // confirm ergonomic
    commit('emptyFolderContent')
    this.dispatch('documents/cleanSelectedEntities')
    commit('setCurrentFolderId', params.folderId)
    commit('updateLastSelectedEntity', undefined)

    if (params.folderId === 'collaborative') {
      commit('setCurrentDisplay', 'grid')
    } else {
      commit('setCurrentDisplay', 'list')
    }

    if (params.isGroupDirectory) {
      this.dispatch('documents/updateGroupBreadcrumb', params.folderId)
      this.dispatch('documents/getGroupEntities', params.folderId).then((value) => {
        if (params.fileId) { // Select the given file if exist
          const index = value.files.map(file => file.id).indexOf(params.fileId)
          if (index !== -1) {
            const file = value.files[index]
            this.dispatch('documents/selectOneDocument', file)
            if (params.displayFile) { // Display file if asked
              this.dispatch('documents/openFile', file)
            }
          } else {
            console.error('cannot find fileId: ' + params.fileId + ' in folder ' + params.folderId)
          }
        }
      })
    } else {
      this.dispatch('documents/updateBreadcrumb', params.folderId)
      this.dispatch('documents/getEntities', params.folderId).then((value) => {
        if (params.fileId) { // Select the given file if exist
          const index = value.files.map(file => file.id).indexOf(params.fileId)
          if (index !== -1) {
            const file = value.files[index]
            this.dispatch('documents/selectOneDocument', file)
            if (params.displayFile) { // Display file if asked
              this.dispatch('documents/openFile', file)
            }
          } else {
            console.error('cannot find fileId: ' + params.fileId + ' in folder ' + params.folderId)
          }
        }
      })
    }
  },
  cleanSelectedEntities ({ commit }) {
    commit('setSelectedEntities', [])
  },
  closeDocumentPanel ({ commit }) {
    commit('setDocumentPanelDisplayed', false)
  },
  getGlobalDocumentsProperties ({ commit }) {
    this.dispatch('currentActions/addAction', { name: 'getDocumentsProperties' })
    documentsService.getGlobalDocumentsProperties().then((data) => {
      this.dispatch('currentActions/removeAction', { name: 'getDocumentsProperties' })
      commit('setDocumentsProperties', data)
    }, (err) => {
      console.error(err)
      this.dispatch('currentActions/removeAction', { name: 'getDocumentsProperties' })
    })
  },
  getEntities ({ commit }, folderId) {
    return new Promise((resolve) => {
      this.dispatch('currentActions/addAction', { name: 'getEntities' })
      navigationService.getAllEntities(folderId, true).then((data) => {
        this.dispatch('currentActions/removeAction', { name: 'getEntities' })
        if (data.success) {
          commit('setLoadDocumentsError', false)
          commit('setFolderContent', { subFolders: data.subFolders, files: data.files })
          resolve({ subFolders: data.subFolders, files: data.files })
        } else {
          commit('setLoadDocumentsError', true)
          console.error('Unable to get entities from backend for folder id ' + folderId)
        }
      }, (err) => {
        console.error(err)
        this.$store.dispatch('currentActions/removeAction', { name: 'getEntities' })
      })
    })
  },
  getGroupEntities ({ commit }, groupFolderId) {
    return new Promise((resolve) => {
      this.dispatch('currentActions/addAction', { name: 'getEntities' })
      groupService.getGroupEntities(groupFolderId).then((data) => {
        this.dispatch('currentActions/removeAction', { name: 'getEntities' })
        if (data.success) {
          commit('setLoadDocumentsError', false)
          data.folders.forEach(folder => { folder.isGroupDirectory = true })
          commit('setFolderContent', { subFolders: data.folders, files: data.files })
          resolve({ subFolders: data.folders, files: data.files })
        } else if (data.error === 'PermissionException') {
          store.dispatch('popups/pushPopup', {
            message: i18n.global.t('Documents.permissionException'),
            type: 'error'
          })
          this.dispatch('documents/goInGroupRoot')
        } else {
          commit('setLoadDocumentsError', true)
          console.error('Unable to get entities from backend for folder id ' + groupFolderId)
        }
      }, (err) => {
        console.error(err)
        this.$store.dispatch('currentActions/removeAction', { name: 'getEntities' })
      })
    })
  },
  goInDocumentRoot ({ state, commit }) {
    if (state.documentsProperties !== undefined && state.documentsProperties.private) {
      this.dispatch('documents/changeDirectory', { folderId: state.documentsProperties.private.id })
    } else {
      this.dispatch('currentActions/addAction', { name: 'getDocumentsProperties' })
      documentsService.getGlobalDocumentsProperties().then((data) => {
        this.dispatch('currentActions/removeAction', { name: 'getDocumentsProperties' })
        commit('setDocumentsProperties', data)
        this.dispatch('documents/changeDirectory', { folderId: data.private.id })
      }, (err) => {
        console.error(err)
        this.dispatch('currentActions/removeAction', { name: 'getDocumentsProperties' })
      })
    }
  },
  goInGroupRoot () {
    this.dispatch('documents/changeDirectory', { folderId: 'collaborative', isGroupDirectory: true }) // TODO get those key from documentsProperties
  },
  openDocumentPanel ({ commit }) {
    commit('setDocumentPanelDisplayed', true)
  },
  refreshCurrentFolder ({ state }) {
    if (state.currentFolderId && getters.currentFolder(state)) {
      if (getters.currentFolder(state).isGroupDirectory) {
        this.dispatch('documents/updateGroupBreadcrumb', state.currentFolderId)
        this.dispatch('documents/getGroupEntities', state.currentFolderId)
      } else {
        this.dispatch('documents/updateBreadcrumb', state.currentFolderId)
        this.dispatch('documents/getEntities', state.currentFolderId)
      }
    }
  },
  updateBreadcrumb ({ commit }, folderId) {
    this.dispatch('currentActions/addAction', { name: 'getBreadcrumb' })
    navigationService.getBreadcrumb(folderId).then((data) => {
      this.dispatch('currentActions/removeAction', { name: 'getBreadcrumb' })

      if (data.breadCrumb && data.breadcrumb[0]) {
        data.breadcrumb[0].name = i18n.global.t('Documents.options.documents')
        for (const folder of data.breadcrumb) { // Because all documents in breadcrumb are folders, add folder icon
          folder.icon = require('@assets/icons/folder.svg')
        }
        commit('setBreadcrumb', data.breadcrumb)
      } else {
        console.error('Unable to get breadcrumb for folder id ' + folderId)
      }
    }, (err) => {
      console.error(err)
      this.dispatch('currentActions/removeAction', { name: 'getBreadcrumb' })
    })
  },
  updateGroupBreadcrumb ({ commit }, groupFolderId) {
    this.dispatch('currentActions/addAction', { name: 'getBreadcrumb' })
    groupService.getGroupBreadcrumb(groupFolderId).then((data) => {
      this.dispatch('currentActions/removeAction', { name: 'getBreadcrumb' })
      if (data.breadCrumb && data.breadCrumb[0]) {
        data.breadCrumb[0].name = i18n.global.t('Documents.options.groups')
      }
      if (data.success && data.breadCrumb) {
        for (const folder of data.breadCrumb) { // Because all documents in breadcrumb are folders, add folder icon
          folder.icon = require('@assets/icons/folder.svg')
          folder.isGroupDirectory = true
        }
        commit('setBreadcrumb', data.breadCrumb)
      } else {
        console.error('Unable to get breadcrumb for folder id ' + groupFolderId)
      }
    }, (err) => {
      console.error(err)
      this.dispatch('currentActions/removeAction', { name: 'getBreadcrumb' })
    })
  },

  // Selection
  selectAll () {
    if (state.folderContent.subFolders && state.folderContent.files) {
      const currentDocuments = [...state.folderContent.subFolders, ...state.folderContent.files]
      this.dispatch('documents/selectManyDocuments', currentDocuments)
    }
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
