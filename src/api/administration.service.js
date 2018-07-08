import axios from 'axios'
import constants from './constants'

export default {
  getAdministeredSchoolList,
  getPortletList,
  getRoleList
}

function getAdministeredSchoolList () {
  const url = constants.BASE_URL + '/api/get_administration_schools'
  return axios.get(url, {
    params: {
      cmd: 'getSchoolList'
    }
  }).then(response => response.data)
}

function getPortletList () {
  const url = constants.BASE_URL + '/api/get_portlets'
  return axios.get(url, {
    params: {
      cmd: 'getListPortlet'
    }
  }).then(response => response.data)
}

function getRoleList () {
  const url = constants.BASE_URL + '/api/get_roles'
  return axios.get(url, {
    params: {
      cmd: 'getRoleList'
    }
  }).then(response => response.data)
}
