import axios from 'axios'
import constants from '@/api/constants'

export {
  runMessageMigration,
  runArchiving
}

export default {
  runMessageMigration,
  runArchiving
}

const MAINTENANCE_PATH = '/entTools-portlet.maintenance'

function runMessageMigration () {
  return axios.get(constants.JSON_WS_URL + MAINTENANCE_PATH + '/run-message-migration').then(response => response.data)
}

function runArchiving () {
  return axios.get(constants.JSON_WS_URL + MAINTENANCE_PATH + '/archive').then(response => response.data)
}
