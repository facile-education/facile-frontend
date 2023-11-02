import axios from 'axios'

import constants from '@/api/constants'

export default {
  addMobileToken,
  refreshMobileToken
}

const MOBILE_PATH = '/mobile.usermobiletoken/'

function addMobileToken () {
  return axios.get(constants.JSON_WS_URL + MOBILE_PATH + 'add-mobile-token', {
    params: {
    }
  }).then(response => response.data)
}

function refreshMobileToken (token) {
  return axios.get(constants.JSON_WS_URL + MOBILE_PATH + 'refresh-mobile-token', {
    params: {
      token
    }
  }).then(response => response.data)
}
