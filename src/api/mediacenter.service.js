import axios from 'axios'
import constants from '@/api/constants'
import PentilaUtils from 'pentila-utils'

export {
  addGARAdminList,
  deleteGARAdminList,
  getGARManagerUIUrl,
  getResourceList,
  getSchoolAdminList,
  getUserSchoolList
}

const MEDIACENTER_PATH = '/mediacentre-portlet.garmediacenter'

/**
 * Get user resource list for school
 */
function getResourceList (schoolId) {
  return axios.get(constants.JSON_WS_URL + MEDIACENTER_PATH + '/get-resource-list', {
    params: { schoolId }
  }).then(response => response.data)
}

/**
 * Get school GAR admin list
 */
function getSchoolAdminList (schoolId) {
  return axios.get(constants.JSON_WS_URL + MEDIACENTER_PATH + '/get-gar-admins', {
    params: { schoolId }
  }).then(response => response.data)
}

/**
 * Get user school list with GAR available
 */
function getUserSchoolList () {
  return axios.get(constants.JSON_WS_URL + MEDIACENTER_PATH + '/get-user-schools', {
    params: {}
  }).then(response => response.data)
}

/**
 * Get GAR management UI url
 */
function getGARManagerUIUrl () {
  return axios.get(constants.JSON_WS_URL + MEDIACENTER_PATH + '/get-gar-management-ihm-url', {
    params: {}
  }).then(response => response.data)
}

/**
 * Add GAR admins in school
 */
function addGARAdminList (schoolId, applyToSchoolComplex, adminId) {
  return axios.post(constants.JSON_WS_URL + MEDIACENTER_PATH + '/save-gar-admin', PentilaUtils.URL.params({
    schoolId,
    applyToSchoolComplex,
    adminId
  })).then(response => response.data)
}

/**
 * Remove GAR admins in school
 */
function deleteGARAdminList (schoolId, applyToSchoolComplex, adminId) {
  return axios.post(constants.JSON_WS_URL + MEDIACENTER_PATH + '/remove-gar-admin', PentilaUtils.URL.params({
    schoolId,
    applyToSchoolComplex,
    adminId
  })).then(response => response.data)
}
