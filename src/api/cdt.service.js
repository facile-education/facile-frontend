import axios from 'axios'
// import constants from '@/api/constants'

export default {
  getGroups,
  getSessions
}

// const CDT_PATH = '/cdt-portlet'
const CDT_URL = '/group/314141/cahier-de-texte?p_p_id=cdt_WAR_cdtportlet&p_p_lifecycle=2&p_p_state=exclusive&p_p_mode=view&p_p_cacheability=cacheLevelPage&controlPanelCategory=portlet_cdt_WAR_cdtportlet'

// '&cmd=getGroups&profile=5&userId=333930'

/**
 * Get the student's slots in the specified amount of time
 */
function getSessions (userId, groupId, minDate, maxDate) {
  // WS : CDT_PATH + constants.JSON_WS_URL + '/cdtsession/priv-get-sessions'
  return axios.get(CDT_URL, {
    params: {
      cmd: 'getSessions',
      userId,
      groupId,
      profile: 5,
      startDate: minDate.format('DD/MM/YYYY HH:MM'),
      endDate: maxDate.format('DD/MM/YYYY HH:MM')
      // userId,
      // groupId,
      // start: minDate.format('YYYY-MM-DD HH:mm'),
      // end: maxDate.format('YYYY-MM-DD HH:mm')
    }
  }).then(response => response.data)
}

function getGroups (userId) {
  return axios.get(CDT_URL, {
    params: {
      cmd: 'getGroups',
      userId,
      profile: 5
    }
  }).then(response => response.data)
}
