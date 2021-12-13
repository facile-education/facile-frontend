import axios from 'axios'
import constants from '@/api/constants'
import { getCookie } from '@utils/browser.util'

export default {
  uploadFile,
  getResource
}

const FILE_PATH = '/documents-portlet.fileutil'

/**
 * Upload a file in a folder
 * TODO Change backend to accept multiple files in one call
 * ideally, we will pass in argument something like this: parentFolderId, listFolders[], listFiles[]
 * -> it will be more easily to update current loaded tree, and it will allow the creation of empty folder
 */
function uploadFile (folderId, file) {
  const formData = new FormData()
  formData.append('p_auth', getCookie('pauth'))
  formData.append('folderId', folderId)
  formData.append('fileName', file.name)
  formData.append('file', file, file.name)

  return axios.post(
    constants.JSON_WS_URL + FILE_PATH + '/upload-file?',
    formData
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
