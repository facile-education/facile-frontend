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

function checkFilesSize (currentListFiles, store, maxUploadSize) {
  const invalidFilesList = []

  for (let i = 0; i < currentListFiles.length; ++i) {
    if (currentListFiles[i].size >= maxUploadSize) {
      invalidFilesList.push(currentListFiles[i])
      // remove file from list
      currentListFiles.splice(i, 1)
      i--
    }
  }

  if (invalidFilesList.length !== 0) {
    store.dispatch('error/setErrorType', 'reachMaxSize')
    store.dispatch('error/setListFilesConcerns', invalidFilesList)
    store.dispatch('monDrive/openErrorModal')
  }
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

function returnAddedFiles (e, store, maxUploadSize, allowMultiple = true, requiresTypeCheck = false, acceptedTypes = []) {
  return new Promise((resolve) => {
    listFiles = []
    const wasDropped = e.dataTransfer
    let entry
    if (wasDropped) {
      const items = e.dataTransfer.items
      for (let i = 0; i < items.length; ++i) {
        const item = items[i]
        // If is a folder
        if ((item.webkitGetAsEntry != null) && (entry = item.webkitGetAsEntry()) && entry.isDirectory) {
          addFilesFromDirectory(entry, entry.name).then(() => {
            checkFilesType(allowMultiple, requiresTypeCheck, acceptedTypes)
            checkFilesSize(listFiles, store, maxUploadSize)
            resolve(listFiles)
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
          checkFilesSize(listFiles, store, maxUploadSize)
          resolve(listFiles)
        }
      }
    } else {
      const filesObj = e.target.files
      for (let i = 0; i < filesObj.length; ++i) { // Necessary to have a array of object
        listFiles.push(filesObj[i])
      }
      checkFilesType(allowMultiple, requiresTypeCheck, acceptedTypes)
      checkFilesSize(listFiles, store, maxUploadSize)
      resolve(listFiles)
    }
  })
}

export {
  returnAddedFiles
}
