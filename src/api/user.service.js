import axios from 'axios'
import constants from '@/api/constants'
import PentilaUtils from 'pentila-utils'

export default {
  getPersonalDetails,
  getServiceList,
  getUserInformations,
  removePicture,
  updateInterfacePreferences,
  uploadProfilePicture,
  updateThemeColor,
  updateReportFrequency,
  updateWebdavState,
  updateWebdavPassword
}

const PREF_PATH = '/preference-portlet.'

/**
 * Get user details for preferences modal window
 */
function getPersonalDetails () {
  return axios.get(constants.JSON_WS_URL + PREF_PATH + 'userproperties/get-personnal-details', {
    params: {}
  }).then(response => response.data)
}

/**
 * Get global user informations
 */
function getUserInformations () {
  return axios.get(constants.JSON_WS_URL + PREF_PATH + 'userproperties/get-user-infos', {
    params: {}
  }).then(response => response.data)
}

/**
 * Remove user portrait
 */
function removePicture () {
  return axios.get(constants.PREFERENCES_URL, {
    params: {
      cmd: 'removePicture'
    }
  }).then(response => response.data)
}

/**
 * Update language, theme color and default menu status
 * @param {*} preferences
 */
function updateInterfacePreferences (preferences) {
  return axios.post(constants.PREFERENCES_URL, PentilaUtils.URL.params({
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

function updateThemeColor (newColor) {
  const formattedColor = newColor.replace('#', '').toLowerCase()
  return axios.post(constants.JSON_WS_URL + PREF_PATH + 'userproperties/update-theme-color',
    PentilaUtils.URL.params({
      color: formattedColor
    })
  ).then(response => response.data)
}

function updateReportFrequency (frequency) {
  return axios.post(constants.JSON_WS_URL + PREF_PATH + 'userproperties/update-report-frequency',
    PentilaUtils.URL.params({
      frequency: frequency
    })
  ).then(response => response.data)
}

function updateWebdavState (isEnabled) {
  return axios.post(constants.JSON_WS_URL + PREF_PATH + 'userproperties/update-webdav-state',
    PentilaUtils.URL.params({
      isEnabled: isEnabled
    })
  ).then(response => response.data)
}

function updateWebdavPassword (password, confirmPassword) {
  return axios.post(constants.JSON_WS_URL + PREF_PATH + 'userproperties/update-webdav-password',
    PentilaUtils.URL.params({
      password: password,
      confirmPassword: confirmPassword
    })
  ).then(response => response.data)
}

/**
 * Update user profile picture
 * @param {*} formData
 */
function uploadProfilePicture (formData) {
  return axios.post(constants.PREFERENCES_URL + '&cmd=uploadPicture', formData,
    {
      headers: {
        'Content-Type': undefined
      }
    }).then(response => response.data)
}

/**
 * Get User's service list
 */
function getServiceList () {
  return axios.get(constants.INFORMATION_MANAGER_URL, {
    params: {
      cmd: 'getServiceList'
    }
  }).then(response => response.data)
}
