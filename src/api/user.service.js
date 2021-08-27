import axios from 'axios'
import constants from '@/api/constants'
// import PentilaUtils from 'pentila-utils'

export default {
  getPersonalDetails,
  getUserInformations
  // removePicture,
  // updateInterfacePreferences,
  // uploadProfilePicture
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

// /**
//  * Remove user portrait
//  */
// function removePicture () {
//   return axios.get(constants.PREFERENCES_URL, {
//     params: {
//       cmd: 'removePicture'
//     }
//   }).then(response => response.data)
// }

// /**
//  * Update language, theme color and default menu status
//  * @param {*} preferences
//  */
// function updateInterfacePreferences (preferences) {
//   return axios.post(constants.PREFERENCES_URL, PentilaUtils.URL.params({
//     cmd: 'editInterface',
//     lang: preferences.language,
//     hideMenu: preferences.isMenuHidden,
//     themeColor: preferences.themeColor
//   }),
//   {
//     headers: {
//       'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
//     }
//   }).then(response => response.data)
// }

// /**
//  * Update user profile picture
//  * @param {*} formData
//  */
// function uploadProfilePicture (formData) {
//   return axios.post(constants.PREFERENCES_URL + '&cmd=uploadPicture', formData,
//     {
//       headers: {
//         'Content-Type': undefined
//       }
//     }).then(response => response.data)
// }
