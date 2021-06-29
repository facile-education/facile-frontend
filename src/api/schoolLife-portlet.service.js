import axios from 'axios'
import constants from '@/api/constants'

export default {
  getSchoolStudents
}

const SCHOOL_LIFE_PATH = 'schoollife-portlet/schoollifesessionstudent/'

/**
 * Get the specified school's students filtered by name
 */
function getSchoolStudents (schoolId, query) {
  return axios.get(constants.JSON_WS_URL + SCHOOL_LIFE_PATH + '/get-school-students', {
    params: {
      // p_auth: getCookie('pauth'),
      schoolId: schoolId,
      search: query
    }
  }).then(response => response.data)
}
