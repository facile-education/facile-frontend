import WeprodeUtils from '@utils/weprode.utils'
import axios from 'axios'

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
    WeprodeUtils.params({
      fileEntryId,
      versionId
    })
  ).then(response => response.data)
}

function recordViewActivity (fileEntryId, versionId) {
  return axios.post(constants.JSON_WS_URL + GROUP_PATH + '/record-view-activity',
    WeprodeUtils.params({
      fileEntryId,
      versionId
    })
  ).then(response => response.data)
}
