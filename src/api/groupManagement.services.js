import axios from 'axios'
import constants from '@/api/constants'

export {
  getGroups
}

const DASHBOARD_PATH = '/community-portlet.'
const DASHBOARD_CTX = 'dashboard/'

function initDashboard () {
  return axios.get(constants.JSON_WS_URL + DASHBOARD_PATH + DASHBOARD_CTX + 'init-dashboard', {
    params: {
    }
  }).then(response => response.data)
}
