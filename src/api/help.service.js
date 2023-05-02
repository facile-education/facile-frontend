import axios from 'axios'
import constants from '@/api/constants'
import PentilaUtils from 'pentila-utils'

export {
  getHelpMenu,
  getHelpItem,
  saveLink,
  deleteLink,
  saveRelation,
  deleteRelation,
  saveCategory,
  deleteCategory,
  saveItem,
  saveHelpItemPosition,
  deleteItem
}

const HELP_PATH = '/help.'

/**
 * Get user details for preferences modal window
 */
function getHelpMenu (search) {
  return axios.get(constants.JSON_WS_URL + HELP_PATH + 'helpcategory/get-help-menu', {
    params: {
      search: search
    }
  }).then(response => response.data)
}

function getHelpItem (itemId) {
  return axios.get(constants.JSON_WS_URL + HELP_PATH + 'helpitem/get-help-item', {
    params: {
      itemId: itemId
    }
  }).then(response => response.data)
}

/// ADMIN WebServices

function saveLink (itemId, linkLabel, linkUrl) {
  return axios.post(constants.JSON_WS_URL + HELP_PATH + 'helplink/save-link', PentilaUtils.URL.params({
    link: JSON.stringify({ itemId: itemId, linkName: linkLabel, linkUrl: linkUrl })
  })).then(response => response.data)
}

function deleteLink (linkId) {
  return axios.get(constants.JSON_WS_URL + HELP_PATH + 'helplink/delete-link', {
    params: {
      linkId: linkId
    }
  }).then(response => response.data)
}

function saveRelation (itemId, relatedItemId) {
  return axios.post(constants.JSON_WS_URL + HELP_PATH + 'helprelation/save-relation', PentilaUtils.URL.params({
    relation: JSON.stringify({ itemId: itemId, relatedItemId: relatedItemId })
  })).then(response => response.data)
}

function deleteRelation (relationId) {
  return axios.get(constants.JSON_WS_URL + HELP_PATH + 'helprelation/delete-relation', {
    params: {
      relationId: relationId
    }
  }).then(response => response.data)
}

function saveCategory (categoryName, serviceId) {
  return axios.post(constants.JSON_WS_URL + HELP_PATH + 'helpcategory/save-category', PentilaUtils.URL.params({
    categoryName: categoryName,
    serviceId: serviceId
  })).then(response => response.data)
}

function deleteCategory (categoryId) {
  return axios.get(constants.JSON_WS_URL + HELP_PATH + 'helpcategory/delete-category', {
    params: {
      categoryId: categoryId
    }
  }).then(response => response.data)
}

function saveItem (categoryId, item) {
  return axios.post(constants.JSON_WS_URL + HELP_PATH + 'helpitem/save-help-item', PentilaUtils.URL.params({
    categoryId: categoryId,
    item: JSON.stringify(item)
  })).then(response => response.data)
}

function saveHelpItemPosition (categoryId, item) {
  return axios.post(constants.JSON_WS_URL + HELP_PATH + 'helpitem/save-help-item-position', PentilaUtils.URL.params({
    categoryId: categoryId,
    item: JSON.stringify(item)
  })).then(response => response.data)
}

function deleteItem (itemId) {
  return axios.post(constants.JSON_WS_URL + HELP_PATH + 'helpitem/delete-item', PentilaUtils.URL.params({
    itemId: itemId
  })).then(response => response.data)
}
