<template>
  <div
    data-test="thread-list-item"
    :draggable="true"
    @dragstart="onDragStart"
    @dragend="onDragEnd"
  >
    <div>
      <!-- Thread with 1 single message AND thread multi-message collapsed -->
      <div
        class="main"
        :class="{'theme-background-color': isThreadSelected,
                 'theme-light-background-color': isSubMessageSelected,
                 'expanded': isThreadExpanded,
                 'selection-mode': isMultiSelectionActive,
                 'phone': mq.phone || mq.tablet}"
        @click.exact="handleClick()"
        @dblclick="editDraft()"
        @click.ctrl.exact="ctrlSelectThread()"
        @click.meta.exact="ctrlSelectThread()"
        @click.shift="shiftSelectThread()"
      >
        <div
          v-if="isMultiSelectionActive"
          class="selected-icon"
        >
          <div class="oval">
            <div
              v-if="isThreadSelected"
              class="marked"
            />
          </div>
        </div>

        <div
          class="icons"
          :class="{'shrink': isMultiSelectionActive}"
        >
          <div
            v-if="isUnread"
            class="unread theme-background-color icon"
            :class="{'selected' :isThreadSelected}"
            data-test="unread-icon"
          />
          <img
            v-if="hasAttachFiles"
            class="icon attached-file-icon"
            :src="require('@assets/icon_pj.svg')"
            alt="has attached files"
            :title="$t('Messaging.hasAttachedFiles')"
          >
          <img
            v-if="isAnswered"
            class="icon answered-icon"
            :src="require('@assets/options/icon_answer.svg')"
            alt="is answered"
            :title="$t('Messaging.answered')"
          >
          <img
            v-if="isForwarded"
            class="icon forwarded-icon"
            :src="require('@assets/options/icon_share.svg')"
            alt="is forwarded"
            :title="$t('Messaging.forwarded')"
          >
        </div>
        <div class="body">
          <!-- Line 1 : sender + date -->
          <div class="line1">
            <div class="sender">
              {{ displayedName }}
            </div>
            <div
              class="sendDate"
              data-test="sent-date"
            >
              {{ formatSentDate(mainMessage) }}
            </div>
          </div>

          <!-- Line 2 : subject + thread toggle -->
          <div class="line2">
            <p :title="mainMessage.subject">
              {{ mainMessage.subject }}
            </p>
            <button
              v-if="thread.messages.length > 1"
              class="thread-toggle"
              @click.stop="toggleThreadExtension"
            >
              <span>{{ thread.messages.length }}</span>
              <img
                :class="isThreadExpanded ? 'collapse-thread': 'extend-thread'"
                src="@assets/arrow_down.svg"
                alt="toggle thread"
              >
            </button>
          </div>

          <!-- Line 3 : content -->
          <div class="line3">
            <p>{{ mainMessage.previewContent }}</p>
          </div>
        </div>
      </div>

      <!-- Expanded thread : contains all thread's messages -->
      <Transition name="slide-fade">
        <div
          v-if="isThreadExpanded"
          class="expanded theme-extra-light-background-color"
          data-test="threadExpansion"
        >
          <div
            v-for="message in sortedMessages"
            :key="message.messageId"
          >
            <ThreadMessage
              :message="message"
              :is-first="isFirstMessage(message)"
              :is-last="isLastMessage(message)"
              @contextmenu.prevent="openContextMenu($event, message)"
            />
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script>

import ThreadMessage from '@components/Messaging/ThreadMessage'
import dayjs from 'dayjs'
import _ from 'lodash'

import messageService from '@/api/messaging/message.service'
import messagingConstants from '@/constants/messagingConstants'
import { isInViewport } from '@/utils/commons.util'
import messagingUtils from '@/utils/messaging.utils'

export default {
  components: {
    ThreadMessage
  },
  inject: ['mq'],
  props: {
    thread: {
      type: Object,
      required: true
    },
    isLast: {
      type: Boolean,
      default: false
    }
  },
  emits: ['openContextMenu'],
  data: function () {
    return {
      isThreadExpanded: false
    }
  },
  computed: {
    threads () {
      return this.$store.state.messaging.selectedThreads
    },
    currentFolder () {
      return this.$store.state.messaging.currentFolder
    },
    isMultiSelectionActive () {
      return this.$store.state.messaging.isMultiSelectionActive
    },
    sortedMessages () {
      return _.orderBy(this.thread.messages, 'sendDate', 'desc')
    },
    mainMessage () {
      // Returns the main message for current thread:
      // - if thread contains unread messages -> the oldest unread
      // - if thread contains no unread message -> the newest
      for (const message of this.thread.messages) {
        if (this.thread.mainMessageId === message.messageId) {
          return message
        }
      }
      return this.thread.messages[0]
    },
    isUnread () {
      // Returns true if the thread is unread, ie if at least one of its messages is unread
      for (const message of this.thread.messages) {
        if (message.isNew) {
          return true
        }
      }
      return false
    },
    isAnswered () {
      // Returns true if at least 1 message of the thread has been replied
      for (const message of this.thread.messages) {
        if (message.isAnswered) {
          return true
        }
      }
      return false
    },
    isForwarded () {
      // Returns true if at least 1 message of the thread has been forwarded
      for (const message of this.thread.messages) {
        if (message.isForwarded) {
          return true
        }
      }
      return false
    },
    hasAttachFiles () {
      // Returns true if at least 1 message of the thread has attached files
      for (const message of this.thread.messages) {
        if (message.hasAttachFiles) {
          return true
        }
      }
      return false
    },
    isDraft () {
      return this.currentFolder.type === messagingConstants.messagingDraftFolderType
    },
    isThreadSelected () {
      for (const selectedThread of this.$store.state.messaging.selectedThreads) {
        if (selectedThread.threadId === this.thread.threadId) {
          return true
        }
      }
      return false
    },
    isSubMessageSelected () {
      for (const selectedMessage of this.$store.state.messaging.selectedMessages) {
        if (selectedMessage.threadId === this.thread.threadId) {
          return true
        }
      }
      return false
    },
    selectedThreads () {
      return this.$store.state.messaging.selectedThreads
    },
    displayedName () {
      // For draft and sent box, this is the first recipients
      // For others, this is the sender
      if (messagingUtils.isDraftFolder() || messagingUtils.isSentFolder()) {
        return messagingUtils.shortRecipientList(this.mainMessage)
      } else {
        return this.mainMessage.senderName
      }
    },
    isDisplayMessageFromRouting () {
      return this.$store.state.messaging.displayMessageFromRouting
    }
  },
  mounted () {
    this.isThreadExpanded = false
    if (this.isLast && !this.isDisplayMessageFromRouting) {
      if (isInViewport(this.$el)) {
        this.getNextThreads()
      }
    }
  },
  methods: {
    getNextThreads () {
      let lastThreadDate = '-1'
      const lastThread = this.$store.getters['messaging/oldestThread']
      if (lastThread) {
        lastThreadDate = lastThread.lastSendDate
      }

      this.$store.dispatch('messaging/getThreads', { folderId: this.currentFolder.folderId, lastDate: lastThreadDate })
    },
    handleClick () {
      if (this.isMultiSelectionActive) {
        this.ctrlSelectThread()
      } else {
        if (this.thread.messages.length > 1 && this.isThreadSelected && this.$store.state.messaging.selectedMessages.length === 0) {
          this.toggleThreadExtension()
        } else {
          this.selectThread()
        }
        if (this.mq.phone || this.mq.tablet) {
          this.$store.dispatch('messaging/showDetailPanel')
        }
      }
    },
    selectThread () {
      messagingUtils.selectThread(this.thread)
    },
    toggleThreadExtension () {
      if (!this.isThreadSelected && (!this.mq.phone && !this.mq.tablet)) {
        this.selectThread()
      }
      this.isThreadExpanded = !this.isThreadExpanded
    },
    ctrlSelectThread () {
      // If thread is already selected, remove it from the list
      let isRemoved = false
      for (const selectedThread of this.$store.state.messaging.selectedThreads) {
        if (selectedThread.threadId === this.thread.threadId) {
          this.$store.dispatch('messaging/removeSelectedThread', this.thread)
          isRemoved = true
        }
      }
      if (!isRemoved) {
        this.$store.dispatch('messaging/addSelectedThreads', [this.thread])
        this.$store.dispatch('messaging/setLastSelectedThread', this.thread)
      }
    },
    shiftSelectThread () {
      if (!this.mq.phone) { // no selection on mobile
        const selectedThreads = messagingUtils.selectBetween(this.thread)
        this.$store.dispatch('messaging/setSelectedThreads', selectedThreads)
      }
    },

    formatSentDate (message) {
      const sendDate = dayjs(message.sendDate, 'YYYY/MM/DD HH:mm:ss')
      const today = dayjs().startOf('day')
      const yesterday = dayjs().subtract(1, 'days').startOf('day')

      if (sendDate.isSame(yesterday, 'd')) {
        return 'hier'
      } else if (sendDate.isSame(today, 'd')) {
        return sendDate.format('HH:mm')
      } else {
        return sendDate.format('DD/MM/YYYY HH:mm')
      }
    },
    onDragStart (e) {
      // Select thread if not already selected
      let isSelected = false
      for (const selectedThread of this.selectedThreads) {
        if (selectedThread.threadId === this.thread.threadId) {
          isSelected = true
        }
      }
      if (!isSelected) {
        this.$store.dispatch('messaging/setLastSelectedThread', this.thread)
        this.$store.dispatch('messaging/setSelectedThreads', [this.thread])
        this.$store.dispatch('messaging/removeSelectedMessages')

        messageService.getThreadMessages(this.thread.threadId, this.currentFolder.folderId).then((data) => {
          if (data.success) {
            this.$store.dispatch('messaging/setCurrentThreadMessages', data.messages)
          }
        })
      }
      // Set in the drag event the selected threads
      e.dataTransfer.setData('draggedThreads', JSON.stringify(this.selectedThreads))
      this.$store.dispatch('messaging/setDraggedThreads', this.selectedThreads)
    },
    onDragEnd () {
      this.$store.dispatch('messaging/setDraggedThreads', [])
    },
    editDraft () {
      if (this.isDraft) {
        messagingUtils.editDraft(this.mainMessage.messageId)
      }
    },
    isFirstMessage (message) {
      return this.sortedMessages[0].messageId === message.messageId
    },
    isLastMessage (message) {
      return this.sortedMessages[this.sortedMessages.length - 1].messageId === message.messageId
    },
    openContextMenu (e, message) {
      // Add message if not already selected
      if (!messagingUtils.isMessageSelected(message)) {
        messagingUtils.selectMessage(message)
      }

      this.$emit('openContextMenu', e, message.threadId)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@design';

.sender, .line2 p {
  font-size: 0.9rem;
}

.main {
  --icons-width: 35px;
  --icons-shrink-width: 30px;
  display: flex;
  width: 100%;
  cursor: pointer;
  transition-property: border-bottom-right-radius, border-bottom-left-radius;
  transition-duration: .3s;
  &.phone {
    --icons-width: 25px;
  }
  &.selection-mode {
    .body {
      width: calc(100% - var(--icons-width) - var(--icons-shrink-width));
    }
  }

  .selected-icon {
    width: var(--icons-width);
    min-width: var(--icons-width);
    display: flex;
    align-items: center;
    justify-content: flex-end;

    .oval {
      display: flex;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
      height: 20px;
      width: 20px;
      border-radius: 10px;
      border: 1px solid #D9E2EA;
      background-color: #F3F6F8;

      .marked {
        height: 12px;
        width: 12px;
        border-radius: 6px;
        background-color: #0B3C5F;
      }
    }
  }

  .icons {
    width: var(--icons-width);
    padding-top: 17px;
    padding-bottom: 7px;
    min-width: var(--icons-width);
    display: flex;
    flex-direction: column;
    align-items: center;

    &.shrink {
      width: var(--icons-shrink-width);
      min-width: var(--icons-shrink-width);
    }

    .icon {
      margin-bottom: 7px;
    }

    .unread {
      @extend %messaging-pellet;

      &.selected {
        background-color: white;
      }
    }

    .attached-file-icon {
      width: 7px;
    }

    .answered-icon, .forwarded-icon {
      width: 11px;
    }
  }
  .body {
    display: flex;
    flex-direction: column;
    padding: 10px 10px 7px 0;
    width: calc(100% - var(--icons-width));

    p {
      margin: 0;
    }

    .line1 {
      width: 100%;
      height: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .sender {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        font-weight: bold;
      }
      .sendDate {
        white-space: nowrap;
        font-weight: normal;
        font-size: 0.75em;
        letter-spacing: 0;
        line-height: 19px;
      }
    }
    .line2 {
      min-width: 0;
      height: 20px;
      display: flex;
      margin: 0;
      justify-content: space-between;

      p{
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }

      .thread-toggle {
        display: flex;
        align-items: center;
        cursor: pointer;
        border: 1px solid transparent;
        margin: 0;
        padding: 0;
        background-color: transparent;
        color: inherit;

        &:hover {
          font-weight: bold;
        }

        span {
          margin-top: -2px;
          margin-right: 3px;
          padding-right: 3px;
          font-size: 0.75em;
          font-weight: 600;
          letter-spacing: 0;
          line-height: 19px;
        }
        .arrow {
          margin: auto;
        }

        .collapse-thread, .extend-thread {
          width: 10px;
          transition:  transform .3s;
        }

        .expanded {
          transform: rotate(0);
        }

        .collapse-thread {
          transform: rotate(180deg);
        }
      }
    }
    .line3 {
      p {
        font-weight: lighter;
        font-size: 12px;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }

  &:not(.theme-background-color) {
    .body {
      .line3 {
        p {
          color: $color-new-light-text;
        }
      }
    }
  }
}

.expanded {
  border-bottom: none;
}

.slide-fade-enter-active {
  transition: all .3s ease-in;
}
.slide-fade-leave-active {
  transition: all .3s ease-out;
}

.slide-fade-enter-from, .slide-fade-leave-to {
  max-height: 0;
}
.slide-fade-enter-to, .slide-fade-leave-from {
  /* TODO: make max-height adaptive to content height */
  max-height: 200px;
}

</style>
