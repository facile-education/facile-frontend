<template>
  <div
    :draggable="true"
    @dragstart="onDragStart"
    @dragend="onDragEnd"
  >
    <!-- Thread with 1 single message AND thread multi-message collapsed -->
    <div
      class="main"
      :class="{'selected': isThreadSelected,
               'subMessageSelected': isSubMessageSelected,
               'expanded': isThreadExpanded,
               'dragged': isDragged}"
      @click.exact="handleClick()"
      @dblclick="editDraft()"
      @click.ctrl.exact="ctrlSelectThread()"
      @click.meta.exact="ctrlSelectThread()"
      @click.shift="shiftSelectThread()"
    >
      <div class="icons">
        <BaseIcon
          v-if="isUnread"
          name="circle"
          class="fa-xs unread icon"
          data-test="unread-icon"
          :class="{'selected' : isThreadSelected && !isSubMessageSelected}"
          :title="$t('Messaging.new')"
        />
        <img
          v-if="mainMessage.hasAttachFiles"
          class="icon attached-file-icon"
          :src="isThreadSelected && !isSubMessageSelected ? require('@assets/icon_pj_white.svg') : require('@assets/icon_pj.svg')"
          alt="has attached files"
          :title="$t('Messaging.hasAttachedFiles')"
        >
        <img
          v-if="mainMessage.isAnswered"
          class="icon answered-icon"
          :src="isThreadSelected && !isSubMessageSelected ? require('@assets/options/icon_answer_white.svg') : require('@assets/options/icon_answer.svg')"
          alt="is answered"
          :title="$t('Messaging.answered')"
        >
        <img
          v-if="mainMessage.isForwarded"
          class="icon forwarded-icon"
          :src="isThreadSelected && !isSubMessageSelected ? require('@assets/options/icon_share_white.svg') : require('@assets/options/icon_share.svg')"
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
          <p>{{ mainMessage.subject }}</p>
          <div
            v-if="thread.messages.length > 1"
            class="thread-toggle"
            @click.stop="toggleThreadExtension"
          >
            <p>{{ thread.messages.length }}</p>
            <img
              v-if="!isThreadSelected || isSubMessageSelected"
              :class="isThreadExpanded ? 'collapse-thread': 'extend-thread'"
              src="@assets/icon_arrow_down_double.svg"
              alt="toggle thread"
            >
            <img
              v-show="isThreadSelected && !isSubMessageSelected"
              :class="isThreadExpanded ? 'collapse-thread': 'extend-thread'"
              src="@assets/icon_arrow_down_double_white.svg"
              alt="toggle thread"
            >
          </div>
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
        class="expanded"
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
</template>

<script>

import messagingUtils from '@/utils/messaging.utils'
import moment from 'moment'
import constants from '@/constants/messagingConstants'
import BaseIcon from '@components/Base/BaseIcon'
import ThreadMessage from '@components/Messaging/ThreadMessage'
import _ from 'lodash'
import messageService from '@/api/messaging/message.service'

export default {
  components: {
    BaseIcon,
    ThreadMessage
  },
  inject: ['mq'],
  props: {
    thread: {
      type: Object,
      required: true
    }
  },
  emits: ['openContextMenu'],
  data: function () {
    return {
      isThreadExpanded: false,
      isDragged: false
    }
  },
  computed: {
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
    isDraft () {
      return this.$store.state.messaging.currentFolder.type === constants.messagingDraftFolderType
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
    }
  },
  mounted () {
    this.isThreadExpanded = false
    this.isDragged = false
  },
  methods: {
    handleClick () {
      if (!this.isThreadSelected || this.$store.state.messaging.selectedMessages.length !== 0) {
        this.selectThread()
      } else if (this.thread.messages.length > 1) {
        this.toggleThreadExtension()
      }
    },
    selectThread () {
      messagingUtils.selectThread(this.thread, this.mainMessage)
    },
    toggleThreadExtension () {
      if (!this.isThreadSelected) {
        this.selectThread()
      }
      this.isThreadExpanded = !this.isThreadExpanded
    },
    ctrlSelectThread () {
      if (!this.mq.phone) { // no selection on mobile
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
      }
    },
    shiftSelectThread () {
      if (!this.mq.phone) { // no selection on mobile
        const selectedThreads = messagingUtils.selectBetween(this.thread)
        this.$store.dispatch('messaging/addSelectedThreads', selectedThreads)
      }
    },

    formatSentDate (message) {
      const sendDate = moment(message.sendDate, 'YYYY/MM/DD HH:mm:ss SSS')
      const today = moment().startOf('day')
      const yesterday = moment().subtract(1, 'days').startOf('day')

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
          this.isDragged = true
          isSelected = true
        }
      }
      if (!isSelected) {
        this.$store.dispatch('messaging/setLastSelectedThread', this.thread)
        this.$store.dispatch('messaging/setSelectedThreads', [this.thread])
        this.$store.dispatch('messaging/setSelectedMessages', [])

        messageService.getThreadMessages(this.thread.threadId, this.$store.state.messaging.currentFolder.folderId).then((data) => {
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

.main {
  display: flex;
  width: 100%;
  transition-property: border-bottom-right-radius, border-bottom-left-radius;
  transition-duration: .3s;

  &.selected:not(.subMessageSelected) {
    background-color: #27AAE1;
    color: white;

    .body {
      .line3 {
        p {
          color: white
        }
      }
    }
  }
  &.subMessageSelected {
    background-color: #D9E2EA;
  }
  &.dragged {
    z-index:100;
    opacity:0.5;
    background: none;
  }

  .icons {
    padding-top: 17px;
    padding-bottom: 10px;
    width: 40px;
    min-width: 40px;
    display: flex;
    flex-direction: column;
    align-items: center;

    .icon {
      margin-bottom: 7px;
    }

    .unread {
      color: #27AAE1;

      &.selected {
        color: white;
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
    padding: 10px 10px 10px 0;
    width: 100%;

    p {
      margin: 0;
    }

    .line1 {
      width: 100%;
      height: 20px;
      display: flex;
      margin-bottom: 5px;
      justify-content: space-between;
      .sender {
        font-weight: bold;
      }
      .sendDate {
        font-weight: 600;
        font-size: 0.75em;
        letter-spacing: 0;
        line-height: 19px;
      }
    }
    .line2 {
      height: 20px;
      display: flex;
      margin-bottom: 5px;
      justify-content: space-between;

      .thread-toggle {
        display: flex;
        align-items: center;
        cursor: pointer;
        border: 1px solid transparent;

        &:hover {
          font-weight: bold;
        }

        p {
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
          width: 6px;
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
        color: rgba(11, 60, 95, 0.7);
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
}
.expanded {
  background-color: rgba(39, 170, 255, 0.15);
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
