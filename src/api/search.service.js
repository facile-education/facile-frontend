import axios from 'axios'
import constants from '@/api/constants'

export {
  search
}

const PREF_PATH = '/moteurDeRecherche-portlet.'

/**
 * Run search parameterized
 */
function search (query, searchNews, searchMessaging, searchDocs, searchProgression, start, end) {
  return axios.get(constants.JSON_WS_URL + PREF_PATH + 'search/search', {
    params: {
      query,
      searchNews,
      searchMessaging,
      searchDocs,
      searchProgression,
      start,
      end
    }
  }).then(response => response.data)
}
