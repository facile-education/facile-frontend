import axios from 'axios'

import constants from './constants'

export default {
  getVersionNotesList,
  getVersionNoteContent,
  createVersionNote,
  updateVersionNote,
  deleteVersionNote
}

export {
  getVersionNotesList,
  getVersionNoteContent,
  createVersionNote,
  updateVersionNote,
  deleteVersionNote
}

const ABOUT_PATH = '/about.'

function getVersionNotesList () {
  return axios.get(constants.JSON_WS_URL + ABOUT_PATH + 'versionnote/get-version-notes', {
    params: {}
  }).then(response => response.data)
}

function getVersionNoteContent (versionNoteId) {
  return axios.get(constants.JSON_WS_URL + ABOUT_PATH + 'versionnote/get-version-note-content', {
    params: {
      versionNoteId
    }
  }).then(response => response.data)
}

function createVersionNote (title, htmlContent) {
  return axios.post(constants.JSON_WS_URL + ABOUT_PATH + 'versionnote/create-version-note', {
    params: {
      title,
      htmlContent
    }
  }).then(response => response.data)
}

function updateVersionNote (versionNoteId, title, htmlContent) {
  return axios.put(constants.JSON_WS_URL + ABOUT_PATH + 'versionnote/update-version-note', {
    params: {
      versionNoteId,
      title,
      htmlContent
    }
  }).then(response => response.data)
}

function deleteVersionNote (versionNoteId) {
  return axios.delete(constants.JSON_WS_URL + ABOUT_PATH + 'versionnote/delete-version-note', {
    params: {
      versionNoteId
    }
  }).then(response => response.data)
}
