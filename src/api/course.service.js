import axios from 'axios'
import PentilaUtils from 'pentila-utils'

import constants from '@/api/constants'

export {
  getCourses,
  getCourseContent,
  getSessionDetails,
  savePrivateNotes,
  addSessionContent,
  updateSessionContent,
  deleteSessionContent,
  getSessionContents,
  getSessionPreview,
  getSessionStudents,
  addBlock,
  addFileBlock,
  updateBlock,
  deleteBlock
}

const COURSE_PREFIX = '/course.'
const COURSE_PATH = COURSE_PREFIX + 'course/'
const SESSION_CONTENT_PATH = COURSE_PREFIX + 'sessioncontent/'
const CONTENT_BLOCK_PATH = COURSE_PREFIX + 'contentblock/'

function getCourses (userId) {
  return axios.get(constants.JSON_WS_URL + COURSE_PATH + 'get-user-courses', {
    params: {
      userId
    }
  }).then(response => response.data)
}

function getCourseContent (courseId, minDate, maxDate) {
  return axios.get(constants.JSON_WS_URL + COURSE_PATH + 'get-course-content', {
    params: {
      courseId,
      minDate,
      maxDate
    }
  }).then(response => response.data)
}

function getSessionDetails (sessionId) {
  return axios.get(constants.JSON_WS_URL + COURSE_PATH + 'get-session-details', {
    params: {
      sessionId
    }
  }).then(response => response.data)
}

function savePrivateNotes (sessionId, notes) {
  return axios.post(constants.JSON_WS_URL + COURSE_PATH + 'save-private-notes', PentilaUtils.URL.params({
    sessionId,
    notes
  })).then(response => response.data)
}

function addSessionContent (courseId, sessionId, title, blocks, publicationDate, isDraft) {
  return axios.post(constants.JSON_WS_URL + SESSION_CONTENT_PATH + 'add-session-content', PentilaUtils.URL.params({
    courseId,
    sessionId,
    title,
    blocks,
    publicationDate,
    isDraft
  })).then(response => response.data)
}

function updateSessionContent (sessionId, title, blocks, publicationDate, isDraft) {
  return axios.post(constants.JSON_WS_URL + SESSION_CONTENT_PATH + 'update-session-content', PentilaUtils.URL.params({
    sessionId,
    title,
    blocks,
    publicationDate,
    isDraft
  })).then(response => response.data)
}

function deleteSessionContent (sessionId) {
  return axios.delete(constants.JSON_WS_URL + SESSION_CONTENT_PATH + 'delete-session-content', {
    params: {
      sessionId
    }
  }).then(response => response.data)
}

function getSessionContents (sessionId) {
  return axios.get(constants.JSON_WS_URL + SESSION_CONTENT_PATH + 'get-session-contents', {
    params: {
      sessionId
    }
  }).then(response => response.data)
}

function getSessionPreview (sessionId) {
  return axios.get(constants.JSON_WS_URL + SESSION_CONTENT_PATH + 'get-session-preview', {
    params: {
      sessionId
    }
  }).then(response => response.data)
}

function addBlock (itemId, blockType, blockName, blockValue, fileEntryId) {
  return axios.post(constants.JSON_WS_URL + CONTENT_BLOCK_PATH + 'add-block', PentilaUtils.URL.params({
    itemId,
    blockType,
    blockName,
    blockValue,
    fileEntryId
  })).then(response => response.data)
}

function addFileBlock (itemId, blockType, blockName, fileName, file) {
  return axios.post(constants.JSON_WS_URL + CONTENT_BLOCK_PATH + 'add-file-block', PentilaUtils.URL.params({
    itemId,
    blockType,
    blockName,
    fileName,
    file
  })).then(response => response.data)
}

function updateBlock (blockId, blockName, blockValue, order) {
  return axios.post(constants.JSON_WS_URL + CONTENT_BLOCK_PATH + 'update-block', PentilaUtils.URL.params({
    blockId,
    blockName,
    blockValue,
    order
  })).then(response => response.data)
}

function deleteBlock (blockId) {
  return axios.del(constants.JSON_WS_URL + SESSION_CONTENT_PATH + 'delete-block', {
    params: {
      blockId
    }
  }).then(response => response.data)
}

function getSessionStudents (courseId) {
  return axios.get(constants.JSON_WS_URL + COURSE_PATH + 'get-course-students', {
    params: {
      courseId
    }
  }).then(response => response.data)
}
