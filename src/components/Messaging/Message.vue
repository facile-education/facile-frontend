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
      <img
        :src="folderIcon"
        alt=""
      >
      <span>
        {{ $t('Messaging.findInFolder') + ' ' + message.folderName }}
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
import MessageRecipients from '@components/Messaging/MessageRecipients'
import dayjs from 'dayjs'
import { defineAsyncComponent } from 'vue'
const AttachedFiles = defineAsyncComponent(() => import('@components/AttachedFiles/AttachedFiles.vue'))

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
    folderIcon () {
      switch (this.message.folderName) { // TODO use a kee which deserve this name
        case 'Boîte de réception':
          return require('@/assets/icon_reception.svg')
        case 'Brouillons':
          return require('@/assets/icon_fichier.svg')
        case 'Envoyés':
          return require('@/assets/icon_envoyes.svg')
        case 'Corbeille':
          return require('@/assets/icons/trash.svg')
        default:
          return require('@/assets/icon_messaging_folder.svg')
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
      return dayjs(this.message.sendDate, 'YYYY/MM/DD HH:mm:ss').format('DD/MM/YYYY HH:mm')
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
