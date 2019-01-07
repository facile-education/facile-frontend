import axios from 'axios'
import constants from './constants'

export default {
  getNewsList,
  addNews,
  editNews,
  deleteNews
}
const url = constants.DASHBOARD_URL

function getNewsList (isHeadMaster, startLimit, endLimit) {
  return axios.get(url, {
    params: {
      cmd: 'getAllNews',
      startLimit: startLimit,
      endLimit: endLimit,
      isWelcomePage: true, // TODO needed ?
      getNewsGroup: !isHeadMaster,
      getNewsHM: isHeadMaster,
      getNewsHighPriority: isHeadMaster
    }
  }).then(response => response.data)
}

// TODO
function addNews (widget) {
  return axios.post(url, {
    cmd: 'saveWidget',
    widget: JSON.stringify(widget)
  }).then(response => response.data)
}

// TODO
function editNews (widget) {
  return axios.post(url, {
    cmd: 'saveWidget',
    widget: JSON.stringify(widget)
  }).then(response => response.data)
}

// TODO
function deleteNews (widget) {
  return axios.post(url, {
    cmd: 'saveWidget',
    widget: JSON.stringify(widget)
  }).then(response => response.data)
}
