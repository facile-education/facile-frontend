import axios from 'axios'
import constants from '@/api/constants'

export default {
  getConfiguration,
  getGroups,
  getSessions
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
