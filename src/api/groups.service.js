import axios from 'axios'
import constants from '@/api/constants'

export {
  getUserGroups
}

export default {
  getUserGroups
}

const GROUP_PATH = '/accesAteliers-portlet.'
const GROUP_CTX = 'grouputils/'

/**
 * Get groups for current user (school AND/OR institutionnal AND/OR communities)
 */
function getUserGroups (schoolId, includeInstitutional, includeCommunities, pedagogicalOnly) {
  return axios.get(constants.JSON_WS_URL + GROUP_PATH + GROUP_CTX + 'get-user-groups', {
    params: {
      schoolId: schoolId,
      includeInstitutional: includeInstitutional,
      includeCommunities: includeCommunities,
      pedagogicalOnly: pedagogicalOnly
    }
  }).then(response => response.data)
}
