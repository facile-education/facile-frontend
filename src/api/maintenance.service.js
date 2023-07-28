import axios from 'axios'

import constants from '@/api/constants'

export {
  startSynchro,
  startParentSynchro,
  startFsAnalysis,
  startFsAnalysisV2,
  runArchiving,
  deleteGroup,
  deleteGroups,
  runAnonymisation,
  runPermissions
}

export default {
  startSynchro,
  startParentSynchro,
  startFsAnalysis,
  startFsAnalysisV2,
  runArchiving,
  deleteGroup,
  deleteGroups,
  runAnonymisation,
  runPermissions
}

const MAINTENANCE_PATH = '/maintenance.maintenance'
const GROUPS_PATH = '/maintenance.groupsmaintenance'

function startSynchro () {
  return axios.post(constants.JSON_WS_URL + MAINTENANCE_PATH + '/start-synchro').then(response => response.data)
}

function startParentSynchro () {
  return axios.post(constants.JSON_WS_URL + MAINTENANCE_PATH + '/start-parent-synchro').then(response => response.data)
}

function startFsAnalysis () {
  return axios.post(constants.JSON_WS_URL + MAINTENANCE_PATH + '/start-fs-analysis').then(response => response.data)
}

function startFsAnalysisV2 () {
  return axios.post(constants.JSON_WS_URL + MAINTENANCE_PATH + '/start-fs-analysis-v2').then(response => response.data)
}

function runAnonymisation () {
  return axios.post(constants.JSON_WS_URL + MAINTENANCE_PATH + '/run-anonymisation').then(response => response.data)
}

function runArchiving () {
  return axios.post(constants.JSON_WS_URL + GROUPS_PATH + '/archive-groups').then(response => response.data)
}

function deleteGroup (groupId) {
  const formData = new FormData()
  formData.append('groupId', groupId)
  return axios.post(
    constants.JSON_WS_URL + GROUPS_PATH + '/delete-group',
    formData
  ).then(response => response.data)
}

function deleteGroups (file) {
  const formData = new FormData()
  formData.append('file', file, file.name)

  return axios.post(
    constants.JSON_WS_URL + GROUPS_PATH + '/delete-groups',
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  ).then(response => response.data)
}

function runPermissions () {
  return axios.post(constants.JSON_WS_URL + MAINTENANCE_PATH + '/add-permissions').then(response => response.data)
}
