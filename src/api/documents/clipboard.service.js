import axios from 'axios'

import constants from '@/api/constants'

export default {
  copy,
  move
}

const CLIPBOARD_PATH = '/document.clipboard'

/**
 * Put in the clipboard all the entities specified
 */
function copy (targetFolderId, folderIds, fileIds, mode) {
  return axios.get(constants.JSON_WS_URL + CLIPBOARD_PATH + '/copy', {
    params: {
      targetFolderId,
      folderIds: JSON.stringify(folderIds),
      fileIds: JSON.stringify(fileIds),
      mode: mode
    }
  }).then(response => response.data)
}

/**
 * Put in the clipboard all the entities specified, and they will be delete once a paste occurs
 */
function move (targetFolderId, folderIds, fileIds, mode) {
  return axios.get(constants.JSON_WS_URL + CLIPBOARD_PATH + '/move', {
    params: {
      targetFolderId,
      folderIds: JSON.stringify(folderIds),
      fileIds: JSON.stringify(fileIds),
      mode: mode
    }
  }).then(response => response.data)
}
