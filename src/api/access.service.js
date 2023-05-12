import axios from 'axios'
import constants from '@/api/constants'
import PentilaUtils from 'pentila-utils'

export {
  getSchoolAccesses,
  saveSchoolAccesses,
  getUserAccesses,
  getRoleAccesses
}

const ACCESS_PATH = '/access.'
const ACCESS_CTX = 'access/'

function getSchoolAccesses (schoolId) {
  return axios.get(constants.JSON_WS_URL + ACCESS_PATH + ACCESS_CTX + 'get-school-accesses', {
    params: {
      schoolId: schoolId
    }
  }).then(response => response.data)
}

function saveSchoolAccesses (schoolId, accesses) {
  return axios.post(constants.JSON_WS_URL + ACCESS_PATH + ACCESS_CTX + 'save-school-accesses', PentilaUtils.URL.params({
    schoolId: schoolId,
    accesses: JSON.stringify(accesses)
  })).then(response => response.data)
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
