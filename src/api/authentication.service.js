import WeprodeUtils from '@utils/weprode.utils'
import axios from 'axios'

import constants from '@/api/constants'

export default {
//  authLog,
  login
}

// const AUTHENTICATION_PATH = '/authentication.authentication'

// Uncomment for local testing
// function authLog (str) {
//   return axios.get(constants.JSON_WS_URL + AUTHENTICATION_PATH + '/auth-log', {
//     params: {
//       str
//     }
//   }).then(response => response.data)
// }

function login (login, password, rememberMe) {
  return axios.post(constants.BASE_API_URL + '/c/common/login', WeprodeUtils.params({
    login,
    password,
    rememberMe
  })).then(response => response.data)
}
