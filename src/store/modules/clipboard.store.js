// TODO LocalStorage to persist on reload ?
import clipboardService from '@/api/documents/clipboard.service'
import i18n from '@/i18n'
import { conflicts } from '@/constants/documentsConstants'

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
  duplicate ({ commit, rootState }, { targetFolder, entities, mode = conflicts.MODE_NORMAL, successMessage = i18n.global.t('Popup.duplicated') }) {
    if (entities.length > 0) {
      const folderIds = []
      const fileIds = []
      for (let i = 0; i < entities.length; ++i) {
        if (entities[i].type === 'Folder') {
          folderIds.push(entities[i].id)
        } else {
          fileIds.push(entities[i].id)
        }
      }

      this.dispatch('currentActions/addAction', { name: 'duplicate' })
      clipboardService.copy(targetFolder.id, folderIds, fileIds, mode).then((data) => {
        this.dispatch('currentActions/removeAction', { name: 'duplicate' })
        if (data.success) {
          this.dispatch('documents/refreshCurrentFolder')
          this.dispatch('popups/pushPopup', { message: successMessage, type: 'success' })
        } else {
          const entitiesInConflict = [...data.foldersInConflict, ...data.filesInConflict]
          if (entitiesInConflict.length > 0) {
            this.dispatch('conflictModal/addConflict', {
              entitiesInConflict: entitiesInConflict,
              lastAction: { fct: this.dispatch, params: { storePath: 'clipboard/duplicate', storeParams: { targetFolder, entities: entitiesInConflict, successMessage } } }
            })
          // Print error messages if any
          } else if (data.errorMessages !== undefined && data.errorMessages.length > 0) {
            alert('Erreurs:' + data.errorMessages)
          }
        }
      })
    }
  },
  move ({ commit, rootState }, { targetFolder, entities, mode = conflicts.MODE_NORMAL }) {
    if (entities.length !== 0) {
      const folderIds = []
      const fileIds = []
      for (let i = 0; i < entities.length; ++i) {
        const entity = entities[i]
        if (entity.type === 'Folder') {
          folderIds.push(entity.id)
        } else {
          fileIds.push(entity.id)
        }
      }

      this.dispatch('currentActions/addAction', { name: 'move' })
      clipboardService.move(targetFolder.id, folderIds, fileIds, mode).then((data) => {
        this.dispatch('currentActions/removeAction', { name: 'move' })
        if (data.success) {
          commit('updateAction', 'copy') // Allow to create copy of moved document (if many ctrl+V)
          this.dispatch('documents/refreshCurrentFolder')
          this.dispatch('popups/pushPopup', { message: i18n.global.t('Popup.moved'), type: 'success' })
        } else {
          const entitiesInConflict = [...data.foldersInConflict, ...data.filesInConflict]
          if (entitiesInConflict.length > 0) {
            this.dispatch('conflictModal/addConflict', {
              entitiesInConflict: entitiesInConflict,
              lastAction: { fct: this.dispatch, params: { storePath: 'clipboard/move', storeParams: { targetFolder, entities: entitiesInConflict } } }
            })
            // Print error messages if any
          } else if (data.errorMessages !== undefined && data.errorMessages.length > 0) {
            alert('Erreurs:' + data.errorMessages)
          }
        }
      })
    }
  },
  copy ({ commit, rootState }) {
    if (rootState.documents.selectedEntities.length !== 0) {
      commit('updateAction', 'copy')
      commit('updateSourceFolderId', rootState.documents.currentFolderId)
      commit('updateDocumentList', rootState.documents.selectedEntities)

      // display popup
      const message = rootState.documents.selectedEntities.length === 1 ? rootState.documents.selectedEntities[0].name + ' ' + i18n.global.t('Popup.copied') : i18n.global.t('Popup.documentCopied')
      this.dispatch('popups/pushPopup', { message: message })
    }
  },
  cut ({ commit, rootState }) {
    if (rootState.documents.selectedEntities.length !== 0) {
      commit('updateAction', 'cut')
      commit('updateSourceFolderId', rootState.documents.currentFolderId)
      commit('updateDocumentList', rootState.documents.selectedEntities)

      // display popup
      const message = rootState.documents.selectedEntities.length === 1 ? rootState.documents.selectedEntities[0].name + ' ' + i18n.global.t('Popup.cut') : i18n.global.t('Popup.documentCut')
      this.dispatch('popups/pushPopup', { message: message })
    }
  }
}
