import axios from 'axios'
import constants from './constants'

export default {
  getPersonalDetails,
  getUserInformations
}

function getPersonalDetails () {
  return axios.get(constants.PREFERENCES_URL, {
    params: {
      cmd: 'getPersonnalDetails'
    }
  }).then(response => response.data)
}

// editInfoUser - editInterface

function getUserInformations () {
  return axios.get(constants.PREFERENCES_URL, {
    params: {
      cmd: 'getUserInformations'
    }
  }).then(response => response.data)
}
