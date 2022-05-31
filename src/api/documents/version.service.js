import axios from 'axios'
import constants from '@/api/constants'
import { getCookie } from '@/utils/browser.util'

export default {
  restoreVersion,
  createMajorVersion,
  saveVersionDescription,
  getFileVersions
}

const VERSION_PATH = '/documents-portlet.version'

/**
 * Put the specified version number as the last version of the file
 */
function restoreVersion (fileVersionId) {
  return axios.get(constants.JSON_WS_URL + VERSION_PATH + '/restore-version', {
    params: {
      p_auth: getCookie('pauth'),
      fileVersionId: fileVersionId
    }
  }).then(response => response.data)
}

/**
 * Create a new Major version of a file (that will delete all the minor versions?)
 */
function createMajorVersion (fileId) {
  return axios.get(constants.JSON_WS_URL + VERSION_PATH + '/create-major-version', {
    params: {
      p_auth: getCookie('pauth'),
      fileEntryId: fileId
    }
  }).then(response => response.data)
}

/**
 * Save a description for a given version
 */
function saveVersionDescription (fileVersionId, description) {
  return axios.get(constants.JSON_WS_URL + VERSION_PATH + '/save-version-description', {
    params: {
      p_auth: getCookie('pauth'),
      fileVersionId: fileVersionId,
      description: description
    }
  }).then(response => response.data)
}

/**
 * Return the list of versions of a given file
 */
function getFileVersions (fileId) {
  return axios.get(constants.JSON_WS_URL + VERSION_PATH + '/get-file-versions', {
    params: {
      p_auth: getCookie('pauth'),
      fileId: fileId
    }
  }).then(response => response.data)
}
