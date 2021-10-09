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
  addItem,
  addItemContent,
  deleteItem,
  deleteItemContent,
  updateItem,
  updateItemContent,
  addAssignment,
  deleteAssignment,
  updateAssignment,
  addAttachedFile,
  addAudioRecording,
  deleteAttachedFile
}

const PROGRESSION_PATH = '/progression-portlet.'
const PROGRESSION_CTX = 'progression/'
const FOLDER_CTX = 'progressionfolder/'
const ITEM_CTX = 'progressionitem/'
const ASSIGNMENT_CTX = 'progressionitemassignment/'
const ATTACHED_FILE_CTX = 'progressionitemattachedfile/'

// Progression object
// TODO image ?
function addProgression ({ name, description, subjectId, volee, image }) {
  return axios.post(constants.JSON_WS_URL + PROGRESSION_PATH + PROGRESSION_CTX + 'add-progression',
    PentilaUtils.URL.params({
      name,
      description,
      subjectId,
      volee,
      image
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

function updateProgression (progressionId, name, description, subjectId, volee, image) {
  return axios.post(constants.JSON_WS_URL + PROGRESSION_PATH + PROGRESSION_CTX + 'update-progression',
    PentilaUtils.URL.params({
      progressionId,
      name,
      description,
      subjectId,
      volee,
      image
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

function updateFolder (folderId, parentFolderId, name, order) {
  return axios.post(constants.JSON_WS_URL + PROGRESSION_PATH + FOLDER_CTX + 'update-folder',
    PentilaUtils.URL.params({
      folderId,
      parentFolderId,
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

function addItemContent (itemId, contentType, contentName, contentValue, fileName, fileEntryId, isToBeCompleted) {
  return axios.post(constants.JSON_WS_URL + PROGRESSION_PATH + ITEM_CTX + 'add-item-content',
    PentilaUtils.URL.params({
      itemId,
      contentType,
      contentName,
      contentValue,
      fileName,
      fileEntryId,
      isToBeCompleted
    })).then(response => response.data)
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

function updateItem ({ itemId, folderId, name, isHomework, type, content, order }) {
  return axios.post(constants.JSON_WS_URL + PROGRESSION_PATH + ITEM_CTX + 'update-item',
    PentilaUtils.URL.params({
      itemId,
      folderId,
      name,
      isHomework,
      type,
      content,
      order
    })).then(response => response.data)
}

function updateItemContent ({ itemId, contentId, name, contentType, order }) {
  return axios.post(constants.JSON_WS_URL + PROGRESSION_PATH + ITEM_CTX + 'update-item',
    PentilaUtils.URL.params({
      itemId,
      contentId,
      name,
      contentType,
      order
    })).then(response => response.data)
}

// ProgressionItemAssignment object
function addAssignment (itemId, sessionId, groupId) {
  return axios.post(constants.JSON_WS_URL + PROGRESSION_PATH + ASSIGNMENT_CTX + 'add-assignment',
    PentilaUtils.URL.params({
      itemId,
      sessionId,
      groupId
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

function updateAssignment (itemId, sessionId) {
  return axios.post(constants.JSON_WS_URL + PROGRESSION_PATH + ASSIGNMENT_CTX + 'update-assignment',
    PentilaUtils.URL.params({
      itemId,
      sessionId
    })).then(response => response.data)
}

// ProgressionItemAttachedFile object
function addAttachedFile (itemId, fileName, file, isToBeCompleted) {
  return axios.post(constants.JSON_WS_URL + PROGRESSION_PATH + ATTACHED_FILE_CTX + 'add-attachment',
    PentilaUtils.URL.params({
      itemId,
      fileName,
      file,
      isToBeCompleted
    })).then(response => response.data)
}

function addAudioRecording (itemId, fileName, file) {
  return axios.post(constants.JSON_WS_URL + PROGRESSION_PATH + ATTACHED_FILE_CTX + 'add-attachment',
    PentilaUtils.URL.params({
      itemId,
      fileName,
      file
    })).then(response => response.data)
}

function deleteAttachedFile (attachmentId) {
  return axios.get(constants.JSON_WS_URL + PROGRESSION_PATH + ATTACHED_FILE_CTX + 'delete-attachment', {
    params: {
      attachmentId
    }
  }).then(response => response.data)
}
