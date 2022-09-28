<template>
  <div class="panel">
    <div
      class="splitarea-header"
      data-test="header"
    >
      <div class="header-label">
        <img
          src="@assets/menu_messaging_black.svg"
          alt=""
        >
        <div
          class="current-folder"
          :title="currentFolder && currentFolder.type === 5 ? currentFolderName : ''"
        >
          <p>{{ formattedCurrentFolderName }}</p>
        </div>
      </div>
      <div class="buttons">
        <IconOption
          class="button"
          :icon="require('@/assets/icon_menu_lateral.svg')"
          :icon-white="require('@/assets/icon_menu_lateral_white.svg')"
          :title="$t('Messaging.hideMenuPanel')"
          :gray-background-color="true"
          name="toggleMessagingMenu"
          icon-height="16px"
          alt="toggle menu"
          @click="toggleSideMenuPanel"
        />
        <IconOption
          class="button"
          :icon="require('@/assets/icon_refresh.svg')"
          :icon-white="require('@assets/icon_refresh_white.svg')"
          :title="$t('Messaging.refresh')"
          :gray-background-color="true"
          name="refresh"
          icon-height="16px"
          alt="refresh"
          @click="refresh"
        />
        <IconOption
          class="button"
          :icon="require('@/assets/icon_edit_texte.svg')"
          :icon-white="require('@assets/icon_edit_texte_white.svg')"
          :title="$t('Messaging.new')"
          :gray-background-color="true"
          name="createNewMessage"
          icon-height="16px"
          alt="new message"
          @click="createNewMessage"
        />
      </div>

      <!-- Display unread messages only toggle -->
      <div class="unread">
        <PentilaCheckbox
          v-model="unreadOnly"
          :label="$t('Messaging.unreadOnly')"
          @update:modelValue="toggleUnreadOnly()"
        />
      </div>
    </div>
    <hr>

    <div class="thread-list">
      <div
        v-for="thread in threads"
        :key="thread.threadId"
      >
        <Thread
          :thread="thread"
          class="thread-list-item"
          @contextmenu.prevent="openContextMenu($event, thread)"
        />
        <hr class="hr-thread-list">
      </div>
      <ContextMenu
        v-if="isContextMenuDisplayed"
        @chooseOption="handleChosenOption"
        @close="isContextMenuDisplayed=false"
      />
      <PentilaSpinner
        v-if="isLoadingThreads"
        data-test="spinner"
      />
    </div>
  </div>
</template>

<script>

import contextMenus from '@/utils/contextMenus'
import constants from '@/constants/messagingConstants'
import Thread from '@components/Messaging/Thread'
import messagingUtils from '@/utils/messaging.utils'
import ContextMenu from '@/components/ContextMenu/ContextMenu'
import _ from 'lodash'
import utils from '@utils/utils'
import IconOption from '@components/Base/IconOption'

export default {
  name: 'ThreadList',
  components: {
    IconOption,
    Thread,
    ContextMenu
  },
  props: {
  },
  data: function () {
    return {
      unreadOnly: false,
      isContextMenuDisplayed: false
    }
  },
  computed: {
    threads () {
      return _.orderBy(this.$store.state.messaging.threads, 'lastSendDate', 'desc')
    },
    isMenuPanelDisplayed () {
      return this.$store.state.messaging.isMenuPanelDisplayed
    },
    currentFolderName () {
      return this.$store.state.messaging.currentFolder.folderName
    },
    currentFolder () {
      return this.$store.state.messaging.currentFolder
    },
    formattedCurrentFolderName () {
      return this.currentFolderName ? this.currentFolderName.toUpperCase() : ''
    },
    nbNewMessages () {
      return this.$store.state.messaging.nbNewMessages
    },
    isLoadingThreads () {
      return this.$store.getters['currentActions/isInProgress']('loadThreads')
    }
  },
  methods: {
    createNewMessage () {
      messagingUtils.newMessage()
    },
    toggleSideMenuPanel () {
      if (this.isMenuPanelDisplayed) {
        this.$store.dispatch('messaging/hideMenuPanel')
      } else {
        this.$store.dispatch('messaging/showMenuPanel')
      }
    },
    refresh () {
      messagingUtils.refresh()
    },
    toggleUnreadOnly () {
      this.$store.dispatch('messaging/toggleUnreadOnly')
      this.refresh()
    },
    openContextMenu (e, thread) {
      // Add thread if not already selected
      if (!messagingUtils.isThreadSelected(thread)) {
        // thread is not selected -> select it'
        messagingUtils.selectThread(thread)
      }

      let contextMenu = []

      if (this.$store.state.messaging.selectedThreads.length > 1) {
        contextMenu = contextMenus.messagingMultiSelectionMenu
      } else {
        contextMenu = contextMenus.messagingMenu
      }
      // Add 'markAsRead' or 'markAsUnread' menus
      let isOneMessageRead = false
      let isOneMessageUnread = false
      for (const thread of this.$store.state.messaging.selectedThreads) {
        for (const message of thread.messages) {
          if (message.isNew) {
            isOneMessageUnread = true
          } else {
            isOneMessageRead = true
          }
        }
      }
      if (isOneMessageRead) {
        contextMenu = contextMenus.messagingMarkAsUnreadMenu.concat(contextMenu)
      }
      if (isOneMessageUnread) {
        contextMenu = contextMenus.messagingMarkAsReadMenu.concat(contextMenu)
      }

      if (this.currentFolder.type === constants.messagingDraftFolderType) { // Draft options
        contextMenu = contextMenus.messagingEditDraftMenu.concat(contextMenu)
        if (this.$store.state.messaging.selectedThreads.length > 1) {
          utils.removeMenuOptionIfExist(contextMenu, 'editDraft')
        }
        utils.removeMenuOptionIfExist(contextMenu, 'markAsRead')
        utils.removeMenuOptionIfExist(contextMenu, 'markAsUnread')
        utils.removeMenuOptionIfExist(contextMenu, 'reply')
        utils.removeMenuOptionIfExist(contextMenu, 'replyAll')
        utils.removeMenuOptionIfExist(contextMenu, 'forward')
      }

      this.isContextMenuDisplayed = true
      this.$store.dispatch('contextMenu/openContextMenu', { event: e, options: contextMenu })
    },
    handleChosenOption (option) {
      switch (option.name) {
        case 'markAsRead':
          this.markSelectionAsRead(true)
          break
        case 'markAsUnread':
          this.markSelectionAsRead(false)
          break
        case 'editDraft':
          messagingUtils.editDraft(this.$store.state.messaging.selectedThreads[0].mainMessageId)
          break
        case 'reply':
          messagingUtils.reply()
          break
        case 'replyAll':
          messagingUtils.replyAll()
          break
        case 'forward':
          messagingUtils.forward()
          break
        case 'delete':
          messagingUtils.deleteSelectedThreads()
          break
        default:
          console.error('unknown action for option', option)
      }
      this.isContextMenuDisplayed = false
      this.$store.dispatch('contextMenu/closeMenus')
    },
    markSelectionAsRead (markAsRead) {
      const messageIds = []
      // Pick mainMessage for each selected thread
      for (const selectedThread of this.$store.state.messaging.selectedThreads) {
        messageIds.push(selectedThread.mainMessageId)
      }
      // Add all selected messages
      for (const selectedMessage of this.$store.state.messaging.selectedMessages) {
        messageIds.push(selectedMessage.messageId)
      }
      messagingUtils.markMessagesAsReadUnread(messageIds, markAsRead)
    },
    draggedThreads () {
      return this.$store.state.messaging.draggedThreads
    },
    isDragged () {
      for (let i = 0; i < this.draggedThreads.length; ++i) {
        if (this.folder.id === this.draggedThreads[i].id) {
          return true
        }
      }
      return false
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

.panel {
  height: 100%;
  color: #0B3C5F;
}

.splitarea-header {
  padding: 0 20px;
  height: 74px;
  display: flex;
  justify-content: space-between;

  .header-label {
    display: flex;
    align-items: center;

    img {
      width: 33px;
    }
    .current-folder {
      margin-left: 15px;
      font-weight: bold;

      p {
        max-width: 170px; /* TODO find solution to mix that with flex: justify-content:space-between */
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }

  .header-icon {
    margin: 3px;
    padding: 5px;
    width: 30px;
    height: 30px;
    border: 1px solid transparent;

    &:hover {
      border-radius: 5px;
      border: 1px solid black;
      cursor: pointer;
    }
  }

  .buttons {
    display: flex;
    align-items: center;
    justify-content: center;

    .button {
      margin: 0 5px;
    }

  }
  .unread {
    display: flex;
    align-items: center;

    label {
      white-space: nowrap;
    }
  }
}

hr {
  margin: 0;
  border: 0; border-top: 1px solid #D9E2EA;
}

hr.hr-thread-list {
  margin: 0;
  border: 0; border-top: 1px solid #e0e0e0;
}

.thread-list {
  height: calc(100% - (74px + 2px));  /* 100% - (banner-height + hr-height) */
  overflow: auto;
  position: relative;
  .thread-list-item {
    overflow: hidden;
  }
}

</style>
