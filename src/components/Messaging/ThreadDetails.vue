<template>
  <div class="container">
    <!-- Contextual actions -->
    <div class="splitarea-header">
      <IconOption
        v-if="isActionEnabled"
        class="header-icon trash-icon"
        :icon="require('@assets/options/icon_trash.svg')"
        :icon-white="require('@assets/options/icon_trash_white.svg')"
        :title="$t('Messaging.deleteMessage')"
        :gray-background-color="true"
        name="trash"
        icon-height="14px"
        alt="delete item"
        @click="deleteItem"
      />
      <div
        v-if="isActionEnabled"
        class="icons"
      >
        <IconOption
          v-if="!isDraft"
          class="header-icon"
          :icon="require('@assets/options/icon_answer.svg')"
          :icon-white="require('@assets/options/icon_answer_white.svg')"
          :title="$t('Messaging.reply')"
          :gray-background-color="true"
          name="reply"
          icon-height="14px"
          alt="reply"
          @click="reply"
        />
        <IconOption
          v-if="!isDraft"
          class="header-icon"
          :icon="require('@assets/options/icon_answer_all.svg')"
          :icon-white="require('@assets/options/icon_answer_all_white.svg')"
          :title="$t('Messaging.replyAll')"
          :gray-background-color="true"
          name="replyAll"
          icon-height="14px"
          alt="reply All"
          @click="replyAll"
        />
        <IconOption
          v-if="!isDraft"
          class="header-icon"
          :icon="require('@assets/options/icon_share.svg')"
          :icon-white="require('@assets/options/icon_share_white.svg')"
          :title="$t('Messaging.forward')"
          :gray-background-color="true"
          name="forward"
          icon-height="14px"
          alt="forward"
          @click="forward"
        />
        <IconOption
          v-if="isDraft"
          class="header-icon"
          :icon="require('@assets/options/icon_edit_texte.svg')"
          :icon-white="require('@assets/options/icon_edit_texte_white.svg')"
          :title="$t('Messaging.editDraft')"
          :gray-background-color="true"
          name="editDraft"
          icon-height="16px"
          alt="edit draft"
          @click="editDraft"
        />
      </div>
      <!--      <input-->
      <!--        v-model="search"-->
      <!--        class="search"-->
      <!--        :style="{ backgroundImage: 'url(\'' + require('@/assets/icon_search.svg') + '\')' }"-->
      <!--        :placeholder="$t('Messaging.search')"-->
      <!--        @keyup.enter="runSearch"-->
      <!--        @keyup.escape="search = ''"-->
      <!--      >-->
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
        v-t="'Messaging.noSelectedMessage'"
        class="placeholder"
      />

      <!-- Thread with 1 message -->
      <div
        v-else-if="!areMultiThreadsSelected && messageListWithoutSelfMessages.length === 1 || (selectedMessages.length === 1 && !isSelectedMessageFromRightPanel)"
        class="single-message"
      >
        <Message :message="messageToDisplay" />
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
          :class="{'selected': (isSelected(message))}"
          @click="selectMessage(message)"
        >
          <Message :message="message" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import messageService from '@/api/messaging/message.service'
import messagingUtils from '@/utils/messaging.utils'
import Message from '@components/Messaging/Message'
import _ from 'lodash'
import IconOption from '@components/Base/IconOption'
import constants from '@/constants/messagingConstants'

export default {
  name: 'ThreadDetails',
  components: {
    IconOption,
    Message
  },
  props: {
  },
  data: function () {
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
      return this.currentFolder.type === constants.messagingDraftFolderType
    },
    messageList () {
      return _.orderBy(this.$store.state.messaging.currentThreadMessages, 'sendDate', 'desc')
    },
    messageListWithoutSelfMessages () {
      const listWithoutSelfMessages = []

      for (let i = 0; i < this.messageList.length; ++i) {
        const message = this.messageList[i]
        if (this.currentFolder.type !== constants.messagingSentFolderType) {
          if (message.recipients.map(recipient => recipient.id).indexOf(this.currentUser.id) === -1 || message.folderName !== 'Envoyés') { // TODO based on folder type and not label
            listWithoutSelfMessages.push(message)
          }
        } else {
          if (message.senderId !== this.currentUser.id || message.folderName === undefined) {
            listWithoutSelfMessages.push(message)
          }
        }
      }

      return listWithoutSelfMessages
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
  created () {
  },
  methods: {
    editDraft () {
      messagingUtils.editDraft(this.$store.state.messaging.selectedThreads[0].mainMessageId)
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

.container {
  height: 100%;
}

.splitarea-header {
  height: 74px;
  padding: 0 10px 0 21px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .icons {
    display: flex;
    align-items: center;
  }

  .header-icon {
    margin: 0 5px;
    padding: 5px;
    width: 30px;
    height: 30px;
    border: 1px solid transparent;

    &.disabled {
      color: grey;
    }
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
}

hr {
  margin: 0;
  border: 0; border-top: 1px solid #D9E2EA;
}

.details {
  height: calc(100% - (74px + 2px));
  overflow: auto;
  background-color: #F3F6F8;

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
    padding-top: 20%;
    color: #0B3C5F;
    text-align: center;
    font-weight: bold;
    font-size: 1.5em;
  }

  .single-message {
    padding: 10px;
    border: 2px solid white;
  }

  .message-list {
    padding: 10px;
    .details-message {
      margin-bottom: 10px;
      border-radius: 6px;
      border: 2px solid white;

      &.selected {
        border: 2px solid #27AAE1;
        box-shadow: 0 0 6px #27AAE1;
      }

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