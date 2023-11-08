import axios from 'axios'

import constants from './constants'

export {
  getBroadcastRoleList,
  getLocalUserRoleList,
  getRoleList
}

const USER_MANAGEMENT_PATH = '/role.'
const ROLE_UTILS_CTX = 'roleutils/'

function getBroadcastRoleList () {
  return axios.get(constants.JSON_WS_URL + USER_MANAGEMENT_PATH + ROLE_UTILS_CTX + 'get-broadcast-roles', {
    params: {}
  }).then(response => response.data)
}

function getLocalUserRoleList () {
  return axios.get(constants.JSON_WS_URL + USER_MANAGEMENT_PATH + ROLE_UTILS_CTX + 'get-local-user-roles', {
    params: {}
  }).then(response => response.data)
}

function getRoleList () {
  return axios.get(constants.JSON_WS_URL + USER_MANAGEMENT_PATH + ROLE_UTILS_CTX + 'get-main-roles', {
    params: {}
  }).then(response => response.data)
}
