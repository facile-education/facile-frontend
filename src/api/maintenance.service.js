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
  cleanupObsoleteFolders,
  runDataFeed,
  setNewsPermissions,
  runAbsenceNotifications,
  deleteFolders,
  setCoursePermissions
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
  cleanupObsoleteFolders,
  runDataFeed,
  setNewsPermissions,
  runAbsenceNotifications,
  deleteFolders,
  setCoursePermissions
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

function cleanupObsoleteFolders () {
  return axios.post(constants.JSON_WS_URL + MAINTENANCE_PATH + '/cleanup-obsolete-folders').then(response => response.data)
}

function runDataFeed () {
  return axios.post(constants.JSON_WS_URL + MAINTENANCE_PATH + '/run-data-feed').then(response => response.data)
}

function setNewsPermissions () {
  return axios.post(constants.JSON_WS_URL + MAINTENANCE_PATH + '/set-news-permissions').then(response => response.data)
}

function runAbsenceNotifications () {
  return axios.post(constants.JSON_WS_URL + MAINTENANCE_PATH + '/run-absence-otifications').then(response => response.data)
}

function deleteFolders (file) {
  const formData = new FormData()
  formData.append('file', file, file.name)

  return axios.post(
    constants.JSON_WS_URL + MAINTENANCE_PATH + '/delete-folders',
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  ).then(response => response.data)
}

function setCoursePermissions () {
  return axios.post(constants.JSON_WS_URL + MAINTENANCE_PATH + '/set-course-permissions').then(response => response.data)
}
