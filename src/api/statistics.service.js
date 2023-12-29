import axios from 'axios'

import constants from './constants'

export {
  getDashboardStatistics,
  getSessionsCount,
  getActiveUsersCount,
  getFilesCount,
  getHomeworksCount,
  getNewsCount,
  getMessagesCount,
  getActionsCount,
  getSchoolLifeStudentsCount
}

const STAT_PATH = '/statistic.generalstat'

function getDashboardStatistics () {
  return axios.get(constants.JSON_WS_URL + STAT_PATH + '/get-dashboard-statistics-count')
    .then(response => response.data)
}

function getActiveUsersCount (schoolId, startDate, endDate) {
  return axios.get(constants.JSON_WS_URL + STAT_PATH + '/get-active-users-count', {
    params: {
      schoolId,
      startDate: startDate.format('YYYY-MM-DD HH:mm'),
      endDate: endDate.format('YYYY-MM-DD HH:mm')
    }
  }).then(response => response.data)
}

function getSessionsCount (schoolId, startDate, endDate, comparator) {
  return axios.get(constants.JSON_WS_URL + STAT_PATH + '/get-sessions-count', {
    params: {
      schoolId,
      startDate: startDate.format('YYYY-MM-DD HH:mm'),
      endDate: endDate.format('YYYY-MM-DD HH:mm'),
      comparator
    }
  }).then(response => response.data)
}

function getActionsCount (schoolId, serviceId, startDate, endDate, comparator) {
  return axios.get(constants.JSON_WS_URL + STAT_PATH + '/get-actions-count', {
    params: {
      startDate: startDate.format('YYYY-MM-DD HH:mm'),
      endDate: endDate.format('YYYY-MM-DD HH:mm'),
      schoolId,
      serviceId,
      comparator
    }
  }).then(response => response.data)
}

function getFilesCount (schoolId, startDate, endDate) {
  return axios.get(constants.JSON_WS_URL + STAT_PATH + '/get-files-count', {
    params: {
      schoolId,
      startDate: startDate.format('YYYY-MM-DD HH:mm'),
      endDate: endDate.format('YYYY-MM-DD HH:mm')
    }
  }).then(response => response.data)
}

function getHomeworksCount (schoolId, startDate, endDate) {
  return axios.get(constants.JSON_WS_URL + STAT_PATH + '/get-homeworks-count', {
    params: {
      schoolId,
      startDate: startDate.format('YYYY-MM-DD HH:mm'),
      endDate: endDate.format('YYYY-MM-DD HH:mm')
    }
  }).then(response => response.data)
}

function getNewsCount (schoolId, startDate, endDate) {
  return axios.get(constants.JSON_WS_URL + STAT_PATH + '/get-news-count', {
    params: {
      schoolId,
      startDate: startDate.format('YYYY-MM-DD HH:mm'),
      endDate: endDate.format('YYYY-MM-DD HH:mm')
    }
  }).then(response => response.data)
}

function getMessagesCount (schoolId, startDate, endDate) {
  return axios.get(constants.JSON_WS_URL + STAT_PATH + '/get-messages-count', {
    params: {
      schoolId,
      startDate: startDate.format('YYYY-MM-DD HH:mm'),
      endDate: endDate.format('YYYY-MM-DD HH:mm')
    }
  }).then(response => response.data)
}

function getSchoolLifeStudentsCount (schoolId, startDate, endDate) {
  return axios.get(constants.JSON_WS_URL + STAT_PATH + '/get-school-life-students-count', {
    params: {
      schoolId,
      startDate: startDate.format('YYYY-MM-DD HH:mm'),
      endDate: endDate.format('YYYY-MM-DD HH:mm')
    }
  }).then(response => response.data)
}
