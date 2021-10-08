import axios from 'axios'
import constants from '@/constants/appConstants'
import { getCookie } from '@/utils/browser.util'

export default {
  downloadFolder,
  getAllEntities,
  getFolderBreadcrumb,
  getSpacesFolders
}

const NAVIGATION_PATH = '/documents.navigation'

/**
 * Create a zip containing the folderContent and download it
 */
function downloadFolder (folderId) {
  return axios.get(constants.JSON_WS_URL + NAVIGATION_PATH + '/download-folder', {
    params: {
      p_auth: getCookie('pauth'),
      folderId: folderId
    }
  }).then(response => response.data)
}

/**
 * Return all the entities (files and folders) inside a given folder
 */
function getAllEntities (node) {
  return axios.get(constants.JSON_WS_URL + NAVIGATION_PATH + '/get-all-entities', {
    params: {
      p_auth: getCookie('pauth'),
      folderId: node
    }
  }).then(response => response.data)
}

/**
 * Ask to backend the source space of a given entity (private, etc...)
 */
function getFolderBreadcrumb (folderId) {
  return axios.get(constants.JSON_WS_URL + NAVIGATION_PATH + '/get-folder-breadcrumb', {
    params: {
      p_auth: getCookie('pauth'),
      folderId: folderId
    }
  }).then(response => response.data)
}

/**
 * Return all the application's root folders (privateFolder, trashFolder, ...)
 */
function getSpacesFolders () {
  return axios.get(constants.JSON_WS_URL + NAVIGATION_PATH + '/get-spaces-folders', {
    params: {
      p_auth: getCookie('pauth')
    }
  }).then(response => response.data)
}
