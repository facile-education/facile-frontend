import axios from 'axios'
import constants from '@/api/constants'
import { getCookie } from '@utils/browser.util'

export default {
  getGlobalDocumentsProperties,
  getDocumentGroupActivity
}

const DOCUMENTS_PATH = '/documents-portlet.documents'

/**
 * Return all the application's root folders (privateFolder, trashFolder, ...) and documents' service related data
 */
function getGlobalDocumentsProperties () {
  return axios.get(constants.JSON_WS_URL + DOCUMENTS_PATH + '/get-global-documents-properties', {
    params: {
      p_auth: getCookie('pauth')
    }
  }).then(response => response.data)
}

function getDocumentGroupActivity (groupId, maxDate, nbResults) {
  return axios.get(constants.JSON_WS_URL + DOCUMENTS_PATH + 'get-document-group-activity', {
    params: {
      groupId,
      maxDate,
      nbResults
    }
  }).then(response => response.data)
}
