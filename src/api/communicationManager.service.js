import axios from 'axios'

import constants from './constants'

const url = constants.COMMUNICATION_MANAGER_URL

export default {
  getCommunicationRoleList,
  getInternalCommunicationRights,
  setInternalCommunicationRights,
  getExternalCommunicationRights,
  setExternalCommunicationRights
}

function getCommunicationRoleList () {
  return axios.get(url, {
    params: {
      cmd: 'getRolesToAdministrate'
    }
  }).then(response => response.data)
}

function getInternalCommunicationRights (schoolId) {
  return axios.get(url, {
    params: {
      cmd: 'getInternalCommunicationRights',
      etabId: schoolId
    }
  }).then(response => response.data)
}

function setInternalCommunicationRights (schoolId, rightList) {
  return axios.get(url, {
    params: {
      cmd: 'setInternalCommunicationRights',
      etabId: schoolId,
      ...rightList
    }
  }).then(response => response.data)
}

function getExternalCommunicationRights (schoolId) {
  return axios.get(url, {
    params: {
      cmd: 'getExternalCommunication',
      etabId: schoolId
    }
  }).then(response => response.data)
}

function setExternalCommunicationRights (schoolId, rightList) {
  return axios.get(url, {
    params: {
      cmd: 'setExternalCommunication',
      etabId: schoolId,
      ...rightList
    }
  }).then(response => response.data)
}
