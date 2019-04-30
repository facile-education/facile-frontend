import axios from 'axios'
import constants from './constants'

export default {
  getAdministeredSchoolList,
  getClassList,
  getPortletList,
  getRoleList
}

const url = constants.APPLICATION_MANAGER_URL

function getAdministeredSchoolList () {
  return axios.get(url, {
    params: {
      cmd: 'getSchoolList'
    }
  }).then(response => response.data)
}

function getClassList (schoolId) {
  return axios.get(url, {
    params: {
      cmd: 'getListClasses',
      etabId: schoolId
    }
  }).then(response => response.data)
}

function getPortletList () {
  return axios.get(url, {
    params: {
      cmd: 'getListPortlet'
    }
  }).then(response => response.data)
}

function getRoleList () {
  return axios.get(url, {
    params: {
      cmd: 'getRoleList'
    }
  }).then(response => response.data)
}
