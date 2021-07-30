import axios from 'axios'
import constants from '@/api/constants'

export default {
  getSubjects
}

const SUBJECT_PATH = '/gestionUtilisateurs-portlet.subject'

/**
 * Get the specified school's students filtered by name
 */
function getSubjects () {
  return axios.get(constants.JSON_WS_URL + SUBJECT_PATH + '/get-subjects').then(response => response.data)
}
