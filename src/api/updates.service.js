import axios from 'axios'
import constants from './constants'

export default {
  getVersionList
}

const url = constants.VERSION_MANAGER_URL

function getVersionList () {
  return axios.get(url, {
    params: {
      cmd: 'getVersionList'
    }
  }).then(response => response.data)
}
