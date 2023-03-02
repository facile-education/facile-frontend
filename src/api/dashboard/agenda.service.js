import axios from 'axios'
import constants from '@/api/constants'
import PentilaUtils from 'pentila-utils'

export {
  getEvents,
  getEventDetails,
  createEvent,
  modifyEvent,
  deleteEvent,
  setEventRead
}

const AGENDA_PATH = '/agenda-portlet.agenda'

function getEvents (fromDate, nbEvents, unreadOnly) {
  return axios.get(constants.JSON_WS_URL + AGENDA_PATH + '/get-events', {
    params: {
      minDateStr: fromDate.format('YYYY-MM-DD HH:mm'),
      nbEvents: nbEvents,
      unreadOnly: unreadOnly
    }
  }).then(response => response.data)
}

function getEventDetails (eventId) {
  return axios.get(constants.JSON_WS_URL + AGENDA_PATH + '/get-event-details', {
    params: {
      eventId: eventId
    }
  }).then(response => response.data)
}

function createEvent (title, description, location, startDate, endDate, populations) {
  return axios.post(constants.JSON_WS_URL + AGENDA_PATH + '/create-event',
    PentilaUtils.URL.params({
      title,
      description,
      location,
      startDate: startDate.format('YYYY-MM-DD HH:mm'),
      endDate: endDate.format('YYYY-MM-DD HH:mm'),
      populations: JSON.stringify(populations)
    })
  ).then(response => response.data)
}

function modifyEvent (eventId, title, description, location, startDate, endDate, populations, markAsUnreadForAll) {
  return axios.post(constants.JSON_WS_URL + AGENDA_PATH + '/modify-event',
    PentilaUtils.URL.params({
      eventId,
      title,
      description,
      location,
      startDate: startDate.format('YYYY-MM-DD HH:mm'),
      endDate: endDate.format('YYYY-MM-DD HH:mm'),
      populations: JSON.stringify(populations),
      markAsUnreadForAll
    })
  ).then(response => response.data)
}

function deleteEvent (eventId) {
  return axios.get(constants.JSON_WS_URL + AGENDA_PATH + '/delete-event', {
    params: {
      eventId: eventId
    }
  }).then(response => response.data)
}

function setEventRead (eventId, read) {
  return axios.post(constants.JSON_WS_URL + AGENDA_PATH + '/set-event-read',
    PentilaUtils.URL.params({
      eventId,
      read
    })
  ).then(response => response.data)
}
