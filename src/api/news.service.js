import axios from 'axios'
import constants from '@/api/constants'
import NeroUtils from '@/utils/nero.utils'

export default {
  addNews,
  editNews,
  deleteNews,
  getDelegateList,
  getDelegationCandidateList,
  getNewsBroadcastedGroups,
  getNewsList,
  updateDelegateList
}
const url = constants.DASHBOARD_URL

function getNewsList (isHeadMaster, startLimit, endLimit) {
  return axios.get(url, {
    params: {
      cmd: 'getAllNews',
      startLimit: startLimit,
      endLimit: endLimit,
      isWelcomePage: true, // TODO needed ?
      getNewsGroup: !isHeadMaster,
      getNewsHM: isHeadMaster,
      getNewsHighPriority: isHeadMaster
    }
  }).then(response => response.data)
}

// TODO
function addNews (widget) {
  return axios.post(url, {
    cmd: 'saveWidget',
    widget: JSON.stringify(widget)
  }).then(response => response.data)
}

// TODO
function editNews (widget) {
  return axios.post(url, {
    cmd: 'saveWidget',
    widget: JSON.stringify(widget)
  }).then(response => response.data)
}

// TODO
function deleteNews (widget) {
  return axios.post(url, {
    cmd: 'saveWidget',
    widget: JSON.stringify(widget)
  }).then(response => response.data)
}

/**
 * Get delegate user list
 */
function getDelegateList () {
  return axios.get(url, {
    params: {
      cmd: 'getDelegate'
    }
  }).then(response => response.data)
}

/**
 * Get user list that could be delegate
 */
function getDelegationCandidateList () {
  return axios.get(url, {
    params: {
      cmd: 'getUserListAvalaibleForDelegation'
    }
  }).then(response => response.data)
}

/**
 * Get targeted groups for a newsId
 * @param {Number} newsId
 */
function getNewsBroadcastedGroups (newsId) {
  return axios.get(url, {
    params: {
      cmd: 'getBroadcastedGroups',
      blogEntryInfosId: newsId
    }
  }).then(response => response.data)
}

function updateDelegateList (delegateList) {
  return axios.post(url, NeroUtils.URL.params({
    cmd: 'validateDelegate',
    usersToDelegate: JSON.stringify(delegateList)
  }),
  {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  }).then(response => response.data)
}
