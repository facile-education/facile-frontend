import axios from 'axios'
import constants from '@/api/constants'
import PentilaUtils from 'pentila-utils'

export {
  getSchoolUsers,
  getSubjects,
  getManualUsers,
  getSchools,
  getRoles,
  createManualUser,
  editManualUser,
  getSchoolOrgs,
  addUserToOrg,
  removeUserFromOrg,
  getManuallyAddedOrgs,
  addSchoolAdmin,
  removeSchoolAdmin,
  getSchoolAdmins
}

export default {
  getSchoolUsers,
  getSubjects
}

const SUBJECT_PATH = '/gestionUtilisateurs-portlet.subject'
const USER_SEARCH_PATH = '/gestionUtilisateurs-portlet.usersearch'
const USER_MANAGEMENT_PATH = '/gestionUtilisateurs-portlet.usermanagement'
const MANUAL_AFFECTATION_PATH = '/gestionUtilisateurs-portlet.manualaffectation'
const SCHOOL_ADMIN_PATH = '/gestionUtilisateurs-portlet.schooladmin'

/**
 * Get the specified school's students filtered by name
 */
function getSubjects () {
  return axios.get(constants.JSON_WS_URL + SUBJECT_PATH + '/get-subjects').then(response => response.data)
}

/**
 * Get the specified school's users filtered by name
 */
function getSchoolUsers (schoolId, query) {
  return axios.get(constants.JSON_WS_URL + USER_SEARCH_PATH + '/get-school-student-teacher-list', {
    params: {
      schoolId: schoolId,
      search: query
    }
  }).then(response => response.data)
}

function getManualUsers (schoolId, query) {
  return axios.get(constants.JSON_WS_URL + USER_MANAGEMENT_PATH + '/get-manual-users', {
    params: {
      schoolId: schoolId,
      search: query
    }
  }).then(response => response.data)
}

function getSchools () {
  return axios.get(constants.JSON_WS_URL + USER_MANAGEMENT_PATH + '/get-schools', {
    params: {
    }
  }).then(response => response.data)
}

function getRoles () {
  return axios.get(constants.JSON_WS_URL + USER_MANAGEMENT_PATH + '/get-roles', {
    params: {
    }
  }).then(response => response.data)
}

function createManualUser (lastName, firstName, email, roleId, schoolId) {
  return axios.post(constants.JSON_WS_URL + USER_MANAGEMENT_PATH + '/create-manual-user',
    PentilaUtils.URL.params({
      lastName,
      firstName,
      email,
      roleId,
      schoolId
    })).then(response => response.data)
}

function editManualUser (userId, lastName, firstName, email, roleId, schoolId) {
  return axios.post(constants.JSON_WS_URL + USER_MANAGEMENT_PATH + '/edit-manual-user',
    PentilaUtils.URL.params({
      userId,
      lastName,
      firstName,
      email,
      roleId,
      schoolId
    })).then(response => response.data)
}

function getSchoolOrgs (schoolId) {
  return axios.get(constants.JSON_WS_URL + MANUAL_AFFECTATION_PATH + '/get-school-orgs', {
    params: {
      schoolId: schoolId
    }
  }).then(response => response.data)
}

function addUserToOrg (userId, orgId) {
  return axios.get(constants.JSON_WS_URL + MANUAL_AFFECTATION_PATH + '/add-user-to-org', {
    params: {
      userId: userId,
      orgId: orgId
    }
  }).then(response => response.data)
}

function removeUserFromOrg (userId, orgId) {
  return axios.get(constants.JSON_WS_URL + MANUAL_AFFECTATION_PATH + '/remove-user-from-org', {
    params: {
      userId: userId,
      orgId: orgId
    }
  }).then(response => response.data)
}

function getManuallyAddedOrgs (userId) {
  return axios.get(constants.JSON_WS_URL + MANUAL_AFFECTATION_PATH + '/get-manually-added-orgs', {
    params: {
      userId: userId
    }
  }).then(response => response.data)
}

function addSchoolAdmin (schoolId, userId) {
  return axios.get(constants.JSON_WS_URL + SCHOOL_ADMIN_PATH + '/add-school-admin', {
    params: {
      schoolId: schoolId,
      userId: userId,
      applyToSchoolComplex: true
    }
  }).then(response => response.data)
}

function removeSchoolAdmin (schoolId, userId) {
  return axios.get(constants.JSON_WS_URL + SCHOOL_ADMIN_PATH + '/remove-school-admin', {
    params: {
      schoolId: schoolId,
      userId: userId,
      applyToSchoolComplex: true
    }
  }).then(response => response.data)
}

function getSchoolAdmins (schoolId, userId) {
  return axios.get(constants.JSON_WS_URL + SCHOOL_ADMIN_PATH + '/get-school-admins', {
    params: {
      schoolId: schoolId
    }
  }).then(response => response.data)
}
