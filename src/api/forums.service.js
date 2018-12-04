import axios from 'axios'
import constants from './constants'

export default {
  getForumList,
  getEntryList
}

// JSP : listForum.jsp
function getForumList () {
  const url = constants.BASE_URL + '/api/get_forum_list'
  return axios.get(url, {
    params: {
      cmd: 'getForumList'
    }
  }).then(response => response.data)
}

// JSP listEntity.jsp -> params ? folderId ?
function getEntryList () {
  const url = constants.BASE_URL + '/api/get_forum_entry_list'
  return axios.get(url, {
    params: {
      cmd: 'getEntryList'
    }
  }).then(response => response.data)
}
