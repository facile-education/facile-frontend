import axios from 'axios'
import constants from './constants'

export default {
  getUserMenu
}

function getUserMenu () {
  const url = constants.BASE_URL + '/api/get_menu'
  return axios.get(url).then(response => response.data)
}
