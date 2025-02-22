import WeprodeUtils from '@utils/weprode.utils'
import axios from 'axios'

import constants, { DATE_EXCHANGE_FORMAT } from '@/api/constants'

export {
  addNews,
  editNews,
  getSchoolNews,
  setNewsRead,
  getGroupNewsBroadcastGroups,
  getSchoolNewsBroadcastGroups,
  getNewsDetails,
  deleteNews,
  addNewsDelegate,
  removeNewsDelegate,
  getUnreadGroupNews
}

const NEWS_PATH = '/news.'
const NEWS_CTX = 'news/'
const DELEGATION_PATH = '/user.'
const DELEGATION_CTX = 'newsadmin/'

function addNews (title, content, isSchoolNews, isImportant, imageId, publicationDate, population, attachFiles) {
  return axios.post(constants.JSON_WS_URL + NEWS_PATH + NEWS_CTX + 'add-news',
    WeprodeUtils.params({
      title,
      content,
      isSchoolNews,
      isImportant,
      imageId,
      publicationDate: publicationDate.format(DATE_EXCHANGE_FORMAT),
      population: JSON.stringify(population),
      attachFiles: JSON.stringify(attachFiles)
    })).then(response => response.data)
}

function editNews (newsId, title, content, isImportant, imageId, publicationDate, population, attachFiles, markAsUnreadForAll) {
  return axios.post(constants.JSON_WS_URL + NEWS_PATH + NEWS_CTX + 'edit-news',
    WeprodeUtils.params({
      newsId,
      title,
      content,
      isImportant,
      imageId,
      publicationDate: publicationDate.format(DATE_EXCHANGE_FORMAT),
      population: JSON.stringify(population),
      attachFiles: JSON.stringify(attachFiles),
      markAsUnreadForAll
    })).then(response => response.data)
}

function getSchoolNews (currentDate, startIndex, nbNews, importantOnly, unreadOnly) {
  return axios.get(constants.JSON_WS_URL + NEWS_PATH + NEWS_CTX + 'get-school-news', {
    params: {
      currentDateString: currentDate.format(DATE_EXCHANGE_FORMAT),
      startIndex,
      nbNews,
      importantOnly,
      unreadOnly
    }
  }).then(response => response.data)
}

function getUnreadGroupNews (groupId, maxDate, nbResults) {
  return axios.get(constants.JSON_WS_URL + NEWS_PATH + NEWS_CTX + 'get-unread-group-news', {
    params: {
      groupId,
      maxDate,
      nbResults
    }
  }).then(response => response.data)
}

function setNewsRead (newsId) {
  return axios.get(constants.JSON_WS_URL + NEWS_PATH + NEWS_CTX + 'set-news-read', {
    params: {
      newsId
    }
  }).then(response => response.data)
}

function getGroupNewsBroadcastGroups () {
  return axios.get(constants.JSON_WS_URL + NEWS_PATH + NEWS_CTX + 'get-group-news-broadcast-groups', {
    params: {
    }
  }).then(response => response.data)
}

function getSchoolNewsBroadcastGroups () {
  return axios.get(constants.JSON_WS_URL + NEWS_PATH + NEWS_CTX + 'get-school-news-broadcast-groups', {
    params: {
    }
  }).then(response => response.data)
}

function getNewsDetails (newsId) {
  return axios.get(constants.JSON_WS_URL + NEWS_PATH + NEWS_CTX + 'get-news-details', {
    params: {
      newsId
    }
  }).then(response => response.data)
}

function deleteNews (newsId) {
  return axios.delete(constants.JSON_WS_URL + NEWS_PATH + NEWS_CTX + 'delete-news', {
    params: {
      newsId
    }
  }).then(response => response.data)
}

function addNewsDelegate (userId, schoolId) {
  return axios.get(constants.JSON_WS_URL + DELEGATION_PATH + DELEGATION_CTX + '/add-news-delegate', {
    params: {
      userId,
      schoolId
    }
  }).then(response => response.data)
}

function removeNewsDelegate (userId, schoolId) {
  return axios.delete(constants.JSON_WS_URL + DELEGATION_PATH + DELEGATION_CTX + '/remove-news-delegate', {
    params: {
      userId,
      schoolId
    }
  }).then(response => response.data)
}
