import axios from 'axios'
import constants from '@/api/constants'

export {
  search,
  quickSearch,
  getLastSearchQueries,
  getSearchResultDetails,
  addQueryHistory
}

const SEARCH_PATH = '/moteurDeRecherche-portlet.'

function quickSearch (query, start, end) {
  return axios.get(constants.JSON_WS_URL + SEARCH_PATH + 'search/quick-search', {
    params: {
      query: query,
      start: start,
      end: end
    }
  }).then(response => response.data)
}

/**
 * Run search parameterized
 */
function search (query, searchNews, searchMessaging, searchDocs, searchProgression, start, end) {
  return axios.get(constants.JSON_WS_URL + SEARCH_PATH + 'search/advanced-search', {
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

function getLastSearchQueries () {
  return axios.get(constants.JSON_WS_URL + SEARCH_PATH + 'search/get-last-search-queries').then(response => response.data)
}

function getSearchResultDetails (entityId, service) {
  return axios.get(constants.JSON_WS_URL + SEARCH_PATH + 'search/get-search-result-details', {
    params: {
      entityId: entityId,
      service: service
    }
  }).then(response => response.data)
}

function addQueryHistory (query) {
  return axios.get(constants.JSON_WS_URL + SEARCH_PATH + 'search/add-query-history', {
    params: {
      query
    }
  }).then(response => response.data)
}
