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
      v-if="message.folderName !== undefined"
      class="message-sourcefolder"
    >
      <p>{{ $t('Messaging.findInFolder') + ' ' + message.folderName }}</p>
    </div>

    <!-- Header -->
    <div class="message-header">
      <div class="sender-icon">
        <div
          v-if="message.isNew"
          class="is-read"
        />
        <div class="icon-container">
          {{ senderAcronym }}
        </div>
      </div>
      <div class="header-main">
        <div class="header-line1">
          <p class="sender">
            {{ message.senderName }}
          </p>
          <p
            class="sent-date"
            data-test="sent-date"
          >
            {{ formatSentDate() }}
          </p>
        </div>
        <div class="header-line2">
          <p v-html="message.subject" />
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
      <!-- TODO: sanitize content -->
      <!-- eslint-disable-next-line vue/no-v-html -->
      <p v-html="message.fullContent" />
    </div>

    <!-- Attached files-->
    <AttachedFiles
      v-if="message.hasAttachFiles"
      :attached-files="message.attachments"
      :read-only="true"
      class="files"
    />
  </div>
</template>

<script>
import dayjs from 'dayjs'
import AttachedFiles from '@components/Base/AttachedFiles'
import messagingUtils from '@/utils/messaging.utils'
import MessageRecipients from '@components/Messaging/MessageRecipients'

export default {
  name: 'Message',
  components: {
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
    isSentFolder () {
      return messagingUtils.isSentFolder()
    },
    senderAcronym () {
      return this.message.senderName ? (this.message.senderName.includes('(') ? 'US' : this.message.senderName.trim().split(' ').map((n) => n[0].toUpperCase()).join(' ')) : ''
    }
  },
  mounted () {
    if (this.isOldestUnread) {
      // this.$refs.message.scrollIntoView(true)
      this.$refs.message.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' }) // To test in safari, do like above if it's not working
    }
  },
  methods: {
    formatSentDate () {
      return dayjs(this.message.sendDate, 'YYYY/MM/DD HH:mm:ss').format('DD/MM/YYYY HH:mm')
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

.message {
  color: $color-messaging-dark-text;
  border-radius: 6px;
  background-color: white;
  border: 1px solid $color-border;
  box-shadow: 0 2px 14px 0 rgba(0,0,0,0.1);
  padding: 0 20px;

  p{
    margin: 3px 0;
  }

  .message-sourcefolder {
    padding: 3px 0;
    border-bottom: 1px solid $color-border-menu;
    font-style: italic;
    text-align: center;
    font-size: 0.915rem;
  }

  .message-header {
    display: flex;
    padding-top: 5px;

    .sender-icon {
      position: relative;
      min-width: 50px;
      display: flex;
      justify-content: flex-start;

      .is-read {
        position: absolute;
        top: 2px;
        left: -5px;
        width: 12px;
        height: 12px;
        border-radius: 5px;
        background-color: $color-messaging-bg;
      }

      .icon-container {
        margin-top : 8px;
        height: 50px;
        width: 50px;
        border-radius: 25px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: grey;
        font-weight: bold;
        color: white;
        white-space: nowrap;
        word-spacing: -2px;
      }
    }
    .header-main {
      margin-left: 1%;
      flex-grow: 1;
      .header-line1 {
        width: 100%;
        margin-top: 3px;
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
      margin: 0;
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    p ::v-deep p {
      margin: 0;
    }

    p ::v-deep figure {
      margin: 0;
    }
  }
}
</style>
