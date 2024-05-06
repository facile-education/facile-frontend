import WeprodeUtils from '@utils/weprode.utils'
import axios from 'axios'

import constants, { DATE_EXCHANGE_FORMAT } from '@/api/constants'

export default {
  createSlot,
  updateSlot,
  deleteSlot,
  getSessionLimitSlotDate,
  getCandidateSessions,
  getWeekSessions,
  getSessionMembers,
  registerClass,
  registerStudent,
  unRegisterStudent,
  registerFiring,
  unRegisterFiring,
  getPendingFirings,
  setFiringReason,
  markStudentsPresent
}

const OFF_SCHEDULE_SLOT_PATH = '/offschedule.offscheduleslot'
const OFF_SCHEDULE_SESSION_PATH = '/offschedule.offschedulesession'
const OFF_SCHEDULE_SESSION_STUDENT_PATH = '/offschedule.sessionstudent'
const OFF_SCHEDULE_RENVOI_PATH = '/offschedule.renvoi'

/**
 * Create a slot of a given type in the school. (return only success field)
 */
function createSlot (schoolId, startDateStr, endDateStr, day, startHour, endHour, teacherId, type, room, capacity) {
  return axios.post(constants.JSON_WS_URL + OFF_SCHEDULE_SLOT_PATH + '/create-slot', WeprodeUtils.params({
    schoolId,
    startDateStr,
    endDateStr,
    day,
    startHour,
    endHour,
    teacherId,
    type,
    room,
    capacity
  })).then(response => response.data)
}

/**
 * Update a slot based on it id
 */
function updateSlot (slotId, startDateStr, endDateStr, day, startHour, endHour, teacherId, room, capacity) {
  return axios.post(constants.JSON_WS_URL + OFF_SCHEDULE_SLOT_PATH + '/edit-slot', WeprodeUtils.params({
    offScheduleSessionId: slotId,
    startDateStr,
    endDateStr,
    newDay: day,
    newStartHour: startHour,
    newEndHour: endHour,
    newTeacherId: teacherId,
    newRoom: room,
    newCapacity: capacity
  })).then(response => response.data)
}

/**
 * Delete a slot and all the sessions concerns by a slot after a given date
 */
function deleteSlot (slotId, startDateStr, endDateStr) {
  return axios.delete(constants.JSON_WS_URL + OFF_SCHEDULE_SLOT_PATH + '/delete-slot', {
    params: {
      offScheduleSessionId: slotId,
      startDateStr,
      endDateStr
    }
  }).then(response => response.data)
}

function getSessionLimitSlotDate (sessionId) {
  return axios.get(constants.JSON_WS_URL + OFF_SCHEDULE_SLOT_PATH + '/get-session-limit-slot-date', {
    params: {
      offScheduleSessionId: sessionId
    }
  }).then(response => response.data)
}

/**
 * Get a student's day slots (based on the day of currentSlot) with more accurate about teachers than getStudentSessions
 * Fields: success, candidateSessions
 */
function getCandidateSessions (student, currentSlotId) {
  return axios.get(constants.JSON_WS_URL + OFF_SCHEDULE_RENVOI_PATH + '/get-candidate-sessions', {
    params: {
      studentId: student.userId,
      offScheduleSessionId: currentSlotId
    }
  }).then(response => response.data)
}

/**
 * Get the unusual slots of a week, filtered by type
 */
function getWeekSessions (schoolId, slotType, startDate, endDate) {
  return axios.get(constants.JSON_WS_URL + OFF_SCHEDULE_SESSION_PATH + '/get-week-sessions', {
    params: {
      schoolId,
      type: slotType,
      startDate: startDate.format(DATE_EXCHANGE_FORMAT),
      endDate: endDate.format(DATE_EXCHANGE_FORMAT)
    }
  }).then(response => response.data)
}

/**
 * Get the students registered in a slot (fields: success, members)
 */
function getSessionMembers (slotId) {
  return axios.get(constants.JSON_WS_URL + OFF_SCHEDULE_SESSION_STUDENT_PATH + '/get-session-members', {
    params: {
      offScheduleSessionId: slotId
    }
  }).then(response => response.data)
}

/**
 * Register class in a not usual slot (fields: success)
 */
function registerClass (classId, slotId, comment, notifyParents, replayTestSubject) {
  return axios.post(constants.JSON_WS_URL + OFF_SCHEDULE_SESSION_STUDENT_PATH + '/register-class', WeprodeUtils.params({
    classId,
    offScheduleSessionId: slotId,
    comment,
    notifyParents,
    replayTestSubject
  })).then(response => response.data)
}

/**
 * Register student in a not usual slot (fields: success)
 */
function registerStudent (student, slotId, comment, notifyParents, replayTestSubject) {
  return axios.post(constants.JSON_WS_URL + OFF_SCHEDULE_SESSION_STUDENT_PATH + '/register-student', WeprodeUtils.params({
    studentId: student.userId,
    offScheduleSessionId: slotId,
    comment,
    notifyParents,
    replayTestSubject
  })).then(response => response.data)
}

/**
 * UnRegister student from a not usual slot (fields: success)
 */
function unRegisterStudent (student, slotId, allSessions) {
  return axios.post(constants.JSON_WS_URL + OFF_SCHEDULE_SESSION_STUDENT_PATH + '/unregister-student', WeprodeUtils.params({
    studentId: student.userId,
    offScheduleSessionId: slotId,
    allSessions
  })).then(response => response.data)
}

/**
 * Register student firing (fields: success)
 */
function registerFiring (slotId, student, sourceSessionId, sourceTeacherId, sourceOffScheduleSessionId, registrationDate) {
  return axios.post(constants.JSON_WS_URL + OFF_SCHEDULE_RENVOI_PATH + '/register-student-renvoi', WeprodeUtils.params({
    offScheduleSessionId: slotId,
    studentId: student.userId,
    sourceSessionId,
    sourceTeacherId,
    sourceOffScheduleSessionId,
    registrationDate
  })).then(response => response.data)
}

/**
 * unRegisterFiring student firing (fields: success)
 */
function unRegisterFiring (slotId, student) {
  return axios.post(constants.JSON_WS_URL + OFF_SCHEDULE_RENVOI_PATH + '/unregister-student-renvoi', WeprodeUtils.params({
    offScheduleSessionId: slotId,
    studentId: student.userId
  })).then(response => response.data)
}

/**
 * Get pending firing (fields: success, pendingRenvois)
 */
function getPendingFirings () {
  return axios.get(constants.JSON_WS_URL + OFF_SCHEDULE_RENVOI_PATH + '/get-pending-renvois').then(response => response.data)
}

/**
 * Set the reason of a firing
 * Updates the awareness
 */
function setFiringReason (slotId, studentId, reason) {
  return axios.post(constants.JSON_WS_URL + OFF_SCHEDULE_RENVOI_PATH + '/set-renvoi-reason', WeprodeUtils.params({
    offScheduleSessionId: slotId,
    studentId,
    reason
  })).then(response => response.data)
}

/**
 * StudentsPresence is a json containing all the students of a slot with a boolean 'isPresent' (fields: success)
 */
function markStudentsPresent (slotId, studentsPresence) {
  return axios.post(constants.JSON_WS_URL + OFF_SCHEDULE_SESSION_STUDENT_PATH + '/mark-students-present', WeprodeUtils.params({
    offScheduleSessionId: slotId,
    studentsPresence
  })).then(response => response.data)
}
