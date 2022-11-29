import axios from 'axios'
import constants from '@/api/constants'
import PentilaUtils from 'pentila-utils'

export {
  getUserGroups,
  getUserCommunities,
  getCommunityMembers,
  createCommunity,
  editCommunity,
  removeCommunity,
  getGroupHistory,
  getSpecificGroupActivities,
  addCommunityMembers,
  removeCommunityMember,
  addCommunityAdmin,
  removeCommunityAdmin,
  extendCommunity
}

export default {
  getUserGroups,
  getUserCommunities
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
      groupId: groupId
    }
  }).then(response => response.data)
}

function addCommunityAdmin (groupId, userId) {
  return axios.get(constants.JSON_WS_URL + GROUP_PATH + COMMUNITY_CTX + 'add-community-admin', {
    params: {
      groupId: groupId,
      adminId: userId
    }
  }).then(response => response.data)
}

function removeCommunityAdmin (groupId, userId) {
  return axios.get(constants.JSON_WS_URL + GROUP_PATH + COMMUNITY_CTX + 'remove-community-admin', {
    params: {
      groupId: groupId,
      adminId: userId
    }
  }).then(response => response.data)
}

function removeCommunityMember (groupId, memberId) {
  return axios.get(constants.JSON_WS_URL + GROUP_PATH + COMMUNITY_CTX + 'remove-community-members', {
    params: {
      groupId: groupId,
      memberId: memberId
    }
  }).then(response => response.data)
}

function addCommunityMembers (groupId, members) {
  return axios.post(constants.JSON_WS_URL + GROUP_PATH + COMMUNITY_CTX + 'add-community-members',
    PentilaUtils.URL.params({
      groupId: groupId,
      members: JSON.stringify(members)
    })
  ).then(response => response.data)
}

function getGroupHistory (groupId, maxDate, nbResults) {
  return axios.get(constants.JSON_WS_URL + GROUP_PATH + GROUP_CTX + 'get-group-history', {
    params: {
      groupId: groupId,
      maxDate: maxDate,
      nbResults: nbResults
    }
  }).then(response => response.data)
}

function getSpecificGroupActivities (groupId, maxDate, nbResults, allHistory, containNews, containDocs, containMembership, containPendingFirings, containFirings, containHomework) {
  return axios.get(constants.JSON_WS_URL + GROUP_PATH + GROUP_CTX + 'get-specific-group-activities', {
    params: {
      groupId: groupId,
      maxDate: maxDate,
      nbResults: nbResults,
      allHistory: allHistory,
      containNews: containNews,
      containDocs: containDocs,
      containMembership: containMembership,
      containPendingFirings: containPendingFirings,
      containFirings: containFirings,
      containHomework: containHomework
    }
  }).then(response => response.data)
}

function createCommunity (groupName, description, isPedagogical, members) {
  return axios.post(constants.JSON_WS_URL + GROUP_PATH + COMMUNITY_CTX + 'create-community',
    PentilaUtils.URL.params({
      groupName: groupName,
      description: description,
      isPedagogical: isPedagogical,
      members: JSON.stringify(members)
    })
  ).then(response => response.data)
}

function editCommunity (groupId, groupName, description, isPedagogical) {
  return axios.post(constants.JSON_WS_URL + GROUP_PATH + COMMUNITY_CTX + 'edit-community',
    PentilaUtils.URL.params({
      groupId: groupId,
      groupName: groupName,
      description: description,
      isPedagogical: isPedagogical
    })
  ).then(response => response.data)
}

function removeCommunity (groupId) {
  return axios.get(constants.JSON_WS_URL + GROUP_PATH + COMMUNITY_CTX + 'remove-community', {
    params: {
      groupId: groupId
    }
  }).then(response => response.data)
}

function extendCommunity (groupId) {
  return axios.post(constants.JSON_WS_URL + GROUP_PATH + COMMUNITY_CTX + 'extend-community',
    PentilaUtils.URL.params({
      groupId: groupId
    })
  ).then(response => response.data)
}
