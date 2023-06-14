import axios from 'axios'
import constants from '@/api/constants'
import PentilaUtils from 'pentila-utils'

export {
  getConfiguration,
  getGlobalConfiguration,
  saveGlobalConfiguration,
  getSchoolSlotConfiguration,
  saveSchoolSlotConfiguration,
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
 * Get ENT configuration (star year date, end year date, holidays and weeks parity
 */
function getGlobalConfiguration () {
  return axios.get(constants.JSON_WS_URL + CDT_PATH + 'scheduleconfiguration/get-global-configuration').then(response => response.data)
}

/**
 * Save ENT configuration (star year date, end year date, holidays and weeks parity
 */
function saveGlobalConfiguration (startDate, semesterDate, endDate, holidays, h1Weeks, h2Weeks) {
  return axios.post(constants.JSON_WS_URL + CDT_PATH + 'scheduleconfiguration/save-global-configuration', PentilaUtils.URL.params({
    startDateStr: startDate.format('YYYY-MM-DD'),
    semesterDateStr: semesterDate.format('YYYY-MM-DD'),
    endDateStr: endDate.format('YYYY-MM-DD'),
    holidays: JSON.stringify(holidays),
    h1Weeks,
    h2Weeks
  })).then(response => response.data)
}

/**
 * Get school slots (P1, P2, etc...)
 */
function getSchoolSlotConfiguration (schoolId) {
  return axios.get(constants.JSON_WS_URL + CDT_PATH + 'slotconfiguration/get-school-slot-configuration', {
    params: {
      schoolId: schoolId
    }
  }).then(response => response.data)
}

/**
 * Save school slots (P1, P2, etc...)
 */
function saveSchoolSlotConfiguration (schoolId, slots) {
  return axios.post(constants.JSON_WS_URL + CDT_PATH + 'slotconfiguration/save-school-slot-configuration', PentilaUtils.URL.params({
    schoolId,
    jsonConfig: JSON.stringify(slots)
  })).then(response => response.data)
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
