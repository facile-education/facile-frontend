import axios from 'axios'
import constants from '@/api/constants'
import { conflicts } from '@/constants/documentsConstants'
import { getCookie } from '@utils/browser.util'
import PentilaUtils from 'pentila-utils'

export default {
  uploadFile,
  renameFile,
  getResource,
  createMindMapFile,
  createGeogebraFile,
  createScratchFile,
  createLoolFile,
  createAudioFile,
  createHtmlFile,
  getHtmlContent,
  saveHtmlContent,
  removeLoolToken
}

const FILE_PATH = '/documents-portlet.fileutil'
const WISIWIG_PATH = '/documents-portlet.wisiwig'

/**
 * Upload a file in a folder
 * TODO Change backend to accept multiple files in one call
 * ideally, we will pass in argument something like this: parentFolderId, listFolders[], listFiles[]
 * -> it will be more easily to update current loaded tree, and it will allow the creation of empty folder
 */
function uploadFile (folderId, file, mode = conflicts.MODE_NORMAL) {
  const formData = new FormData()
  formData.append('p_auth', getCookie('pauth'))
  formData.append('folderId', folderId)
  formData.append('fileName', file.name)
  formData.append('file', file, file.name)
  formData.append('mode', mode)

  return axios.post(
    constants.JSON_WS_URL + FILE_PATH + '/upload-file?',
    formData
  ).then(response => response.data)
}

/**
 * Create HTML file
 */
function createAudioFile (folderId, name, audioFile) {
  const formData = new FormData()
  formData.append('p_auth', getCookie('pauth'))
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
    PentilaUtils.URL.params({
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
    PentilaUtils.URL.params({
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
    PentilaUtils.URL.params({
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
    PentilaUtils.URL.params({
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
    PentilaUtils.URL.params({
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
    PentilaUtils.URL.params({
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
      p_auth: getCookie('pauth'),
      fileVersionId: fileVersionId
    }
  }).then(response => response.data)
}

/**
 * Save HTML content
 */
function saveHtmlContent (fileVersionId, content, majorVersion) {
  return axios.post(constants.JSON_WS_URL + WISIWIG_PATH + '/save-html-content',
    PentilaUtils.URL.params({
      fileVersionId: fileVersionId,
      content: content,
      majorVersion: majorVersion
    })
  ).then(response => response.data)
}

/**
 * Get the url to see the resource
 */
function getResource (fileId, versionId, readOnly) {
  return axios.get(constants.JSON_WS_URL + FILE_PATH + '/get-resource', {
    params: {
      p_auth: getCookie('pauth'),
      fileId: fileId,
      versionId: versionId,
      readOnly: readOnly
    }
  }).then(response => response.data)
}

/**
 * Get the url to see the resource
 */
function removeLoolToken (token) {
  return axios.post(constants.JSON_WS_URL + FILE_PATH + '/remove-lool-token', PentilaUtils.URL.params({
    token: token
  })).then(response => response.data)
}
