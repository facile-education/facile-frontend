import axios from 'axios'
import constants from '@/api/constants'

export default {
  getThreads,
  getThreadMessages,
  getMessageThread,
  getNbMessages,
  searchMessages,
  getMessageRecipients,
  getMessageAnswerForwardInfos,
  setMessageReadStatus,
  sendMessage,
  saveDraft,
  moveMessages,
  deleteMessages,
  getUsersCompletion
}

const MESSAGING_PATH = '/messaging.message'

/**
 * Get user threads with pagination
 */
function getThreads (folderId, start, nbDisplayed, unreadOnly) {
  return axios.get(constants.JSON_WS_URL + MESSAGING_PATH + '/get-threads', {
    params: {
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
      threadId: threadId,
      folderId: folderId
    }
  }).then(response => response.data)
}

function getMessageThread (messageId) {
  return axios.get(constants.JSON_WS_URL + MESSAGING_PATH + '/get-message-thread', {
    params: {
      messageId: messageId
    }
  }).then(response => response.data)
}

/**
 * Get number of both messages and unread messages
 */
function getNbMessages (folderId) {
  return axios.get(constants.JSON_WS_URL + MESSAGING_PATH + '/get-nb-messages', {
    params: {
      folderId
    }
  }).then(response => response.data)
}

/**
 * Search messages with query string
 */
function searchMessages (folderId, search, startIndex, nbResults, unreadOnly) {
  return axios.get(constants.JSON_WS_URL + MESSAGING_PATH + '/search-messages', {
    params: {
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
 * Moves a list of messages to a given folder
 */
function moveMessages (folderId, messageIds) {
  const formData = new FormData()
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
      query: query
    }
  }).then(response => response.data)
}
