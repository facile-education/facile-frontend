import axios from 'axios'
import constants from '@/api/constants'
import NeroUtils from '@/utils/nero.utils'

export default {
  getPersonalDetails,
  getUserInformations,
  updateInterfacePreferences
}

/**
 * Get user details for preferences modal window
 */
function getPersonalDetails () {
  return axios.get(constants.PREFERENCES_URL, {
    params: {
      cmd: 'getPersonnalDetails'
    }
  }).then(response => response.data)
}

/**
 * Get global user informations
 */
function getUserInformations () {
  return axios.get(constants.PREFERENCES_URL, {
    params: {
      cmd: 'getUserInformations'
    }
  }).then(response => response.data)
}

/**
 * Update language, theme color and default menu status
 * @param {*} preferences
 */
function updateInterfacePreferences (preferences) {
  return axios.post(constants.PREFERENCES_URL, NeroUtils.URL.params({
    cmd: 'editInterface',
    lang: preferences.language,
    hideMenu: preferences.isMenuHidden,
    themeColor: preferences.themeColor
  }),
  {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  }).then(response => response.data)
}
