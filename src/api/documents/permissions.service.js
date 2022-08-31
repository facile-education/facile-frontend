import axios from 'axios'
import constants from '@/api/constants'
import { getCookie } from '@/utils/browser.util'

export default {
  getFilePermissionMatrix,
  getFolderPermissionMatrix
}

const CLIPBOARD_PATH = '/documents-portlet.permissionUtils'

function getFilePermissionMatrix (fileEntryId) {
  return axios.get(constants.JSON_WS_URL + CLIPBOARD_PATH + '/copy', {
    params: {
      p_auth: getCookie('pauth'),
      fileEntryId: fileEntryId
    }
  }).then(response => response.data)
}

function getFolderPermissionMatrix (folderId) {
  return axios.get(constants.JSON_WS_URL + CLIPBOARD_PATH + '/copy', {
    params: {
      p_auth: getCookie('pauth'),
      folderId: folderId
    }
  }).then(response => response.data)
}
