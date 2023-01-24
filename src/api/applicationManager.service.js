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
  updateBroadcast,
  getAllServices
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

const SERVICEMANAGER_PATH = '/gestionApplications-portlet.'
const SERVICE_CTX = '/'
const SERVICEBROADCAST_CTX = 'broadcast/'
const SERVICEBROADCASTRULE_CTX = 'broadcastrule/'

function createApplication (application) {
  return axios.post(constants.JSON_WS_URL + SERVICEMANAGER_PATH + SERVICE_CTX + 'add-service',
    PentilaUtils.URL.params({
      serviceName: application.serviceName,
      serviceKey: application.serviceKey,
      category: application.category,
      portletId: application.portletId,
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
  return axios.post(constants.JSON_WS_URL + SERVICEMANAGER_PATH + SERVICE_CTX + 'edit-service',
    PentilaUtils.URL.params({
      serviceId: application.serviceId,
      serviceName: application.serviceName,
      serviceKey: application.serviceKey,
      category: application.category,
      portletId: application.portletId,
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

function removeApplication (serviceId) {
  return axios.get(constants.JSON_WS_URL + SERVICEMANAGER_PATH + SERVICE_CTX + 'remove-service', {
    params: {
      serviceId
    }
  }).then(response => response.data)
}

function getSchoolApplications (schoolId) {
  return axios.get(constants.JSON_WS_URL + SERVICEMANAGER_PATH + SERVICE_CTX + 'get-school-services', {
    params: {
      schoolId
    }
  }).then(response => response.data)
}

function getAllApplications () {
  return axios.get(constants.JSON_WS_URL + SERVICEMANAGER_PATH + SERVICE_CTX + 'get-all-services', {
    params: {}
  }).then(response => response.data)
}

function getApplicationBroadcastScope (applicationId, schoolId) {
  return axios.get(constants.JSON_WS_URL + SERVICEMANAGER_PATH + SERVICEBROADCASTRULE_CTX + 'get-service-rules', {
    params: {
      serviceId: applicationId,
      schoolId
    }
  }).then(response => response.data)
}

function updateBroadcastScope (serviceId, schoolId, rules) {
  return axios.post(constants.JSON_WS_URL + SERVICEMANAGER_PATH + SERVICEBROADCASTRULE_CTX + 'update-broadcast-rules',
    PentilaUtils.URL.params({
      serviceId,
      schoolId,
      rules: JSON.stringify(rules)
    })
  ).then(response => response.data)
}

function updateBroadcast (serviceId, schoolId, isBroadcasted, serviceUrl) {
  return axios.post(constants.JSON_WS_URL + SERVICEMANAGER_PATH + SERVICEBROADCAST_CTX + 'update-broadcast',
    PentilaUtils.URL.params({
      serviceId,
      schoolId,
      isBroadcasted,
      serviceUrl
    })
  ).then(response => response.data)
}

function exportApplicationUserList (schoolId, applicationId, roleName) {
  return axios.get(constants.JSON_WS_URL + SERVICEMANAGER_PATH + SERVICE_CTX + 'export', {
    params: {
      serviceId: applicationId,
      schoolId,
      roleName
    }
  }).then(response => response.data)
}

function getUserApplications () {
  return axios.get(constants.JSON_WS_URL + SERVICEMANAGER_PATH + SERVICE_CTX + 'get-user-services', {
    params: {}
  }).then(response => response.data)
}

function getAllServices () {
  return axios.get(constants.JSON_WS_URL + SERVICEMANAGER_PATH + SERVICE_CTX + 'get-all-services', {
    params: {}
  }).then(response => response.data)
}
