<template>
  <section
    class="panel"
    data-test="threads-panel"
    :class="{'phone': mq.phone || mq.tablet}"
  >
    <ThreadListHeader class="thread-list-header" />
    <hr>

    <div class="thread-list">
      <IconOption
        v-if="mq.phone || mq.tablet"
        ref="PTRIcon"
        class="pull-to-refresh-icon"
        :class="{'is-waiting': isWaiting}"
        :icon="require('@assets/icons/refresh.svg')"
        :title="$t('Messaging.ThreadList.refresh')"
        name="refresh"
        icon-height="20px"
        alt=""
      />
      <WeprodeSpinner
        v-if="isDeleteThreads"
        data-test="spinner"
      />
      <div
        v-else-if="loadingThreadsError"
        class="placeholder"
      >
        <div v-t="loadingThreadsError === 'PermissionException' ? 'permissionError' : 'loadingError'" />
        <FAIcon
          name="exclamation-triangle"
          class="icon"
          style="margin-top: 40px; font-size: 40px;"
        />
      </div>
      <div
        v-else-if="threads && threads.length === 0 && !isLoadingThreads"
        class="placeholder"
      >
        <div v-t="'Messaging.ThreadList.' + (currentFolder.type === 1 ? (isReadOnlyToggled ? 'noNewMessage' : 'noMessage') : 'emptyFolder')" />
        <img
          src="@/assets/icons/messaging_placeholder.svg"
          alt=""
        >
      </div>
      <div
        v-else
        ref="scroll"
        class="scroll"
        @touchstart="pointerDown"
        @touchend="pointerUp"
        @scroll="handleScroll"
      >
        <div
          v-for="thread in threads"
          :key="thread.threadId"
        >
          <Thread
            v-touch:hold="toggleMultiSelection"
            :thread="thread"
            :is-last="thread.threadId === threads[threads.length-1].threadId"
            class="thread-list-item"
            @contextmenu.prevent="askContextMenu($event, thread)"
          />
          <hr class="hr-thread-list">
        </div>
        <ContextMenu
          v-if="isContextMenuDisplayed"
          @choose-option="handleChosenOption"
          @close="isContextMenuDisplayed=false"
        />
        <WeprodeSpinner
          v-if="isLoadingThreads || isDeleteThreads"
          data-test="spinner"
        />
      </div>
    </div>
  </section>
</template>

<script>

import FAIcon from '@components/Base/FAIcon.vue'
import IconOption from '@components/Base/IconOption'
import Thread from '@components/Messaging/Thread'
import ThreadListHeader from '@components/Messaging/ThreadListHeader'
import { removeMenuOptionIfExist } from '@utils/commons.util'

import WeprodeSpinner from '@/components/Base/Weprode/WeprodeSpinner.vue'
import ContextMenu from '@/components/ContextMenu/ContextMenu'
import constants, { MESSAGING } from '@/constants/appConstants'
import contextMenus from '@/utils/contextMenus'
import messagingUtils from '@/utils/messaging.utils'

let startMouseY = 0
let startMouseX = 0
let oldScrollTop = 0
let refrechTimeout

export default {
  name: 'ThreadList',
  components: {
    FAIcon,
    IconOption,
    ThreadListHeader,
    Thread,
    ContextMenu,
    WeprodeSpinner
  },
  inject: ['mq'],
  props: {
    isDragging: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      isContextMenuDisplayed: false,
      isWaiting: false,
      mouseY: 0,
      isThreadDragging: false,
      isScrollable: true
    }
  },
  computed: {
    threads () {
      return this.$store.state.messaging.threads
    },
    currentFolder () {
      return this.$store.state.messaging.currentFolder
    },
    nbNewMessages () {
      return this.$store.state.messaging.nbNewMessages
    },
    loadingThreadsError () {
      return this.$store.state.messaging.loadingThreadsError
    },
    isLoadingThreads () {
      return this.$store.getters['currentActions/isInProgress']('loadThreads')
    },
    isDeleteThreads () {
      return this.$store.getters['currentActions/isInProgress']('deleteMessages')
    },
    isDisplayMessageFromRouting () {
      return this.$store.state.messaging.displayMessageFromRouting
    },
    selectedThreads () {
      return this.$store.state.messaging.selectedThreads
    },
    isModalOpen () {
      return this.$store.state.misc.nbOpenModals > 0
    },
    isReadOnlyToggled () {
      return this.$store.state.messaging.unreadOnly
    }
  },
  mounted () {
    window.addEventListener('keydown', this.keyMonitor)
  },
  beforeUnmount () {
    window.removeEventListener('keydown', this.keyMonitor)
  },
  methods: {
    keyMonitor (event) {
      if (this.threads.length > 0 && !this.isModalOpen) {
        if (event.key === 'ArrowDown') {
          this.selectNextThread()
        } else if (event.key === 'ArrowUp') {
          this.selectPreviousThread()
        }
      }
    },
    selectNextThread () {
      if (this.selectedThreads.length > 1) {
        // Multiple selected threads, do nothing
      } else if (this.selectedThreads.length === 0) { // No selected thread
        messagingUtils.selectThread(this.threads[0])
      } else { // Exactly one selected thread
        const selectedThread = this.selectedThreads[0]
        if (this.threads.map(thread => thread.threadId).indexOf(selectedThread.threadId) === this.threads.length - 1) { // The last event
          // Do nothing
        } else {
          const currentIndex = this.threads.map(thread => thread.threadId).indexOf(selectedThread.threadId)
          messagingUtils.selectThread(this.threads[currentIndex + 1])
        }
      }
    },
    selectPreviousThread () {
      if (this.selectedThreads.length > 1) {
        // Multiple selected threads, do nothing
      } else if (this.selectedThreads.length === 0) { // No selected thread
        messagingUtils.selectThread(this.threads[this.threads.length - 1])
      } else { // Exactly one selected thread
        const selectedThread = this.selectedThreads[0]
        if (this.threads.map(thread => thread.threadId).indexOf(selectedThread.threadId) === 0) { // The first event
          // Do nothing
        } else {
          const currentIndex = this.threads.map(thread => thread.threadId).indexOf(selectedThread.threadId)
          messagingUtils.selectThread(this.threads[currentIndex - 1])
        }
      }
    },
    pointerDown (e) {
      this.isScrollable = true
      if (!this.isDragging) {
        if (this.$refs.scroll.scrollTop <= 50) {
          startMouseY = this.mouseY = e.touches[0].clientY
          startMouseX = this.mouseY = e.touches[0].clientX
          window.addEventListener('touchmove', this.pointerMove)
        }
      }
    },
    pointerUp () {
      if (!this.isDragging) {
        if (!this.isWaiting) {
          this.$refs.scroll.style.marginTop = '0'
          this.$refs.PTRIcon.$refs.iconOption.style.transform = 'translate(-50%, -50%) rotate(0deg)'
          this.$refs.PTRIcon.$refs.iconOption.style.opacity = 0
        }
        window.removeEventListener('touchmove', this.pointerMove)
      }
    },
    pointerMove (e) {
      if (!this.isDragging) {
        const newY = e.touches[0].clientY
        const deltaY = newY - startMouseY

        if (deltaY > 0 && Math.abs(deltaY) > Math.abs(e.touches[0].clientX - startMouseX) && this.$refs.scroll.scrollTop === 0) {
          if (deltaY < 200 && this.isScrollable) {
            this.$refs.scroll.style.marginTop = deltaY / 4 + 'px'
            this.$refs.PTRIcon.$refs.iconOption.style.transform = 'translate(-50%, -50%) rotate(' + deltaY + 'deg)'
            this.$refs.PTRIcon.$refs.iconOption.style.opacity = deltaY / 200
            this.waitBeforeRefresh()
          } else {
            this.isScrollable = false
          }
        } else {
          this.isScrollable = false
        }
      }
    },

    waitBeforeRefresh () {
      clearTimeout(refrechTimeout)
      // Make a new timeout set to go off in 800ms
      this.isWaiting = true
      refrechTimeout = setTimeout(() => {
        this.isWaiting = false
        this.refresh()
        this.pointerUp()
      }, 500)
    },
    refresh () {
      if (this.$route.params.messageId) {
        this.$router.push({ name: MESSAGING })
        this.$store.dispatch('messaging/setDisplayMessageFromRouting', false)
      } else {
        messagingUtils.refresh()
      }
    },
    askContextMenu (e, thread) {
      if (!messagingUtils.isThreadSelected(thread)) {
        // thread is not selected -> select it'
        messagingUtils.selectThread(thread).then(() => {
          this.openContextMenu(e, thread)
        })
      } else {
        this.openContextMenu(e, thread)
      }
    },
    openContextMenu (e, thread) {
      // Add thread if not already selected
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
          removeMenuOptionIfExist(contextMenu, 'editDraft')
        }
        removeMenuOptionIfExist(contextMenu, 'markAsRead')
        removeMenuOptionIfExist(contextMenu, 'markAsUnread')
        removeMenuOptionIfExist(contextMenu, 'reply')
        removeMenuOptionIfExist(contextMenu, 'replyAll')
        removeMenuOptionIfExist(contextMenu, 'forward')
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
      let messageIds = []

      if (this.$store.state.messaging.selectedMessages.length > 0) {
        for (const selectedMessage of this.$store.state.messaging.selectedMessages) {
          messageIds.push(selectedMessage.messageId)
        }
      } else {
        // Pick all messages of each selected thread
        for (const selectedThread of this.$store.state.messaging.selectedThreads) {
          messageIds = [...messageIds, ...selectedThread.messages.map(message => message.messageId)]
        }
      }
      messagingUtils.markMessagesAsReadUnread(messageIds, markAsRead)
    },
    draggedThreads () {
      return this.$store.state.messaging.draggedThreads
    },
    handleScroll () {
      const scroll = this.$refs.scroll
      if (scroll.scrollTop > oldScrollTop && !this.isDisplayMessageFromRouting) { // if we go down
        const nbPixelsBeforeBottom = scroll.scrollHeight - (scroll.scrollTop + scroll.clientHeight)

        if (nbPixelsBeforeBottom <= 5) {
          if (!this.$store.getters['currentActions/isInProgress']('loadThreads')) {
            this.getNextThreads()
          }
        }
      }
      oldScrollTop = scroll.scrollTop
    },
    getNextThreads () {
      let lastThreadDate = '-1'
      const lastThread = this.$store.getters['messaging/oldestThread']
      if (lastThread) {
        lastThreadDate = lastThread.lastSendDate
      }

      this.$store.dispatch('messaging/getThreads', { folderId: this.currentFolder.folderId, lastDate: lastThreadDate })
    },
    toggleMultiSelection () {
      if (this.mq.phone) {
        this.$store.dispatch('messaging/toggleMultiSelection')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

.panel {
  height: 100%;
  border-right: 1px solid $color-border;

  &.phone {
    border: none;
    min-width: 0;

    .scroll {
      padding: 0;
      height: 100%;  /* 100% - (banner-height + hr-height) */
      overscroll-behavior: none;
    }

    .thread-list-header {
      position: relative;
    }

    .thread-list {
      position: relative;
      height: calc(100% - (#{$messaging-mobile-header-height} + 2px));
      border: none;
    }

    .pull-to-refresh-icon {
      position: absolute;
      top: -18px;
      left: 50%;
      opacity: 0;
      transform-origin: center;
      transform: translate(-50%, -50%);

      &.is-waiting {
        transform: translate(-50%, -50%);
        -webkit-animation: rotating 1s linear infinite;
        -moz-animation: rotating 1s linear infinite;
        -ms-animation: rotating 1s linear infinite;
        -o-animation: rotating 1s linear infinite;
        animation: rotating 1s linear infinite;
      }
    }
  }
}

hr {
  margin: 0;
  border: 0; border-top: 1px solid $color-border-menu;
}

hr.hr-thread-list {
  border: 0; border-top: 1px solid $neutral-40;
}

.thread-list {
  position: relative;
  height: calc(100% - (#{$messaging-header-height} + 2px)); /* 100% - (banner-height + hr-height) */
}

.scroll {
  height: 100%;
  padding-right: 0.5em;
  overflow: auto;
  .thread-list-item {
    border-radius: 6px;
    overflow: hidden;
  }
}

.placeholder {
  width: 100%;
  height: 100%;
  padding-top: 40px;
  text-align: center;
  font-weight: bold;
  font-size: 1em;

  img {
    margin-top: 40px;
  }
}

@-webkit-keyframes rotating /* Safari and Chrome */ {
  from {
    -webkit-transform: rotate(0deg);
    -o-transform: rotate(0deg);
    transform: translate(-50%, -50%) rotate(0deg);
  }
  to {
    -webkit-transform: rotate(360deg);
    -o-transform: rotate(360deg);
    transform: translate(-50%, -50%) rotate(360deg);
  }
}
@keyframes rotating {
  from {
    -ms-transform: rotate(0deg);
    -moz-transform: rotate(0deg);
    -webkit-transform: rotate(0deg);
    -o-transform: rotate(0deg);
    transform: translate(-50%, -50%) rotate(0deg);
  }
  to {
    -ms-transform: rotate(360deg);
    -moz-transform: rotate(360deg);
    -webkit-transform: rotate(360deg);
    -o-transform: rotate(360deg);
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

</style>
