import store from '@store/index.js'
import { formatSize } from '@utils/commons.util'

import fileService from '@/api/documents/file.service'
import groupService from '@/api/documents/group.service'
import trashService from '@/api/documents/trash.service'
import { conflicts } from '@/constants/documentsConstants'
import { fileOptions, folderOptions, groupOptions } from '@/constants/options'
import i18n from '@/i18n'
import { mergeContextMenus, removeMenuOptionIfExist } from '@/utils/commons.util'

function computeDocumentsOptions (documentList) {
  const listCM = []
  // for each selected file, get context menu associated and add him to list
  for (const document of documentList) {
    let documentContextMenu

    if (document.type === 'Group' || document.isGroupRootFolder) {
      documentContextMenu = [...groupOptions]
    } else if (document.type === 'Folder') {
      documentContextMenu = [...folderOptions]
      if (!document.isGroupDirectory) {
        removeMenuOptionIfExist(documentContextMenu, 'managePermissions')
      }
    } else {
      documentContextMenu = [...fileOptions]
      if (!document.isGroupFile) {
        removeMenuOptionIfExist(documentContextMenu, 'managePermissions')
      }
    }

    // Permissions
    if (!document.permissions.UPDATE && !document.permissions.ADD_OBJECT) {
      removeMenuOptionIfExist(documentContextMenu, 'rename')
    }
    if ((!document.permissions.UPDATE && !document.permissions.ADD_OBJECT) || !document.permissions.DELETE) {
      removeMenuOptionIfExist(documentContextMenu, 'move')
    }
    if (!document.permissions.DELETE) {
      removeMenuOptionIfExist(documentContextMenu, 'delete')
    }
    if (!document.permissions.PERMISSIONS) {
      removeMenuOptionIfExist(documentContextMenu, 'managePermissions')
    }

    listCM.push(documentContextMenu)
  }

  // Compute the intersection of context menus
  const contextMenu = mergeContextMenus(listCM)

  // New button does not depend on the selected documents, but on the current folder
  const currentFolder = store.getters['documents/currentFolder']
  if (currentFolder.isGroupDirectory && !currentFolder.permissions.ADD_OBJECT) {
    removeMenuOptionIfExist(contextMenu, 'new')
  }

  // Remove some options depending on context
  if (store.state.clipboard.documentList.length === 0) { // remove paste option if no documents were copied
    removeMenuOptionIfExist(contextMenu, 'paste')
  }

  // multi selection
  if (listCM.length > 1) {
    removeMenuOptionIfExist(contextMenu, 'details')
    removeMenuOptionIfExist(contextMenu, 'managePermissions')
    removeMenuOptionIfExist(contextMenu, 'paste')
    removeMenuOptionIfExist(contextMenu, 'open')
    removeMenuOptionIfExist(contextMenu, 'rename')
    removeMenuOptionIfExist(contextMenu, 'comment')
    removeMenuOptionIfExist(contextMenu, 'share')
    removeMenuOptionIfExist(contextMenu, 'copyUrl')
  }

  return contextMenu
}

function selectNextEntity (sortedEntities, selectedEntity) {
  if (selectedEntity === undefined) { // if no document selected, trigger the selection on the first document
    store.dispatch('documents/selectOneDocument', sortedEntities[0])
  } else {
    const index = sortedEntities.map(entity => entity.id).indexOf(selectedEntity.id)
    store.dispatch('documents/selectOneDocument', sortedEntities[(index + 1) % sortedEntities.length])
  }
}

function selectPreviousEntity (sortedEntities, selectedEntity) {
  if (selectedEntity === undefined) { // if no document selected, trigger the selection on the last document
    store.dispatch('documents/selectOneDocument', sortedEntities[sortedEntities.length - 1])
  } else {
    const index = sortedEntities.map(entity => entity.id).indexOf(selectedEntity.id)
    store.dispatch('documents/selectOneDocument', sortedEntities[(index + sortedEntities.length - 1) % sortedEntities.length])
  }
}

function ctrlSelectNextEntity (sortedEntities, selectedEntity) {
  if (selectedEntity === undefined) { // if no document selected, trigger the selection on the first document
    store.dispatch('documents/selectOneDocument', sortedEntities[0])
  } else {
    const index = sortedEntities.map(entity => entity.id).indexOf(selectedEntity.id)
    store.dispatch('documents/updateCtrlSelectedDocument', sortedEntities[(index + 1) % sortedEntities.length])
  }
}

function ctrlSelectPreviousEntity (sortedEntities, selectedEntity) {
  if (selectedEntity === undefined) { // if no document selected, trigger the selection on the last document
    store.dispatch('documents/selectOneDocument', sortedEntities[sortedEntities.length - 1])
  } else {
    const index = sortedEntities.map(entity => entity.id).indexOf(selectedEntity.id)
    store.dispatch('documents/updateCtrlSelectedDocument', sortedEntities[(index + sortedEntities.length - 1) % sortedEntities.length])
  }
}

function selectBetween (listSortedFiles, firstFile, secondFile) {
  let idxLastSelectedFile = -1
  let idxFile = -1
  for (let i = 0; i < listSortedFiles.length; ++i) {
    if (listSortedFiles[i].id === firstFile.id) {
      idxLastSelectedFile = i
    }
    if (listSortedFiles[i].id === secondFile.id) {
      idxFile = i
    }
  }
  if (idxLastSelectedFile === -1 || idxFile === -1) {
    console.error('error when trying to get files between ' + firstFile.name + ' and ' + secondFile.name)
    return []
  } else if (idxLastSelectedFile < idxFile) {
    return listSortedFiles.slice(idxLastSelectedFile, idxFile + 1)
  } else {
    return listSortedFiles.slice(idxFile, idxLastSelectedFile + 1)
  }
}

async function importDocuments (folderId, documentList) {
  let stop = false
  for (let i = 0; i < documentList.length && !stop; i++) {
    const doc = documentList[i]
    if (!doc.mode) {
      doc.mode = conflicts.MODE_NORMAL
    }
    if (!store.state.currentActions.cancelUpload) {
      store.dispatch('currentActions/setCurrentUploadFile', doc)

      if (folderId === undefined) {
        await fileService.uploadTmpFile(doc).then((data) => {
          store.dispatch('currentActions/removeCurrentUploadFile')
          if (data.success) {
            store.dispatch('currentActions/addUploadedFile', data.uploadedFile)
          } else {
            stop = handleError(data, doc, folderId, documentList, i)
          }
        })
      } else {
        // TODO remove unnecessary parameter
        await fileService.uploadFile(folderId, doc, doc.mode).then((data) => {
          store.dispatch('currentActions/removeCurrentUploadFile')
          if (data.success) {
            store.dispatch('currentActions/addUploadedFile', doc)
            store.dispatch('documents/refreshCurrentFolder')
            if (data.firstCreatedFolder) { // If we previously have created a new folder, change the followings file paths to place it in th new folder
              for (let j = i + 1; j < documentList.length; j++) {
                const fileToUpload = documentList[j]
                const parts = fileToUpload.name.split('/')
                const oldFolderNameIndex = parts.indexOf(data.oldFolderName)
                if (oldFolderNameIndex !== -1) {
                  parts[i] = data.firstCreatedFolder.name
                  documentList[j] = new File([fileToUpload], parts.join('/'))
                }
                documentList[j].mode = conflicts.MODE_MERGE
              }
              // Upload store document list
              store.dispatch('currentActions/updateImportFileList', documentList)
            }
          } else {
            stop = handleError(data, doc, folderId, documentList, i)
          }
        }, (err) => {
          console.error(err)
          store.dispatch('currentActions/removeCurrentUploadFile')
        })
      }
    }
  }
}

function handleError (data, doc, folderId, documentList, index) {
  if (data.error !== 'DuplicateFileException' && data.error !== 'DuplicateFolderException') { // Toggle conflict modal, not really an error yet
    store.dispatch('currentActions/setUploadFileError', doc)
  }
  if (data.error === 'fileSizeException') {
    const formattedMaxUploadSize = formatSize(store.state.documents.documentsProperties.maxUploadSize)
    store.dispatch('popups/pushPopup', {
      message: i18n.global.t('Documents.fileSizeException', { maxUploadSize: formattedMaxUploadSize }),
      type: 'error'
    })
  } else if (data.error === 'DuplicateFileException') {
    doc.canReplaceOriginalDoc = data.hasUpdatePermission
    store.dispatch('conflictModal/addConflict', {
      isUploadConflict: true,
      docInParametersThatCauseConflict: doc,
      lastAction: { fct: importDocuments, params: [folderId, documentList.slice(index)] }
    })
    return true
  } else if (data.error === 'DuplicateFolderException') {
    doc.canReplaceOriginalDoc = data.hasUpdatePermission
    store.dispatch('conflictModal/addConflict', {
      isUploadConflict: true,
      docInParametersThatCauseConflict: doc,
      folderNameInConflict: data.folderName,
      lastAction: { fct: importDocuments, params: [folderId, documentList.slice(index)] }
    })
    return true
  } else if (data.error === 'PermissionException') {
    store.dispatch('popups/pushPopup', {
      message: i18n.global.t('Documents.permissionException'),
      type: 'error'
    })
  } else if (data.error === 'FileExtensionException') {
    store.dispatch('popups/pushPopup', {
      message: i18n.global.t('Documents.extensionException'),
      type: 'error'
    })
  } else if (data.error === 'AntivirusException') {
    store.dispatch('popups/pushPopup', {
      message: i18n.global.t('Documents.antivirusException'),
      type: 'error'
    })
  } else if (data.error !== 'ignored') {
    store.dispatch('popups/pushPopup', {
      message: i18n.global.t('Documents.uploadError'),
      type: 'error'
    })
  }

  return false
}

async function downloadDocuments (entityList) {
  entityList.forEach(entity => {
    if (entity.type === 'File') {
      if (entity.isGroupFile) {
        groupService.recordDownloadActivity(entity.id, 0)
      }
      const a = document.createElement('a')
      a.style.display = 'none'
      a.download = entity.name // don't works on Internet Explorer and IOS' safari
      a.href = entity.url + '&p_auth=' + store.state.user.pauth
      a.click()
    }
  })
}

function deleteEntities (selectedEntities) {
  const listFoldersToDelete = selectedEntities.filter(entity => entity.type === 'Folder')
  const listFoldersIdToDelete = listFoldersToDelete.map(folder => folder.id)
  const listFilesToDelete = selectedEntities.filter(entity => entity.type === 'File')
  const listFilesIdToDelete = listFilesToDelete.map(file => file.id)

  store.dispatch('currentActions/addAction', { name: 'deleteDefinitely' })
  trashService.deleteEntities(listFoldersIdToDelete, listFilesIdToDelete).then((data) => {
    store.dispatch('currentActions/removeAction', { name: 'deleteDefinitely' })
    if (data.success) {
      if (data.failedEntitiesList.length !== 0) {
        console.error('Unable to delete entities from trash:', data.failedEntitiesList)
        data.failedEntitiesList.forEach(failedEntity => {
          if (failedEntity.subEntityInFailure) {
            if (failedEntity.subEntityInFailure.id === -1) {
              store.dispatch('popups/pushPopup', { message: i18n.global.t('Documents.unKnownSubEntityFailedDelete'), type: 'error' })
            } else {
              store.dispatch('popups/pushPopup', { message: i18n.global.t('Documents.subEntityFailedDelete', { entityName: failedEntity.subEntityInFailure.name }), type: 'error' })
            }
          } else {
            const failedEntity = selectedEntities.find(entity => entity.id === failedEntity.id)
            store.dispatch('popups/pushPopup', { message: i18n.global.t('Documents.failedDelete', { entityName: failedEntity.name }), type: 'error' })
          }
        })
      } else {
        this.$store.dispatch('popups/pushPopup', { message: i18n.global.t('Documents.documentDeleted'), type: 'success' })
      }

      store.dispatch('documents/cleanSelectedEntities')
      store.dispatch('documents/refreshCurrentFolder')
    } else {
      console.error('cannot empty content of trash folder')
    }
  }, (err) => {
    console.error(err)
    store.dispatch('currentActions/removeAction', { name: 'deleteDefinitely' })
  })
}

export {
  computeDocumentsOptions,
  selectBetween,
  selectPreviousEntity,
  selectNextEntity,
  ctrlSelectPreviousEntity,
  ctrlSelectNextEntity,
  importDocuments,
  downloadDocuments,
  deleteEntities
}
