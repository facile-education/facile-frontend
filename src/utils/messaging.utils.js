import store from '@store/index.js'

import messageService from '@/api/messaging/message.service'
import messagingConstants, {
  messagingDraftFolderType,
  messagingInboxFolderType,
  messagingSentFolderType,
  messagingTrashFolderType
} from '@/constants/messagingConstants'
import i18n from '@/i18n'

const MessagingUtils = {
  getMessagingFolderName (messagingFolder) {
    switch (messagingFolder.type) {
      case messagingInboxFolderType:
        return i18n.global.t('Messaging.inbox')
      case messagingDraftFolderType:
        return i18n.global.t('Messaging.draft')
      case messagingSentFolderType:
        return i18n.global.t('Messaging.sent')
      case messagingTrashFolderType:
        return i18n.global.t('Messaging.trash')
      default:
        return messagingFolder.folderName
    }
  },

  formatContact (contact) {
    if (contact.type === messagingConstants.CONTACT_TYPE_USER) {
      contact.id = contact.userId
    }
  },

  formatContacts (contactList) {
    contactList.forEach(contact => {
      this.formatContact(contact)
    })
  },

  selectBetween (shiftSelectedThread) {
    const sortedThreads = store.state.messaging.threads
    const threadIdArray = sortedThreads.map(thread => thread.threadId)

    let lastSelectedThreadIndex = -1
    let threadIndex = -1

    // If no previous thread selected, then behave as simple click
    if (store.state.messaging.lastSelectedThread !== undefined) {
      for (let i = 0; i < threadIdArray.length && (lastSelectedThreadIndex === -1 || threadIndex === -1); i++) {
        if (threadIdArray[i] === store.state.messaging.lastSelectedThread.threadId) {
          lastSelectedThreadIndex = i
        }
        if (threadIdArray[i] === shiftSelectedThread.threadId) {
          threadIndex = i
        }
      }
    }
    if (lastSelectedThreadIndex === -1 || threadIndex === -1) {
      return []
    } else if (lastSelectedThreadIndex < threadIndex) {
      return sortedThreads.slice(lastSelectedThreadIndex, threadIndex + 1)
    } else {
      return sortedThreads.slice(threadIndex, lastSelectedThreadIndex + 1)
    }
  },
  refresh () {
    store.dispatch('messaging/selectFolder', store.state.messaging.currentFolder)
  },
  newMessage (recipientList = []) {
    const createMessageParameters = { isNew: true, isReply: false, isReplyAll: false, isForward: false, isDraft: false, draftMessageId: 0, recipientList }
    store.dispatch('messaging/openCreateMessageModal', createMessageParameters)
  },
  reply () {
    const createMessageParameters = { isNew: false, isReply: true, isReplyAll: false, isForward: false, isDraft: false, draftMessageId: 0 }
    store.dispatch('messaging/openCreateMessageModal', createMessageParameters)
  },
  replyAll () {
    const createMessageParameters = { isNew: false, isReply: false, isReplyAll: true, isForward: false, isDraft: false, draftMessageId: 0 }
    store.dispatch('messaging/openCreateMessageModal', createMessageParameters)
  },
  forward () {
    const createMessageParameters = { isNew: false, isReply: false, isReplyAll: false, isForward: true, isDraft: false, draftMessageId: 0 }
    store.dispatch('messaging/openCreateMessageModal', createMessageParameters)
  },
  editDraft (draftMessageId) {
    const createMessageParameters = { isNew: false, isReply: false, isReplyAll: false, isForward: false, isDraft: true, draftMessageId }
    store.dispatch('messaging/openCreateMessageModal', createMessageParameters)
  },
  deleteSelectedThreads () {
    return new Promise((resolve) => {
      const messageIdsToDelete = []
      let nbUnreadMessages = 0

      for (const thread of store.state.messaging.selectedThreads) {
        for (const message of thread.messages) {
          messageIdsToDelete.push(message.messageId)
          if (message.isNew) {
            nbUnreadMessages++
          }
        }
      }
      store.dispatch('currentActions/addAction', { name: 'deleteMessages' })
      messageService.deleteMessages(messageIdsToDelete).then((data) => {
        store.dispatch('currentActions/removeAction', { name: 'deleteMessages' })
        if (data.success) {
          store.dispatch('messaging/deleteSelectedThreads')
          store.dispatch('menu/updateMessagingNotification', nbUnreadMessages)
          store.dispatch('messaging/updateNbUnread', store.state.messaging.currentFolder.folderId)
          resolve()
        }
      }, (err) => {
        console.error(err)
        this.dispatch('currentActions/removeAction', { name: 'deleteMessages' })
      })
    })
  },
  deleteSelectedMessage () {
    const selectedMessage = store.state.messaging.selectedMessages[0]
    const parentThreadId = selectedMessage.threadId
    const messageIdsToDelete = [selectedMessage.messageId]
    store.dispatch('currentActions/addAction', { name: 'deleteMessages' })
    messageService.deleteMessages(messageIdsToDelete).then((data) => {
      store.dispatch('currentActions/removeAction', { name: 'deleteMessages' })
      if (data.success) {
        store.dispatch('messaging/deleteMessages', messageIdsToDelete)
        // if (this.currentThreads.map(item => item.threadId).indexOf(selectedThreadBeforeDeleteMessage.threadId) !== -1) { // If the new thread list still contains selectedThread
        this.reloadThread({ threadId: parentThreadId })
      }
    }, (err) => {
      console.error(err)
      this.dispatch('currentActions/removeAction', { name: 'deleteMessages' })
    })
  },
  reloadThread (thread) {
    store.dispatch('messaging/setSelectedMessages', [])

    messageService.getThreadMessages(thread.threadId, store.state.messaging.currentFolder.folderId).then((data) => {
      if (data.success) {
        store.dispatch('messaging/setCurrentThreadMessages', data.messages)
      }
    })
  },
  isThreadSelected (thread) {
    for (const selectedThread of store.state.messaging.selectedThreads) {
      if (selectedThread.threadId === thread.threadId) {
        return true
      }
    }
    return false
  },
  isMessageSelected (message) {
    for (const selectedMessage of store.state.messaging.selectedMessages) {
      if (selectedMessage.messageId === message.messageId) {
        return true
      }
    }
    return false
  },
  selectMessage (message) {
    // Mark as read if unread
    if (message.isNew) {
      this.markMessagesAsReadUnread([message.messageId], true)
    }
    store.dispatch('messaging/setSelectedMessages', [message])
  },
  async selectThread (thread, messageIdToSelect) {
    return new Promise((resolve) => {
      let foundMainMessage = false
      // Mark as read main message if unread
      for (const message of thread.messages) {
        if (message.messageId === thread.mainMessageId) {
          foundMainMessage = true
          if (message.isNew) {
            this.markMessagesAsReadUnread([thread.mainMessageId], true).then(() => { // Wait message is mark as read before re-getting the thread
              store.dispatch('messaging/setLastSelectedThread', thread)
              store.dispatch('messaging/setSelectedThreads', [thread])
              resolve()

              this.getThreadMessages(thread, store.state.messaging.currentFolder.folderId, messageIdToSelect)
            }, (err) => {
              console.error(err)
              store.dispatch('popups/pushPopup', { message: i18n.global.t('Popup.error'), type: 'error' })
            })
          } else {
            store.dispatch('messaging/setLastSelectedThread', thread)
            store.dispatch('messaging/setSelectedThreads', [thread])
            resolve()

            this.getThreadMessages(thread, store.state.messaging.currentFolder.folderId, messageIdToSelect)
          }
        }
      }
      if (!foundMainMessage) {
        console.error('cannot find main thread message (to mark it as unread for example)')
        store.dispatch('popups/pushPopup', { message: i18n.global.t('Popup.error'), type: 'error' })
      }
    })
  },
  getThreadMessages (thread, folderId, messageIdToSelect) {
    messageService.getThreadMessages(thread.threadId, folderId).then((data) => {
      if (data.success) {
        store.dispatch('messaging/setCurrentThreadMessages', data.messages)

        if (messageIdToSelect) {
          const index = data.messages.map(message => message.messageId).indexOf(parseInt(messageIdToSelect))
          if (index !== -1) {
            this.selectMessage(data.messages[index])
          } else {
            console.error('cannot select messageId ' + messageIdToSelect + ' in ', data.messages)
          }
        }
      }
    })
  },
  markMessagesAsReadUnread (messageIds, markAsRead) {
    return new Promise((resolve, reject) => {
      messageService.setMessageReadStatus(messageIds, markAsRead).then((data) => {
        if (data.success) {
          if (markAsRead) {
            store.dispatch('messaging/markMessagesAsRead', messageIds)
            store.dispatch('menu/updateMessagingNotification', messageIds.length)
          } else {
            store.dispatch('messaging/markMessagesAsUnread', messageIds)
            store.dispatch('menu/updateMessagingNotification', -messageIds.length)
          }
          store.dispatch('messaging/updateNbUnread', store.state.messaging.currentFolder.folderId)
          resolve()
        } else {
          console.error('Error while updating message status', messageIds, markAsRead)
          reject(new Error('Error while updating message status'))
        }
      }, (err) => {
        console.error(err)
        reject(err)
      })
    })
  },
  isDraftFolder () {
    return store.state.messaging.currentFolder.type === messagingConstants.messagingDraftFolderType
  },
  isSentFolder () {
    return store.state.messaging.currentFolder.type === messagingConstants.messagingSentFolderType
  },
  shortRecipientList (message) {
    const nbRecipients = message.recipients.length
    if (nbRecipients === 0) {
      return i18n.global.t('Messaging.noRecipient')
    }
    let shortRecipients = 'À: ' + message.recipients[0].text
    if (nbRecipients === 2) {
      shortRecipients += ', ' + message.recipients[1].text
    } else if (nbRecipients > 2) {
      const nbOthers = message.nbRecipients - 1
      shortRecipients += ' et ' + nbOthers + ' autres'
    }
    return shortRecipients
  },
  getThreadLastMessage (thread) {
    for (const message of thread.messages) {
      if (thread.mainMessageId === message.messageId) {
        return message
      }
    }
  },
  getFolderFromId (folderList, folderId) {
    for (const folder of folderList) {
      if (folder.folderId === folderId) {
        return folder
      } else {
        const foundSubFolder = this.getFolderFromId(folder.subFolders, folderId)
        if (foundSubFolder !== undefined) {
          return foundSubFolder
        }
      }
    }
    return undefined
  },
  getNextNotSelectedThread (threadList, selectedThreads) {
    let nextNotSelectedThreadIndex = -1
    for (let i = threadList.length - 1; i >= 0; i--) { // Start from the end of the array
      if (selectedThreads.map(thread => thread.threadId).indexOf(threadList[i].threadId) === -1) {
        nextNotSelectedThreadIndex = i
      } else {
        return threadList[nextNotSelectedThreadIndex]
      }
    }
  }
}

export default MessagingUtils
