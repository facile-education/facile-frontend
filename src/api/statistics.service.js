import axios from 'axios'
import constants from './constants'

export {
  getSessionsCount,
  getActiveUsersCount,
  getFilesCount,
  getHomeworksCount,
  getNewsCount,
  getMessagesCount
}

const STAT_PATH = '/statistics-portlet.generalstat'

function getActiveUsersCount (schoolId, startDate, endDate) {
  return axios.get(constants.JSON_WS_URL + STAT_PATH + '/get-active-users-count', {
    params: {
      schoolId: schoolId,
      startDate: startDate.format('YYYY-MM-DD HH:mm'),
      endDate: endDate.format('YYYY-MM-DD HH:mm')
    }
  }).then(response => response.data)
}

function getSessionsCount (schoolId, startDate, endDate, comparator) {
  return axios.get(constants.JSON_WS_URL + STAT_PATH + '/get-sessions-count', {
    params: {
      schoolId: schoolId,
      startDate: startDate.format('YYYY-MM-DD HH:mm'),
      endDate: endDate.format('YYYY-MM-DD HH:mm'),
      comparator: comparator
    }
  }).then(response => response.data)
}

function getFilesCount (schoolId, startDate, endDate) {
  return axios.get(constants.JSON_WS_URL + STAT_PATH + '/get-files-count', {
    params: {
      schoolId: schoolId,
      startDate: startDate.format('YYYY-MM-DD HH:mm'),
      endDate: endDate.format('YYYY-MM-DD HH:mm')
    }
  }).then(response => response.data)
}

function getHomeworksCount (schoolId, startDate, endDate) {
  return axios.get(constants.JSON_WS_URL + STAT_PATH + '/get-homeworks-count', {
    params: {
      schoolId: schoolId,
      startDate: startDate.format('YYYY-MM-DD HH:mm'),
      endDate: endDate.format('YYYY-MM-DD HH:mm')
    }
  }).then(response => response.data)
}

function getNewsCount (schoolId, startDate, endDate) {
  return axios.get(constants.JSON_WS_URL + STAT_PATH + '/get-news-count', {
    params: {
      schoolId: schoolId,
      startDate: startDate.format('YYYY-MM-DD HH:mm'),
      endDate: endDate.format('YYYY-MM-DD HH:mm')
    }
  }).then(response => response.data)
}

function getMessagesCount (schoolId, startDate, endDate) {
  return axios.get(constants.JSON_WS_URL + STAT_PATH + '/get-messages-count', {
    params: {
      schoolId: schoolId,
      startDate: startDate.format('YYYY-MM-DD HH:mm'),
      endDate: endDate.format('YYYY-MM-DD HH:mm')
    }
  }).then(response => response.data)
}
