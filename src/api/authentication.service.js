import axios from 'axios'
import PentilaUtils from 'pentila-utils'

import constants from '@/api/constants'

export default {
  checkCredentials
}

const AUTHENTICATION_PATH = '/authentication.authentication'

/**
 * Check credentials without logging
 */
function checkCredentials (login, password) {
  return axios.post(constants.JSON_WS_URL + AUTHENTICATION_PATH + '/check-credentials',
    PentilaUtils.URL.params({
      login,
      password
    })
  ).then(response => response.data)
}
