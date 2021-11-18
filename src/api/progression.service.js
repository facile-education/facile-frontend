import axios from 'axios'
import constants from '@/api/constants'
import PentilaUtils from 'pentila-utils'

export {
  addProgression,
  deleteProgression,
  getProgressionContent,
  getProgressionList,
  updateProgression,
  getFolderContent,
  addFolder,
  deleteFolder,
  updateFolder,
  getItemContents,
  getItemPreview,
  addItem,
  addItemContent,
  addItemFileContent,
  deleteItem,
  deleteItemContent,
  updateItem,
  updateItemContent,
  addSessionAssignment,
  addHomeworkAssignment,
  deleteAssignment
}

const PROGRESSION_PATH = '/progression-portlet.'
const PROGRESSION_CTX = 'progression/'
const FOLDER_CTX = 'progressionfolder/'
const ITEM_CTX = 'progressionitem/'
const ASSIGNMENT_CTX = 'progressionitemassignment/'

// Progression object
function addProgression ({ name, description, subjectId, volee, color }) {
  return axios.post(constants.JSON_WS_URL + PROGRESSION_PATH + PROGRESSION_CTX + 'add-progression',
    PentilaUtils.URL.params({
      name,
      description,
      subjectId,
      volee,
      color
    })).then(response => response.data)
}

function deleteProgression (progressionId) {
  return axios.get(constants.JSON_WS_URL + PROGRESSION_PATH + PROGRESSION_CTX + 'delete-progression', {
    params: {
      progressionId
    }
  }).then(response => response.data)
}

function getProgressionContent (progressionId) {
  return axios.get(constants.JSON_WS_URL + PROGRESSION_PATH + PROGRESSION_CTX + 'get-progression-content', {
    params: {
      progressionId
    }
  }).then(response => response.data)
}

function getProgressionList () {
  return axios.get(constants.JSON_WS_URL + PROGRESSION_PATH + PROGRESSION_CTX + 'get-progression-list', {
    params: {}
  }).then(response => response.data)
}

function updateProgression ({ progressionId, name, description, subjectId, volee, color }) {
  return axios.post(constants.JSON_WS_URL + PROGRESSION_PATH + PROGRESSION_CTX + 'update-progression',
    PentilaUtils.URL.params({
      progressionId,
      name,
      description,
      subjectId,
      volee,
      color
    })).then(response => response.data)
}

// ProgressionFolder object
function getFolderContent (folderId) {
  return axios.get(constants.JSON_WS_URL + PROGRESSION_PATH + FOLDER_CTX + 'get-folder-content', {
    params: {
      folderId
    }
  }).then(response => response.data)
}

function addFolder (progressionId, parentFolderId) {
  return axios.post(constants.JSON_WS_URL + PROGRESSION_PATH + FOLDER_CTX + 'add-folder',
    PentilaUtils.URL.params({
      progressionId,
      parentFolderId
    })).then(response => response.data)
}

function deleteFolder (folderId) {
  return axios.get(constants.JSON_WS_URL + PROGRESSION_PATH + FOLDER_CTX + 'delete-folder', {
    params: {
      folderId
    }
  }).then(response => response.data)
}

function updateFolder ({ folderId, parentId, name, order }) {
  return axios.post(constants.JSON_WS_URL + PROGRESSION_PATH + FOLDER_CTX + 'update-folder',
    PentilaUtils.URL.params({
      folderId,
      parentFolderId: parentId,
      name,
      order
    })).then(response => response.data)
}

// ProgressionItem object
function getItemContents (itemId) {
  return axios.get(constants.JSON_WS_URL + PROGRESSION_PATH + ITEM_CTX + 'get-item-contents', {
    params: {
      itemId
    }
  }).then(response => response.data)
}

function getItemPreview (itemId) {
  return axios.get(constants.JSON_WS_URL + PROGRESSION_PATH + ITEM_CTX + 'get-item-preview', {
    params: {
      itemId
    }
  }).then(response => response.data)
}

function addItem (progressionId, folderId, name, isHomework, type, content, order) {
  return axios.post(constants.JSON_WS_URL + PROGRESSION_PATH + ITEM_CTX + 'add-item',
    PentilaUtils.URL.params({
      progressionId,
      folderId,
      name,
      isHomework,
      type,
      content,
      order
    })).then(response => response.data)
}

function addItemContent (itemId, contentType, contentName, contentValue, fileEntryId, isToBeCompleted) {
  return axios.post(constants.JSON_WS_URL + PROGRESSION_PATH + ITEM_CTX + 'add-item-content',
    PentilaUtils.URL.params({
      itemId,
      contentType,
      contentName,
      contentValue,
      fileEntryId,
      isToBeCompleted
    })).then(response => response.data)
}

function addItemFileContent (itemId, contentType, formData) {
  formData.append('itemId', itemId)
  formData.append('contentType', contentType)

  return axios.post(constants.JSON_WS_URL + PROGRESSION_PATH + ITEM_CTX + 'add-item-content',
    formData
  ).then(response => response.data)
}

function deleteItem (itemId) {
  return axios.get(constants.JSON_WS_URL + PROGRESSION_PATH + ITEM_CTX + 'delete-item', {
    params: {
      itemId
    }
  }).then(response => response.data)
}

function deleteItemContent (contentId) {
  return axios.get(constants.JSON_WS_URL + PROGRESSION_PATH + ITEM_CTX + 'delete-item-content', {
    params: {
      contentId
    }
  }).then(response => response.data)
}

function updateItem (itemId, folderId, name, type, duration, order) {
  return axios.post(constants.JSON_WS_URL + PROGRESSION_PATH + ITEM_CTX + 'update-item',
    PentilaUtils.URL.params({
      itemId,
      folderId,
      name,
      type,
      duration,
      order
    })).then(response => response.data)
}

function updateItemContent (contentId, contentName, contentValue, order) {
  return axios.post(constants.JSON_WS_URL + PROGRESSION_PATH + ITEM_CTX + 'update-item-content',
    PentilaUtils.URL.params({
      contentId,
      contentName,
      contentValue,
      order
    })).then(response => response.data)
}

// ProgressionItemAssignment object
function addSessionAssignment (itemId, sessionId) {
  return axios.post(constants.JSON_WS_URL + PROGRESSION_PATH + ASSIGNMENT_CTX + 'add-session-assignment',
    PentilaUtils.URL.params({
      itemId,
      sessionId
    })).then(response => response.data)
}

function addHomeworkAssignment (itemId, homeworks) {
  return axios.post(constants.JSON_WS_URL + PROGRESSION_PATH + ASSIGNMENT_CTX + 'add-homework-assignment',
    PentilaUtils.URL.params({
      itemId: itemId,
      homeworks: JSON.stringify(homeworks)
    })).then(response => response.data)
}

function deleteAssignment (itemId, sessionId) {
  return axios.get(constants.JSON_WS_URL + PROGRESSION_PATH + ASSIGNMENT_CTX + 'delete-assignment', {
    params: {
      itemId,
      sessionId
    }
  }).then(response => response.data)
}
