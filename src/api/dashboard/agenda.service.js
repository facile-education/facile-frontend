import WeprodeUtils from '@utils/weprode.utils'
import axios from 'axios'

import constants, { DATE_EXCHANGE_FORMAT } from '@/api/constants'

export {
  getEvents,
  getEventDetails,
  createEvent,
  modifyEvent,
  deleteEvent,
  setEventRead
}

const AGENDA_PATH = '/agenda.agenda'

function getEvents (minDate, startIndex, nbEvents, unreadOnly) {
  return axios.get(constants.JSON_WS_URL + AGENDA_PATH + '/get-events', {
    params: {
      minDateStr: minDate.format(DATE_EXCHANGE_FORMAT),
      startIndex,
      nbEvents,
      unreadOnly
    }
  }).then(response => response.data)
}

function getEventDetails (eventId) {
  return axios.get(constants.JSON_WS_URL + AGENDA_PATH + '/get-event-details', {
    params: {
      eventId
    }
  }).then(response => response.data)
}

function createEvent (title, description, location, startDate, endDate, populations) {
  return axios.post(constants.JSON_WS_URL + AGENDA_PATH + '/create-event',
    WeprodeUtils.params({
      title,
      description,
      location,
      startDate: startDate.format(DATE_EXCHANGE_FORMAT),
      endDate: endDate.format(DATE_EXCHANGE_FORMAT),
      populations: JSON.stringify(populations)
    })
  ).then(response => response.data)
}

function modifyEvent (eventId, title, description, location, startDate, endDate, populations, markAsUnreadForAll) {
  return axios.post(constants.JSON_WS_URL + AGENDA_PATH + '/modify-event',
    WeprodeUtils.params({
      eventId,
      title,
      description,
      location,
      startDate: startDate.format(DATE_EXCHANGE_FORMAT),
      endDate: endDate.format(DATE_EXCHANGE_FORMAT),
      populations: JSON.stringify(populations),
      markAsUnreadForAll
    })
  ).then(response => response.data)
}

function deleteEvent (eventId) {
  return axios.delete(constants.JSON_WS_URL + AGENDA_PATH + '/delete-event', {
    params: {
      eventId
    }
  }).then(response => response.data)
}

function setEventRead (eventId, read) {
  return axios.post(constants.JSON_WS_URL + AGENDA_PATH + '/set-event-read',
    WeprodeUtils.params({
      eventId,
      read
    })
  ).then(response => response.data)
}
