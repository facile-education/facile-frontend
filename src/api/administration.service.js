import axios from 'axios'
import constants from './constants'

export default {
  getAdministrationSchools
}

function getAdministrationSchools () {
  const url = constants.BASE_URL + '/api/get_administration_schools'
  return axios.get(url).then(response => response.data)
}
