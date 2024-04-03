import axios from 'axios'

import constants from '@/api/constants'

export {
  getSchoolMembers,
  getSchoolStudents,
  getSchoolRelatives,
  getSchoolTeachers,
  getSchoolAgents,
  getSchoollifeAgents,
  getTeacherStudents
}

const USER_SEARCH_PATH = '/user.usersearch'

function getSchoolMembers (schoolId, filter = '') {
  return axios.get(constants.JSON_WS_URL + USER_SEARCH_PATH + '/get-school-members', {
    params: {
      schoolId,
      filter
    }
  }).then(response => response.data)
}

function getSchoolStudents (schoolId, filter = '', start = -1, limit = -1) {
  return axios.get(constants.JSON_WS_URL + USER_SEARCH_PATH + '/get-school-students', {
    params: {
      schoolId,
      filter,
      start,
      limit
    }
  }).then(response => response.data)
}

function getSchoolRelatives (schoolId, filter = '', start = -1, limit = -1) {
  return axios.get(constants.JSON_WS_URL + USER_SEARCH_PATH + '/get-school-relatives', {
    params: {
      schoolId,
      filter,
      start,
      limit
    }
  }).then(response => response.data)
}

function getSchoolTeachers (schoolId, filter = '', start = -1, limit = -1) {
  return axios.get(constants.JSON_WS_URL + USER_SEARCH_PATH + '/get-school-teachers', {
    params: {
      schoolId,
      filter,
      start,
      limit
    }
  }).then(response => response.data)
}

function getSchoolAgents (schoolId, filter = '', start = -1, limit = -1) {
  return axios.get(constants.JSON_WS_URL + USER_SEARCH_PATH + '/get-school-agents', {
    params: {
      schoolId,
      filter
    }
  }).then(response => response.data)
}

function getSchoollifeAgents (schoolId, filter = '') {
  return axios.get(constants.JSON_WS_URL + USER_SEARCH_PATH + '/get-schoolife-agents', {
    params: {
      schoolId,
      filter
    }
  }).then(response => response.data)
}

function getTeacherStudents (filter = '', start = -1, limit = -1) {
  return axios.get(constants.JSON_WS_URL + USER_SEARCH_PATH + '/get-teacher-students', {
    params: {
      filter,
      start,
      limit
    }
  }).then(response => response.data)
}
