import axios from 'axios'

import constants from './constants'

export default {
  getTermsOfUse,
  getVersionNotesList,
  getVersionNoteDetails,
  createVersionNote,
  updateVersionNote,
  deleteVersionNote
}

export {
  getTermsOfUse,
  getVersionNotesList,
  getVersionNoteDetails,
  createVersionNote,
  updateVersionNote,
  deleteVersionNote
}

const ABOUT_PATH = '/about.'

function getTermsOfUse () {
  return axios.get(constants.JSON_WS_URL + ABOUT_PATH + 'entdetails/get-terms-of-use', {
    params: {}
  }).then(response => response.data)
}

function getVersionNotesList () {
  return axios.get(constants.JSON_WS_URL + ABOUT_PATH + 'entdetails/get-version-list', {
    params: {}
  }).then(response => response.data)
}

function getVersionNoteDetails (versionId) {
  return axios.get(constants.JSON_WS_URL + ABOUT_PATH + 'entdetails/get-version-details', {
    params: {
      versionId
    }
  }).then(response => response.data)
}

function createVersionNote (title, htmlContent) {
  return axios.post(constants.JSON_WS_URL + ABOUT_PATH + 'entdetails/create-version-note', {
    params: {
      title,
      htmlContent
    }
  }).then(response => response.data)
}

function updateVersionNote (versionNoteId, title, htmlContent) {
  return axios.put(constants.JSON_WS_URL + ABOUT_PATH + 'entdetails/update-version-note', {
    params: {
      versionNoteId,
      title,
      htmlContent
    }
  }).then(response => response.data)
}

function deleteVersionNote (versionNoteId) {
  return axios.delete(constants.JSON_WS_URL + ABOUT_PATH + 'entdetails/delete-version-note', {
    params: {
      versionNoteId
    }
  }).then(response => response.data)
}
