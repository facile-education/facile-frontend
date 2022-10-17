import store from '@store/index.js'
import i18n from '@/i18n'
import trashService from '@/api/documents/trash.service'
import fileService from '@/api/documents/file.service'
import folderService from '@/api/documents/folder.service'
import { mergeContextMenus, removeMenuOptionIfExist } from '@/utils/commons.util'
import { folderOptions, fileOptions, groupOptions } from '@/constants/options'
import groupService from '@/api/documents/group.service'
import { conflicts } from '@/constants/documentsConstants'

function computeDocumentsOptions (documentList) {
  const listCM = []
  // for each selected file, get context menu associated and add him to list
  for (let i = 0; i < documentList.length; ++i) {
    let documentContextMenu
    const document = documentList[i]

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
      removeMenuOptionIfExist(documentContextMenu, 'move')
    }
    if (document.permissions.DELETE && !document.permissions.DELETE) {
      removeMenuOptionIfExist(documentContextMenu, 'delete')
    }
    if (!document.permissions.PERMISSIONS) {
      removeMenuOptionIfExist(documentContextMenu, 'managePermissions')
    }

    listCM.push(documentContextMenu)
  }

  // Compute the intersection of context menus
  const contextMenu = mergeContextMenus(listCM)

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
    removeMenuOptionIfExist(contextMenu, 'download')
    removeMenuOptionIfExist(contextMenu, 'rename')
    removeMenuOptionIfExist(contextMenu, 'comment')
    removeMenuOptionIfExist(contextMenu, 'share')
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
  } else {
    if (idxLastSelectedFile < idxFile) {
      return listSortedFiles.slice(idxLastSelectedFile, idxFile + 1)
    } else {
      return listSortedFiles.slice(idxFile, idxLastSelectedFile + 1)
    }
  }
}

async function importDocuments (folderId, documentList, mode) {
  let stop = false
  for (let i = 0; i < documentList.length && !stop; i++) {
    const doc = documentList[i]
    if (!store.state.currentActions.cancelUpload) {
      store.dispatch('currentActions/setCurrentUploadFile', doc)
      await fileService.uploadFile(folderId, doc, i === 0 ? mode : conflicts.MODE_MERGE).then((data) => {
        store.dispatch('currentActions/removeCurrentUploadFile')
        if (data.success) {
          store.dispatch('currentActions/addUploadedFile', doc)
          store.dispatch('documents/refreshCurrentFolder')
          if (data.firstCreatedFolder && mode === conflicts.MODE_RENAME) { // If we previously have created a new folder, change the followings file paths to place it in th new folder
            for (let j = i + 1; j < documentList.length; j++) {
              const fileToUpload = documentList[j]
              const parts = fileToUpload.name.split('/')
              if (parts.length > 1) { // rename the root folder part of the name
                parts[0] = data.firstCreatedFolder.name
                documentList[j] = new File([fileToUpload], parts.join('/'))
              }
            }
          }
        } else {
          if (data.error === 'fileSizeException') {
            store.dispatch('popups/pushPopup', {
              message: i18n.global.t('Documents.fileSizeException'),
              type: 'error'
            })
          } else if (data.error === 'DuplicateFileException') {
            stop = true
            store.dispatch('conflictModal/addConflict', {
              entitiesInConflict: [doc],
              lastAction: { fct: importDocuments, params: [folderId, documentList.slice(i)] }
            })
          } else if (data.error === 'PermissionException') {
            store.dispatch('popups/pushPopup', {
              message: i18n.global.t('Documents.permissionException'),
              type: 'error'
            })
          }
        }
      })
    }
  }
}

async function downloadDocument (entity) {
  return new Promise((resolve) => {
    if (entity.type === 'Folder') {
      store.dispatch('currentActions/addAction', { name: 'download' })
      folderService.downloadFolder(entity.id).then((data) => {
        store.dispatch('currentActions/removeAction', { name: 'download' })
        if (data.success) {
          const url = data.zipUrl

          const a = document.createElement('a')
          a.style.display = 'none'
          a.download = entity.name // don't works on Internet Explorer and IOS' safari
          a.href = url
          a.click()
          resolve()
        } else {
          console.error('Error in getting url for folder archive download')
        }
      })
    } else { // No type analysis because default is 'file'
      if (entity.isGroupFile) {
        groupService.recordDownloadActivity(entity.id, 0)
      }
      console.log('down entity ', entity)
      const a = document.createElement('a')
      a.style.display = 'none'
      a.download = entity.name // don't works on Internet Explorer and IOS' safari
      a.href = entity.url
      a.click()

      // activityService.recordDownloadActivity(entity.id, 0) // Not necessary because we don't use collaborative space yet
      resolve()
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
        store.dispatch('error/setErrorType', 'deleteEntities')
        store.dispatch('error/setListFilesConcerns', data.failedEntitiesList)
      }

      store.dispatch('documents/cleanSelectedEntities')
      store.dispatch('documents/refreshCurrentFolder')
    } else {
      console.error('cannot empty content of trash folder')
    }
  })
}

// async function importMessagingAttachFiles (documentList) {
//   const createdFiles = []
//   for (const doc of documentList) {
//     await fileService.uploadFile(0, doc).then((data) => {
//       if (data.success) {
//         for (const createdFile of data.createdFiles) {
//           createdFile.text = createdFile.name
//           createdFile.value = createdFile.id
//           createdFiles.push(createdFile)
//         }
//       }
//     })
//   }
//   return createdFiles
// }

export default {
  computeDocumentsOptions,
  selectBetween,
  ctrlSelectPreviousEntity,
  ctrlSelectNextEntity,
  selectPreviousEntity,
  selectNextEntity,
  importDocuments,
  downloadDocument,
  deleteEntities
  // importMessagingAttachFiles
}

export {
  computeDocumentsOptions,
  selectBetween,
  selectPreviousEntity,
  selectNextEntity,
  ctrlSelectPreviousEntity,
  ctrlSelectNextEntity,
  importDocuments,
  downloadDocument,
  deleteEntities
}
