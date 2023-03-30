import axios from 'axios'
import constants from '@/api/constants'

export default {
  getGlobalDocumentsProperties
}

const DOCUMENTS_PATH = '/document.documentutils'

/**
 * Return all the application's root folders (privateFolder, trashFolder, ...) and documents' service related data
 */
function getGlobalDocumentsProperties () {
  return axios.get(constants.JSON_WS_URL + DOCUMENTS_PATH + '/get-global-documents-properties', {
    params: {}
  }).then(response => response.data)
}
