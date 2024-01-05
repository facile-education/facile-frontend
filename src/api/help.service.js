import WeprodeUtils from '@utils/weprode.utils'
import axios from 'axios'

import constants from '@/api/constants'

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
      search
    }
  }).then(response => response.data)
}

function getHelpItem (itemId) {
  return axios.get(constants.JSON_WS_URL + HELP_PATH + 'helpitem/get-help-item', {
    params: {
      itemId
    }
  }).then(response => response.data)
}

/// ADMIN WebServices

function saveLink (itemId, linkLabel, linkUrl) {
  return axios.post(constants.JSON_WS_URL + HELP_PATH + 'helplink/save-link', WeprodeUtils.params({
    link: JSON.stringify({ itemId, linkName: linkLabel, linkUrl })
  })).then(response => response.data)
}

function deleteLink (linkId) {
  return axios.delete(constants.JSON_WS_URL + HELP_PATH + 'helplink/delete-link', {
    params: {
      linkId
    }
  }).then(response => response.data)
}

function saveRelation (itemId, relatedItemId) {
  return axios.post(constants.JSON_WS_URL + HELP_PATH + 'helprelation/save-relation', WeprodeUtils.params({
    relation: JSON.stringify({ itemId, relatedItemId })
  })).then(response => response.data)
}

function deleteRelation (relationId) {
  return axios.delete(constants.JSON_WS_URL + HELP_PATH + 'helprelation/delete-relation', {
    params: {
      relationId
    }
  }).then(response => response.data)
}

function saveCategory (categoryName, serviceId) {
  return axios.post(constants.JSON_WS_URL + HELP_PATH + 'helpcategory/save-category', WeprodeUtils.params({
    categoryName,
    serviceId
  })).then(response => response.data)
}

function deleteCategory (categoryId) {
  return axios.delete(constants.JSON_WS_URL + HELP_PATH + 'helpcategory/delete-category', {
    params: {
      categoryId
    }
  }).then(response => response.data)
}

function saveItem (categoryId, item) {
  return axios.post(constants.JSON_WS_URL + HELP_PATH + 'helpitem/save-help-item', WeprodeUtils.params({
    categoryId,
    item: JSON.stringify(item)
  })).then(response => response.data)
}

function saveHelpItemPosition (categoryId, item) {
  return axios.post(constants.JSON_WS_URL + HELP_PATH + 'helpitem/save-help-item-position', WeprodeUtils.params({
    categoryId,
    item: JSON.stringify(item)
  })).then(response => response.data)
}

function deleteItem (itemId) {
  return axios.delete(constants.JSON_WS_URL + HELP_PATH + 'helpitem/delete-item', WeprodeUtils.params({
    itemId
  })).then(response => response.data)
}
