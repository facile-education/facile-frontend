import axios from 'axios'

import constants from './constants'

export default {
  getContactTree,
  getOrgMembers,
  searchDirectory,
  getContactDetails,
  getMyStudents,
  getMyRelatives
}

export {
  getContactTree,
  getOrgMembers,
  searchDirectory,
  getContactDetails,
  getMyStudents,
  getMyRelatives
}

const CONTACT_PATH = '/contact.'
const CONTACT_CTX = 'contact/'

function getContactTree () {
  return axios.get(constants.JSON_WS_URL + CONTACT_PATH + CONTACT_CTX + 'get-contact-tree', {
    params: {
    }
  }).then(response => response.data)
}

function getOrgMembers (orgId, roleId) {
  return axios.get(constants.JSON_WS_URL + CONTACT_PATH + CONTACT_CTX + 'get-org-members', {
    params: {
      orgId,
      roleId
    }
  }).then(response => response.data)
}

function searchDirectory (query, roleId, schoolId) {
  return axios.get(constants.JSON_WS_URL + CONTACT_PATH + CONTACT_CTX + 'search-directory', {
    params: {
      query,
      roleId,
      schoolId
    }
  }).then(response => response.data)
}

function getContactDetails (contactUserId) {
  return axios.get(constants.JSON_WS_URL + CONTACT_PATH + CONTACT_CTX + 'get-contact-details', {
    params: {
      contactUserId
    }
  }).then(response => response.data)
}

function getMyStudents () {
  return axios.get(constants.JSON_WS_URL + CONTACT_PATH + CONTACT_CTX + 'get-my-students', {
    params: {
    }
  }).then(response => response.data)
}

function getMyRelatives () {
  return axios.get(constants.JSON_WS_URL + CONTACT_PATH + CONTACT_CTX + 'get-my-relatives', {
    params: {
    }
  }).then(response => response.data)
}
