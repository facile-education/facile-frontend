import axios from 'axios'
import PentilaUtils from 'pentila-utils'

import constants from '@/api/constants'

export {
  getNextSessions,
  getScheduleConfiguration,
  getUserSessions,
  getGroupSessions,
  getGlobalConfiguration,
  saveGlobalConfiguration,
  getSchoolSlotConfiguration,
  saveSchoolSlotConfiguration,
  getTeacherGroups,
  getSessionDetails,
  getSessionTeachersAndSubstitutes,
  saveTeacherSubstitutes,
  createSession
}

export default {
  getUserSessions,
  getGroupSessions,
  createSession
}

const CDT_PATH = '/schedule.'

/**
 * Get CDT configuration
 */
function getScheduleConfiguration () {
  return axios.get(constants.JSON_WS_URL + CDT_PATH + 'scheduleconfiguration/get-schedule-configuration').then(response => response.data)
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
      schoolId
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
 * Get the user session list for specified date range
 */
function getUserSessions (userId, minDate, maxDate) {
  return axios.get(constants.JSON_WS_URL + CDT_PATH + 'cdtsession/get-user-sessions', {
    params: {
      userId,
      minDateStr: minDate.format('YYYY-MM-DD HH:mm'),
      maxDateStr: maxDate.format('YYYY-MM-DD HH:mm')
    }
  }).then(response => response.data)
}

/**
 * Get the group session list for specified date range
 */
function getGroupSessions (groupId, minDate, maxDate) {
  return axios.get(constants.JSON_WS_URL + CDT_PATH + 'cdtsession/get-group-sessions', {
    params: {
      groupId,
      minDateStr: minDate.format('YYYY-MM-DD HH:mm'),
      maxDateStr: maxDate.format('YYYY-MM-DD HH:mm')
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

function createSession (groupId, subject, room, dayNumber, slot, startHour, endHour, teacherIds, isRecurrent) {
  return axios.post(constants.JSON_WS_URL + CDT_PATH + 'cdtsession/create-session', PentilaUtils.URL.params({
    groupId,
    subject,
    room,
    dayNumber,
    slot,
    startHour,
    endHour,
    teacherIds: JSON.stringify(teacherIds),
    isRecurrent
  })).then(response => response.data)
}

function getNextSessions (sessionId) {
  return axios.get(constants.JSON_WS_URL + CDT_PATH + 'cdtsession/get-course-next-sessions', {
    params: {
      sessionId
    }
  }).then(response => response.data)
}
