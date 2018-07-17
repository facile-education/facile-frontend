import axios from 'axios'
import constants from './constants'

export default {
  getFolderContent
}

function getFolderContent () {
  const url = constants.BASE_URL + '/api/get_folder_content'
  return axios.get(url, {
    params: {
      cmd: 'getFolderContent',
      folderId: -1
    }
  }).then(response => response.data)
}
