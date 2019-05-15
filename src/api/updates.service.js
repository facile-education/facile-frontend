import axios from 'axios'
import constants from './constants'

export default {
  getVersionList,
  getVersionDetails,
  createVersion
}

const url = constants.VERSION_MANAGER_URL

function getVersionList () {
  return axios.get(url, {
    params: {
      cmd: 'getVersionList'
    }
  }).then(response => response.data)
}

function getVersionDetails (id) {
  return axios.get(url, {
    params: {
      cmd: 'getVersionDetails',
      versionId: id
    }
  }).then(response => response.data)
}

function createVersion (number, details) {
  return axios.get(url, {
    params: {
      cmd: 'createVersion',
      versionNumber: number,
      versionDetails: details
    }
  }).then(response => response.data)
}
