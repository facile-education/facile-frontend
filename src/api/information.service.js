import axios from 'axios'
import constants from './constants'

export default {
  getTermsOfUse,
  getVersionList,
  getVersionDetails,
  createVersion
}

const url = constants.INFORMATION_MANAGER_URL

function getTermsOfUse () {
  return axios.get(url, {
    params: {
      cmd: 'getTermsOfUse'
    }
  }).then(response => response.data)
}

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
