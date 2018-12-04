import axios from 'axios'
import constants from './constants'

export default {
  getSynchronizationInformations,
  getSynchronizationType,
  updateSynchronizationType
}

function getSynchronizationInformations () {
  const url = constants.BASE_URL + '/api/get_synchro_infos'
  return axios.get(url, {
    params: {
      cmd: 'getSynchroInfos'
    }
  }).then(response => response.data)
}

function getSynchronizationType () {
  const url = constants.BASE_URL + '/api/get_synchro_type'
  return axios.get(url, {
    params: {
      cmd: 'getSynchroType'
    }
  }).then(response => response.data)
}

function updateSynchronizationType (synchronizationType) {
  const url = constants.BASE_URL + '/api/get_synchro_type'
  return axios.get(url, {
    params: {
      cmd: 'saveDataConfiguration',
      dataSource: synchronizationType
    }
  }).then(response => response.data)
}
