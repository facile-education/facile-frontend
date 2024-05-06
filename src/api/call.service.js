import WeprodeUtils from '@utils/weprode.utils'
import axios from 'axios'

import constants from '@/api/constants'

export {
  getCallDetails,
  doCall
}

const CALL_PATH = '/schoollife.call'

function getCallDetails (sessionId) {
  return axios.get(constants.JSON_WS_URL + CALL_PATH + '/get-call-details', {
    params: {
      sessionId
    }
  }).then(response => response.data)
}

function doCall (sessionId, studentsPresence) {
  return axios.post(constants.JSON_WS_URL + CALL_PATH + '/do-call', WeprodeUtils.params({
    sessionId,
    studentsPresence: JSON.stringify(studentsPresence)
  })).then(response => response.data)
}
