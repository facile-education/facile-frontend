import axios from 'axios'

import constants from '@/api/constants'

export {
  getLogbookUnReadEntries
}

const LOGBOOK_PATH = '/logbook.logbook'

function getLogbookUnReadEntries () {
  return axios.get(constants.JSON_WS_URL + LOGBOOK_PATH + '/count-unsigned-logbook-entries').then(response => response.data)
}
