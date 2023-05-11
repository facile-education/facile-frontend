import axios from 'axios'
import constants from '@/api/constants'

export {
  initDashboard,
  getUserSchedule,
  getDashboardActivity
}

const DASHBOARD_PATH = '/dashboard-portlet.'
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
      userId: userId,
      date: targetDate.format('YYYY-MM-DD HH:mm'),
      goForward: goForward
    }
  }).then(response => response.data)
}

function getDashboardActivity (maxDate, nbResults, withNews, withDocs, withSchoollife, withSessions) {
  return axios.get(constants.JSON_WS_URL + DASHBOARD_PATH + DASHBOARD_CTX + 'get-dashboard-activity', {
    params: {
      maxDate,
      nbResults,
      withNews,
      withDocs,
      withSchoollife,
      withSessions
    }
  }).then(response => response.data)
}
