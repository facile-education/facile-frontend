import axios from 'axios'
import PentilaUtils from 'pentila-utils'

import constants from '@/api/constants'

export {
  getConfiguration,
  getSessions,
  getTeacherGroups,
  getSessionDetails,
  getSessionTeachersAndSubstitutes,
  saveTeacherSubstitutes,
  createSession
}

export default {
  getConfiguration,
  getSessions,
  getTeacherGroups,
  getSessionDetails,
  createSession
}

const CDT_PATH = '/schedule.'

/**
 * Get CDT configuration
 */
function getConfiguration (schoolId = 0) {
  return axios.get(constants.JSON_WS_URL + CDT_PATH + 'scheduleconfiguration/get-configuration', {
    params: {
      schoolId: schoolId,
      childId: 0
    }
  }).then(response => response.data)
}

/**
 * Get the user or group session list for specified date range
 */
function getSessions (userId, groupId, minDate, maxDate, volee = '') {
  return axios.get(constants.JSON_WS_URL + CDT_PATH + 'cdtsession/get-horaires-sessions', {
    params: {
      userId,
      groupId,
      start: minDate.format('YYYY-MM-DD HH:mm'),
      end: maxDate.format('YYYY-MM-DD HH:mm'),
      volee: volee
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
      sessionId: sessionId
    }
  }).then(response => response.data)
}

// SessionTeacher and substitutes management
function getSessionTeachersAndSubstitutes (sessionId) {
  return axios.get(constants.JSON_WS_URL + CDT_PATH + 'sessionteacher/get-session-teachers-and-substitutes', {
    params: {
      sessionId
    }
  }).then(response => response.data)
}

function saveTeacherSubstitutes (sessionId, teacherArray) {
  return axios.post(constants.JSON_WS_URL + CDT_PATH + 'sessionteacher/save-teacher-substitutes', PentilaUtils.URL.params({
    sessionId,
    teacherArray: JSON.stringify(teacherArray)
  })).then(response => response.data)
}

function createSession (groupId, subject, room, startDate, endDate, teacherIds, isRecurrent) {
  return axios.post(constants.JSON_WS_URL + CDT_PATH + 'cdtsession/create-session', PentilaUtils.URL.params({
    groupId,
    subject,
    room,
    startDate: startDate.format('YYYY-MM-DD HH:mm'),
    endDate: endDate.format('YYYY-MM-DD HH:mm'),
    teacherIds: JSON.stringify(teacherIds),
    isRecurrent
  })).then(response => response.data)
}
