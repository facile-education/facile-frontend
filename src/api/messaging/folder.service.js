import WeprodeUtils from '@utils/weprode.utils'
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
  return axios.post(constants.JSON_WS_URL + MESSAGING_PATH + '/add-folder', WeprodeUtils.params({
    parentFolderId,
    folderName
  })).then(response => response.data)
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
  return axios.post(constants.JSON_WS_URL + MESSAGING_PATH + '/rename-folder', WeprodeUtils.params({
    folderId,
    newLabel
  })).then(response => response.data)
}

/**
 * Get all user messaging folders
 */
function deleteFolder (folderId) {
  return axios.delete(constants.JSON_WS_URL + MESSAGING_PATH + '/delete-folder', {
    params: {
      folderId
    }
  }).then(response => response.data)
}
