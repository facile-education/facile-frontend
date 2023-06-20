import axios from 'axios'
import PentilaUtils from 'pentila-utils'

import constants from '@/api/constants'

export default {
  getGroupEntities,
  getGroupImages,
  getGroupBreadcrumb,
  recordDownloadActivity,
  recordViewActivity
}

const GROUP_PATH = '/document.groups'

/**
 * Create a zip containing the folderContent and download it
 */
function getGroupEntities (node) {
  return axios.get(constants.JSON_WS_URL + GROUP_PATH + '/get-group-entities', {
    params: {
      nodePath: node
    }
  }).then(response => response.data)
}

function getGroupImages (node) {
  return axios.get(constants.JSON_WS_URL + GROUP_PATH + '/get-group-images', {
    params: {
      nodePath: node
    }
  }).then(response => response.data)
}

function getGroupBreadcrumb (node) {
  return axios.get(constants.JSON_WS_URL + GROUP_PATH + '/get-group-breadcrumb', {
    params: {
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
