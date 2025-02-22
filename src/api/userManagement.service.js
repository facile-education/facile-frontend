import WeprodeUtils from '@utils/weprode.utils'
import axios from 'axios'

import constants from '@/api/constants'

export {
  getSubjects,
  getManualUsers,
  createManualUser,
  editManualUser,
  removeManualUser,
  getAffectedUsers,
  addUserAffectation,
  removeUserAffectation,
  getUserAffectations,
  addSchoolAdmin,
  removeSchoolAdmin,
  getSchoolDelegates,
  getDelegationCandidates,
  updateForgottenPassword,
  updatePasswordAfterReinitByManager,
  updatePasswordByManager
}

export default {
  getSubjects,
  updateForgottenPassword,
  updatePasswordAfterReinitByManager,
  updatePasswordByManager
}

const SUBJECT_PATH = '/schedule.subject'
const USER_MANAGEMENT_PATH = '/user.usermanagement'
const AFFECTATION_PATH = '/user.affectation'
const SCHOOL_ADMIN_PATH = '/user.schooladmin'

function getSubjects () {
  return axios.get(constants.JSON_WS_URL + SUBJECT_PATH + '/get-subjects').then(response => response.data)
}

function getManualUsers (schoolId, search, pageNb, nbItemsPerPage, sort = 'lastName', asc = true) {
  const start = pageNb * nbItemsPerPage
  const limit = start + nbItemsPerPage

  return axios.get(constants.JSON_WS_URL + USER_MANAGEMENT_PATH + '/get-manual-users', {
    params: {
      schoolId,
      search,
      start,
      limit,
      sort,
      asc
    }
  }).then(response => response.data)
}

function createManualUser (lastName, firstName, email, roleId, schoolId) {
  return axios.post(constants.JSON_WS_URL + USER_MANAGEMENT_PATH + '/create-manual-user',
    WeprodeUtils.params({
      lastName,
      firstName,
      email,
      roleId,
      schoolId
    })).then(response => response.data)
}

function editManualUser (userId, lastName, firstName, email, roleId, schoolId) {
  return axios.post(constants.JSON_WS_URL + USER_MANAGEMENT_PATH + '/edit-manual-user',
    WeprodeUtils.params({
      userId,
      lastName,
      firstName,
      email,
      roleId,
      schoolId
    })).then(response => response.data)
}

function removeManualUser (userId) {
  return axios.delete(constants.JSON_WS_URL + USER_MANAGEMENT_PATH + '/delete-manual-user', {
    params: {
      userId
    }
  }).then(response => response.data)
}

function getAffectedUsers (schoolId, filter) {
  return axios.get(constants.JSON_WS_URL + AFFECTATION_PATH + '/get-affected-users', {
    params: {
      schoolId,
      filter
    }
  }).then(response => response.data)
}

function addUserAffectation (userId, orgId, expirationDate = '') {
  return axios.get(constants.JSON_WS_URL + AFFECTATION_PATH + '/add-user-affectation', {
    params: {
      userId,
      orgId,
      expirationDate
    }
  }).then(response => response.data)
}

function removeUserAffectation (userId, orgId) {
  return axios.delete(constants.JSON_WS_URL + AFFECTATION_PATH + '/remove-user-affectation', {
    params: {
      userId,
      orgId
    }
  }).then(response => response.data)
}

function getUserAffectations (userId) {
  return axios.get(constants.JSON_WS_URL + AFFECTATION_PATH + '/get-user-affectations', {
    params: {
      userId
    }
  }).then(response => response.data)
}

function addSchoolAdmin (userId, schoolId) {
  return axios.get(constants.JSON_WS_URL + SCHOOL_ADMIN_PATH + '/add-school-admin', {
    params: {
      userId,
      schoolId
    }
  }).then(response => response.data)
}

function removeSchoolAdmin (userId, schoolId) {
  return axios.delete(constants.JSON_WS_URL + SCHOOL_ADMIN_PATH + '/remove-school-admin', {
    params: {
      userId,
      schoolId
    }
  }).then(response => response.data)
}

function getSchoolDelegates (schoolId) {
  return axios.get(constants.JSON_WS_URL + SCHOOL_ADMIN_PATH + '/get-school-delegates', {
    params: {
      schoolId
    }
  }).then(response => response.data)
}

function getDelegationCandidates (schoolId, filter) {
  return axios.get(constants.JSON_WS_URL + SCHOOL_ADMIN_PATH + '/get-delegation-candidates', {
    params: {
      schoolId,
      filter
    }
  }).then(response => response.data)
}

function updatePasswordByManager (userId, password) {
  return axios.post(constants.JSON_WS_URL + USER_MANAGEMENT_PATH + '/update-password-by-manager',
    WeprodeUtils.params({
      userId,
      password
    })).then(response => response.data)
}

function updatePasswordAfterReinitByManager (password, confirmPassword) {
  return axios.post(constants.JSON_WS_URL + USER_MANAGEMENT_PATH + '/update-password-after-reinit-by-manager',
    WeprodeUtils.params({
      password,
      confirmPassword
    })).then(response => response.data)
}

function updateForgottenPassword (password, confirmPassword, ticketKey) {
  return axios.post(constants.JSON_WS_URL + USER_MANAGEMENT_PATH + '/update-forgotten-password',
    WeprodeUtils.params({
      password,
      confirmPassword,
      ticketKey
    })).then(response => response.data)
}
