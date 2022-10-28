<template>
  <div
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
        :icon="require('@/assets/options/icon_refresh.svg')"
        :title="$t('Messaging.refresh')"
        :gray-background-color="true"
        name="refresh"
        icon-height="16px"
        alt=""
      />
      <div
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
            :thread="thread"
            class="thread-list-item"
            @contextmenu.prevent="openContextMenu($event, thread)"
          />
          <hr class="hr-thread-list">
        </div>
        <div
          v-if="threads.length === 0"
          class="placeholder"
        >
          <div v-t="'emptyBox'" />
          <img
            src="@assets/messaging_placeholder.svg"
            alt=""
          >
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

    <ThreadListOptions v-if="mq.phone || mq.tablet" />
  </div>
</template>

<script>

import contextMenus from '@/utils/contextMenus'
import constants from '@/constants/appConstants'
import Thread from '@components/Messaging/Thread'
import messagingUtils from '@/utils/messaging.utils'
import ContextMenu from '@/components/ContextMenu/ContextMenu'
import _ from 'lodash'
import utils from '@utils/utils'
import ThreadListHeader from '@components/Messaging/ThreadListHeader'
import IconOption from '@components/Base/IconOption'
import ThreadListOptions from '@components/Messaging/ThreadListOptions'
import messageService from '@/api/messaging/message.service'

let mouseY = 0
let startMouseY = 0
let oldScrollTop = 0
let refrechTimeout

export default {
  name: 'ThreadList',
  components: {
    ThreadListOptions,
    IconOption,
    ThreadListHeader,
    Thread,
    ContextMenu
  },
  inject: ['mq'],
  data () {
    return {
      searchResultThreads: [],
      isContextMenuDisplayed: false,
      isWaiting: false
    }
  },
  computed: {
    threads () {
      if (this.$route.params.messageId) {
        return this.searchResultThreads
      } else {
        return _.orderBy(this.$store.state.messaging.threads, 'lastSendDate', 'desc')
      }
    },
    currentFolder () {
      return this.$store.state.messaging.currentFolder
    },
    nbNewMessages () {
      return this.$store.state.messaging.nbNewMessages
    },
    isLoadingThreads () {
      return this.$store.getters['currentActions/isInProgress']('loadThreads')
    }
  },
  created () {
    if (this.$route.params.messageId) {
      this.getMessageThread()
    }
  },
  methods: {
    getMessageThread () {
      messageService.getMessageThread(this.$route.params.messageId).then((data) => {
        this.searchResultThreads = [data.thread]
      })
    },
    pointerDown (e) {
      if (this.$refs.scroll.scrollTop <= 50) {
        startMouseY = mouseY = e.touches[0].clientY
        window.addEventListener('touchmove', this.pointerMove)
      }
    },
    pointerUp () {
      if (!this.isWaiting) {
        this.$refs.scroll.style.marginTop = '0'
        this.$refs.PTRIcon.$refs.iconOption.style.transform = 'translate(-50%, -50%) rotate(0deg)'
        this.$refs.PTRIcon.$refs.iconOption.style.opacity = 0
      }
      window.removeEventListener('touchmove', this.pointerMove)
    },
    pointerMove (e) {
      const newY = e.touches[0].clientY
      if (newY > mouseY && this.$refs.scroll.scrollTop === 0) {
        const d = newY - startMouseY
        if (d < 200) {
          this.$refs.scroll.style.marginTop = d / 4 + 'px'
          this.$refs.PTRIcon.$refs.iconOption.style.transform = 'translate(-50%, -50%) rotate(' + d + 'deg)'
          this.$refs.PTRIcon.$refs.iconOption.style.opacity = d / 200
        } else {
          this.waitBeforeRefresh()
        }
      } else {
        window.removeEventListener('mousemove', this.pointerMove)
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
      messagingUtils.refresh()
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
    },
    handleScroll () {
      const scroll = this.$refs.scroll
      if (scroll.scrollTop > oldScrollTop) { // if we go down
        const nbPixelsBeforeBottom = scroll.scrollHeight - (scroll.scrollTop + scroll.clientHeight)

        if (nbPixelsBeforeBottom === 0) {
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
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

.panel {
  height: 100%;
  color: $color-messaging-dark-text;

  &.phone {
    .thread-list-header {
      position: relative;
    }

    .thread-list {
      position: relative;
      height: calc(100% - (#{$messaging-mobile-header-height} + #{$messaging-mobile-footer-height} + 2px));
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

    .scroll {
      height: 100%;  /* 100% - (banner-height + hr-height) */
    }
  }
}

hr {
  margin: 0;
  border: 0; border-top: 1px solid $color-border-menu;
}

hr.hr-thread-list {
  margin: 0;
  border: 0; border-top: 1px solid #e0e0e0;
}

.thread-list {
  position: relative;
  height: calc(100% - (#{$messaging-header-height} + 2px)); /* 100% - (banner-height + hr-height) */
}

.scroll {
  height: 100%;
  overflow: auto;
  .thread-list-item {
    overflow: hidden;
  }
}

.placeholder {
  width: 100%;
  height: 100%;
  padding-top: 40px;
  color: $color-messaging-dark-text;
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

<i18n locale="fr">
{
  "emptyBox": "Cette boîte est vide"
}
</i18n>
