<template>
  <div
    class="thread-message"
    :class="{'selected': isMessageSelected,
             'last' : isLast,
             'shifted': isMultiSelectionActive}"
    @click.exact="selectMessage"
  >
    <div class="icons">
      <BaseIcon
        v-if="message.isNew"
        name="circle"
        class="fa-xs unread icon"
        :class="{'selected' : isMessageSelected}"
        :title="$t('Messaging.new')"
      />
      <img
        v-if="message.hasAttachFiles"
        class="icon attached-file-icon"
        :src="isMessageSelected ? require('@assets/icon_pj_white.svg') : require('@assets/icon_pj.svg')"
        alt="has attached files"
        :title="$t('Messaging.hasAttachedFiles')"
      >
      <img
        v-if="message.isAnswered"
        class="icon answered-icon"
        :src="isMessageSelected ? require('@assets/options/icon_answer_white.svg') : require('@assets/options/icon_answer.svg')"
        alt="is answered"
        :title="$t('Messaging.answered')"
      >
      <img
        v-if="message.isForwarded"
        class="icon forwarded-icon"
        :src="isMessageSelected ? require('@assets/options/icon_share_white.svg') : require('@assets/options/icon_share.svg')"
        alt="is forwarded"
        :title="$t('Messaging.forwarded')"
      >
    </div>
    <div
      class="body"
      :class="{
        'first' : isFirst,
        'last' : isLast,
        'others' : !isLast}"
    >
      <!-- Line 1 : recipients + date -->
      <div class="line1">
        <p class="sender">
          {{ message.senderName }}
        </p>
        <p class="sendDate">
          {{ formatSentDate() }}
        </p>
      </div>

      <!-- Line 2 : content -->
      <div class="line3">
        <p>{{ message.previewContent }}</p>
      </div>
    </div>
  </div>
</template>

<script>

import messagingUtils from '@/utils/messaging.utils'
import dayjs from 'dayjs'
import BaseIcon from '@components/Base/BaseIcon'

export default {
  components: {
    BaseIcon
  },
  props: {
    message: {
      type: Object,
      required: true
    },
    isFirst: {
      type: Boolean,
      required: true
    },
    isLast: {
      type: Boolean,
      required: true
    }
  },
  computed: {
    isMessageSelected () {
      return messagingUtils.isMessageSelected(this.message)
    },
    isMultiSelectionActive () {
      return this.$store.state.messaging.isMultiSelectionActive
    }
  },
  methods: {
    selectMessage () {
      for (const thread of this.$store.state.messaging.threads) {
        if (thread.threadId === this.message.threadId) {
          // Set thread for details panel to be updated
          messagingUtils.selectThread(thread)
          // Set message
          this.$store.dispatch('messaging/setIsSelectedMessageFromRightPanel', false)
          messagingUtils.selectMessage(this.message)
          this.$store.dispatch('messaging/showDetailPanel')
          break
        }
      }
    },
    formatSentDate () {
      const sendDate = dayjs(this.message.sendDate, 'YYYY/MM/DD HH:mm:ss')
      const today = dayjs().startOf('day')
      const yesterday = dayjs().subtract(1, 'days').startOf('day')

      if (sendDate.isSame(yesterday, 'd')) {
        return 'hier'
      } else if (sendDate.isSame(today, 'd')) {
        return sendDate.format('HH:mm')
      } else {
        return sendDate.format('DD/MM/YYYY HH:mm')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@design';

.thread-message {
  display: flex;
  &.selected {
    background-color: #27AAE1;
    color: white;
  }
  &.last {
    border-bottom: none;
  }
  &.shifted {
    margin-left: 30px;
  }

  .icons {
    margin-left: 15px;
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
      color: blue;

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
    flex-grow: 1;
    padding: 10px 10px 10px 0;
    border-top: 1px solid $color-border-menu;
    &.first {
      //border-top: none;
    }

    p {
      margin: 0;
    }

    .line1 {
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
      display: flex;
      justify-content: space-between;
      .thread-toggle {
        display: flex;
        p {
          margin: auto;
          padding-right: 3px;
        }
        .arrow {
          margin: auto;
        }
      }
    }
    .line3 {
      margin-bottom: 5px;
      margin-right: 10px;
      font-size: 12px;
      font-weight: lighter;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}

</style>
