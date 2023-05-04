import axios from 'axios'
import constants from './constants'

export default {
  getTermsOfUse,
  getVersionList,
  getVersionDetails,
  createVersion
}

const ABOUT_PATH = '/about.'

function getTermsOfUse () {
  return axios.get(constants.JSON_WS_URL + ABOUT_PATH + 'entdetails/get-terms-of-use', {
    params: {}
  }).then(response => response.data)
}

function getVersionList () {
  return axios.get(constants.JSON_WS_URL + ABOUT_PATH + 'entdetails/get-version-list', {
    params: {}
  }).then(response => response.data)
}

function getVersionDetails (versionId) {
  return axios.get(constants.JSON_WS_URL + ABOUT_PATH + 'entdetails/get-version-details', {
    params: {
      versionId
    }
  }).then(response => response.data)
}

function createVersion (versionNumber, versionDetails) {
  return axios.get(constants.JSON_WS_URL + ABOUT_PATH + 'entdetails/create-version', {
    params: {
      versionNumber,
      versionDetails
    }
  }).then(response => response.data)
}
