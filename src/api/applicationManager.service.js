import axios from 'axios'
import constants from './constants'

export default {
  getSchoolServices
}

function getSchoolServices () {
  const url = constants.BASE_URL + '/api/get_schools_services'
  return axios.get(url).then(response => response.data)
}
