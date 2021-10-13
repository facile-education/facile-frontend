import store from '@store/index.js'
import documentService from '@/api/documents/document.service'
import folderService from '@/api/documents/folder.service'
import activityService from '@/api/documents/activity.service'
import { mergeContextMenus, removeMenuOptionIfExist } from '@/utils/commons.util'
import { folderOptions, fileOptions } from '@/constants/options'

async function importDocument (folderId, documentList) {
  for (const doc of documentList) {
    store.dispatch('currentActions/addAction', { name: 'importDocument' })
    await documentService.uploadFile(folderId, doc).then((data) => {
      store.dispatch('currentActions/removeAction', { name: 'importDocument' })
      if (data.success) {
        if (data.firstCreatedEntity.parentFolderId === store.state.files.currentFolderId) {
          store.dispatch('documents/refreshCurrentFolder')
        }
      } else {
        console.error('Error when trying upload file')
        if (data.error === 'fileSizeException') {
          // this.$store.dispatch('error/setErrorType', 'reachMaxSize')
          // this.$store.dispatch('error/setListFilesConcerns', [doc])
          // this.$store.dispatch('monDrive/openErrorModal')
        }
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
          const url = data.downloadURL

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
      const a = document.createElement('a')
      a.style.display = 'none'
      a.download = entity.name // don't works on Internet Explorer and IOS' safari
      a.href = entity.url
      a.click()

      activityService.recordDownloadActivity(entity.id, 0)
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
  documentService.deleteEntities(listFoldersIdToDelete, listFilesIdToDelete).then((data) => {
    store.dispatch('currentActions/removeAction', { name: 'deleteDefinitely' })
    if (data.success) {
      if (data.failedEntitiesList.length !== 0) {
        console.error('Unable to delete entities from trash:', data.failedEntitiesList)
        store.dispatch('error/setErrorType', 'deleteEntities')
        store.dispatch('error/setListFilesConcerns', data.failedEntitiesList)
      }

      store.commit('documents/cleanSelectedFiles')
      store.dispatch('documents/refreshCurrentFolder')
    } else {
      console.error('cannot empty content of trash folder')
    }
  })
}

function computeDocumentsOptions (documentList) {
  const listCM = []
  // for each selected file, get context menu associated and add him to list
  for (let i = 0; i < documentList.length; ++i) {
    let documentContextMenu
    const document = documentList[i]

    if (document.type === 'Folder') {
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

  // multi selection
  if (listCM.length > 1) {
    removeMenuOptionIfExist(contextMenu, 'showData')
    removeMenuOptionIfExist(contextMenu, 'paste')
    removeMenuOptionIfExist(contextMenu, 'open')
    removeMenuOptionIfExist(contextMenu, 'download')
    removeMenuOptionIfExist(contextMenu, 'rename')
    removeMenuOptionIfExist(contextMenu, 'comment')
    removeMenuOptionIfExist(contextMenu, 'share')
  }
}

// async function importMessagingAttachFiles (documentList) {
//   const createdFiles = []
//   for (const doc of documentList) {
//     await documentService.uploadFile(0, doc).then((data) => {
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
  importDocument,
  computeDocumentsOptions,
  downLoadDocument,
  deleteEntities
  // importMessagingAttachFiles
}

export {
  importDocument,
  computeDocumentsOptions,
  downLoadDocument,
  deleteEntities
}
