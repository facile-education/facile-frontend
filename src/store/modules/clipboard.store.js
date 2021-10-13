// TODO LocalStorage to persist on reload ?
import clipboardService from '@/api/documents/clipboard.service'
import i18n from '@/i18n'

export const state = {
  action: undefined,
  documentList: [],
  sourceFolderId: undefined
}

export const mutations = {
  updateAction (state, payload) {
    state.action = payload
  },
  updateDocumentList (state, payload) {
    state.documentList = [...payload]
  },
  updateSourceFolderId (state, payload) {
    state.sourceFolderId = payload
  }
}

export const actions = {
  duplicate ({ commit, rootState }, targetFolder) {
    if (rootState.files.selectedFiles.length > 0) {
      const folderIds = []
      const fileIds = []
      for (let i = 0; i < rootState.files.selectedFiles.length; ++i) {
        if (rootState.files.selectedFiles[i].type === 'Folder') {
          folderIds.push(rootState.files.selectedFiles[i].id)
        } else {
          fileIds.push(rootState.files.selectedFiles[i].id)
        }
      }

      this.dispatch('currentActions/addAction', { name: 'duplicate' })
      clipboardService.copy(targetFolder.id, folderIds, fileIds).then((data) => {
        this.dispatch('currentActions/removeAction', { name: 'duplicate' })
        if (data.success) {
          this.dispatch('documents/refreshCurrentFolder')
        } else {
          // Print error messages if any
          if (data.errorMessages !== undefined && data.errorMessages.length > 0) {
            alert('Erreurs:' + data.errorMessages)
          }
        }
      })
    }
    commit('updateDocumentList', [])
  },
  move ({ commit, rootState }, targetFolder) {
    if (rootState.files.selectedFiles.length !== 0) {
      const folderIds = []
      const fileIds = []
      for (let i = 0; i < rootState.files.selectedFiles.length; ++i) {
        const entity = rootState.files.selectedFiles[i]
        if (entity.type === 'Folder') {
          folderIds.push(entity.id)
        } else {
          fileIds.push(entity.id)
        }
      }

      this.dispatch('currentActions/addAction', { name: 'move' })
      clipboardService.move(targetFolder.id, folderIds, fileIds).then((data) => {
        this.dispatch('currentActions/removeAction', { name: 'move' })
        if (data.success) {
          this.dispatch('documents/refreshCurrentFolder')
        } else {
          // Print error messages if any
          if (data.errorMessages !== undefined && data.errorMessages.length > 0) {
            alert('Erreurs:' + data.errorMessages)
          }
        }
      })
    }
  },
  copy ({ commit, rootState }) {
    if (rootState.files.selectedFiles.length !== 0) {
      commit('updateAction', 'copy')
      commit('updateSourceFolderId', rootState.files.currentFolderId)
      commit('updateDocumentList', rootState.files.selectedFiles)

      // display popup
      const message = rootState.files.selectedFiles.length === 1 ? rootState.files.selectedFiles[0].name + ' ' + i18n.global.t('Popup.copied') : i18n.global.t('Popup.documentCopied')
      this.dispatch('popups/pushPopup', { message: message })
    }
  },
  cut ({ commit, rootState }) {
    if (rootState.files.selectedFiles.length !== 0) {
      commit('updateAction', 'cut')
      commit('updateSourceFolderId', rootState.files.currentFolderId)
      commit('updateDocumentList', rootState.files.selectedFiles)

      // display popup
      const message = rootState.files.selectedFiles.length === 1 ? rootState.files.selectedFiles[0].name + ' ' + i18n.global.t('Popup.cut') : i18n.global.t('Popup.documentCut')
      this.dispatch('popups/pushPopup', { message: message })
    }
  },
  drop ({ state }, { entities, folder }) {
    const folderIds = []
    const fileIds = []
    for (let i = 0; i < entities.length; ++i) {
      if (entities[i].type === 'Folder') {
        folderIds.push(entities[i].id)
      } else {
        fileIds.push(entities[i].id)
      }
    }

    this.dispatch('currentActions/addAction', { name: 'move' })
    clipboardService.move(folder.id, folderIds, fileIds).then((data) => {
      this.dispatch('currentActions/removeAction', { name: 'move' })
      if (data.success) {
        this.dispatch('documents/refreshCurrentFolder')
      } else {
        // Print error messages if any
        if (data.errorMessages !== undefined && data.errorMessages.length > 0) {
          alert('Erreurs:' + data.errorMessages)
        }
      }
    })
  },
  paste ({ commit, state }, targetFolderId) {
    if (state.documentList.length > 0) {
      // TODO call copy or move service
      const folderIds = []
      const fileIds = []
      for (let i = 0; i < state.documentList.length; ++i) {
        if (state.documentList[i].type === 'Folder') {
          folderIds.push(state.documentList[i].id)
        } else {
          fileIds.push(state.documentList[i].id)
        }
      }

      if (state.action === 'copy') {
        this.dispatch('currentActions/addAction', { name: 'paste' })
        clipboardService.copy(targetFolderId, folderIds, fileIds).then((data) => {
          this.dispatch('currentActions/removeAction', { name: 'paste' })
          if (data.success) {
            this.dispatch('documents/refreshCurrentFolder')
          } else {
            // Print error messages if any
            if (data.errorMessages !== undefined && data.errorMessages.length > 0) {
              alert('Erreurs:' + data.errorMessages)
            }
          }
        })
      } else if (state.action === 'cut') {
        this.dispatch('currentActions/addAction', { name: 'move' })
        clipboardService.move(targetFolderId, folderIds, fileIds).then((data) => {
          this.dispatch('currentActions/removeAction', { name: 'move' })
          if (data.success) {
            commit('updateAction', 'copy') // Allow to create copy of moved document (if many ctrl+V)
            this.dispatch('documents/refreshCurrentFolder')
          } else {
            // Print error messages if any
            if (data.errorMessages !== undefined && data.errorMessages.length > 0) {
              alert('Erreurs:' + data.errorMessages)
            }
          }
        })
      }
    }
  }
}
