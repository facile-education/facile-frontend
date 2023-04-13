import axios from 'axios'
import constants from './constants'
import PentilaUtils from 'pentila-utils'

export {
  createApplication,
  exportApplicationUserList,
  getApplicationBroadcastScope,
  getSchoolApplications,
  getAllApplications,
  getUserApplications,
  removeApplication,
  updateApplication,
  updateBroadcastScope,
  updateBroadcast
}

export default {
  createApplication,
  exportApplicationUserList,
  getApplicationBroadcastScope,
  getSchoolApplications,
  getAllApplications,
  getUserApplications,
  removeApplication,
  updateApplication,
  updateBroadcastScope,
  updateBroadcast
}

const APP_MANAGER_PATH = '/application.'
const APPLICATION_CTX = 'application/'
const BROADCAST_CTX = 'broadcast/'
const BROADCASTRULE_CTX = 'broadcastrule/'

function createApplication (application) {
  return axios.post(constants.JSON_WS_URL + APP_MANAGER_PATH + APPLICATION_CTX + 'add-application',
    PentilaUtils.URL.params({
      applicationName: application.applicationName,
      applicationKey: application.applicationKey,
      category: application.category,
      menuEntryId: application.menuEntryId,
      image: application.image,
      hasCustomUrl: application.hasCustomUrl,
      globalUrl: application.globalUrl,
      exportUser: application.exportUser,
      exportStudent: application.exportStudent,
      exportParent: application.exportParent,
      exportTeacher: application.exportTeacher,
      exportOther: application.exportOther,
      defaultRoles: JSON.stringify(application.roleIds),
      authorizedSchools: JSON.stringify(application.schoolIds)
    })
  ).then(response => response.data)
}

function updateApplication (application) {
  return axios.post(constants.JSON_WS_URL + APP_MANAGER_PATH + APPLICATION_CTX + 'edit-application',
    PentilaUtils.URL.params({
      applicationId: application.applicationId,
      applicationName: application.applicationName,
      applicationKey: application.applicationKey,
      category: application.category,
      menuEntryId: application.menuEntryId,
      image: application.image,
      hasCustomUrl: application.hasCustomUrl,
      globalUrl: application.globalUrl,
      exportUser: application.exportUser,
      exportParent: application.exportParent,
      exportStudent: application.exportStudent,
      exportTeacher: application.exportTeacher,
      exportOther: application.exportOther,
      defaultRoles: JSON.stringify(application.roleIds),
      authorizedSchools: JSON.stringify(application.schoolIds)
    })
  ).then(response => response.data)
}

function removeApplication (applicationId) {
  return axios.get(constants.JSON_WS_URL + APP_MANAGER_PATH + APPLICATION_CTX + 'remove-application', {
    params: {
      applicationId
    }
  }).then(response => response.data)
}

function getSchoolApplications (schoolId) {
  return axios.get(constants.JSON_WS_URL + APP_MANAGER_PATH + APPLICATION_CTX + 'get-school-applications', {
    params: {
      schoolId
    }
  }).then(response => response.data)
}

function getAllApplications () {
  return axios.get(constants.JSON_WS_URL + APP_MANAGER_PATH + APPLICATION_CTX + 'get-all-applications', {
    params: {}
  }).then(response => response.data)
}

function getApplicationBroadcastScope (applicationId, schoolId) {
  return axios.get(constants.JSON_WS_URL + APP_MANAGER_PATH + BROADCASTRULE_CTX + 'get-application-rules', {
    params: {
      applicationId,
      schoolId
    }
  }).then(response => response.data)
}

function updateBroadcastScope (applicationId, schoolId, rules) {
  return axios.post(constants.JSON_WS_URL + APP_MANAGER_PATH + BROADCASTRULE_CTX + 'update-broadcast-rules',
    PentilaUtils.URL.params({
      applicationId,
      schoolId,
      rules: JSON.stringify(rules)
    })
  ).then(response => response.data)
}

function updateBroadcast (applicationId, schoolId, isBroadcasted, applicationUrl) {
  return axios.post(constants.JSON_WS_URL + APP_MANAGER_PATH + BROADCAST_CTX + 'update-broadcast',
    PentilaUtils.URL.params({
      applicationId,
      schoolId,
      isBroadcasted,
      applicationUrl
    })
  ).then(response => response.data)
}

function exportApplicationUserList (schoolId, applicationId, roleName) {
  return axios.get(constants.JSON_WS_URL + APP_MANAGER_PATH + APPLICATION_CTX + 'export', {
    params: {
      applicationId,
      schoolId,
      roleName
    }
  }).then(response => response.data)
}

function getUserApplications () {
  return axios.get(constants.JSON_WS_URL + APP_MANAGER_PATH + APPLICATION_CTX + 'get-user-applications', {
    params: {}
  }).then(response => response.data)
}
