import axios from 'axios'
import constants from '@/api/constants'

export {
  getSchoolUsers,
  getSubjects
}

export default {
  getSchoolUsers,
  getSubjects
}

const SUBJECT_PATH = '/gestionUtilisateurs-portlet.subject'
const USER_SEARCH_PATH = '/gestionUtilisateurs-portlet.usersearch'

/**
 * Get the specified school's students filtered by name
 */
function getSubjects () {
  return axios.get(constants.JSON_WS_URL + SUBJECT_PATH + '/get-subjects').then(response => response.data)
}

/**
 * Get the specified school's users filtered by name
 */
function getSchoolUsers (schoolId, query) {
  return axios.get(constants.JSON_WS_URL + USER_SEARCH_PATH + '/get-school-student-teacher-list', {
    params: {
      // p_auth: getCookie('pauth'),
      schoolId: schoolId,
      search: query
    }
  }).then(response => response.data)
}
