import store from '@store/index.js'
import _ from 'lodash'

import messageService from '@/api/messaging/message.service'
import messagingConstants from '@/constants/messagingConstants'
import i18n from '@/i18n'

const MessagingUtils = {
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
    // lastSelectedThread in the store indicated the source index
    let lastSelectedThreadIndex = -1
    let threadIndex = -1
    const sortedThreads = _.orderBy(store.state.messaging.threads, 'lastSendDate', 'desc')

    for (let i = 0; i < sortedThreads.length; ++i) {
      if (store.state.messaging.lastSelectedThread && sortedThreads[i].threadId === store.state.messaging.lastSelectedThread.threadId) { lastSelectedThreadIndex = i }
      if (sortedThreads[i].threadId === shiftSelectedThread.threadId) { threadIndex = i }
    }
    if (lastSelectedThreadIndex === -1 || threadIndex === -1) {
      return []
    } else {
      if (lastSelectedThreadIndex < threadIndex) {
        return sortedThreads.slice(lastSelectedThreadIndex, threadIndex + 1)
      } else {
        return sortedThreads.slice(threadIndex, lastSelectedThreadIndex + 1)
      }
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
    const messageIdsToDelete = [store.state.messaging.selectedMessages[0].messageId]
    store.dispatch('currentActions/addAction', { name: 'deleteMessages' })
    messageService.deleteMessages(messageIdsToDelete).then((data) => {
      store.dispatch('currentActions/removeAction', { name: 'deleteMessages' })
      if (data.success) {
        store.dispatch('messaging/deleteMessages', messageIdsToDelete)
        const selectedThreadBeforeDeleteMessage = store.state.messaging.selectedThreads[0]
        // if (this.currentThreads.map(item => item.threadId).indexOf(selectedThreadBeforeDeleteMessage.threadId) !== -1) { // If the new thread list still contains selectedThread
        this.reloadThread(selectedThreadBeforeDeleteMessage)
        this.refresh()
        store.dispatch('messaging/setSelectedThreads', [selectedThreadBeforeDeleteMessage])
      }
    }, (err) => {
      console.error(err)
      this.dispatch('currentActions/removeAction', { name: 'deleteMessages' })
    })
  },
  reloadThread (thread) {
    store.dispatch('messaging/setLastSelectedThread', thread)
    store.dispatch('messaging/setSelectedThreads', [thread])
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
  selectThread (thread, messageIdToSelect) {
    store.dispatch('messaging/setLastSelectedThread', thread)
    store.dispatch('messaging/setSelectedThreads', [thread])

    messageService.getThreadMessages(thread.threadId, store.state.messaging.currentFolder.folderId).then((data) => {
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
      }
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
    for (let i = 0; i < folderList.length; i++) {
      const folder = folderList[i]

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
  }
}

export default MessagingUtils
