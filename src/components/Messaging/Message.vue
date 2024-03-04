<template>
  <div
    v-if="message!==undefined"
    ref="message"
    class="message"
    :class="{'phone-message': mq.phone || mq.tablet}"
    data-test="message"
  >
    <!-- Source folder -->
    <div
      v-if="!message.isInCurrentFolder"
      class="message-sourcefolder"
    >
      <img
        v-if="isFolderIconImage"
        :src="folderIcon"
        alt=""
      >
      <CustomIcon
        v-else
        class="custom-icon"
        :icon-name="folderIcon"
      />
      <span>
        {{ $t('Messaging.findInFolder') + ' ' + folderName }}
      </span>
    </div>

    <!-- Header -->
    <div class="message-header">
      <div
        v-if="message.isNew"
        class="unread theme-background-color"
      />
      <div class="header-main">
        <div class="header-line1">
          <p class="sender">
            <a
              v-if="message.sender.isValidUser"
              href="#"
              style="color: black;"
              class="toggle-user-card"
              @click.prevent="openUserCardModal"
            >
              {{ displayedName }}
            </a>
            <span v-else>{{ displayedName }}</span>
          </p>
          <p
            class="sent-date"
            data-test="sent-date"
          >
            {{ formatSentDate() }}
          </p>
        </div>
        <div class="header-line2">
          <p>{{ message.subject }}</p>
        </div>
        <div class="header-line3">
          <MessageRecipients
            :recipients="message.recipients"
            :nb-recipients="message.nbRecipients"
          />
        </div>
      </div>
    </div>
    <hr>

    <!-- Body -->
    <div class="message-content">
      <!-- eslint-disable-next-line vue/no-v-html -->
      <p v-html="message.fullContent" />
    </div>

    <!-- Attached files-->
    <AttachedFiles
      v-if="message.hasAttachFiles"
      :model-value="message.attachments"
      :read-only="true"
    />
  </div>
</template>

<script>
import CustomIcon from '@components/Base/CustomIcon.vue'
import MessageRecipients from '@components/Messaging/MessageRecipients'
import MessagingUtils from '@utils/messaging.utils.js'
import dayjs from 'dayjs'
import { defineAsyncComponent } from 'vue'

import { DATE_EXCHANGE_FORMAT } from '@/api/constants'
import {
  messagingDraftFolderType,
  messagingInboxFolderType,
  messagingSentFolderType,
  messagingTrashFolderType
} from '@/constants/messagingConstants.js'
const AttachedFiles = defineAsyncComponent(() => import('@components/AttachedFiles/AttachedFiles.vue'))

export default {
  name: 'Message',
  components: {
    CustomIcon,
    MessageRecipients,
    AttachedFiles
  },
  inject: ['mq'],
  props: {
    message: {
      type: Object,
      required: true
    },
    isOldestUnread: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    folderIcon () {
      switch (this.message.messagingFolder?.type) {
        case messagingInboxFolderType:
          return require('@assets/icons/inbox.svg')
        case messagingDraftFolderType:
          return require('@assets/icons/draft.svg')
        case messagingSentFolderType:
          return require('@assets/icons/sent.svg')
        case messagingTrashFolderType:
          return 'icon-trash'
        default:
          return 'icon-folder'
      }
    },
    folderName () {
      return MessagingUtils.getMessagingFolderName(this.message.messagingFolder)
    },
    isFolderIconImage () {
      return this.folderIcon?.indexOf('svg') !== -1
    },
    displayedName () {
      if (this.message.sender.isSenderDeleted) {
        return this.$t('Messaging.userDelete', { user: this.message.sender.userName })
      } else {
        return this.message.sender.userName
      }
    }
  },
  mounted () {
    if (this.isOldestUnread && !this.mq.phone) {
      // this.$refs.message.scrollIntoView(true)
      this.$refs.message.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' }) // To test in safari, do like above if it's not working
    }
  },
  methods: {
    formatSentDate () {
      return dayjs(this.message.sendDate, DATE_EXCHANGE_FORMAT).format('DD/MM/YYYY HH:mm')
    },
    openUserCardModal () {
      this.$store.dispatch('userCard/initUserCard', this.message.sender)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

.single-message .message {
  padding: 10px 1em 0 1em;
}

.message {
  border-radius: 6px;
  border: 1px solid $color-border;
  box-shadow: 0 2px 14px 0 rgba(0,0,0,0.1);
  padding: 10px 1.4em 0 1.4em;

  p {
    margin: 0;
  }

  .message-sourcefolder {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    height: 1.875em;
    font-size: 0.750em;
    color: $color-new-light-text;

    img {
      margin-right: 6px;
      height: 1em;
    }

    .custom-icon {
      margin-right: 4px;
      font-size: 1rem;
    }
  }

  .message-header {
    position: relative;
    display: flex;

    .unread {
      @extend %messaging-pellet;
      position: absolute;
      top: 6px;
      left: -0.5em;
      transform: translateX(-50%);
    }

    .header-main {
      margin-left: 1%;
      flex-grow: 1;
      .header-line1 {
        width: 100%;
        display: flex;
        justify-content: space-between;

        .sender {
          font-weight: bold;
        }

        .sent-date {
          font-weight: lighter;
          font-size: 13px;
        }
      }
      .header-line2 {
        width: 100%;
        display: flex;
        justify-content: space-between;
        padding-top: 3px;
        padding-bottom: 3px;
      }
    }
  }

  hr {
    width: 100%;
    border: none;
    height: 1px;
    background-color: $color-border-menu;
  }

  .message-content {
    padding: 10px 10px 10px 10px;
    p {
      margin: 5px 0;
      line-height: 1.25rem;
      width: 100%;
      overflow-wrap: break-word;
    }

    p ::deep p {
      margin: 5px 0;
      line-height: 1.25rem;
      overflow-wrap: break-word;
    }

    p ::deep figure {
      margin: 5px 0;
      line-height: 1.25rem;
      overflow-wrap: break-word;
    }
  }
}
</style>
