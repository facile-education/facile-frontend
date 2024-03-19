import WeprodeUtils from '@utils/weprode.utils'
import axios from 'axios'

import constants, { DATE_EXCHANGE_FORMAT } from '@/api/constants'

export {
  getClassLogbook,
  getStudentLogbook,
  getLogbookBroadcastPopulations,
  createEntries,
  signLogbookEntry,
  deleteEntry,
  updateEntry,
  getEntryReadStatus,
  followupUnsigned
}

const LOGBOOK_PATH = '/logbook.logbook'

function getClassLogbook (orgId) {
  return axios.get(constants.JSON_WS_URL + LOGBOOK_PATH + '/get-class-logbook', {
    params: {
      orgId
    }
  }).then(response => response.data)
}

function getStudentLogbook (childId) {
  return axios.get(constants.JSON_WS_URL + LOGBOOK_PATH + '/get-student-logbook', {
    params: {
      childId
    }
  }).then(response => response.data)
}

function getLogbookBroadcastPopulations () {
  return axios.get(constants.JSON_WS_URL + LOGBOOK_PATH + '/get-logbook-broadcast-populations').then(response => response.data)
}

function createEntries (title, content, populations, isAuthorisation, needAllParents, limitDateStr) {
  return axios.post(constants.JSON_WS_URL + LOGBOOK_PATH + '/create-logbook-entry',
    WeprodeUtils.params({
      title,
      content,
      isAuthorisation,
      needAllParents,
      limitDateStr: limitDateStr.format(DATE_EXCHANGE_FORMAT),
      populations: JSON.stringify(populations)
    })).then(response => response.data)
}

function signLogbookEntry (logbookEntryId, hasAuthorized) {
  return axios.get(constants.JSON_WS_URL + LOGBOOK_PATH + '/sign-logbook-entry', {
    params: {
      logbookEntryId,
      hasAuthorized
    }
  }).then(response => response.data)
}

function deleteEntry (logbookEntryId) {
  return axios.delete(constants.JSON_WS_URL + LOGBOOK_PATH + '/delete-logbook-entry', {
    params: {
      logbookEntryId
    }
  }).then(response => response.data)
}

function updateEntry (logbookEntryId, title, content, populations, isAuthorisation, limitDateStr) {
  return axios.post(constants.JSON_WS_URL + LOGBOOK_PATH + '/edit-logbook-entry',
    WeprodeUtils.params({
      logbookEntryId,
      title,
      content,
      isAuthorisation,
      limitDateStr: limitDateStr.format(DATE_EXCHANGE_FORMAT),
      populations: JSON.stringify(populations)
    })).then(response => response.data)
}

function getEntryReadStatus (logbookEntryId) {
  return axios.get(constants.JSON_WS_URL + LOGBOOK_PATH + '/get-logbook-entry-read-status', {
    params: {
      logbookEntryId
    }
  }).then(response => response.data)
}

function followupUnsigned (logbookEntryId) {
  return axios.get(constants.JSON_WS_URL + LOGBOOK_PATH + '/followup-unsigned-parents', {
    params: {
      logbookEntryId
    }
  }).then(response => response.data)
}
