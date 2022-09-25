import axios from 'axios'
import constants from '@/api/constants'
import { getCookie } from '@/utils/browser.util'

export default {
  getMessagingConfiguration,
  updateMessagingConfiguration
}

const MESSAGING_PATH = '/messaging-portlet.messagingconfig'

/**
 * Get user messaging configuration
 */
function getMessagingConfiguration () {
  return axios.get(constants.JSON_WS_URL + MESSAGING_PATH + '/get-messaging-configuration', {
    params: {
      p_auth: getCookie('pauth')
    }
  }).then(response => response.data)
}

/**
 * Update user messaging configuration
 */
function updateMessagingConfiguration (configuration) {
  const formData = new FormData()
  formData.append('p_auth', getCookie('pauth'))
  formData.append('configuration', JSON.stringify(configuration))

  return axios.post(constants.JSON_WS_URL + MESSAGING_PATH + '/update-messaging-configuration',
    formData
  ).then(response => response.data)
}
