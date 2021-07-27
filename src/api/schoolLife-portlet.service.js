import axios from 'axios'
// import constants from '@/api/constants'

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

// const SCHOOL_LIFE_PATH = '/schoollife-portlet'
const SCHOOL_LIFE_URL = '/group/14924102/schoollife?p_p_id=schoollife_WAR_schoollifeportlet&p_p_lifecycle=2&p_p_state=exclusive&p_p_mode=view&&p_p_cacheability=cacheLevelPage&controlPanelCategory=portlet_schoollife_WAR_schoollifeportlet'

/**
 * Get the specified school's students filtered by name
 */
function getSchoolStudents (schoolId, query) {
  // return axios.get(SCHOOL_LIFE_PATH + constants.JSON_WS_URL + '/schoollifesessionstudent/get-school-students', {
  return axios.get(SCHOOL_LIFE_URL, {
    params: {
      // p_auth: getCookie('pauth'),
      cmd: 'get-school-students',
      schoolId: schoolId,
      search: query
    }
  }).then(response => response.data)
}

/**
 * Get the specified school's teachers filtered by name
 */
function getSchoolTeachers (schoolId, query) {
  // return axios.get(SCHOOL_LIFE_PATH + constants.JSON_WS_URL + '/schoollifeslot/get-teachers', {
  return axios.get(SCHOOL_LIFE_URL, {
    params: {
      cmd: 'get-teachers',
      schoolId: schoolId,
      search: query
    }
  }).then(response => response.data)
}

/**
 * Create a slot of a given type in the school. (return only success field)
 */
function createSlot (schoolId, startDateStr, day, startHour, endHour, teacherId, type, room, capacity) {
  // return axios.get(SCHOOL_LIFE_PATH + constants.JSON_WS_URL + '/schoollifeslot/create-slot', {
  return axios.get(SCHOOL_LIFE_URL, {
    params: {
      cmd: 'create-slot',
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
  // return axios.get(SCHOOL_LIFE_PATH + constants.JSON_WS_URL + '/schoollifeslot/edit-slot', {
  return axios.get(SCHOOL_LIFE_URL, {
    params: {
      cmd: 'edit-slot',
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
  // return axios.get(SCHOOL_LIFE_PATH + constants.JSON_WS_URL + '/schoollifeslot/delete-slot', {
  return axios.get(SCHOOL_LIFE_URL, {
    params: {
      cmd: 'delete-slot',
      schoollifeSessionId: slotId,
      startDateStr: startDateStr
    }
  }).then(response => response.data)
}

/**
 * Get the student's slots in the specified amount of time
 */
function getStudentSessions (student, minDate, maxDate) {
  // return axios.get(SCHOOL_LIFE_PATH + constants.JSON_WS_URL + '/schoollifesessionstudent/get-student-sessions', {
  return axios.get(SCHOOL_LIFE_URL, {
    params: {
      cmd: 'get-student-sessions',
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
  // return axios.get(SCHOOL_LIFE_PATH + constants.JSON_WS_URL + '/renvoi/get-candidate-sessions', {
  return axios.get(SCHOOL_LIFE_URL, {
    params: {
      cmd: 'get-candidate-sessions',
      studentId: student.studentId,
      schoollifeSessionId: currentSlotId
    }
  }).then(response => response.data)
}

/**
 * Get the unusual slots of a week, filtered by type
 */
function getWeekSession (slotType, currentDate) {
  // return axios.get(SCHOOL_LIFE_PATH + constants.JSON_WS_URL + '/schoollifesession/get-week-sessions', {
  return axios.get(SCHOOL_LIFE_URL, {
    params: {
      cmd: 'get-week-sessions',
      type: slotType,
      currentDateStr: currentDate.format('YYYY/MM/DD HH:mm')
    }
  }).then(response => response.data)
}

/**
 * Get the students registered in a slot (fields: success, members)
 */
function getSessionMembers (slotId) {
  // return axios.get(SCHOOL_LIFE_PATH + constants.JSON_WS_URL + '/schoollifesessionstudent/get-session-members', {
  return axios.get(SCHOOL_LIFE_URL, {
    params: {
      cmd: 'get-session-members',
      schoollifeSessionId: slotId
    }
  }).then(response => response.data)
}

/**
 * Register student in a not usual slot (fields: success)
 */
function registerStudent (student, slotId, comment, notifyParents, replayTestSubject) {
  // return axios.get(SCHOOL_LIFE_PATH + constants.JSON_WS_URL + '/schoollifesessionstudent/register-student', {
  return axios.get(SCHOOL_LIFE_URL, {
    params: {
      cmd: 'register-student',
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
  // return axios.get(SCHOOL_LIFE_PATH + constants.JSON_WS_URL + '/schoollifesessionstudent/unregister-student', {
  return axios.get(SCHOOL_LIFE_URL, {
    params: {
      cmd: 'unregister-student',
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
  // return axios.get(SCHOOL_LIFE_PATH + constants.JSON_WS_URL + '/renvoi/register-student-renvoi', {
  return axios.get(SCHOOL_LIFE_URL, {
    params: {
      cmd: 'register-student-renvoi',
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
  // return axios.get(SCHOOL_LIFE_PATH + constants.JSON_WS_URL + '/renvoi/unregister-student-renvoi', {
  return axios.get(SCHOOL_LIFE_URL, {
    params: {
      cmd: 'unregister-student-renvoi',
      schoollifeSessionId: slotId,
      studentId: student.studentId
    }
  }).then(response => response.data)
}

/**
 * Get pending firing (fields: success, pendingRenvois)
 */
function getPendingFirings () {
  // return axios.get(SCHOOL_LIFE_PATH + constants.JSON_WS_URL + '/renvoi/get-pending-renvois').then(response => response.data)
  return axios.get(SCHOOL_LIFE_URL, {
    cmd: 'get-pending-renvois'
  }).then(response => response.data)
}

/**
 * Set the reason of a firing (fields: success)
 */
function setFiringReason (slotId, studentId, reason) {
  // return axios.get(SCHOOL_LIFE_PATH + constants.JSON_WS_URL + '/renvoi/set-renvoi-reason', {
  return axios.get(SCHOOL_LIFE_URL, {
    params: {
      cmd: 'set-renvoi-reason',
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
  // return axios.get(SCHOOL_LIFE_PATH + constants.JSON_WS_URL + '/schoollifesessionstudent/mark-students-present', {
  return axios.get(SCHOOL_LIFE_URL, {
    params: {
      cmd: 'mark-students-present',
      schoollifeSessionId: slotId,
      studentsPresence: studentsPresence
    }
  }).then(response => response.data)
}
