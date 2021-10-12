import store from '@store/index.js'
import documentService from '@/api/documents/document.service'
import { mergeContextMenus, removeMenuOptionIfExist } from '@/utils/commons.util'
import { folderOptions, fileOptions } from '@/constants/options'

export default {
  importDocument,
  computeDocumentsOptions
  // importMessagingAttachFiles
}

export {
  importDocument,
  computeDocumentsOptions
}

async function importDocument (folderId, documentList) {
  for (const doc of documentList) {
    store.dispatch('currentActions/addAction', { name: 'importDocument' })
    await documentService.uploadFile(folderId, doc).then((data) => {
      store.dispatch('currentActions/removeAction', { name: 'importDocument' })
      if (data.success) {
        if (data.firstCreatedEntity.parentFolderId === store.state.files.currentFolderId) {
          store.dispatch('files/refreshCurrentFolder')
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
