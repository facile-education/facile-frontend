import messagingService from '@/api/messaging/message.service'
import messagingUtils from '@utils/messaging.utils'
import folderService from '@/api/messaging/folder.service'
import constants from '@/constants/messagingConstants'

export const state = {
  messagingFolders: [],
  currentFolder: {},
  threads: [],
  selectedThreads: [],
  currentThreadMessages: [],
  selectedMessages: [],
  lastSelectedThread: undefined,
  isThreadSelected: true,
  startIndex: 0,
  nbDisplayed: 20,
  unreadOnly: false,
  isParametersModalDisplayed: false,
  isSelectedMessageFromRightPanel: false,
  isMenuPanelDisplayed: false,
  isCreateMessageModalDisplayed: false,
  nbNewMessages: 0,
  search: '',
  createMessageParameters: {},
  draggedThreads: [],
  signature: ''
}

// Defined outside of mutations because of recursion
const doActionInPersonalFolder = (action, folderList, personalFolder, subFolder = undefined) => {
  for (let i = 0; i < folderList.length; ++i) {
    if (folderList[i].folderId === personalFolder.folderId) {
      switch (action) {
        case 'delete':
          folderList.splice(i, 1)
          break
        case 'update': {
          folderList.splice(i, 1, personalFolder)
          break
        }
        case 'addSubFolder': {
          folderList[i].subFolders.splice(0, 0, subFolder)
          break
        }
      }
      break
    } else {
      doActionInPersonalFolder(action, folderList[i].subFolders, personalFolder, subFolder)
    }
  }
}

export const mutations = {
  setMessagingFolders (state, folders) {
    console.log('set messaging folders to ', folders)
    state.messagingFolders = folders
  },
  addPersonalRootFolder (state, folder) {
    state.messagingFolders.push(folder)
  },
  deletePersonalFolder (state, folderToDelete) {
    doActionInPersonalFolder('delete', state.messagingFolders, folderToDelete)
  },
  updatePersonalFolder (state, folderToUpdate) {
    doActionInPersonalFolder('update', state.messagingFolders, folderToUpdate)
  },
  addSubFolder (state, { personalFolder, subFolder }) {
    doActionInPersonalFolder('addSubFolder', state.messagingFolders, personalFolder, subFolder)
  },
  setCurrentFolder (state, folder) {
    state.currentFolder = folder
    state.startIndex = 0
    state.nbDisplayed = 20
  },
  setLastSelectedThread (state, thread) {
    state.lastSelectedThread = thread
  },
  setSelectedThreads (state, threads) {
    state.selectedThreads = threads
  },
  setIsSelectedMessageFromRightPanel (state, payload) {
    state.isSelectedMessageFromRightPanel = payload
  },
  addSelectedThreads (state, threads) {
    for (const thread of threads) {
      if (!state.selectedThreads.includes(thread)) {
        state.selectedThreads = state.selectedThreads.concat(thread)
      }
    }
  },
  removeSelectedThread (state, thread) {
    let i = 0
    let indexToRemove = 0
    for (const selectedThread of state.selectedThreads) {
      if (selectedThread.threadId === thread.threadId) {
        indexToRemove = i
      }
      i++
    }
    state.selectedThreads.splice(indexToRemove, 1)
  },
  setSelectedMessages (state, messages) {
    state.selectedMessages = messages
  },
  addSelectedMessages (state, messages) {
    state.selectedMessages = state.selectedMessages.concat(messages)
  },
  setThreadList (state, threads) {
    state.threads = threads
  },
  setCurrentThreadMessages (state, messages) {
    state.currentThreadMessages = messages
  },
  setCreateMessageModalParameters (state, createMessageParameters) {
    state.createMessageParameters = createMessageParameters
  },
  setParametersModalDisplayed (state, isParametersModalDisplayed) {
    state.isParametersModalDisplayed = isParametersModalDisplayed
  },
  setCreateMessageModalDisplayed (state, isCreateMessageModalDisplayed) {
    state.isCreateMessageModalDisplayed = isCreateMessageModalDisplayed
  },
  setMessageRecipients (state, { messageId, recipients }) {
    const i = state.currentThreadMessages.map(item => item.messageId).indexOf(messageId)
    state.currentThreadMessages[i].recipients = recipients
  },
  setShowMenuPanel (state, payload) {
    state.isMenuPanelDisplayed = payload
  },
  setNbNewMessages (state, nbNewMessages) {
    state.nbNewMessages = nbNewMessages
  },
  markMessagesAsRead (state, messageIds) {
    for (const thread of state.threads) {
      for (const message of thread.messages) {
        if (messageIds.includes(message.messageId)) {
          message.isNew = false
        }
      }
    }
    state.nbNewMessages -= 1
  },
  markMessagesAsUnread (state, unreadMessageIds) {
    for (const thread of state.threads) {
      for (const message of thread.messages) {
        if (unreadMessageIds.includes(message.messageId)) {
          message.isNew = true
        }
      }
    }
    state.nbNewMessages += 1
  },
  addNewMessage (state, newMessage) {
    state.currentThreadMessages.splice(0, 0, newMessage)
    state.selectedMessages = [newMessage]
    state.isThreadSelected = false
  },
  toggleUnreadOnly (state, payload) {
    state.unreadOnly = !state.unreadOnly
  },
  deleteSelectedThreads (state) {
    // Delete the threads in the thread list
    let lastIndex = 0
    for (let i = 0; i < state.selectedThreads.length; ++i) {
      for (let j = 0; j < state.threads.length; ++j) {
        if (state.threads[j].threadId === state.selectedThreads[i].threadId) {
          state.threads.splice(j, 1)
          lastIndex = j
          break
        }
      }
    }
    if (state.threads.length > 0 && state.threads[lastIndex] !== undefined) {
      messagingUtils.selectThread(state.threads[lastIndex])
    } else {
      state.currentThreadMessages = []
    }
  },
  deleteMessages (state, messageIds) {
    // Delete the messages in thread list
    for (let i = 0; i < messageIds.length; ++i) {
      const messageIdToDelete = messageIds[i]

      // Loop over all threads
      for (let j = 0; j < state.threads.length; ++j) {
        for (let k = 0; k < state.threads[j].messages.length; ++k) {
          if (state.threads[j].messages.messageId === messageIdToDelete) {
            state.threads[j].messages.splice(k, 1)
            break
          }
        }
      }
    }
  },
  setDraggedThreads (state, threads) {
    state.draggedThreads = threads
  },
  setSignature (state, signature) {
    state.signature = signature
  }
}

export const actions = {
  showMenuPanel ({ commit }) {
    commit('setShowMenuPanel', true)
  },
  hideMenuPanel ({ commit }) {
    commit('setShowMenuPanel', false)
  },
  setIsSelectedMessageFromRightPanel ({ commit }, payload) {
    commit('setIsSelectedMessageFromRightPanel', payload)
  },
  setCurrentThreadMessages ({ commit }, messages) {
    commit('setCurrentThreadMessages', messages)
  },
  selectFolder ({ commit, state }, folder) {
    if (folder.folderId !== state.currentFolder.folderId) {
      commit('setCurrentFolder', folder)
      commit('setSelectedThreads', [])
      commit('setCurrentThreadMessages', [])
      commit('setSelectedMessages', [])
    }
    this.dispatch('messaging/getThreads', folder.folderId)
  },
  loadMessagingFolders ({ commit }) {
    folderService.getAllUserFolders().then((data) => {
      if (data.success) {
        commit('setMessagingFolders', data.folders)
        const inboxFolder = data.folders.find(folder => folder.type === constants.messagingInboxFolderType)
        this.dispatch('messaging/selectFolder', inboxFolder)
      } else {
        console.error('Error while getting folders')
      }
    })
  },
  setLastSelectedThread ({ commit }, thread) {
    commit('setLastSelectedThread', thread)
  },
  setSelectedThreads ({ commit }, threads) {
    commit('setSelectedThreads', threads)
    commit('setSelectedMessages', [])
  },
  addSelectedThreads ({ commit }, threads) {
    commit('addSelectedThreads', threads)
    commit('setSelectedMessages', [])
  },
  removeSelectedThread ({ commit }, thread) {
    commit('removeSelectedThread', thread)
  },
  setThreadList ({ commit }, threads) {
    commit('setThreadList', threads)
  },
  setSelectedMessages ({ commit }, messages) {
    commit('setSelectedMessages', messages)
  },
  addSelectedMessages ({ commit }, messages) {
    commit('addSelectedMessages', messages)
  },
  getMessageRecipients ({ commit }, messageId) {
    messagingService.getMessageRecipients(messageId).then((data) => {
      if (data.success) {
        commit('setMessageRecipients', { messageId, recipients: data.recipients })
      }
    })
  },
  addPersonalRootFolder ({ commit }, folder) {
    commit('addPersonalRootFolder', folder)
  },
  addSubFolder ({ commit }, { personalFolder, subFolder }) {
    commit('addSubFolder', { personalFolder, subFolder })
  },
  updatePersonalFolder ({ commit }, folder) {
    commit('updatePersonalFolder', folder)
  },
  deletePersonalFolder ({ commit }, folder) {
    commit('deletePersonalFolder', folder)
  },
  getThreads ({ commit }, folderId) {
    return new Promise((resolve) => {
      commit('setThreadList', []) // Force trigger component re-render (to fold unfolded threads)
      this.dispatch('currentActions/addAction', { name: 'loadThreads' })
      messagingService.getThreads(folderId, state.startIndex, state.nbDisplayed, state.unreadOnly).then((data) => {
        this.dispatch('currentActions/removeAction', { name: 'loadThreads' })

        if (data.success) {
          commit('setThreadList', data.threads)
          resolve({ threads: data.threads })
        }
      })
      messagingUtils.updateNbNewMessages()
    })
  },
  openCreateMessageModal ({ commit }, createMessageParameters) {
    commit('setCreateMessageModalParameters', createMessageParameters)
    commit('setCreateMessageModalDisplayed', true)
  },
  closeCreateMessageModal ({ commit }) {
    commit('setCreateMessageModalDisplayed', false)
  },
  openParametersModal ({ commit }) {
    commit('setParametersModalDisplayed', true)
  },
  closeParametersModal ({ commit }) {
    commit('setParametersModalDisplayed', false)
  },
  setNbNewMessages ({ commit }, nbNewMessages) {
    commit('setNbNewMessages', nbNewMessages)
  },
  markMessagesAsRead ({ commit }, messages) {
    commit('markMessagesAsRead', messages)
  },
  markMessagesAsUnread ({ commit }, messages) {
    commit('markMessagesAsUnread', messages)
  },
  addNewMessage ({ commit }, newMessage) {
    commit('addNewMessage', newMessage)
  },
  toggleUnreadOnly ({ commit }) {
    commit('toggleUnreadOnly')
  },
  deleteMessages ({ commit }, messageIds) {
    commit('deleteMessages', messageIds)
  },
  deleteSelectedThreads ({ commit }) {
    commit('deleteSelectedThreads')
  },
  setDraggedThreads ({ commit }, threads) {
    commit('setDraggedThreads', threads)
  },
  setSignature ({ commit }, signature) {
    commit('setSignature', signature)
  }

}
