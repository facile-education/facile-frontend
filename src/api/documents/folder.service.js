import axios from 'axios'
import constants from '@/api/constants'
import { getCookie } from '@utils/browser.util'

export default {
  downloadFolder,
  getAllEntities,
  getFolderBreadcrumb
}

const FOLDER_PATH = '/documents-portlet.folderutil'

/**
 * Create a zip containing the folderContent and download it
 */
function downloadFolder (folderId) {
  return axios.get(constants.JSON_WS_URL + FOLDER_PATH + '/download-folder', {
    params: {
      p_auth: getCookie('pauth'),
      folderId: folderId
    }
  }).then(response => response.data)
}

/**
 * Return all the entities (files and folders) inside a given folder
 */
function getAllEntities (folderId, withDetails) {
  return axios.get(constants.JSON_WS_URL + FOLDER_PATH + '/get-all-entities', {
    params: {
      p_auth: getCookie('pauth'),
      folderId: folderId,
      withDetails: withDetails
    }
  }).then(response => response.data)
}

/**
 * Get the breadCrumb of a folder
 */
function getFolderBreadcrumb (folderId) {
  return axios.get(constants.JSON_WS_URL + FOLDER_PATH + '/get-folder-breadcrumb', {
    params: {
      p_auth: getCookie('pauth'),
      folderId: folderId
    }
  }).then(response => response.data)
}
