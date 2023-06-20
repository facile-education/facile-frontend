import axios from 'axios'

import constants from '@/api/constants'

export default {
  createFolder,
  renameEntity
}

const EDIT_PATH = '/document.folderutils'

/**
 * Create a folder with the specified name
 */
function createFolder (parentFolderId, name) {
  return axios.get(constants.JSON_WS_URL + EDIT_PATH + '/create-folder', {
    params: {
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
      recordsList: JSON.stringify(listRecToRename)
    }
  }).then(response => response.data)
}
