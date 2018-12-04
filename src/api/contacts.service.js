import axios from 'axios'
import constants from './constants'

export default {
  getContactList
}

function getContactList (listId, categoryName, searchValue,
  start, limit, predicate, reverse, agentsOnly) {
  const url = constants.BASE_URL + '/api/get_contact_list'
  return axios.get(url, {
    params: {
      cmd: 'getListContacts',
      listId: listId,
      categoryName: categoryName,
      searchValue: searchValue,
      start: start,
      limit: limit,
      predicate: predicate,
      reverse: reverse,
      agentsOnly: agentsOnly
    }
  }).then(response => response.data)
}
