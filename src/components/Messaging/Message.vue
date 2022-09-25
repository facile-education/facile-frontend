<template>
  <div
    v-if="message!==undefined"
    class="message"
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
          <p>{{ message.subject }}</p>
        </div>
        <div class="header-line3">
          <MessageRecipients
            :recipients="message.recipients"
            :recipients-max-length="2"
          />
        </div>
      </div>
    </div>
    <hr>

    <!-- Attached files-->
    <AttachedFiles
      v-if="message.hasAttachFiles"
      :initial-attached-files="message.attachments"
      :read-only="true"
      class="files"
    />

    <!-- Body -->
    <div class="message-content">
      <!-- TODO: sanitize content -->
      <!-- eslint-disable-next-line vue/no-v-html -->
      <p v-html="message.fullContent" />
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import AttachedFiles from '@components/Base/AttachedFiles'
import messagingUtils from '@/utils/messaging.utils'
import MessageRecipients from '@components/Messaging/MessageRecipients'

export default {
  name: 'Message',
  components: {
    MessageRecipients,
    AttachedFiles
  },
  props: {
    message: {
      type: Object,
      required: true
    }
  },
  computed: {
    isSentFolder () {
      return messagingUtils.isSentFolder()
    },
    senderAcronym () {
      return this.message.senderName ? this.message.senderName.split(' ').map((n) => n[0].toUpperCase()).join(' ') : ''
    }
  },
  methods: {
    formatSentDate () {
      return moment(this.message.sendDate, 'YYYY/MM/DD HH:mm:ss SSS').format('DD/MM/YYYY HH:mm')
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

.message {
  color: #0B3C5F;
  border-radius: 6px;
  background-color: white;
  box-shadow: 0 2px 14px 0 rgba(0,0,0,0.1);

  p{
    margin: 3px 0;
  }

  .message-sourcefolder {
    padding: 3px 0;
    border-bottom: 1px solid black;
    font-style: italic;
    text-align: center;
  }

  .message-header {
    display: flex;
    padding-top: 5px;

    .sender-icon {
      min-width: 55px;
      display: flex;
      justify-content: center;

      .icon-container {
        margin-top : 8px;
        height: 40px;
        width: 40px;
        border-radius: 20px;
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
        padding-right: 10px;

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
    width: 95%;
    border: none;
    height: 1px;
    background-color: #D9E2EA;
  }
  .message-content {
    padding: 10px 10px 10px 20px;
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
