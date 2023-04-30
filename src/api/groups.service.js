import axios from 'axios'
import constants from '@/api/constants'
import PentilaUtils from 'pentila-utils'

export {
  getUserGroups,
  getUserCommunities,
  getCommunityMembers,
  createCommunity,
  checkCommunityName,
  editCommunity,
  removeCommunity,
  getGroupActivity,
  extendCommunity
}

export default {
  getUserGroups,
  getUserCommunities,
  getCommunityMembers,
  checkCommunityName
}

const GROUP_PATH = '/accesAteliers-portlet.'
const GROUP_CTX = 'grouputils/'
const COMMUNITY_CTX = 'communityinfos/'

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
      filter: filter.label,
      allCommunities: filter.isCommunityActive,
      allClasses: filter.isInstitutionalActive,
      allCours: filter.isPedagogicalActive
    }
  }).then(response => response.data)
}

function getCommunityMembers (groupId) {
  return axios.get(constants.JSON_WS_URL + GROUP_PATH + GROUP_CTX + 'get-group-members', {
    params: {
      groupId
    }
  }).then(response => response.data)
}

function getGroupActivity (groupId, maxDate, nbResults) {
  console.log('nbresult=', nbResults)
  return axios.get(constants.JSON_WS_URL + GROUP_PATH + GROUP_CTX + 'get-group-activity', {
    params: {
      groupId,
      maxDate,
      nbResults
    }
  }).then(response => response.data)
}

function createCommunity (groupName, description, isPedagogical, members, color) {
  return axios.post(constants.JSON_WS_URL + GROUP_PATH + COMMUNITY_CTX + 'create-community',
    PentilaUtils.URL.params({
      groupName,
      description,
      isPedagogical,
      members: JSON.stringify(members),
      color
    })
  ).then(response => response.data)
}

function checkCommunityName (communityName) {
  return axios.get(constants.JSON_WS_URL + GROUP_PATH + COMMUNITY_CTX + 'check-community-name', {
    params: {
      communityName
    }
  }).then(response => response.data)
}

function editCommunity (groupId, groupName, description, isPedagogical, members, color) {
  return axios.post(constants.JSON_WS_URL + GROUP_PATH + COMMUNITY_CTX + 'edit-community',
    PentilaUtils.URL.params({
      groupId,
      groupName,
      description,
      isPedagogical,
      members: JSON.stringify(members),
      color
    })
  ).then(response => response.data)
}

function removeCommunity (groupId) {
  return axios.get(constants.JSON_WS_URL + GROUP_PATH + COMMUNITY_CTX + 'remove-community', {
    params: {
      groupId
    }
  }).then(response => response.data)
}

function extendCommunity (groupId) {
  return axios.post(constants.JSON_WS_URL + GROUP_PATH + COMMUNITY_CTX + 'extend-community',
    PentilaUtils.URL.params({
      groupId
    })
  ).then(response => response.data)
}
