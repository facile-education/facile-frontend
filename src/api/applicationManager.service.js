import axios from 'axios'
import constants from './constants'
import PentilaUtils from 'pentila-utils'

export default {
  createApplication,
  exportApplicationUserList,
  getApplicationBroadcastScope,
  getApplicationDefaultRoleList,
  getSchoolApplications,
  getSchoolClasses,
  removeApplication,
  updateApplication,
  updateBroadcastScope,
  updateBroadcastStatus,
  updateURL
}

const url = constants.APPLICATION_MANAGER_URL

function createApplication (application) {
  return axios.post(url, PentilaUtils.URL.params({
    cmd: 'addService',
    newService: JSON.stringify({
      serviceName: application.serviceName,
      serviceKey: application.serviceKey,
      portletId: application.portletId,
      serviceCategory: application.serviceCategory,
      image: application.image,
      hasCustomUrl: application.hasCustomUrl,
      hasGlobalUrl: application.hasGlobalUrl,
      globalUrl: application.globalUrl,
      exportUser: application.exportUser,
      exportParent: application.exportParent,
      exportStudent: application.exportStudent,
      exportTeacher: application.exportTeacher,
      roles: application.rolesId,
      etabFilters: application.etabFilters
    })
  })).then(response => response.data)
}

function exportApplicationUserList (schoolId, applicationId, role) {
  return axios.get(url, {
    params: {
      cmd: 'exportFichier',
      etabId: schoolId,
      userRole: role,
      serviceId: applicationId
    }
  }).then(response => response.data)
}

function getApplicationBroadcastScope (schoolId, applicationId) {
  return axios.get(url, {
    params: {
      cmd: 'getDiffusionPerimeter',
      etabId: schoolId,
      serviceId: applicationId
    }
  }).then(response => response.data)
}

function getApplicationDefaultRoleList (applicationId) {
  return axios.get(url, {
    params: {
      cmd: 'getDefaultRoles',
      serviceId: applicationId
    }
  }).then(response => response.data)
}

function getSchoolApplications (schoolId) {
  return axios.get(url, {
    params: {
      cmd: 'getSchoolServices',
      schoolId: schoolId
    }
  }).then(response => response.data)
}

function getSchoolClasses (schoolId) {
  return axios.get(url, {
    params: {
      cmd: 'getListClasses',
      etabId: schoolId
    }
  }).then(response => response.data)
}

function removeApplication (serviceId) {
  return axios.get(url, {
    params: {
      cmd: 'deleteService',
      serviceId: serviceId
    }
  }).then(response => response.data)
}

function updateApplication (application) {
  return axios.post(url, PentilaUtils.URL.params({
    cmd: 'modifyService',
    request: JSON.stringify({
      serviceId: application.serviceId,
      serviceName: application.serviceName,
      serviceKey: application.serviceKey,
      portletId: application.portletId,
      serviceCategory: application.serviceCategory,
      image: application.image,
      hasCustomUrl: application.hasCustomUrl,
      hasGlobalUrl: application.hasGlobalUrl,
      globalUrl: application.globalUrl,
      exportUser: application.exportUser,
      exportParent: application.exportParent,
      exportStudent: application.exportStudent,
      exportTeacher: application.exportTeacher,
      roles: application.rolesId,
      etabFilters: application.etabFilters
    })
  })).then(response => response.data)
}

function updateBroadcastScope (schoolId, serviceId, ruleIdList) {
  return axios.post(url, PentilaUtils.URL.params({
    cmd: 'modifyDiffusionPerimeter',
    diffusionPerimeter: JSON.stringify({
      etabId: schoolId,
      serviceId: serviceId,
      rules: ruleIdList
    })
  })).then(response => response.data)
}

function updateBroadcastStatus (schoolId, serviceId, isAvailable) {
  return axios.post(url, PentilaUtils.URL.params({
    cmd: 'updateDiffusion',
    diffusion: isAvailable,
    etabId: schoolId,
    serviceId: serviceId
  })).then(response => response.data)
}

function updateURL (schoolId, serviceId, applicationURL) {
  return axios.post(url, PentilaUtils.URL.params({
    cmd: 'updateUrl',
    url: applicationURL,
    etabId: schoolId,
    serviceId: serviceId
  })).then(response => response.data)
}
