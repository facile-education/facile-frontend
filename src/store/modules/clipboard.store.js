// Use LocalStorage to persist on reload ?
import clipboardService from '@/api/documents/clipboard.service'
import { conflicts } from '@/constants/documentsConstants'
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
  duplicate ({ commit, rootState }, { targetFolder, entities, mode = conflicts.MODE_NORMAL, successMessage = i18n.global.t('Popup.duplicated') }) {
    if (mode === conflicts.MODE_IGNORE) {
      return
    }
    if (entities.length > 0) {
      const folderIds = []
      const fileIds = []
      for (const entity of entities) {
        if (entity.type === 'Folder') {
          folderIds.push(entity.id)
        } else {
          fileIds.push(entity.id)
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
          entitiesInConflict.forEach(conflict => {
            const matchingEntityInParam = entities.find(entity => entity.id === conflict.id.toString())
            this.dispatch('conflictModal/addConflict', {
              isClipboardConflict: true,
              docInParametersThatCauseConflict: { ...conflict, canReplaceOriginalDoc: conflict.hasUpdatePermission },
              lastAction: { fct: this.dispatch, params: { storePath: 'clipboard/duplicate', storeParams: { targetFolder, entities: [matchingEntityInParam], successMessage } } } // Retry with the conflict entity in the chosen mode
            })
          })
          data.failedEntitiesList.forEach(failedEntity => {
            const sourceFailedEntity = entities.find(entity => entity.id === failedEntity.id.toString())
            this.dispatch('popups/pushPopup', { message: i18n.global.t('Popup.duplicationFailure', { entityName: sourceFailedEntity.name }), type: 'error' })
          })
          // Print error messages if any
          if (data.errorMessages !== undefined && data.errorMessages.length > 0) {
            alert('Erreurs:' + data.errorMessages)
          }
        }
      }, (err) => {
        console.error(err)
        this.$store.dispatch('currentActions/removeAction', { name: 'duplicate' })
      })
    }
  },
  move ({ commit, rootState }, { targetFolder, entities, mode = conflicts.MODE_NORMAL }) {
    const unAuthorizedMoveEntity = entities.find(entity => !entity.permissions.DELETE)
    if (unAuthorizedMoveEntity) {
      this.dispatch('popups/pushPopup', { message: i18n.global.t('Popup.unauthorizedCut', { entityName: unAuthorizedMoveEntity.name }), type: 'error' })
      return
    }

    if (mode === conflicts.MODE_IGNORE) {
      return
    }
    if (entities.length !== 0) {
      const folderIds = []
      const fileIds = []
      for (const entity of entities) {
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
          entitiesInConflict.forEach(conflict => {
            const matchingEntityInParam = entities.find(entity => entity.id === conflict.id.toString())
            this.dispatch('conflictModal/addConflict', {
              isClipboardConflict: true,
              docInParametersThatCauseConflict: { ...conflict, canReplaceOriginalDoc: conflict.hasUpdatePermission },
              lastAction: { fct: this.dispatch, params: { storePath: 'clipboard/move', storeParams: { targetFolder, entities: [matchingEntityInParam] } } }
            })
          })
          data.failedEntitiesList.forEach(failedEntity => {
            const sourceFailedEntity = entities.find(entity => entity.id === failedEntity.id.toString())
            console.error(failedEntity.error)
            this.dispatch('popups/pushPopup', { message: i18n.global.t('Popup.moveFailure', { entityName: sourceFailedEntity.name }), type: 'error' })
          })
          // Print error messages if any
          if (data.errorMessages !== undefined && data.errorMessages.length > 0) {
            alert('Erreurs:' + data.errorMessages)
          }
        }
      }, (err) => {
        console.error(err)
        this.$store.dispatch('currentActions/removeAction', { name: 'move' })
      })
    }
  },
  copy ({ commit, rootState }) {
    // Check that the copied entity is not a group root folder
    if (rootState.documents.selectedEntities.length !== 0 && !rootState.documents.selectedEntities[0].isGroupRootFolder) {
      commit('updateAction', 'copy')
      commit('updateSourceFolderId', rootState.documents.currentFolderId)
      commit('updateDocumentList', rootState.documents.selectedEntities)

      // display popup
      const message = rootState.documents.selectedEntities.length === 1 ? rootState.documents.selectedEntities[0].name + ' ' + i18n.global.t('Popup.copied') : i18n.global.t('Popup.documentCopied')
      this.dispatch('popups/pushPopup', { message })
    }
  },
  cut ({ commit, rootState }) {
    // Check that the cut entity is not a group root folder
    if (rootState.documents.selectedEntities.length !== 0 && !rootState.documents.selectedEntities[0].isGroupRootFolder) {
      const unAuthorizedCutEntity = rootState.documents.selectedEntities.find(entity => !entity.permissions.DELETE)
      if (unAuthorizedCutEntity) {
        this.dispatch('popups/pushPopup', { message: i18n.global.t('Popup.unauthorizedCut', { entityName: unAuthorizedCutEntity.name }), type: 'error' })
        return
      }

      commit('updateAction', 'cut')
      commit('updateSourceFolderId', rootState.documents.currentFolderId)
      commit('updateDocumentList', rootState.documents.selectedEntities)

      // display popup
      const message = rootState.documents.selectedEntities.length === 1 ? rootState.documents.selectedEntities[0].name + ' ' + i18n.global.t('Popup.cut') : i18n.global.t('Popup.documentCut')
      this.dispatch('popups/pushPopup', { message })
    }
  }
}
