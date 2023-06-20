import axios from 'axios'

import constants from '@/constants/appConstants'

export default {
  recordDownloadActivity,
  recordViewActivity
}

const ACTIVITY_PATH = '/document.activity'

/**
 * increment the download count of a file, or of a specific version of this file if specified (put 0 for the latest version)
 */
function recordDownloadActivity (fileVersionId, fileEntryId) {
  return axios.get(constants.JSON_WS_URL + ACTIVITY_PATH + '/record-download-activity', {
    params: {
      fileVersionId: fileVersionId,
      fileEntryId: fileEntryId
    }
  }).then(response => response.data)
}

/**
 * increment the view count of a file, or of a specific version of this file if specified (put 0 for the latest version)
 */
function recordViewActivity (fileVersionId, fileEntryId) {
  return axios.get(constants.JSON_WS_URL + ACTIVITY_PATH + '/record-view-activity', {
    params: {
      fileVersionId: fileVersionId,
      fileEntryId: fileEntryId
    }
  }).then(response => response.data)
}
