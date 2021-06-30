import axios from 'axios'
import constants from '@/api/constants'

export default {
  getSchoolStudents,
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
