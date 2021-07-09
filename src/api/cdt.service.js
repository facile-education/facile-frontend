import axios from 'axios'
// import constants from '@/api/constants'

export default {
  getConfiguration,
  getGroups,
  getSessions
}

// const CDT_PATH = '/cdt-portlet'
const CDT_URL = '/group/314141/cahier-de-texte?p_p_id=cdt_WAR_cdtportlet&p_p_lifecycle=2&p_p_state=exclusive&p_p_mode=view&p_p_cacheability=cacheLevelPage&controlPanelCategory=portlet_cdt_WAR_cdtportlet'

// '&cmd=getGroups&profile=5&userId=333930'

/**
 * Get CDT configuration
 */
function getConfiguration () {
  return axios.get(CDT_URL, {
    params: {
      cmd: 'getConfiguration'
    }
  }).then(response => response.data)
}

/**
 * Get group list
 */
function getGroups () {
  return axios.get(CDT_URL, {
    params: {
      cmd: 'getAllGroups'
    }
  }).then(response => response.data)
}

/**
 * Get the user or group session list for specified date range
 */
function getSessions (userId, groupId, minDate, maxDate) {
  // WS : CDT_PATH + constants.JSON_WS_URL + '/cdtsession/priv-get-sessions'
  return axios.get(CDT_URL, {
    params: {
      cmd: 'getHorairesSessions',
      userId,
      groupId,
      start: minDate.format('YYYY-MM-DD HH:mm'),
      end: maxDate.format('YYYY-MM-DD HH:mm')
    }
  }).then(response => response.data)
}
