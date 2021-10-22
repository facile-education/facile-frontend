import axios from 'axios'
import constants from '@/api/constants'
import { getCookie } from '@utils/browser.util'

export default {
  createFolder,
  renameEntity,
  deleteEntities
}

const EDIT_PATH = '/documents.edit'

/**
 * Create a folder with the specified name
 */
function createFolder (parentFolderId, name) {
  return axios.get(constants.JSON_WS_URL + EDIT_PATH + '/create-folder', {
    params: {
      p_auth: getCookie('pauth'),
      parentFolderId: parentFolderId,
      name: name
    }
  }).then(response => response.data)
}

/**
 * Update entity with a new name
 */
function renameEntity (entity, name) {
  const listRecToRename = []
  listRecToRename.push({ id: entity.id, newName: name, type: entity.type })

  return axios.get(constants.JSON_WS_URL + EDIT_PATH + '/rename', {
    params: {
      p_auth: getCookie('pauth'),
      recordsList: JSON.stringify(listRecToRename)
    }
  }).then(response => response.data)
}

/**
 * Delete definitely the specified entities from the document library (and return a list of the failed entities if some failed)
 */
function deleteEntities (folderIdArray, fileIdArray) {
  return axios.get(constants.JSON_WS_URL + EDIT_PATH + '/delete-documents', {
    params: {
      p_auth: getCookie('pauth'),
      folderIdArray: JSON.stringify(folderIdArray),
      fileIdArray: JSON.stringify(fileIdArray)
    }
  }).then(response => response.data)
}
