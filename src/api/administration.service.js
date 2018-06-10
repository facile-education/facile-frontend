import axios from 'axios'
import constants from './constants'

export default {
  getAdministrationSchools,
  getPortlets
}

function getAdministrationSchools () {
  const url = constants.BASE_URL + '/api/get_administration_schools'
  return axios.get(url, {
    params: {
      cmd: 'getSchoolList'
    }
  }).then(response => response.data)
}

function getPortlets () {
  const url = constants.BASE_URL + '/api/get_portlets'
  return axios.get(url, {
    params: {
      cmd: 'getListPortlet'
    }
  }).then(response => response.data)
}
