import axios from 'axios'
import PentilaUtils from 'pentila-utils'

import constants from '@/api/constants'

export default {
  createSlot,
  updateSlot,
  deleteSlot,
  getSessionLimitSlotDate,
  getCandidateSessions,
  getWeekSession,
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

const SCHOOL_LIFE_SLOT_PATH = '/schoollife.schoollifeslot'
const SCHOOL_LIFE_SESSION_PATH = '/schoollife.schoollifesession'
const SCHOOL_LIFE_SESSION_STUDENT_PATH = '/schoollife.sessionstudent'
const SCHOOL_LIFE_RENVOI_PATH = '/schoollife.renvoi'

/**
 * Create a slot of a given type in the school. (return only success field)
 */
function createSlot (schoolId, startDateStr, endDateStr, day, startHour, endHour, teacherId, type, room, capacity) {
  return axios.get(constants.JSON_WS_URL + SCHOOL_LIFE_SLOT_PATH + '/create-slot', {
    params: {
      schoolId: schoolId,
      startDateStr: startDateStr,
      endDateStr: endDateStr,
      day: day,
      startHour: startHour,
      endHour: endHour,
      teacherId: teacherId,
      type: type,
      room: room,
      capacity: capacity
    }
  }).then(response => response.data)
}

/**
 * Update a slot based on it id
 */
function updateSlot (slotId, startDateStr, endDateStr, day, startHour, endHour, teacherId, type, room, capacity) {
  return axios.get(constants.JSON_WS_URL + SCHOOL_LIFE_SLOT_PATH + '/edit-slot', {
    params: {
      schoollifeSessionId: slotId,
      startDateStr: startDateStr,
      endDateStr: endDateStr,
      newDay: day,
      newStartHour: startHour,
      newEndHour: endHour,
      newTeacherId: teacherId,
      newType: type,
      newRoom: room,
      newCapacity: capacity
    }
  }).then(response => response.data)
}

/**
 * Delete a slot and all the sessions concerns by a slot after a given date
 */
function deleteSlot (slotId, startDateStr, endDateStr) {
  return axios.get(constants.JSON_WS_URL + SCHOOL_LIFE_SLOT_PATH + '/delete-slot', {
    params: {
      schoollifeSessionId: slotId,
      startDateStr: startDateStr,
      endDateStr: endDateStr
    }
  }).then(response => response.data)
}

function getSessionLimitSlotDate (sessionId) {
  return axios.get(constants.JSON_WS_URL + SCHOOL_LIFE_SLOT_PATH + '/get-session-limit-slot-date', {
    params: {
      schoollifeSessionId: sessionId
    }
  }).then(response => response.data)
}

/**
 * Get a student's day slots (based on the day of currentSlot) with more accurate about teachers than getStudentSessions
 * Fields: success, candidateSessions
 */
function getCandidateSessions (student, currentSlotId) {
  return axios.get(constants.JSON_WS_URL + SCHOOL_LIFE_RENVOI_PATH + '/get-candidate-sessions', {
    params: {
      studentId: student.studentId,
      schoollifeSessionId: currentSlotId
    }
  }).then(response => response.data)
}

/**
 * Get the unusual slots of a week, filtered by type
 */
function getWeekSession (schoolId, slotType, currentDate) {
  return axios.get(constants.JSON_WS_URL + SCHOOL_LIFE_SESSION_PATH + '/get-week-sessions', {
    params: {
      schoolId,
      type: slotType,
      currentDateStr: currentDate.format('YYYY-MM-DD HH:mm')
    }
  }).then(response => response.data)
}

/**
 * Get the students registered in a slot (fields: success, members)
 */
function getSessionMembers (slotId) {
  return axios.get(constants.JSON_WS_URL + SCHOOL_LIFE_SESSION_STUDENT_PATH + '/get-session-members', {
    params: {
      schoollifeSessionId: slotId
    }
  }).then(response => response.data)
}

/**
 * Register class in a not usual slot (fields: success)
 */
function registerClass (classId, slotId, comment, notifyParents, replayTestSubject) {
  return axios.get(constants.JSON_WS_URL + SCHOOL_LIFE_SESSION_STUDENT_PATH + '/register-class', {
    params: {
      classId,
      schoollifeSessionId: slotId,
      comment: comment,
      notifyParents: notifyParents,
      replayTestSubject: replayTestSubject
    }
  }).then(response => response.data)
}

/**
 * Register student in a not usual slot (fields: success)
 */
function registerStudent (student, slotId, comment, notifyParents, replayTestSubject) {
  return axios.get(constants.JSON_WS_URL + SCHOOL_LIFE_SESSION_STUDENT_PATH + '/register-student', {
    params: {
      studentId: student.studentId,
      schoollifeSessionId: slotId,
      comment: comment,
      notifyParents: notifyParents,
      replayTestSubject: replayTestSubject
    }
  }).then(response => response.data)
}

/**
 * UnRegister student from a not usual slot (fields: success)
 */
function unRegisterStudent (student, slotId, comment, notifyParents, allSessions) {
  return axios.get(constants.JSON_WS_URL + SCHOOL_LIFE_SESSION_STUDENT_PATH + '/unregister-student', {
    params: {
      studentId: student.studentId,
      schoollifeSessionId: slotId,
      comment: comment,
      notifyParents: notifyParents,
      allSessions: allSessions
    }
  }).then(response => response.data)
}

/**
 * Register student firing (fields: success)
 */
function registerFiring (slotId, student, sourceSessionId, sourceTeacherId, sourceSchoollifeSessionId, registrationDate) {
  return axios.get(constants.JSON_WS_URL + SCHOOL_LIFE_RENVOI_PATH + '/register-student-renvoi', {
    params: {
      schoollifeSessionId: slotId,
      studentId: student.studentId,
      sourceSessionId: sourceSessionId,
      sourceTeacherId: sourceTeacherId,
      sourceSchoollifeSessionId: sourceSchoollifeSessionId,
      registrationDate: registrationDate
    }
  }).then(response => response.data)
}

/**
 * unRegisterFiring student firing (fields: success)
 */
function unRegisterFiring (slotId, student) {
  return axios.get(constants.JSON_WS_URL + SCHOOL_LIFE_RENVOI_PATH + '/unregister-student-renvoi', {
    params: {
      schoollifeSessionId: slotId,
      studentId: student.studentId
    }
  }).then(response => response.data)
}

/**
 * Get pending firing (fields: success, pendingRenvois)
 */
function getPendingFirings () {
  return axios.get(constants.JSON_WS_URL + SCHOOL_LIFE_RENVOI_PATH + '/get-pending-renvois').then(response => response.data)
}

/**
 * Set the reason of a firing
 * Updates the awareness
 */
function setFiringReason (slotId, studentId, reason) {
  return axios.get(constants.JSON_WS_URL + SCHOOL_LIFE_RENVOI_PATH + '/set-renvoi-reason', {
    params: {
      schoollifeSessionId: slotId,
      studentId: studentId,
      reason: reason
    }
  }).then(response => response.data)
}

/**
 * StudentsPresence is a json containing all the students of a slot with a boolean 'isPresent' (fields: success)
 */
function markStudentsPresent (slotId, studentsPresence) {
  return axios.post(constants.JSON_WS_URL + SCHOOL_LIFE_SESSION_STUDENT_PATH + '/mark-students-present', PentilaUtils.URL.params({
    schoollifeSessionId: slotId,
    studentsPresence
  })).then(response => response.data)
}
