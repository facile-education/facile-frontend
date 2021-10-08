import axios from 'axios'
import constants from '@/constants/appConstants'
import { getCookie } from '@/utils/browser.util'

export default {
  createFolder,
  moveEntities,
  uploadFile,
  renameEntity
}

const EDIT_PATH = '/documents.edit'

/**
 * Create a folder with the specified name}
 */
function createFolder (parentFolderId, name) {
  return axios.get(constants.JSON_WS_URL + EDIT_PATH + '/create-folder', {
    params: {
      p_auth: getCookie('pauth'),
      parentFolderId: parentFolderId,
      name: name
    }
  }).then(response => response.data)
}

/**
 * Move entities into a targetFolder
 */
function moveEntities (folderIdArray, fileIdArray, destinationFolder) {
  return axios.get(constants.JSON_WS_URL + EDIT_PATH + '/move-entities', {
    params: {
      p_auth: getCookie('pauth'),
      targetFolderId: destinationFolder.id,
      folderIdArray: JSON.stringify(folderIdArray),
      fileIdArray: JSON.stringify(fileIdArray),
      sendToDropbox: false
    }
  }).then(response => response.data)
}

/**
 * Update entity with a new name
 */
function renameEntity (entity, name) {
  const listRecToRename = []
  listRecToRename.push({ id: entity.id, newName: name, type: entity.type })

  return axios.get(constants.JSON_WS_URL + EDIT_PATH + '/rename', {
    params: {
      p_auth: getCookie('pauth'),
      recordsList: JSON.stringify(listRecToRename)
    }
  }).then(response => response.data)
}

/**
 * Upload a file in a folder
 * TODO Change backend to accept multiple files in one call
 * ideally, we will pass in argument something like this: parentFolderId, listFolders[], listFiles[]
 * -> it will be more easily to update current loaded tree, and it will allow the creation of empty folder
 */
function uploadFile (folderId, file) {
  const formData = new FormData()
  formData.append('p_auth', getCookie('pauth'))
  formData.append('folderId', folderId)
  formData.append('fileName', file.name)
  formData.append('file', file, file.name)

  return axios.post(
    constants.JSON_WS_URL + EDIT_PATH + '/upload-file?',
    formData
  ).then(response => response.data)
}
