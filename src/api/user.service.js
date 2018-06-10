import axios from 'axios'
import constants from './constants'

export default {
  getUserInformations
}

function getUserInformations () {
  const url = constants.BASE_URL + '/api/get_user'
  return axios.get(url).then(response => response.data)
}
