import axios from 'axios'
import constants from '@/api/constants'
import PentilaUtils from 'pentila-utils'

export default {
  getHtmlContent,
  saveHtmlContent
}

const FOLDER_PATH = '/document.folderutils'

/**
 * Create a zip containing the folderContent and download it
 */
function downloadFolder (folderId) {
  return axios.get(constants.JSON_WS_URL + FOLDER_PATH + '/download-folder', {
    params: {
      folderId: folderId
    }
  }).then(response => response.data)
}
