import WeprodeUtils from '@utils/weprode.utils'
import axios from 'axios'

import constants from '@/api/constants'

export default {
  getPersonalDetails,
  getUserInformations,
  updateUserPicture,
  removeUserPicture,
  updateInterfacePreferences,
  updateThemeColor,
  updateLocale,
  updateReportFrequency,
  acceptTermsOfUse,
  getParentInfos
}

const PREF_PATH = '/preference.userproperties'
const USER_PATH = '/user.userutils'
const GET_USER_INFOS_WS = '/get-user-infos'

export {
  updateSideMenuState,
  USER_PATH,
  GET_USER_INFOS_WS
}

/**
 * Get user details for preferences modal window
 */
function getPersonalDetails () {
  return axios.get(constants.JSON_WS_URL + USER_PATH + '/get-personnal-details', {
    params: {}
  }).then(response => response.data)
}

/**
 * Get global user informations
 */
function getUserInformations () {
  return axios.get(constants.JSON_WS_URL + USER_PATH + GET_USER_INFOS_WS, {
    params: {}
  }).then(response => response.data)
}

/**
 * Update language, theme color and default menu status
 * @param {*} preferences
 */
function updateInterfacePreferences (preferences) {
  return axios.post(constants.PREFERENCES_URL, WeprodeUtils.params({
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
  return axios.post(constants.JSON_WS_URL + PREF_PATH + '/update-theme-color',
    WeprodeUtils.params({
      color: formattedColor
    })
  ).then(response => response.data)
}

function updateLocale (locale) {
  return axios.post(constants.JSON_WS_URL + PREF_PATH + '/update-locale',
    WeprodeUtils.params({
      locale
    })
  ).then(response => response.data)
}

function updateSideMenuState (isExpanded) {
  return axios.post(constants.JSON_WS_URL + PREF_PATH + '/update-side-menu-state',
    WeprodeUtils.params({
      isExpanded
    })
  ).then(response => response.data)
}

function updateUserPicture (formData) {
  return axios.post(constants.JSON_WS_URL + PREF_PATH + '/update-user-picture',
    formData
  ).then(response => response.data)
}

/**
 * Remove user portrait
 */
function removeUserPicture () {
  const formData = new FormData()
  formData.append('picture', new Blob([]), '')

  return axios.post(constants.JSON_WS_URL + PREF_PATH + '/update-user-picture',
    formData
  ).then(response => response.data)
}

/**
 * Accept terms of use
 */
function acceptTermsOfUse () {
  return axios.get(constants.JSON_WS_URL + USER_PATH + '/accept-terms-of-use', {
    params: {
    }
  }).then(response => response.data)
}

function getParentInfos (parentUserId) {
  return axios.get(constants.JSON_WS_URL + USER_PATH + '/get-parent-infos', {
    params: {
      parentUserId
    }
  }).then(response => response.data)
}
