import store from '@store/index.js'
import documentService from '@/api/document.service'

export default {
  importDocument
  // importMessagingAttachFiles
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
