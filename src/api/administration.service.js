import axios from 'axios'
import constants from './constants'

const applicationManagerURL = '/user/pentila/gestion-applications?p_p_id=gestionApps_WAR_gestionApplicationsportlet&p_p_lifecycle=2&p_p_state=exclusive&p_p_mode=view&p_p_cacheability=cacheLevelPage&controlPanelCategory=portlet_gestionApps_WAR_gestionApplicationsportlet'

export default {
  getAdministeredSchoolList,
  getPortletList,
  getRoleList
}

function getAdministeredSchoolList () {
  // const url = constants.BASE_URL + '/api/get_administration_schools'
  const url = applicationManagerURL
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
