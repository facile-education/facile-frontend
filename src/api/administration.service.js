import axios from 'axios'

import constants from './constants'

export default {
  getPortletList
}

const APPLICATION_MANAGER_PATH = '/application.'
const APPLICATION_CTX = 'application/'

function getPortletList () {
  return axios.get(constants.JSON_WS_URL + APPLICATION_MANAGER_PATH + APPLICATION_CTX + 'get-portlets', {
    params: {
    }
  }).then(response => response.data)
}
