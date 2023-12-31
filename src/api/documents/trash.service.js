import WeprodeUtils from '@utils/weprode.utils'
import axios from 'axios'

import constants from '@/api/constants'

export default {
  deleteEntities
}

const TRASH_PATH = '/document.trash'

/**
 * Delete definitely the specified entities from the document library (and return a list of the failed entities if some failed)
 */
function deleteEntities (folderIdArray, fileIdArray) {
  return axios.post(constants.JSON_WS_URL + TRASH_PATH + '/delete-documents', WeprodeUtils.params({
    folderIdArray: JSON.stringify(folderIdArray),
    fileIdArray: JSON.stringify(fileIdArray)
  })).then(response => response.data)
}
