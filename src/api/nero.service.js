import axios from 'axios'

import constants from '@/api/constants'

export default {
  getUserMenu
}

const SIDE_MENU_PATH = '/menu.sidemenu'

/**
 * Get user service menu
 */
function getUserMenu () {
  return axios.get(constants.JSON_WS_URL + SIDE_MENU_PATH + '/get-side-menu', {
    params: {}
  }).then(response => response.data)
}
