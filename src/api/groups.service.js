import axios from 'axios'
import constants from '@/api/constants'

export {
  getUserGroups,
  getUserCommunities,
  getCommunityMembers
}

export default {
  getUserGroups,
  getUserCommunities
}

const GROUP_PATH = '/accesAteliers-portlet.'
const GROUP_CTX = 'grouputils/'
// const COMMUNITY_CTX = 'communityinfos/'

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

/**
 * Get current user communities (personals groups?)
 */
function getUserCommunities (userId, filter) {
  return axios.get(constants.JSON_WS_URL + GROUP_PATH + GROUP_CTX + 'get-user-collaborative-groups', {
    params: {
      filter: filter,
      allCommunities: true,
      allClasses: true,
      allCours: true
    }
  }).then(response => response.data)
}

/**
 * Get current user communities (personals groups?)
 */
function getCommunityMembers (groupId) {
  return axios.get(constants.JSON_WS_URL + GROUP_PATH + GROUP_CTX + 'get-group-members', {
    params: {
      groupId: groupId
    }
  }).then(response => response.data)
}
