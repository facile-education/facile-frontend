// /api/jsonws/accesAteliers-portlet.orgutils/get-school-classes?schoolId=15180702

import axios from 'axios'
import constants from '@/api/constants'

export {
  getSchoolCLassList,
  getSchoolVoleeList
}

export default {
  getSchoolCLassList
}

const ORG_PATH = '/accesAteliers-portlet.'

/**
 * Get school classes
 */
function getSchoolCLassList (schoolId) {
  return axios.get(constants.JSON_WS_URL + ORG_PATH + 'orgutils/get-school-classes', {
    params: {
      schoolId
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
