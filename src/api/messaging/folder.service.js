import axios from 'axios'

import constants from '@/api/constants'

export default {
  addFolder,
  getAllUserFolders,
  renameFolder,
  deleteFolder
}

const MESSAGING_PATH = '/messaging.messagefolder'

/**
 * Add a personal folder
 */
function addFolder (parentFolderId, folderName) {
  return axios.get(constants.JSON_WS_URL + MESSAGING_PATH + '/add-folder', {
    params: {
      parentFolderId,
      folderName
    }
  }).then(response => response.data)
}

/**
 * Get all user messaging folders
 */
function getAllUserFolders () {
  return axios.get(constants.JSON_WS_URL + MESSAGING_PATH + '/get-all-user-folders', {
    params: {
    }
  }).then(response => response.data)
}

/**
 * Rename a personal folder
 */
function renameFolder (folderId, newLabel) {
  return axios.get(constants.JSON_WS_URL + MESSAGING_PATH + '/rename-folder', {
    params: {
      folderId,
      newLabel
    }
  }).then(response => response.data)
}

/**
 * Get all user messaging folders
 */
function deleteFolder (folderId) {
  return axios.get(constants.JSON_WS_URL + MESSAGING_PATH + '/delete-folder', {
    params: {
      folderId
    }
  }).then(response => response.data)
}
