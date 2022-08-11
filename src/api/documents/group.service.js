import axios from 'axios'
import constants from '@/api/constants'
import { getCookie } from '@utils/browser.util'

export default {
  getGroupEntities,
  getGroupFolderBreadcrumb
}

const GROUP_PATH = '/documents-portlet.groups'

/**
 * Create a zip containing the folderContent and download it
 */
function getGroupEntities (node) {
  return axios.get(constants.JSON_WS_URL + GROUP_PATH + '/get-group-entities', {
    params: {
      p_auth: getCookie('pauth'),
      nodePath: node
    }
  }).then(response => response.data)
}

function getGroupFolderBreadcrumb (node) {
  return axios.get(constants.JSON_WS_URL + GROUP_PATH + '/get-group-folder-path', {
    params: {
      p_auth: getCookie('pauth'),
      nodePath: node
    }
  }).then(response => response.data)
}
