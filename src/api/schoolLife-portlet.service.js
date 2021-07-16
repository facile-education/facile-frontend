import axios from 'axios'
import constants from '@/api/constants'

export default {
  getSchoolStudents,
  getSchoolTeachers,
  createSlot,
  updateSlot,
  deleteSlot,
  getStudentSessions,
  getCandidateSessions,
  getWeekSession,
  getSessionMembers,
  registerStudent,
  unRegisterStudent,
  registerFiring,
  unRegisterFiring,
  getPendingFirings,
  setFiringReason,
  markStudentsPresent
}

const SCHOOL_LIFE_PATH = '/schoollife-portlet'

/**
 * Get the specified school's students filtered by name
 */
function getSchoolStudents (schoolId, query) {
  return axios.get(SCHOOL_LIFE_PATH + constants.JSON_WS_URL + '/schoollifesessionstudent/get-school-students', {
    params: {
      // p_auth: getCookie('pauth'),
      schoolId: schoolId,
      search: query
    }
  }).then(response => response.data)
}

/**
 * Get the specified school's teachers filtered by name
 */
function getSchoolTeachers (schoolId, query) {
  return axios.get(SCHOOL_LIFE_PATH + constants.JSON_WS_URL + '/schoollifeslot/get-teachers', {
    params: {
      // p_auth: getCookie('pauth'),
      schoolId: schoolId,
      search: query
    }
  }).then(response => response.data)
}

/**
 * Create a slot of a given type in the school. (return only success field)
 */
function createSlot (schoolId, startDateStr, day, startHour, endHour, teacherId, type, room, capacity) {
  return axios.get(SCHOOL_LIFE_PATH + constants.JSON_WS_URL + '/schoollifeslot/create-slot', {
    params: {
      // p_auth: getCookie('pauth'),
      schoolId: schoolId,
      startDateStr: startDateStr,
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
function updateSlot (slotId, startDateStr, day, startHour, endHour, teacherId, type, room, capacity) {
  return axios.get(SCHOOL_LIFE_PATH + constants.JSON_WS_URL + '/schoollifeslot/edit-slot', {
    params: {
      schoollifeSessionId: slotId,
      startDateStr: startDateStr,
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
function deleteSlot (slotId, startDateStr) {
  return axios.get(SCHOOL_LIFE_PATH + constants.JSON_WS_URL + '/schoollifeslot/delete-slot', {
    params: {
      schoollifeSessionId: slotId,
      startDateStr: startDateStr
    }
  }).then(response => response.data)
}

/**
 * Get the student's slots in the specified amount of time
 */
function getStudentSessions (student, minDate, maxDate) {
  return axios.get(SCHOOL_LIFE_PATH + constants.JSON_WS_URL + '/schoollifesessionstudent/get-student-sessions', {
    params: {
      studentId: student.studentId,
      minDateStr: minDate.format('YYYY/MM/DD HH:mm'),
      maxDateStr: maxDate.format('YYYY/MM/DD HH:mm')
    }
  }).then(response => response.data)
}

/**
 * Get a student's day slots (based on the day of currentSlot) with more accurate about teachers than getStudentSessions
 * Fields: success, candidateSessions
 */
function getCandidateSessions (student, currentSlotId) {
  return axios.get(SCHOOL_LIFE_PATH + constants.JSON_WS_URL + '/renvoi/get-candidate-sessions', {
    params: {
      studentId: student.studentId,
      schoollifeSessionId: currentSlotId
    }
  }).then(response => response.data)
}

/**
 * Get the unusual slots of a week, filtered by type
 */
function getWeekSession (slotType, currentDate) {
  return axios.get(SCHOOL_LIFE_PATH + constants.JSON_WS_URL + '/schoollifesession/get-week-sessions', {
    params: {
      type: slotType,
      currentDateStr: currentDate.format('YYYY/MM/DD HH:mm')
    }
  }).then(response => response.data)
}

/**
 * Get the students registered in a slot (fields: success, members)
 */
function getSessionMembers (slotId) {
  return axios.get(SCHOOL_LIFE_PATH + constants.JSON_WS_URL + '/schoollifesessionstudent/get-session-members', {
    params: {
      schoollifeSessionId: slotId
    }
  }).then(response => response.data)
}

/**
 * Register student in a not usual slot (fields: success)
 */
function registerStudent (student, slotId, comment, notifyParents) {
  return axios.get(SCHOOL_LIFE_PATH + constants.JSON_WS_URL + '/schoollifesessionstudent/register-student', {
    params: {
      studentId: student.studentId,
      schoollifeSessionId: slotId,
      comment: comment,
      notifyParents: notifyParents
    }
  }).then(response => response.data)
}

/**
 * UnRegister student from a not usual slot (fields: success)
 */
function unRegisterStudent (student, slotId, comment, notifyParents, allSessions) {
  return axios.get(SCHOOL_LIFE_PATH + constants.JSON_WS_URL + '/schoollifesessionstudent/unregister-student', {
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
function registerFiring (slotId, student, sourceSessionId, sourceTeacherId) {
  return axios.get(SCHOOL_LIFE_PATH + constants.JSON_WS_URL + '/renvoi/register-student-renvoi', {
    params: {
      schoollifeSessionId: slotId,
      studentId: student.studentId,
      sourceSessionId: sourceSessionId,
      sourceTeacherId: sourceTeacherId
    }
  }).then(response => response.data)
}

/**
 * unRegisterFiring student firing (fields: success)
 */
function unRegisterFiring (slotId, student) {
  return axios.get(SCHOOL_LIFE_PATH + constants.JSON_WS_URL + '/renvoi/unregister-student-renvoi', {
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
  return axios.get(SCHOOL_LIFE_PATH + constants.JSON_WS_URL + '/renvoi/get-pending-renvois').then(response => response.data)
}

/**
 * Set the reason of a firing (fields: success)
 */
function setFiringReason (slotId, studentId, reason) {
  return axios.get(SCHOOL_LIFE_PATH + constants.JSON_WS_URL + '/renvoi/set-renvoi-reason', {
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
  return axios.get(SCHOOL_LIFE_PATH + constants.JSON_WS_URL + '/schoollifesessionstudent/mark-students-present', {
    params: {
      schoollifeSessionId: slotId,
      studentsPresence: studentsPresence
    }
  }).then(response => response.data)
}
