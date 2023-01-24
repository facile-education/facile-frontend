import axios from 'axios'
import constants from '@/api/constants'

export {
  getSchoollifeAgents,
  getSchoolStudents,
  getSchoolTeachers,
  getSchoolUsers
}

const USER_SEARCH_PATH = '/gestionUtilisateurs-portlet.usersearch'

function getSchoolUsers (schoolId, search = '') {
  return axios.get(constants.JSON_WS_URL + USER_SEARCH_PATH + '/get-school-student-teacher-list', {
    params: {
      schoolId,
      search
    }
  }).then(response => response.data)
}

/**
 * Get the specified school's schoolife agents filtered by name
 */
function getSchoollifeAgents (schoolId, search = '') {
  return axios.get(constants.JSON_WS_URL + USER_SEARCH_PATH + '/get-schoolife-agents', {
    params: {
      search,
      schoolId
    }
  }).then(response => response.data)
}

/**
 * Get the specified school's students filtered by name
 */
function getSchoolStudents (schoolId, search = '') {
  return axios.get(constants.JSON_WS_URL + USER_SEARCH_PATH + '/get-school-students', {
    params: {
      search,
      schoolId
    }
  }).then(response => response.data)
}

function getSchoolTeachers (schoolId, search = '') {
  return axios.get(constants.JSON_WS_URL + USER_SEARCH_PATH + '/get-school-teachers', {
    params: {
      search,
      schoolId
    }
  }).then(response => response.data)
}
