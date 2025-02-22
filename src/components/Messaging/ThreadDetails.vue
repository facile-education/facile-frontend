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
        icon="icon-chevron-right-s"
        name="back"
        icon-height="28px"
        alt="back"
        @click="hideDetails"
      />
      <ul class="icons">
        <li>
          <IconOption
            v-if="isActionEnabled"
            class="header-icon trash-icon"
            icon="icon-trash"
            :title="$t('Messaging.deleteMessage')"
            name="trash"
            icon-height="20px"
            alt="delete item"
            @click="deleteItem"
          />
        </li>
        <li
          v-if="isActionEnabled"
          class="separator"
        />
        <li>
          <IconOption
            v-if="isActionEnabled && !isDraft && !isSenderDeleted"
            class="header-icon"
            :icon="require('@assets/icons/answer.svg')"
            :title="$t('Messaging.reply')"
            name="reply"
            icon-height="18px"
            alt="reply"
            @click="reply"
          />
        </li>
        <li
          v-if="isActionEnabled && !isDraft && !isSenderDeleted"
          class="separator"
        />
        <li>
          <IconOption
            v-if="isActionEnabled && !isDraft && !isSenderDeleted"
            class="header-icon"
            :icon="require('@assets/icons/answer_all.svg')"
            :title="$t('Messaging.replyAll')"
            name="replyAll"
            icon-height="18px"
            alt="reply All"
            @click="replyAll"
          />
        </li>
        <li
          v-if="isActionEnabled && !isDraft && !isSenderDeleted"
          class="separator"
        />
        <li>
          <IconOption
            v-if="isActionEnabled && !isDraft"
            class="header-icon"
            :icon="require('@assets/icons/share.svg')"
            :title="$t('Messaging.forward')"
            name="forward"
            icon-height="18px"
            alt="forward"
            @click="forward"
          />
        </li>
        <li>
          <IconOption
            v-if="isDraftEditionEnabled && isDraft"
            class="header-icon"
            icon="icon-edit"
            :title="$t('Messaging.editDraft')"
            name="editDraft"
            icon-height="19px"
            alt="edit draft"
            @click="editDraft"
          />
        </li>
      </ul>
      <WeprodeButton
        v-if="!(mq.phone || mq.tablet)"
        class="create-button"
        data-test="createMessageButton"
        @click="createNewMessage"
      >
        <CustomIcon icon-name="icon-plus" />
        <span v-t="'Messaging.new'" />
      </WeprodeButton>
    </div>
    <hr>

    <div class="details">
      <!-- Multi-threads selected -->
      <div
        v-if="areMultiThreadsSelected"
        class="multi-threads"
      >
        <p>{{ $t('Messaging.multiThreads', {n: nbSelectedThreads}) }}</p>
      </div>

      <!-- PlaceHolder when no messages selected -->
      <div
        v-if="!messageToDisplay"
        class="placeholder"
      >
        <div v-t="'Messaging.ThreadDetails.noSelectedMessage'" />
        <img
          src="@/assets/icons/messaging_placeholder.svg"
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

import CustomIcon from '@components/Base/CustomIcon.vue'
import IconOption from '@components/Base/IconOption'
import WeprodeButton from '@components/Base/Weprode/WeprodeButton.vue'
import Message from '@components/Messaging/Message'
import _ from 'lodash'

import { MESSAGING } from '@/constants/appConstants'
import messagingConstants, { messagingSentFolderType } from '@/constants/messagingConstants'
import messagingUtils from '@/utils/messaging.utils'

export default {
  name: 'ThreadDetails',
  components: {
    CustomIcon,
    IconOption,
    Message,
    WeprodeButton
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
    isSenderDeleted () {
      if (this.$store.state.messaging.selectedMessages.length === 1) {
        // Message is selected -> use it
        return this.$store.state.messaging.selectedMessages[0].isSenderDeleted
      } else if (this.$store.state.messaging.selectedThreads.length === 1) {
        // Thread is selected -> pick last message
        return messagingUtils.getThreadLastMessage(this.$store.state.messaging.selectedThreads[0]).isSenderDeleted
      } else {
        return false
      }
    },
    isDraft () {
      return this.currentFolder.type === messagingConstants.messagingDraftFolderType
    },
    messageList () {
      return _.orderBy(this.$store.state.messaging.currentThreadMessages, 'sendDate', 'desc')
    },
    messageListWithoutSelfMessages () {
      const listWithoutSelfMessages = []

      for (const message of this.messageList) {
        if (this.currentFolder.type !== messagingConstants.messagingSentFolderType) {
          if (message.recipients.map(recipient => recipient.userId).indexOf(this.currentUser.userId) === -1 || message.messagingFolder.type !== messagingSentFolderType) {
            listWithoutSelfMessages.push(message)
          }
        } else if (message.sender.userId !== this.currentUser.userId || message.isInCurrentFolder) {
          listWithoutSelfMessages.push(message)
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
    },
    isDraftEditionEnabled () {
      return this.$store.state.messaging.selectedThreads.length > 0 || (this.$store.state.messaging.selectedMessages.length > 0 && this.$store.state.messaging.selectedMessages[0].isDraft)
    }
  },
  methods: {
    hideDetails () {
      this.$store.dispatch('messaging/setSelectedThreads', [])
      this.$store.dispatch('messaging/hideDetailPanel')
      // Reload inbox when going back from a routing message
      if (this.$store.state.messaging.displayMessageFromRouting) {
        this.$router.push({ name: MESSAGING })
        this.$store.dispatch('messaging/setDisplayMessageFromRouting', false)
      }
    },
    editDraft () {
      if (this.$store.state.messaging.selectedThreads.length > 0) {
        messagingUtils.editDraft(this.$store.state.messaging.selectedThreads[0].mainMessageId)
      } else if (this.$store.state.messaging.selectedMessages.length > 0 && this.$store.state.messaging.selectedMessages[0].isDraft) {
        messagingUtils.editDraft(this.$store.state.messaging.selectedMessages[0].messageId)
      }
    },
    createNewMessage () {
      messagingUtils.newMessage()
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
.create-button {
  @extend %create-button;
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
