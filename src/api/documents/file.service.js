import WeprodeUtils from '@utils/weprode.utils'
import axios from 'axios'

import constants from '@/api/constants'
import { conflicts } from '@/constants/documentsConstants'

export default {
  uploadFile,
  uploadTmpFile,
  renameFile,
  getResource,
  createMindMapFile,
  createGeogebraFile,
  createScratchFile,
  createLoolFile,
  createAudioFile,
  createHtmlFile,
  addLock,
  removeLock,
  getHtmlContent,
  saveHtmlContent,
  removeLoolToken,
  getFileInfos
}

export {
  uploadFile,
  uploadTmpFile,
  renameFile,
  getResource,
  createMindMapFile,
  createGeogebraFile,
  createScratchFile,
  createLoolFile,
  createAudioFile,
  createHtmlFile,
  addLock,
  removeLock,
  getHtmlContent,
  saveHtmlContent,
  removeLoolToken,
  getFileInfos
}

const FILE_PATH = '/document.fileutils'
const WISIWIG_PATH = '/document.wysiwyg'

/**
 * Upload a file in a folder
 * TODO Change backend to accept multiple files in one call
 * ideally, we will pass in argument something like this: parentFolderId, listFolders[], listFiles[]
 * -> it will be more easily to update current loaded tree, and it will allow the creation of empty folder
 */
function uploadFile (folderId, file, mode = conflicts.MODE_NORMAL) {
  if (mode === conflicts.MODE_IGNORE) {
    return new Promise((resolve) => { // doesn't make the request if the call is processed for an ignored file
      resolve({
        success: false,
        error: 'ignored'
      })
    })
  } else {
    const formData = new FormData()
    formData.append('folderId', folderId)
    formData.append('fileName', file.name)
    formData.append('file', file, file.name)
    formData.append('mode', mode)

    return axios.post(
      constants.JSON_WS_URL + FILE_PATH + '/upload-file?',
      formData
    ).then(response => response.data)
  }
}

/**
 * Upload a file in user tmp folder
 */
function uploadTmpFile (file) {
  const formData = new FormData()
  formData.append('fileName', file.name)
  formData.append('file', file, file.name)

  return axios.post(
    constants.JSON_WS_URL + FILE_PATH + '/upload-tmp-file?',
    formData
  ).then(response => response.data)
}

/**
 * Create HTML file
 */
function createAudioFile (folderId, name, audioFile) {
  const formData = new FormData()
  formData.append('folderId', folderId)
  formData.append('name', name)
  formData.append('file', audioFile)

  return axios.post(constants.JSON_WS_URL + FILE_PATH + '/create-audio-file',
    formData
  ).then(response => response.data)
}

/**
 * Rename a file
 */
function renameFile (fileId, fileName) {
  return axios.post(constants.JSON_WS_URL + FILE_PATH + '/rename-file',
    WeprodeUtils.params({
      fileId,
      fileName
    })
  ).then(response => response.data)
}

/**
 * Create MindMap file
 */
function createMindMapFile (folderId, name) {
  return axios.post(constants.JSON_WS_URL + FILE_PATH + '/create-mindmap-file',
    WeprodeUtils.params({
      folderId,
      name
    })
  ).then(response => response.data)
}

/**
 * Create Geogebra file
 */
function createGeogebraFile (folderId, name) {
  return axios.post(constants.JSON_WS_URL + FILE_PATH + '/create-geogebra-file',
    WeprodeUtils.params({
      folderId,
      name
    })
  ).then(response => response.data)
}

/**
 * Create Scratch file
 */
function createScratchFile (folderId, name) {
  return axios.post(constants.JSON_WS_URL + FILE_PATH + '/create-scratch-file',
    WeprodeUtils.params({
      folderId,
      name
    })
  ).then(response => response.data)
}

/**
 * Create Lool file
 */
function createLoolFile (folderId, name, type) {
  return axios.post(constants.JSON_WS_URL + FILE_PATH + '/create-lool-file',
    WeprodeUtils.params({
      folderId,
      name,
      type
    })
  ).then(response => response.data)
}

/**
 * Create HTML file
 */
function createHtmlFile (folderId, name) {
  return axios.post(constants.JSON_WS_URL + FILE_PATH + '/create-html-file',
    WeprodeUtils.params({
      folderId,
      name
    })
  ).then(response => response.data)
}

/**
 * Get HTML content
 */
function getHtmlContent (fileVersionId) {
  return axios.get(constants.JSON_WS_URL + WISIWIG_PATH + '/get-html-content', {
    params: {
      fileVersionId
    }
  }).then(response => response.data)
}

/**
 * Save HTML content
 */
function saveHtmlContent (fileVersionId, content, majorVersion) {
  return axios.post(constants.JSON_WS_URL + WISIWIG_PATH + '/save-html-content',
    WeprodeUtils.params({
      fileVersionId,
      content,
      majorVersion
    })
  ).then(response => response.data)
}

/**
 * Lock file to prevent multiple edition
 */
function addLock (fileId) {
  return axios.post(constants.JSON_WS_URL + FILE_PATH + '/add-lock',
    WeprodeUtils.params({
      fileId
    })
  ).then(response => response.data)
}

/**
 * Remove lock for targeted file
 */
function removeLock (fileId) {
  return axios.delete(constants.JSON_WS_URL + FILE_PATH + '/remove-lock', {
    params: {
      fileId
    }
  }).then(response => response.data)
}

/**
 * Get the url to see the resource
 */
function getResource (fileId, versionId, readOnly) {
  return axios.get(constants.JSON_WS_URL + FILE_PATH + '/get-resource', {
    params: {
      fileId,
      versionId,
      readOnly
    }
  }).then(response => response.data)
}

/**
 * Get the url to see the resource
 */
function removeLoolToken (token) {
  return axios.delete(constants.JSON_WS_URL + FILE_PATH + '/remove-lool-token', WeprodeUtils.params({
    token
  })).then(response => response.data)
}

function getFileInfos (fileId) {
  return axios.get(constants.JSON_WS_URL + FILE_PATH + '/get-file-infos', {
    params: {
      fileId
    }
  }).then(response => response.data)
}
