import axios from 'axios'
import constants from '@/api/constants'
import PentilaUtils from 'pentila-utils'

export {
  getSchoolNews,
  getBroadcastGroups,
  addNews,
  editNews,
  deleteNews,
  getNewsDetails,
  addNewsDelegate,
  removeNewsDelegate
}

const NEWS_PATH = '/actualites-portlet.'
const NEWS_CTX = 'news/'
const DELEGATION_CTX = 'blogentrydelegate/'

function getSchoolNews (startLimit, endLimit) {
  return axios.get(constants.JSON_WS_URL + NEWS_PATH + NEWS_CTX + 'get-school-news', {
    params: {
      startLimit: startLimit,
      endLimit: endLimit
    }
  }).then(response => response.data)
}

function getBroadcastGroups (filter, isSchoolNews) {
  return axios.get(constants.JSON_WS_URL + NEWS_PATH + NEWS_CTX + 'get-broadcast-groups', {
    params: {
      filter: filter,
      isSchoolNews: isSchoolNews
    }
  }).then(response => response.data)
}

function addNews (title, content, isSchoolNews, isHighPriority, imageId, releaseDateStr, expirationDateStr, populationStr, attachFilesStr) {
  return axios.post(constants.JSON_WS_URL + NEWS_PATH + NEWS_CTX + 'add-news',
    PentilaUtils.URL.params({
      title,
      content,
      isSchoolNews,
      isHighPriority,
      imageId,
      releaseDateStr,
      expirationDateStr,
      populationStr,
      attachFilesStr
    })).then(response => response.data)
}

function editNews (blogEntryInfoId, title, content, isSchoolNews, isHighPriority, imageId, releaseDateStr, expirationDateStr, populationStr, existingAttachFilesStr, newAttachFilesStr) {
  return axios.post(constants.JSON_WS_URL + NEWS_PATH + NEWS_CTX + 'edit-news',
    PentilaUtils.URL.params({
      blogEntryInfoId,
      title,
      content,
      isSchoolNews,
      isHighPriority,
      imageId,
      releaseDateStr,
      expirationDateStr,
      populationStr,
      existingAttachFilesStr,
      newAttachFilesStr
    })).then(response => response.data)
}

function deleteNews (blogEntryId) {
  return axios.get(constants.JSON_WS_URL + NEWS_PATH + NEWS_CTX + 'delete-news', {
    params: {
      blogEntryId: blogEntryId
    }
  }).then(response => response.data)
}

function getNewsDetails (blogEntryInfosId) {
  return axios.get(constants.JSON_WS_URL + NEWS_PATH + NEWS_CTX + 'get-news-details', {
    params: {
      blogEntryInfosId: blogEntryInfosId
    }
  }).then(response => response.data)
}

function addNewsDelegate (userId, schoolId) {
  return axios.get(constants.JSON_WS_URL + NEWS_PATH + DELEGATION_CTX + '/add-news-delegate', {
    params: {
      userId: userId,
      schoolId: schoolId
    }
  }).then(response => response.data)
}

function removeNewsDelegate (userId, schoolId) {
  return axios.get(constants.JSON_WS_URL + NEWS_PATH + DELEGATION_CTX + '/remove-news-delegate', {
    params: {
      userId: userId,
      schoolId: schoolId
    }
  }).then(response => response.data)
}
