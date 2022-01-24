import axios from 'axios'
import constants from '@/api/constants'
import { getCookie } from '@utils/browser.util'
import PentilaUtils from 'pentila-utils'

export default {
  deleteEntities
}

const TRASH_PATH = '/documents-portlet.trash'

/**
 * Delete definitely the specified entities from the document library (and return a list of the failed entities if some failed)
 */
function deleteEntities (folderIdArray, fileIdArray) {
  return axios.post(constants.JSON_WS_URL + TRASH_PATH + '/delete-documents', PentilaUtils.URL.params({
    p_auth: getCookie('pauth'),
    folderIdArray: JSON.stringify(folderIdArray),
    fileIdArray: JSON.stringify(fileIdArray)
  })).then(response => response.data)
}
