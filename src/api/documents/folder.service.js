import WeprodeUtils from '@utils/weprode.utils'
import axios from 'axios'

import constants from '@/api/constants'

export default {
  createFolder,
  renameFolder,
  getAllEntities,
  getImagesEntities,
  getBreadcrumb
}

const FOLDER_PATH = '/document.folderutils'

/**
 * Create a folder
 */
function createFolder (targetFolderId, folderName) {
  return axios.post(constants.JSON_WS_URL + FOLDER_PATH + '/create-folder',
    WeprodeUtils.params({
      targetFolderId,
      folderName
    })
  ).then(response => response.data)
}

/**
 * Rename a folder
 */
function renameFolder (folderId, folderName) {
  return axios.post(constants.JSON_WS_URL + FOLDER_PATH + '/rename-folder',
    WeprodeUtils.params({
      folderId,
      folderName
    })
  ).then(response => response.data)
}

/**
 * Return all the entities (files and folders) inside a given folder
 */
function getAllEntities (folderId, withDetails) {
  return axios.get(constants.JSON_WS_URL + FOLDER_PATH + '/get-all-entities', {
    params: {
      folderId,
      withDetails
    }
  }).then(response => response.data)
}

/**
 * Return the images entities (and folders) inside a given folder
 */
function getImagesEntities (folderId, withDetails) {
  return axios.get(constants.JSON_WS_URL + FOLDER_PATH + '/get-images-entities', {
    params: {
      folderId,
      withDetails
    }
  }).then(response => response.data)
}

/**
 * Get the breadCrumb of a folder
 */
function getBreadcrumb (folderId) {
  return axios.get(constants.JSON_WS_URL + FOLDER_PATH + '/get-breadcrumb', {
    params: {
      folderId
    }
  }).then(response => response.data)
}
