import axios from 'axios'
import constants from '@/api/constants'

export default {
  getSchoolUsers,
  getSubjects
}

const USER_MANAGEMENT_PATH = '/gestionUtilisateurs-portlet'

/**
 * Get the specified school's students filtered by name
 */
function getSubjects () {
  return axios.get(USER_MANAGEMENT_PATH + constants.JSON_WS_URL + '/subject/get-subjects').then(response => response.data)
}

/**
 * Get the specified school's users filtered by name
 */
function getSchoolUsers (schoolId, query) {
  return axios.get(constants.JSON_WS_URL + USER_MANAGEMENT_PATH + '.usersearch/get-school-student-teacher-list', {
    params: {
      // p_auth: getCookie('pauth'),
      schoolId: schoolId,
      search: query
    }
  }).then(response => response.data)
}
