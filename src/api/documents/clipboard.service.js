import axios from 'axios'
import constants from '@/constants/appConstants'
import { getCookie } from '@/utils/browser.util'

export default {
  copy,
  move
}

const CLIPBOARD_PATH = '/documents.clipboard'

/**
 * Put in the clipboard all the entities specified
 */
function copy (targetFolderId, folderIds, fileIds) {
  return axios.get(constants.JSON_WS_URL + CLIPBOARD_PATH + '/copy', {
    params: {
      p_auth: getCookie('pauth'),
      targetFolderId,
      folderIds: JSON.stringify(folderIds),
      fileIds: JSON.stringify(fileIds)
    }
  }).then(response => response.data)
}

/**
 * Put in the clipboard all the entities specified, and they will be delete once a paste occurs
 */
function move (targetFolderId, folderIds, fileIds) {
  return axios.get(constants.JSON_WS_URL + CLIPBOARD_PATH + '/move', {
    params: {
      p_auth: getCookie('pauth'),
      targetFolderId,
      folderIds: JSON.stringify(folderIds),
      fileIds: JSON.stringify(fileIds)
    }
  }).then(response => response.data)
}
