import axios from 'axios'
import constants from '@/api/constants'
import PentilaUtils from 'pentila-utils'
import { getCookie } from '@utils/browser.util'

export {
  runMessageMigration,
  startSynchro,
  startParentSynchro,
  runArchiving,
  deleteGroup,
  deleteGroups
}

export default {
  runMessageMigration,
  startSynchro,
  startParentSynchro,
  runArchiving,
  deleteGroup,
  deleteGroups
}

const MAINTENANCE_PATH = '/entTools-portlet.maintenance'
const GROUPS_PATH = '/entTools-portlet.groupsMaintenance'

function runMessageMigration () {
  return axios.get(constants.JSON_WS_URL + MAINTENANCE_PATH + '/run-message-migration').then(response => response.data)
}

function startSynchro () {
  return axios.post(constants.JSON_WS_URL + MAINTENANCE_PATH + '/start-synchro').then(response => response.data)
}
function startParentSynchro () {
  return axios.post(constants.JSON_WS_URL + MAINTENANCE_PATH + '/start-parent-synchro').then(response => response.data)
}

function runArchiving () {
  return axios.get(constants.JSON_WS_URL + GROUPS_PATH + '/archive-groups').then(response => response.data)
}

function deleteGroup (groupId) {
  return axios.delete(constants.JSON_WS_URL + GROUPS_PATH + '/delete-groups',
    PentilaUtils.URL.params({
      groupId
    }).then(response => response.data))
}

function deleteGroups (file) {
  const formData = new FormData()
  formData.append('p_auth', getCookie('pauth'))
  formData.append('file', file)

  return axios.post(
    constants.JSON_WS_URL + GROUPS_PATH + '/delete-groups?',
    formData
  ).then(response => response.data)
}
