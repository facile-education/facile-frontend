import axios from 'axios'
import constants from '@/api/constants'

export {
  initDashboard,
  getGroupActivities
}

const DASHBOARD_PATH = '/dashboard-portlet.'
const DASHBOARD_CTX = 'dashboard/'

function initDashboard () {
  return axios.get(constants.JSON_WS_URL + DASHBOARD_PATH + DASHBOARD_CTX + 'init-dashboard', {
    params: {
    }
  }).then(response => response.data)
}

function getGroupActivities (startIndex, endIndex) {
  return axios.get(constants.JSON_WS_URL + DASHBOARD_PATH + DASHBOARD_CTX + 'get-group-activities', {
    params: {
      startIndex: startIndex,
      endIndex: endIndex
    }
  }).then(response => response.data)
}
