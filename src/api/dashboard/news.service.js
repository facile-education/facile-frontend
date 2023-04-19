import axios from 'axios'
import constants from '@/api/constants'
import PentilaUtils from 'pentila-utils'

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
  removeNewsDelegate
}

const NEWS_PATH = '/news-portlet.'
const NEWS_CTX = 'news/'
const DELEGATION_PATH = '/actualites-portlet.'
const DELEGATION_CTX = 'blogentrydelegate/'

function addNews (title, content, isSchoolNews, isImportant, imageId, publicationDate, population, attachFiles) {
  return axios.post(constants.JSON_WS_URL + NEWS_PATH + NEWS_CTX + 'add-news',
    PentilaUtils.URL.params({
      title,
      content,
      isSchoolNews,
      isImportant,
      imageId,
      publicationDate: publicationDate.format('YYYY-MM-DD HH:mm'),
      population: JSON.stringify(population),
      attachFiles: JSON.stringify(attachFiles)
    })).then(response => response.data)
}

function editNews (newsId, title, content, isImportant, imageId, publicationDate, population, attachFiles, markAsUnreadForAll) {
  return axios.post(constants.JSON_WS_URL + NEWS_PATH + NEWS_CTX + 'edit-news',
    PentilaUtils.URL.params({
      newsId,
      title,
      content,
      isImportant,
      imageId,
      publicationDate: publicationDate.format('YYYY-MM-DD HH:mm'),
      population: JSON.stringify(population),
      attachFiles: JSON.stringify(attachFiles),
      markAsUnreadForAll
    })).then(response => response.data)
}

function getSchoolNews (maxDate, nbNews, importantOnly, unreadOnly) {
  return axios.get(constants.JSON_WS_URL + NEWS_PATH + NEWS_CTX + 'get-school-news', {
    params: {
      maxDate: maxDate.format('YYYY-MM-DD HH:mm:sss'),
      nbNews,
      importantOnly,
      unreadOnly
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
  return axios.get(constants.JSON_WS_URL + NEWS_PATH + NEWS_CTX + 'delete-news', {
    params: {
      newsId
    }
  }).then(response => response.data)
}

function addNewsDelegate (userId, schoolId) {
  return axios.get(constants.JSON_WS_URL + DELEGATION_PATH + DELEGATION_CTX + '/add-news-delegate', {
    params: {
      userId: userId,
      schoolId: schoolId
    }
  }).then(response => response.data)
}

function removeNewsDelegate (userId, schoolId) {
  return axios.get(constants.JSON_WS_URL + DELEGATION_PATH + DELEGATION_CTX + '/remove-news-delegate', {
    params: {
      userId: userId,
      schoolId: schoolId
    }
  }).then(response => response.data)
}
