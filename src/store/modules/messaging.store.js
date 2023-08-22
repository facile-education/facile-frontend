import messagingUtils from '@utils/messaging.utils'
// import constants from '@/constants/appConstants'
import _ from 'lodash'

import folderService from '@/api/messaging/folder.service'
import messageService from '@/api/messaging/message.service'
import messagingConstants from '@/constants/messagingConstants'

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
  unreadOnly: false,
  isParametersModalDisplayed: false,
  isSelectedMessageFromRightPanel: false,
  isMenuPanelDisplayed: false,
  isMobileDetailsPanelDisplayed: false,
  isMultiSelectionActive: false,
  isCreateMessageModalDisplayed: false,
  loadingThreadsError: undefined,
  nbMessages: 0,
  search: '',
  createMessageParameters: {},
  draggedThreads: [],
  signature: '',
  displayMessageFromRouting: false,
  isThreadListEnded: false
}

// Defined outside of mutations because of recursion
const doActionInPersonalFolder = (store, action, folderList, state, personalFolder, payload = undefined) => {
  for (let i = 0; i < folderList.length; ++i) {
    if (folderList[i].folderId === personalFolder.folderId) {
      switch (action) {
        case 'delete':
          folderList.splice(i, 1)
          // Update currentFolder Object if concern
          if (personalFolder.folderId === state.currentFolder.folderId) {
            store.dispatch('messaging/selectFolder', state.messagingFolders[0])
          }
          break
        case 'update':
          folderList.splice(i, 1, personalFolder)
          // Update currentFolder Object if concern
          if (personalFolder.folderId === state.currentFolder.folderId) {
            state.currentFolder = personalFolder
          }
          break
        case 'addSubFolder':
          folderList[i].subFolders.splice(0, 0, payload)
          break
        case 'setNbUnread':
          folderList[i].nbUnread = payload
          break
        case 'setNbMessages':
          folderList[i].nbMessages = payload
          break
      }
      break
    } else {
      doActionInPersonalFolder(store, action, folderList[i].subFolders, state, personalFolder, payload)
    }
  }
}

export const mutations = {
  setDisplayMessageFromRouting (state, payload) {
    state.displayMessageFromRouting = payload
  },
  setLoadingThreadsError (state, payload) {
    state.loadingThreadsError = payload
  },
  setMessagingFolders (state, folders) {
    state.messagingFolders = folders
  },
  addPersonalRootFolder (state, folder) {
    state.messagingFolders.push(folder)
  },
  deletePersonalFolder (state, folderToDelete) {
    doActionInPersonalFolder(this, 'delete', state.messagingFolders, state, folderToDelete)
  },
  updatePersonalFolder (state, folderToUpdate) {
    doActionInPersonalFolder(this, 'update', state.messagingFolders, state, folderToUpdate)
  },
  addSubFolder (state, { personalFolder, subFolder }) {
    doActionInPersonalFolder(this, 'addSubFolder', state.messagingFolders, state, personalFolder, subFolder)
  },
  updateStartIndex (state, payload) {
    state.startIndex = payload
  },
  setCurrentFolder (state, folder) {
    state.currentFolder = folder
    state.startIndex = 0
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
    if (messages.length === 1) {
      messages[0].isNew = false
    }
  },
  addSelectedMessages (state, messages) {
    state.selectedMessages = state.selectedMessages.concat(messages)
  },
  setThreadList (state, threads) {
    state.threads = threads
  },
  addToThreadList (state, nextThreads) {
    state.threads = [...state.threads, ...nextThreads]
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
  toggleSideMenuPanel (state) {
    state.isMenuPanelDisplayed = !state.isMenuPanelDisplayed
  },
  setDetailPanelDisplayed (state, payload) {
    state.isMobileDetailsPanelDisplayed = payload
  },
  toggleDetailPanelDisplayed (state) {
    state.isMobileDetailsPanelDisplayed = !state.isMobileDetailsPanelDisplayed
  },
  setMultiSelection (state, payload) {
    if (!payload) { // Unselect threads if when closing the multi-selection mode
      state.selectedThreads = []
    }
    state.isMultiSelectionActive = payload
  },
  toggleMultiSelection (state) {
    if (state.isMultiSelectionActive) { // Unselect threads if when closing the multi-selection mode
      state.selectedThreads = []
    }
    state.isMultiSelectionActive = !state.isMultiSelectionActive
  },
  setNbUnread (state, payload) {
    doActionInPersonalFolder(this, 'setNbUnread', state.messagingFolders, state, { folderId: payload.folderId }, payload.nbUnread)
  },
  setNbMessages (state, { folderId, nbMessages }) {
    doActionInPersonalFolder(this, 'setNbMessages', state.messagingFolders, state, { folderId: folderId }, nbMessages)
  },
  markMessagesAsRead (state, messageIds) {
    // Change status of both messages which belongs to threads[] and currentThreadMessages[] arrays
    for (const thread of state.threads) {
      for (const message of thread.messages) {
        if (messageIds.includes(message.messageId)) {
          message.isNew = false
        }
      }
    }

    for (const message of state.currentThreadMessages) {
      if (messageIds.includes(message.messageId)) {
        message.isNew = false
      }
    }
  },
  markMessagesAsUnread (state, unreadMessageIds) {
    for (const thread of state.threads) {
      for (const message of thread.messages) {
        if (unreadMessageIds.includes(message.messageId)) {
          message.isNew = true
        }
      }
    }

    for (const message of state.currentThreadMessages) {
      if (unreadMessageIds.includes(message.messageId)) {
        message.isNew = true
      }
    }
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
          state.currentFolder.nbMessages--
          break
        }
      }
    }
    state.selectedThreads = []
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
  },
  setIsThreadListEnded (state, payload) {
    state.isThreadListEnded = payload
  }
}

export const actions = {
  setDisplayMessageFromRouting ({ commit }, value) {
    commit('setDisplayMessageFromRouting', value)
  },
  showMenuPanel ({ commit }) {
    commit('setShowMenuPanel', true)
  },
  hideMenuPanel ({ commit }) {
    commit('setShowMenuPanel', false)
  },
  toggleSideMenuPanel ({ commit }) {
    commit('toggleSideMenuPanel')
  },
  showDetailPanel ({ commit }) {
    commit('setDetailPanelDisplayed', true)
  },
  hideDetailPanel ({ commit }) {
    commit('setDetailPanelDisplayed', false)
  },
  toggleDetailPanelDisplayed ({ commit }) {
    commit('toggleDetailPanelDisplayed')
  },
  activeMultiSelection ({ commit }) {
    commit('setMultiSelection', true)
  },
  cancelMultiSelection ({ commit }) {
    commit('setMultiSelection', false)
  },
  toggleMultiSelection ({ commit }) {
    commit('toggleMultiSelection')
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
    if (folder.folderId && !state.displayMessageFromRouting) {
      this.dispatch('messaging/getThreads', { folderId: folder.folderId })
    }
  },
  loadMessagingFolders ({ commit }, noSelection) {
    folderService.getAllUserFolders().then((data) => {
      if (data.success) {
        commit('setMessagingFolders', data.folders)
        if (!noSelection && !state.displayMessageFromRouting) {
          const inboxFolder = data.folders.find((folder) => { return folder.type === 1 })
          this.dispatch('messaging/selectFolder', inboxFolder)
        } else {
          this.dispatch('messaging/selectFolder', {})
        }
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
    messageService.getMessageRecipients(messageId).then((data) => {
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
  getThreads ({ commit, state }, { folderId, lastDate = '-1' }) {
    return new Promise((resolve) => {
      if (lastDate === '-1') { // it means we are in a new messaging folder
        commit('setIsThreadListEnded', false)
        commit('setThreadList', []) // Force trigger component re-render (to fold unfolded threads)
      }

      if (!state.isThreadListEnded) {
        this.dispatch('currentActions/addAction', { name: 'loadThreads' })

        messageService.getThreads(folderId, lastDate, messagingConstants.threadListPaginationSize, state.unreadOnly).then((data) => {
          this.dispatch('currentActions/removeAction', { name: 'loadThreads' })

          if (data.success) {
            if (data.threads.length < messagingConstants.threadListPaginationSize) {
              commit('setIsThreadListEnded', true)
            }
            commit('setLoadingThreadsError', undefined)
            commit('updateStartIndex', state.startIndex + messagingConstants.threadListPaginationSize)
            if (lastDate === '-1') {
              commit('setThreadList', data.threads)
            } else {
              commit('addToThreadList', data.threads)
            }
            this.dispatch('messaging/updateNbUnread', folderId)
            resolve({ threads: data.threads })
          } else {
            commit('setLoadingThreadsError', 'loading')
            console.error('Error while getting threads from folderId ' + folderId + ' with last date = ' + lastDate)
          }
        }, (err) => {
          console.error(err)
          this.$store.dispatch('currentActions/removeAction', { name: 'loadThreads' })
        })
      }
    })
  },
  updateNbUnread ({ commit }, folderId) {
    messageService.getNbMessages(folderId).then((data) => {
      if (data.success) {
        commit('setNbMessages', { folderId: folderId, nbMessages: data.nbMessages })
        commit('setNbUnread', { folderId: folderId, nbUnread: data.nbUnread })
      } else {
        commit('setNbMessages', { folderId: folderId, nbMessages: 0 })
        commit('setNbUnread', { folderId: folderId, nbUnread: 0 })
      }
    })
  },
  getMessageThread ({ commit }, messageId) {
    this.dispatch('currentActions/addAction', { name: 'loadThreads' })
    messageService.getMessageThread(messageId).then((data) => {
      if (data.success) {
        commit('setLoadingThreadsError', undefined)
        this.dispatch('currentActions/removeAction', { name: 'loadThreads' })

        commit('setThreadList', [data.thread])

        // Select threadFolder
        const folderToSelect = messagingUtils.getFolderFromId(state.messagingFolders, data.messageFolderId)
        this.dispatch('messaging/selectFolder', folderToSelect)

        // Select thread
        messagingUtils.selectThread(data.thread, messageId)
      } else {
        if (data.Error === 'PermissionException') {
          commit('setLoadingThreadsError', 'PermissionException')
        } else {
          commit('setLoadingThreadsError', 'loading')
        }
        console.error('Error while getting thread from message ' + messageId)
      }
    }, (err) => {
      console.error(err)
      this.$store.dispatch('currentActions/removeAction', { name: 'loadThreads' })
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
  setNbUnread ({ commit }, folderId, nbUnread) {
    commit('setNbUnread', { folderId: folderId, nbUnread: nbUnread })
  },
  setNbMessages ({ commit }, folderId, nbMessages) {
    commit('setNbMessages', { folderId: folderId, nbMessages: nbMessages })
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

export const getters = {
  oldestThread (state) {
    if (state.threads.length > 0) {
      return _.orderBy(state.threads, 'lastSendDate', 'asc')[0]
    } else {
      return undefined
    }
  }
}
