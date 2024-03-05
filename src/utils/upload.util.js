import i18n from '@/i18n'
import store from '@/store'

import { formatSize } from './commons.util'

let listFiles = []

function checkFilesType (allowMultiple, requiresTypeCheck, acceptedTypes) {
  if (!allowMultiple && listFiles.length > 1) {
    console.error('vue-file-picker: Multiple Files are not allowed')
  }
  if (requiresTypeCheck) {
    for (let i = 0; i < listFiles.length; i++) {
      if (acceptedTypes.indexOf(listFiles[i].type) === -1) {
        console.error('vue-file-picker: File type ' + listFiles[i].type + ' not allowed')
      }
    }
  }
}

function checkFilesSize (currentListFiles, store) {
  const invalidFilesList = []
  const maxUploadSize = store.state.documents.documentsProperties.maxUploadSize

  for (let i = 0; i < currentListFiles.length; ++i) {
    if (currentListFiles[i].size >= maxUploadSize) {
      console.error('invalid size: ' + currentListFiles[i].size + ' max is: ' + maxUploadSize)
      invalidFilesList.push(currentListFiles[i])
      // remove file from list
      currentListFiles.splice(i, 1)
      i--
    }
  }

  if (invalidFilesList.length !== 0) {
    const formattedMaxUploadSize = formatSize(store.state.documents.documentsProperties.maxUploadSize)
    store.dispatch('popups/pushPopup', { message: i18n.global.t('Documents.fileSizeException', { maxUploadSize: formattedMaxUploadSize }), type: 'error' })
    return true
  }
  return false
}

function alertNoFile () {
  store.dispatch('popups/pushPopup', { message: i18n.global.t('Documents.errorNoFiles'), type: 'error' })
}

// Browse directory recursively and update listFiles
// Send a promise when all the files were added
function addFilesFromDirectory (directory, path) {
  return new Promise((resolve) => {
    const ignoreHiddenFiles = true
    const dirReader = directory.createReader()

    const entriesReader = (function (_this) { // declare entriesReader function to get content of folder
      return function (entries) {
        let entry
        const listFilesPromises = []
        const listDirectoryPromises = []
        for (let i = 0; i < entries.length; ++i) { // for each entry in current folder
          entry = entries[i]
          if (entry.isFile) { // if it's a file
            const filePromise = new Promise((resolve) => { // return a promise when the file were added to listFiles
              entry.file(function (file) {
                if (ignoreHiddenFiles && entry.name.substring(0, 1) === '.') {
                  return
                }
                // Declare new file to be able to change name
                const newFile = new File([file], path + '/' + file.name, { type: file.type })
                listFiles.push(newFile)
                resolve()
              })
            })
            listFilesPromises.push(filePromise)
          } else if (entry.isDirectory) { // if it's a folder
            const directoryPromise = new Promise((resolve) => { // return a promise when the recursive call do it job (add all sub files to listFiles)
              addFilesFromDirectory(entry, path + '/' + entry.name).then(() => {
                // Nothing to do here
                resolve()
              })
            })
            listDirectoryPromises.push(directoryPromise)
          }
        }
        // when all the declared promises were handle, we can resolve the main promise that mean the job is done
        Promise.all([...listFilesPromises, ...listDirectoryPromises]).then(() => {
          resolve()
        })
      }
    })(this)
    // /!\ readEntries fct is a web 'non standard' and 'experimental technology'
    // it may not work for every user
    dirReader.readEntries(entriesReader, function (error) { console.error(error) })
  })
}

function returnAddedFiles (e, store, allowMultiple = true, requiresTypeCheck = false, acceptedTypes = []) {
  return new Promise((resolve) => {
    listFiles = []
    const wasDropped = e.dataTransfer
    let entry
    if (wasDropped) {
      const items = e.dataTransfer.items
      for (const item of items) {
        // If is a folder
        if ((item.webkitGetAsEntry != null) && (entry = item.webkitGetAsEntry()) && entry.isDirectory) {
          addFilesFromDirectory(entry, entry.name).then(() => {
            checkFilesType(allowMultiple, requiresTypeCheck, acceptedTypes)
            const sizeException = checkFilesSize(listFiles, store)
            resolve({ listFiles, sizeException })
          })
        } else {
          if (item.getAsFile != null) {
            if ((item.kind == null) || item.kind === 'file') {
              listFiles.push(item.getAsFile())
            } else {
              listFiles.push(undefined)
            }
          } else {
            listFiles.push(undefined)
          }
          checkFilesType(allowMultiple, requiresTypeCheck, acceptedTypes)
          const sizeException = checkFilesSize(listFiles, store)
          resolve({ listFiles, sizeException })
        }
      }
    } else {
      const filesObj = e.target.files
      for (let i = 0; i < filesObj.length; ++i) { // Necessary to have a array of object
        if (filesObj[i].webkitRelativePath) {
          const newFile = new File([filesObj[i]], filesObj[i].webkitRelativePath, { type: filesObj[i].type })
          listFiles.push(newFile)
        } else {
          listFiles.push(filesObj[i])
        }
      }
      checkFilesType(allowMultiple, requiresTypeCheck, acceptedTypes)
      const sizeException = checkFilesSize(listFiles, store)
      resolve({ listFiles, sizeException })
    }
  })
}

export {
  returnAddedFiles,
  alertNoFile
}
