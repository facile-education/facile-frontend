import store from '@store/index.js'
import i18n from '@/i18n.js'
import trashService from '@/api/documents/trash.service'
import fileService from '@/api/documents/file.service'
import folderService from '@/api/documents/folder.service'
import { mergeContextMenus, removeMenuOptionIfExist } from '@/utils/commons.util'
import { folderOptions, fileOptions, groupOptions } from '@/constants/options'
import groupService from '@/api/documents/group.service'

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
    } else {
      documentContextMenu = [...fileOptions]
    }

    listCM.push(documentContextMenu)
  }

  // Compute the union of context menus
  const contextMenu = mergeContextMenus(listCM)

  // Remove some options depending of context
  if (store.state.clipboard.documentList.length === 0) { // remove paste option if no documents were copied
    removeMenuOptionIfExist(contextMenu, 'paste')
  }
  if (!store.state.user.hasWebdavEnabled) {
    removeMenuOptionIfExist(contextMenu, 'copyWebdavUrl')
  }

  // multi selection
  if (listCM.length > 1) {
    removeMenuOptionIfExist(contextMenu, 'details')
    removeMenuOptionIfExist(contextMenu, 'copyWebdavUrl')
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

async function importDocuments (folderId, documentList) {
  for (const doc of documentList) {
    store.dispatch('currentActions/addAction', { name: 'importDocument' })
    await fileService.uploadFile(folderId, doc).then((data) => {
      store.dispatch('currentActions/removeAction', { name: 'importDocument' })
      if (data.success) {
        store.dispatch('documents/refreshCurrentFolder')
        store.dispatch('popups/pushPopup', { message: doc.name + i18n.global.t('Documents.uploadSuccess'), type: 'success' })
      } else {
        const reason = (data.error === ': fileSizeException') ? 'fileSizeException' : ''
        store.dispatch('popups/pushPopup', { message: 'failed to upload document' + reason, type: 'error' })
      }
    })
  }
}

async function downLoadDocument (entity) {
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
    } else if (entity.type === 'File') {
      if (entity.isGroupFile) {
        groupService.recordDownloadActivity(entity.id, 0)
      }
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

      store.commit('documents/cleanSelectedEntities')
      store.dispatch('documents/refreshCurrentFolder')
    } else {
      console.error('cannot empty content of trash folder')
    }
  })
}

function copyWebdavUrl (selectedEntity) {
  navigator.permissions.query({ name: 'clipboard-write' }).then(result => {
    if (result.state === 'granted' || result.state === 'prompt') {
      navigator.clipboard.writeText('https://' + window.location.hostname + selectedEntity.urlWebdav) // TODO: make the 'https://hostname' returned by the backend in the webdavUrl
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
  downLoadDocument,
  deleteEntities,
  copyWebdavUrl
  // importMessagingAttachFiles
}

export {
  computeDocumentsOptions,
  copyWebdavUrl,
  selectBetween,
  selectPreviousEntity,
  selectNextEntity,
  ctrlSelectPreviousEntity,
  ctrlSelectNextEntity,
  importDocuments,
  downLoadDocument,
  deleteEntities
}
