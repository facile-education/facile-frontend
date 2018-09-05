import axios from 'axios'
import constants from './constants'

export default {
  getUserMenu,
  getMobileMenu
}

function getUserMenu () {
  const url = constants.BASE_URL + '/api/get_menu'
  return axios.get(url).then(response => response.data)
}

function getMobileMenu () {
  const url = constants.BASE_URL + '/api/get_mobile_menu'
  return axios.get(url).then(response => response.data)
}
