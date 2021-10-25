import axios from 'axios'
import constants from '@/api/constants'

export {
  getConfiguration,
  getGroups,
  getSessions,
  getTeacherGroups,
  getSessionDetails
}

export default {
  getConfiguration,
  getGroups,
  getSessions,
  getTeacherGroups,
  getSessionDetails
}

const CDT_PATH = '/cdt-portlet.'

/**
 * Get CDT configuration
 */
function getConfiguration () {
  return axios.get(constants.JSON_WS_URL + CDT_PATH + 'configuration/get-configuration', {
    params: {
      childId: 0
    }
  }).then(response => response.data)
}

/**
 * Get group list
 */
function getGroups (schoolId) {
  return axios.get(constants.JSON_WS_URL + CDT_PATH + 'configuration/get-all-groups', {
    params: {
      schoolId: schoolId
    }
  }).then(response => response.data)
}

/**
 * Get the user or group session list for specified date range
 */
function getSessions (userId, groupId, minDate, maxDate) {
  return axios.get(constants.JSON_WS_URL + CDT_PATH + 'cdtsession/get-horaires-sessions', {
    params: {
      userId,
      groupId,
      start: minDate.format('YYYY-MM-DD HH:mm'),
      end: maxDate.format('YYYY-MM-DD HH:mm')
    }
  }).then(response => response.data)
}

function getTeacherGroups () {
  return axios.get(constants.JSON_WS_URL + CDT_PATH + 'cdtsession/get-teacher-groups', {
    params: {
    }
  }).then(response => response.data)
}

function getSessionDetails (sessionId) {
  return axios.get(constants.JSON_WS_URL + CDT_PATH + 'cdtsession/get-session-details', {
    params: {
      sessionId
    }
  }).then(response => response.data)
}
