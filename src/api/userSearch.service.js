import axios from 'axios'

import constants from '@/api/constants'

export {
  getSchoolMembers,
  getSchoolStudents,
  getSchoolRelatives,
  getSchoolTeachers,
  getSchoolAgents,
  getSchoollifeAgents
}

const USER_SEARCH_PATH = '/user.usersearch'

function getSchoolMembers (schoolId, search = '') {
  return axios.get(constants.JSON_WS_URL + USER_SEARCH_PATH + '/get-school-members', {
    params: {
      schoolId,
      search
    }
  }).then(response => response.data)
}

function getSchoolStudents (schoolId, search = '') {
  return axios.get(constants.JSON_WS_URL + USER_SEARCH_PATH + '/get-school-students', {
    params: {
      schoolId,
      search
    }
  }).then(response => response.data)
}

function getSchoolRelatives (schoolId, search = '') {
  return axios.get(constants.JSON_WS_URL + USER_SEARCH_PATH + '/get-school-relatives', {
    params: {
      schoolId,
      search
    }
  }).then(response => response.data)
}

function getSchoolTeachers (schoolId, search = '') {
  return axios.get(constants.JSON_WS_URL + USER_SEARCH_PATH + '/get-school-teachers', {
    params: {
      schoolId,
      search
    }
  }).then(response => response.data)
}

function getSchoolAgents (schoolId, search = '') {
  return axios.get(constants.JSON_WS_URL + USER_SEARCH_PATH + '/get-school-agents', {
    params: {
      schoolId,
      search
    }
  }).then(response => response.data)
}

function getSchoollifeAgents (schoolId, search = '') {
  return axios.get(constants.JSON_WS_URL + USER_SEARCH_PATH + '/get-schoolife-agents', {
    params: {
      schoolId,
      search
    }
  }).then(response => response.data)
}
