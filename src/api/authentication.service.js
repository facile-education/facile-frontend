import axios from 'axios'

import constants from '@/api/constants'

export default {
  checkCredentials
}

const AUTHENTICATION_PATH = '/authentication.authentication'

/**
 * Check credentials without logging
 */
function checkCredentials (login, password) {
  return axios.get(constants.JSON_WS_URL + AUTHENTICATION_PATH + '/check-credentials', {
    params: {
      login,
      password
    }
  }).then(response => response.data)
}
