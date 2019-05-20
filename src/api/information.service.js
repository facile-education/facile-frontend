import axios from 'axios'
import constants from './constants'

export default {
  isVersionNameValid,
  isJsonContentValid,
  getTermsOfUse,
  getVersionList,
  getVersionDetails,
  createVersion
}

const url = constants.VERSION_MANAGER_URL

function isVersionNameValid (str) {
  try {
    var regex = /[0-9]+.[0-9]+.[0-9]+.[0-9]+/gm

    var found = str.match(regex)
    return (found.length === 1 && str === found[0])
  } catch (e) {
    return false
  }
}

function isJsonContentValid (str) {
  try {
    var json = JSON.parse(str)
    if (!json.hasOwnProperty('news') || !json.hasOwnProperty('others')) {
      return false
    }
  } catch (e) {
    return false
  }
  return true
}

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
