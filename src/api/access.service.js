import axios from 'axios'
import PentilaUtils from 'pentila-utils'

import constants from '@/api/constants'

export {
  getSchoolAccesses,
  saveSchoolCategory,
  saveSchoolAccess,
  removeSchoolCategory,
  removeSchoolAccess,
  getUserAccesses,
  getRoleAccesses
}

const ACCESS_PATH = '/access.'
const ACCESS_CTX = 'access/'

function getSchoolAccesses (schoolId) {
  return axios.get(constants.JSON_WS_URL + ACCESS_PATH + ACCESS_CTX + 'get-school-accesses', {
    params: {
      schoolId
    }
  }).then(response => response.data)
}

function saveSchoolCategory (schoolId, category) {
  return axios.post(constants.JSON_WS_URL + ACCESS_PATH + ACCESS_CTX + 'save-school-category', PentilaUtils.URL.params({
    schoolId,
    category: JSON.stringify(category)
  })).then(response => response.data)
}

function saveSchoolAccess (schoolId, access) {
  return axios.post(constants.JSON_WS_URL + ACCESS_PATH + ACCESS_CTX + 'save-school-access', PentilaUtils.URL.params({
    schoolId: schoolId,
    access: JSON.stringify(access)
  })).then(response => response.data)
}

function removeSchoolCategory (schoolId, categoryId) {
  return axios.delete(constants.JSON_WS_URL + ACCESS_PATH + ACCESS_CTX + 'remove-school-category', {
    params: {
      schoolId,
      categoryId
    }
  }).then(response => response.data)
}

function removeSchoolAccess (schoolId, accessId) {
  return axios.delete(constants.JSON_WS_URL + ACCESS_PATH + ACCESS_CTX + 'remove-school-access', {
    params: {
      schoolId,
      accessId
    }
  }).then(response => response.data)
}

function getUserAccesses () {
  return axios.get(constants.JSON_WS_URL + ACCESS_PATH + ACCESS_CTX + 'get-user-accesses', {
    params: {
    }
  }).then(response => response.data)
}

function getRoleAccesses (roleId) {
  return axios.get(constants.JSON_WS_URL + ACCESS_PATH + ACCESS_CTX + 'get-role-accesses', {
    params: {
      roleId
    }
  }).then(response => response.data)
}
