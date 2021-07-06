import axios from 'axios'
import constants from '@/api/constants'

export default {
  getSchoolStudents,
  getSchoolTeachers,
  createSlot,
  updateSlot,
  deleteSlot,
  getStudentSessions,
  getWeekSession
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
      schoollifeSlotId: slotId,
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
