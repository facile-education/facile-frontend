import axios from 'axios'

import constants from '@/constants/appConstants'

export default {
  getMediaUrl
}

const MEDIA_PATH = '/document.media'

/**
 * Get the url to see the resource
 */
function getMediaUrl (fileId, versionId) {
  return axios.get(constants.JSON_WS_URL + MEDIA_PATH + '/get-resource', {
    params: {
      fileId: fileId,
      versionId: versionId
    }
  }).then(response => response.data)
}
