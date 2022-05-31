import axios from 'axios'
import constants from '@/api/constants'
import { getCookie } from '@utils/browser.util'
import PentilaUtils from 'pentila-utils'

export default {
  getHtmlContent,
  saveHtmlContent
}

const FOLDER_PATH = '/documents-portlet.folderutil'

/**
 * Create a zip containing the folderContent and download it
 */
function downloadFolder (folderId) {
  return axios.get(constants.JSON_WS_URL + FOLDER_PATH + '/download-folder', {
    params: {
      p_auth: getCookie('pauth'),
      folderId: folderId
    }
  }).then(response => response.data)
}
