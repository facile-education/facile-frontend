import axios from 'axios'
import constants from '@/constants/appConstants'
import { getCookie } from '@/utils/browser.util'

export default {
  recordDownloadActivity,
  recordViewActivity
}

const ACTIVITY_PATH = '/documents.activity'

/**
 * increment the download count of a file, or of a specific version of this file if specified (put 0 for the latest version)
 */
function recordDownloadActivity (fileVersionId, fileEntryId) {
  return axios.get(constants.JSON_WS_URL + ACTIVITY_PATH + '/record-download-activity', {
    params: {
      p_auth: getCookie('pauth'),
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
      p_auth: getCookie('pauth'),
      fileVersionId: fileVersionId,
      fileEntryId: fileEntryId
    }
  }).then(response => response.data)
}
