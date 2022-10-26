import axios from 'axios'
import constants from '@/api/constants'

export default {
  getUserMenu
}

function getUserMenu () {
  const url = constants.MENU_MANAGER_URL
  return axios.get(url, {
    params: {
      cmd: 'getUserMenu'
    }
  }).then(response => response.data)
}
