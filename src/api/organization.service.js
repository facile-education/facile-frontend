import axios from 'axios'

import constants from '@/api/constants'

export {
  getAdministeredSchoolList,
  getAllSchools,
  getSchoolClassList,
  getSchoolVoleeList
}

const ORG_PATH = '/organization.'

function getAllSchools () {
  return axios.get(constants.JSON_WS_URL + ORG_PATH + 'orgutils/get-all-schools', {
    params: {}
  }).then(response => response.data)
}

function getAdministeredSchoolList () {
  return axios.get(constants.JSON_WS_URL + ORG_PATH + 'orgutils/get-visibility-schools', {
    params: {}
  }).then(response => response.data)
}

/**
 * Get school classes
 */
function getSchoolClassList (schoolId, includeCours) {
  return axios.get(constants.JSON_WS_URL + ORG_PATH + 'orgutils/get-school-classes', {
    params: {
      schoolId,
      includeCours
    }
  }).then(response => response.data)
}

/**
 * Get school volees
 */
function getSchoolVoleeList (schoolId = 0) {
  return axios.get(constants.JSON_WS_URL + ORG_PATH + 'orgutils/get-school-volees', {
    params: {
      schoolId
    }
  }).then(response => response.data)
}
