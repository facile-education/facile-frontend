import axios from 'axios'
import constants from '@/api/constants'
import { getCookie } from '@/utils/browser.util'
import PentilaUtils from 'pentila-utils'

export default {
  getFilePermissionMatrix,
  getFolderPermissionMatrix,
  saveFilePermissionMatrix,
  saveFolderPermissionMatrix
}

const PERMISSIONS_PATH = '/documents-portlet.permissionutils'

function getFilePermissionMatrix (fileEntryId) {
  return axios.get(constants.JSON_WS_URL + PERMISSIONS_PATH + '/get-file-permission-matrix', {
    params: {
      p_auth: getCookie('pauth'),
      fileEntryId: fileEntryId
    }
  }).then(response => response.data)
}

function getFolderPermissionMatrix (folderId) {
  return axios.get(constants.JSON_WS_URL + PERMISSIONS_PATH + '/get-folder-permission-matrix', {
    params: {
      p_auth: getCookie('pauth'),
      folderId: folderId
    }
  }).then(response => response.data)
}

function saveFilePermissionMatrix (documentId, permissionMatrix) {
  return axios.post(constants.JSON_WS_URL + PERMISSIONS_PATH + '/save-file-permission-matrix', PentilaUtils.URL.params({
    fileEntryId: documentId,
    JSONPermissionMatrix: JSON.stringify(permissionMatrix)
  })).then(response => response.data)
}

function saveFolderPermissionMatrix (documentId, permissionMatrix, isRecursive) {
  return axios.post(constants.JSON_WS_URL + PERMISSIONS_PATH + '/save-folder-permission-matrix', PentilaUtils.URL.params({
    folderId: documentId,
    JSONPermissionMatrix: JSON.stringify(permissionMatrix),
    isRecursive: isRecursive
  })).then(response => response.data)
}
