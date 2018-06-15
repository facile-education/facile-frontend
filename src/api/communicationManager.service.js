import axios from 'axios'
import constants from './constants'

export default {
  getCommunicationRoleList,
  getInternalCommunicationRights,
  setInternalCommunicationRights,
  getExternalCommunicationRights,
  setExternalCommunicationRights
}

function getCommunicationRoleList () {
  const url = constants.BASE_URL + '/api/get_communication_role_list'
  return axios.get(url, {
    params: {
      cmd: 'getRolesToAdministrate'
    }
  }).then(response => response.data)
}

function getInternalCommunicationRights (schoolId) {
  const url = constants.BASE_URL + '/api/get_internal_communication_rights'
  return axios.get(url, {
    params: {
      cmd: 'getInternalCommunicationRights',
      etabId: schoolId
    }
  }).then(response => response.data)
}

function setInternalCommunicationRights (schoolId, rightList) {
  const url = constants.BASE_URL + '/api/get_internal_communication_rights'
  return axios.get(url, {
    params: {
      cmd: 'setInternalCommunicationRights',
      etabId: schoolId,
      ...rightList
    }
  }).then(response => response.data)
}

function getExternalCommunicationRights (schoolId) {
  const url = constants.BASE_URL + '/api/get_external_communication_rights'
  return axios.get(url, {
    params: {
      cmd: 'getExternalCommunication',
      etabId: schoolId
    }
  }).then(response => response.data)
}

function setExternalCommunicationRights (schoolId, rightList) {
  const url = constants.BASE_URL + '/api/get_external_communication_rights'
  return axios.get(url, {
    params: {
      cmd: 'setExternalCommunication',
      etabId: schoolId,
      ...rightList
    }
  }).then(response => response.data)
}
