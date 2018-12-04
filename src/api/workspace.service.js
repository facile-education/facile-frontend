import axios from 'axios'
import constants from './constants'

export default {
  getFolderContent,
  getGroupList
}

// TODO folderId + command
function getFolderContent () {
  const url = constants.BASE_URL + '/api/get_folder_content'
  return axios.get(url, {
    params: {
      cmd: 'getFolderContent',
      folderId: -1
    }
  }).then(response => response.data)
}

// TODO folderId? + command
function getGroupList () {
  const url = constants.BASE_URL + '/api/get_workspace_group_tree'
  return axios.get(url, {
    params: {
      cmd: 'getFolderContent'
    }
  }).then(response => response.data)
}
