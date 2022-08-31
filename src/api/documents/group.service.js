import axios from 'axios'
import constants from '@/api/constants'
import { getCookie } from '@utils/browser.util'
import PentilaUtils from 'pentila-utils'

export default {
  getGroupEntities,
  getGroupFolderBreadcrumb,
  recordDownloadActivity,
  recordViewActivity
}

const GROUP_PATH = '/documents-portlet.groups'

/**
 * Create a zip containing the folderContent and download it
 */
function getGroupEntities (node) {
  return axios.get(constants.JSON_WS_URL + GROUP_PATH + '/get-group-entities', {
    params: {
      p_auth: getCookie('pauth'),
      nodePath: node
    }
  }).then(response => response.data)
}

function getGroupFolderBreadcrumb (node) {
  return axios.get(constants.JSON_WS_URL + GROUP_PATH + '/get-group-folder-path', {
    params: {
      p_auth: getCookie('pauth'),
      nodePath: node
    }
  }).then(response => response.data)
}

function recordDownloadActivity (fileEntryId, versionId) {
  return axios.post(constants.JSON_WS_URL + GROUP_PATH + '/record-download-activity',
    PentilaUtils.URL.params({
      fileEntryId,
      versionId
    })
  ).then(response => response.data)
}

function recordViewActivity (fileEntryId, versionId) {
  return axios.post(constants.JSON_WS_URL + GROUP_PATH + '/record-view-activity',
    PentilaUtils.URL.params({
      fileEntryId,
      versionId
    })
  ).then(response => response.data)
}
