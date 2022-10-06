import axios from 'axios'
import constants from '@/api/constants'
import { getCookie } from '@/utils/browser.util'

export default {
  getThreads,
  getThreadMessages,
  getNbNewMessages,
  searchMessages,
  getMessageRecipients,
  getMessageAnswerForwardInfos,
  setMessageReadStatus,
  sendMessage,
  saveDraft,
  getMessageFollowUpInfos,
  moveMessages,
  deleteMessages,
  getUsersCompletion
}

const MESSAGING_PATH = '/messaging-portlet.message'

/**
 * Get user threads with pagination
 */
function getThreads (folderId, start, nbDisplayed, unreadOnly) {
  return axios.get(constants.JSON_WS_URL + MESSAGING_PATH + '/get-threads', {
    params: {
      p_auth: getCookie('pauth'),
      folderId: folderId,
      fromDate: start,
      nbDisplayed: nbDisplayed,
      unreadOnly: unreadOnly
    }
  }).then(response => response.data)
}

/**
 * Get message full details
 */
function getThreadMessages (threadId, folderId) {
  return axios.get(constants.JSON_WS_URL + MESSAGING_PATH + '/get-thread-messages', {
    params: {
      p_auth: getCookie('pauth'),
      threadId: threadId,
      folderId: folderId
    }
  }).then(response => response.data)
}

/**
 * Get number of new messges
 */
function getNbNewMessages () {
  return axios.get(constants.JSON_WS_URL + MESSAGING_PATH + '/get-nb-new-messages', {
    params: {
      p_auth: getCookie('pauth')
    }
  }).then(response => response.data)
}

/**
 * Search messages with query string
 */
function searchMessages (folderId, search, startIndex, nbResults, unreadOnly) {
  return axios.get(constants.JSON_WS_URL + MESSAGING_PATH + '/search-messages', {
    params: {
      p_auth: getCookie('pauth'),
      folderId: folderId,
      search: search,
      startIndex: startIndex,
      nbResults: nbResults,
      unreadOnly: unreadOnly
    }
  }).then(response => response.data)
}

/**
 * Return the whole list of message receivers
 */
function getMessageRecipients (messageId) {
  return axios.get(constants.JSON_WS_URL + MESSAGING_PATH + '/get-message-recipients', {
    params: {
      p_auth: getCookie('pauth'),
      messageId: messageId
    }
  }).then(response => response.data)
}

/**
 * Get the sender, receivers in case of reply or forward
 */
function getMessageAnswerForwardInfos (messageId, isReply, isReplyAll, isForward, isDraft) {
  return axios.get(constants.JSON_WS_URL + MESSAGING_PATH + '/get-message-answer-forward-infos', {
    params: {
      p_auth: getCookie('pauth'),
      messageId: messageId,
      isReply: isReply,
      isReplyAll: isReplyAll,
      isForward: isForward,
      isDraft: isDraft
    }
  }).then(response => response.data)
}

/**
 * Set a message as read or unread
 */
function setMessageReadStatus (messageIds, isRead) {
  const formData = new FormData()
  formData.append('p_auth', getCookie('pauth'))
  formData.append('messageIds', JSON.stringify(messageIds))
  formData.append('isRead', isRead)

  return axios.post(constants.JSON_WS_URL + MESSAGING_PATH + '/set-message-read-status',
    formData
  ).then(response => response.data)
}

/**
 * Sends a message
 */
function sendMessage (recipients, subject, content, attachedFiles, draftMessageId, originMessageId, isReply, isForward, isSupport) {
  const formData = new FormData()
  formData.append('p_auth', getCookie('pauth'))
  formData.append('recipients', JSON.stringify(recipients))
  formData.append('subject', subject)
  formData.append('content', content)
  formData.append('attachedFiles', JSON.stringify(attachedFiles))
  formData.append('draftMessageId', draftMessageId)
  formData.append('originMessageId', originMessageId)
  formData.append('isReply', isReply)
  formData.append('isForward', isForward)
  formData.append('isSupport', isSupport)

  return axios.post(constants.JSON_WS_URL + MESSAGING_PATH + '/send-message?',
    formData
  ).then(response => response.data)
}

/**
 * Saves a draft
 */
function saveDraft (recipients, subject, content, attachedFiles, draftMessageId, isSupport) {
  const formData = new FormData()
  formData.append('p_auth', getCookie('pauth'))
  formData.append('recipients', JSON.stringify(recipients))
  formData.append('subject', subject)
  formData.append('content', content)
  formData.append('attachedFiles', JSON.stringify(attachedFiles))
  formData.append('draftMessageId', draftMessageId)
  formData.append('isSupport', isSupport)
  return axios.post(constants.JSON_WS_URL + MESSAGING_PATH + '/save-draft',
    formData
  ).then(response => response.data)
}

/**
 * Returns the list of recipients for a message, with the one having read and the ones having not yet read
 */
function getMessageFollowUpInfos (messageId) {
  return axios.get(constants.JSON_WS_URL + MESSAGING_PATH + '/get-message-follow-up-infos', {
    params: {
      p_auth: getCookie('pauth'),
      messageId: messageId
    }
  }).then(response => response.data)
}

/**
 * Moves a list of messages to a given folder
 */
function moveMessages (folderId, messageIds) {
  const formData = new FormData()
  formData.append('p_auth', getCookie('pauth'))
  formData.append('folderId', folderId)
  formData.append('messageIds', JSON.stringify(messageIds))

  return axios.post(constants.JSON_WS_URL + MESSAGING_PATH + '/move-messages',
    formData
  ).then(response => response.data)
}

/**
 * Delete a list of messages
 */
function deleteMessages (messageIds) {
  const formData = new FormData()
  formData.append('p_auth', getCookie('pauth'))
  formData.append('messageIds', JSON.stringify(messageIds))

  return axios.post(constants.JSON_WS_URL + MESSAGING_PATH + '/delete-messages',
    formData
  ).then(response => response.data)
}

/**
 * Get auto-completion
 */
function getUsersCompletion (query) {
  return axios.get(constants.JSON_WS_URL + MESSAGING_PATH + '/get-users-completion', {
    params: {
      p_auth: getCookie('pauth'),
      query: query
    }
  }).then(response => response.data)
}
