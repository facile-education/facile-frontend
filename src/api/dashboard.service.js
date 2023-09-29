import axios from 'axios'

import constants from '@/api/constants'

export {
  initDashboard,
  getUserSchedule,
  getDashboardActivity,
  checkDashboardParameter
}

const DASHBOARD_PATH = '/dashboard.'
const DASHBOARD_CTX = 'dashboard/'

function initDashboard () {
  return axios.get(constants.JSON_WS_URL + DASHBOARD_PATH + DASHBOARD_CTX + 'init-dashboard', {
    params: {
    }
  }).then(response => response.data)
}

function getUserSchedule (userId, targetDate, goForward) {
  return axios.get(constants.JSON_WS_URL + DASHBOARD_PATH + DASHBOARD_CTX + 'get-user-schedule', {
    params: {
      userId,
      date: targetDate.format('YYYY-MM-DD HH:mm'),
      goForward
    }
  }).then(response => response.data)
}

function getDashboardActivity (groupId, maxDate, nbResults, withNews, withDocs, withMemberships, withSchoollife, withSessions) {
  return axios.get(constants.JSON_WS_URL + DASHBOARD_PATH + DASHBOARD_CTX + 'get-dashboard-activity', {
    params: {
      groupId,
      maxDate,
      nbResults,
      withNews,
      withDocs,
      withMemberships,
      withSchoollife,
      withSessions
    }
  }).then(response => response.data)
}

function checkDashboardParameter (dashboardId) {
  return axios.get(constants.JSON_WS_URL + DASHBOARD_PATH + DASHBOARD_CTX + 'check-dashboard-parameter', {
    params: {
      dashboardId
    }
  }).then(response => response.data)
}
