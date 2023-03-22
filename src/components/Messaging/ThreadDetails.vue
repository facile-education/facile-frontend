<template>
  <section
    class="thread-details"
    data-test="messages-panel"
  >
    <!-- Contextual actions -->
    <div
      class="splitarea-header"
      :class="{'phone': mq.phone || mq.tablet}"
    >
      <IconOption
        v-if="mq.phone || mq.tablet"
        class="header-icon back-arrow"
        :icon="require('@assets/arrow_right.svg')"
        name="back"
        icon-height="20px"
        alt="back"
        @click="hideDetails"
      />
      <ul class="icons">
        <li>
          <IconOption
            class="header-icon new-icon"
            :icon="require('@/assets/options/icon_edit_texte.svg')"
            :title="$t('Messaging.new')"
            name="createNewMessage"
            icon-height="18px"
            alt="new message"
            @click="createNewMessage"
          />
        </li>
        <li
          v-if="isActionEnabled"
          class="separator"
        />
        <li>
          <IconOption
            v-if="isActionEnabled"
            class="header-icon trash-icon"
            :icon="require('@assets/icon_trash.svg')"
            :title="$t('Messaging.deleteMessage')"
            name="trash"
            icon-height="18px"
            alt="delete item"
            @click="deleteItem"
          />
        </li>
        <li
          v-if="isActionEnabled && (mq.phone || mq.tablet)"
          class="separator"
        />
        <li>
          <IconOption
            v-if="isActionEnabled && (mq.phone || mq.tablet)"
            class="header-icon read-icon"
            :icon="require('@/assets/options/icon_unread_filter.svg')"
            :title="$t('Messaging.markAsRead')"
            name="mark-as-read"
            icon-height="18px"
            alt="mark-as-read item"
            @click="markAsRead"
          />
        </li>
        <li
          v-if="isActionEnabled"
          class="separator"
        />
        <li>
          <IconOption
            v-if="isActionEnabled && !isDraft"
            class="header-icon"
            :icon="require('@assets/options/icon_answer.svg')"
            :title="$t('Messaging.reply')"
            name="reply"
            icon-height="18px"
            alt="reply"
            @click="reply"
          />
        </li>
        <li
          v-if="isActionEnabled"
          class="separator"
        />
        <li>
          <IconOption
            v-if="isActionEnabled && !isDraft"
            class="header-icon"
            :icon="require('@assets/options/icon_answer_all.svg')"
            :title="$t('Messaging.replyAll')"
            name="replyAll"
            icon-height="18px"
            alt="reply All"
            @click="replyAll"
          />
        </li>
        <li
          v-if="isActionEnabled"
          class="separator"
        />
        <li>
          <IconOption
            v-if="isActionEnabled && !isDraft"
            class="header-icon"
            :icon="require('@assets/options/icon_share.svg')"
            :title="$t('Messaging.forward')"
            name="forward"
            icon-height="18px"
            alt="forward"
            @click="forward"
          />
        </li>
        <li>
          <IconOption
            v-if="isActionEnabled && isDraft"
            class="header-icon"
            :icon="require('@assets/options/icon_edit_texte.svg')"
            :title="$t('Messaging.editDraft')"
            name="editDraft"
            icon-height="18px"
            alt="edit draft"
            @click="editDraft"
          />
        </li>
      </ul>
    </div>
    <hr>

    <div class="details">
      <!-- Multi-threads selected -->
      <div
        v-if="areMultiThreadsSelected"
        class="multi-threads"
      >
        <p>{{ nbSelectedThreads }} {{ $t('Messaging.multiThreads') }}</p>
      </div>

      <!-- PlaceHolder when no messages selected -->
      <div
        v-if="!messageToDisplay"
        class="placeholder"
      >
        <div v-t="'noSelectedMessage'" />
        <img
          src="@assets/messaging_placeholder.svg"
          alt=""
        >
      </div>

      <!-- Thread with 1 message -->
      <div
        v-else-if="!areMultiThreadsSelected && messageListWithoutSelfMessages.length === 1 || (selectedMessages.length === 1 && !isSelectedMessageFromRightPanel)"
        class="single-message"
      >
        <Message
          :key="messageToDisplay.messageId"
          :message="messageToDisplay"
        />
      </div>

      <!-- Thread with >1 messages -->
      <div
        v-else-if="!areMultiThreadsSelected"
        class="message-list"
      >
        <div
          v-for="message in messageListWithoutSelfMessages"
          :key="message.messageId"
          class="details-message"
          :class="{'theme-shadow-color': (isSelected(message))}"
          @click="selectMessage(message)"
        >
          <Message
            :message="message"
            :is-oldest-unread="oldestUnreadMessage && oldestUnreadMessage.messageId === message.messageId"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script>

import messageService from '@/api/messaging/message.service'
import messagingUtils from '@/utils/messaging.utils'
import Message from '@components/Messaging/Message'
import _ from 'lodash'
import IconOption from '@components/Base/IconOption'
import messagingConstants from '@/constants/messagingConstants'

export default {
  name: 'ThreadDetails',
  components: {
    IconOption,
    Message
  },
  inject: ['mq'],
  data () {
    return {
      isLoadingMessages: false,
      search: ''
    }
  },
  computed: {
    currentUser () {
      return this.$store.state.user
    },
    areMultiThreadsSelected () {
      return this.$store.state.messaging.selectedThreads.length > 1
    },
    selectedMessages () {
      return this.$store.state.messaging.selectedMessages
    },
    currentThreads () {
      return this.$store.state.messaging.threads
    },
    currentSelectedThreads () {
      return this.$store.state.messaging.selectedThreads
    },
    messageToDisplay () {
      return this.selectedMessages.length === 1 ? this.messageList[this.messageList.map(message => message.messageId).indexOf(this.selectedMessages[0].messageId)] : this.messageListWithoutSelfMessages[0]
    },
    isSelectedMessageFromRightPanel () {
      return this.$store.state.messaging.isSelectedMessageFromRightPanel
    },
    nbSelectedThreads () {
      return this.$store.state.messaging.selectedThreads.length
    },
    currentFolder () {
      return this.$store.state.messaging.currentFolder
    },
    isDraft () {
      return this.currentFolder.type === messagingConstants.messagingDraftFolderType
    },
    messageList () {
      return _.orderBy(this.$store.state.messaging.currentThreadMessages, 'sendDate', 'desc')
    },
    messageListWithoutSelfMessages () {
      const listWithoutSelfMessages = []

      for (let i = 0; i < this.messageList.length; ++i) {
        const message = this.messageList[i]
        if (this.currentFolder.type !== messagingConstants.messagingSentFolderType) {
          if (message.recipients.map(recipient => recipient.userId).indexOf(this.currentUser.userId) === -1 || message.folderName !== 'Envoyés') { // TODO based on folder type and not label
            listWithoutSelfMessages.push(message)
          }
        } else {
          if (message.senderId !== this.currentUser.userId || message.folderName === undefined) {
            listWithoutSelfMessages.push(message)
          }
        }
      }

      return listWithoutSelfMessages
    },
    oldestUnreadMessage () {
      let oldestUnreadMessage
      this.messageListWithoutSelfMessages.forEach((message) => { // Assume we browse messages from newest to oldest
        if (message.isNew) {
          oldestUnreadMessage = message
        }
      })
      return oldestUnreadMessage
    },
    originMessageId () {
      if (this.$store.state.messaging.isThreadSelected) {
        // Thread is selected -> pick last message
        return this.messageList[0].messageId
      } else {
        // Message is selected
        return this.selectedMessage.messageId
      }
    },
    isActionEnabled () {
      return (this.$store.state.messaging.selectedThreads.length + this.$store.state.messaging.selectedMessages.length) > 0
    }
  },
  methods: {
    hideDetails () {
      this.$store.dispatch('messaging/hideDetailPanel')
    },
    editDraft () {
      messagingUtils.editDraft(this.$store.state.messaging.selectedThreads[0].mainMessageId)
    },
    createNewMessage () {
      messagingUtils.newMessage()
    },
    markAsRead () {
      const messageIds = []
      let markAsRead = false

      // Add all selected messages
      for (const selectedMessage of this.selectedMessages) {
        if (selectedMessage.isNew) {
          markAsRead = true
        }
        messageIds.push(selectedMessage.messageId)
      }

      if (messageIds.length === 0) { // No messages selected
        // Pick all messages from selected thread
        for (const message of this.messageListWithoutSelfMessages) {
          if (message.isNew) {
            markAsRead = true
          }
          messageIds.push(message.messageId)
        }
      }

      messagingUtils.markMessagesAsReadUnread(messageIds, markAsRead)
    },
    selectMessage (message) {
      this.$store.dispatch('messaging/setIsSelectedMessageFromRightPanel', true)
      messagingUtils.selectMessage(message)
    },
    isSelected (message) {
      for (const selectedMessage of this.$store.state.messaging.selectedMessages) {
        if (message.messageId === selectedMessage.messageId) {
          return true
        }
      }
      return false
    },
    deleteItem () {
      if (this.$store.state.messaging.selectedMessages.length > 0) {
        messagingUtils.deleteSelectedMessage()
      } else if (this.$store.state.messaging.selectedThreads.length > 0) {
        messagingUtils.deleteSelectedThreads()
      }
    },
    reply () {
      messagingUtils.reply()
    },
    replyAll () {
      messagingUtils.replyAll()
    },
    forward () {
      messagingUtils.forward()
    },
    runSearch () {
      messageService.searchMessages(this.$store.state.messaging.currentFolder.folderId, this.search, this.$store.state.messaging.startIndex, this.$store.state.messaging.nbDisplayed, this.$store.state.messaging.unreadOnly).then((data) => {
        if (data.success) {
          this.$store.dispatch('messaging/setThreadList', data.threads)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@design';
ul {
  margin: 0;
  padding: 0;
  list-style-type: none;
}

.thread-details {
  height: 100%;
}

.splitarea-header {
  height: $messaging-header-height;
  padding: 0 10px 0 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .back-arrow {
    transform: rotate(180deg);
  }

  .icons {
    display: flex;
    align-items: center;
    opacity: 60%;
  }

  .header-icon {
    margin: 0 5px;
    padding: 5px;

    &.disabled {
      color: grey;
    }
  }

  .separator {
    height: 30px;
    border-right: 1px solid $color-border;
  }

  .search {
    background-size: 14px;
    background-position: 10px;
    background-repeat: no-repeat;
    text-indent: 30px;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    height: 38px;
    width: 159px;
    border: 1px solid #D9E2EA;
    border-radius: 6px;
  }

  &.phone {
    .icons {
      opacity: 100%;
    }
  }
}

hr {
  margin: 0;
  border: 0; border-top: 1px solid $color-border-menu;
}

.details {
  background-color: white;
  height: calc(100% - (#{$messaging-header-height} + 2px));
  overflow: auto;

  .multi-threads {
    p {
      text-align: center;
      font-size: 14pt;
      margin-top: 100px;
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

  .single-message {
    padding: 10px;

    .message {
      border-radius: 0;
      background-color: white;
      border: none;
      box-shadow: none;
    }
    .phone-message {
      padding: 0;
    }
  }

  .message-list {
    padding: 10px;
    .details-message {
      margin-bottom: 10px;
      border-radius: 6px;
      border: 2px solid white;

      .message-header {
        display: flex;
        .sender-icon {
          width: 50px;
        }
        .header-main {
          flex-grow: 1;
          .header-line1 {
            width: 100%;
            display: flex;
            justify-content: space-between;
            padding-bottom: 3px;
          }
          .header-line2 {
            width: 100%;
            display: flex;
            justify-content: space-between;
          }
        }
      }
      .message-body {
        width: 100%;
        padding: 20px;
      }
    }
  }
}
</style>

<i18n locale="fr">
{
  "noSelectedMessage": "Sélectionnez un fil de discussion ou un message"
}
</i18n>
