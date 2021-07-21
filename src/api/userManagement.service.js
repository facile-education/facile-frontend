import axios from 'axios'
import constants from '@/api/constants'

export default {
  getSubjects
}

const SCHOOL_LIFE_PATH = '/gestionUtilisateurs-portlet'

/**
 * Get the specified school's students filtered by name
 */
function getSubjects () {
  return axios.get(SCHOOL_LIFE_PATH + constants.JSON_WS_URL + '/subject/get-subjects').then(response => response.data)
}
