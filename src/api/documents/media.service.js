import axios from 'axios'
import constants from '@/constants/appConstants'
import { getCookie } from '@/utils/browser.util'

export default {
  getMediaUrl
}

const MEDIA_PATH = '/documents.media'

/**
 * Get the url to see the resource
 */
function getMediaUrl (fileId, versionId) {
  return axios.get(constants.JSON_WS_URL + MEDIA_PATH + '/get-resource', {
    params: {
      p_auth: getCookie('pauth'),
      fileId: fileId,
      versionId: versionId
    }
  }).then(response => response.data)
}
