<template>
  <div class="message-recipients">
    <div class="recipients-list">
      <div
        v-t="'Messaging.to'"
        class="to-label"
      />
      <div
        v-for="(recipient, index) in computedRecipientList"
        :key="index"
        class="recipient"
        :class="{'last-recipient' : index === computedRecipientList.length - 1}"
      >
        <div class="recipientName">
          {{ recipient.text }}
        </div>
        <BaseIcon
          v-if="recipient.hasRead === true"
          class="has-read-icon"
          name="check"
          :title="$t('Messaging.hasRead') + formatReadDate(recipient.readDate)"
        />
        <div v-if="index !== computedRecipientList.length - 1">
          ,
        </div>
      </div>
      <div
        v-if="nbRecipients > nbDisplayed && !isAllRecipientsDisplayed"
        class="others"
      >
        {{ formattedOtherRecipients }}
      </div>
    </div>
    <div
      v-if="nbRecipients > nbDisplayed"
      class="toggle-icon-container"
      :title="isAllRecipientsDisplayed ? $t('Messaging.hideAllRecipients') : $t('Messaging.showAllRecipients')"
      @click.stop="toggleAllRecipientsDisplay"
    >
      <div> {{ isAllRecipientsDisplayed ? $t('Messaging.hideAllRecipients') : $t('Messaging.showAllRecipients') }}</div>
    </div>
  </div>
</template>

<script>
import BaseIcon from '@components/Base/BaseIcon'
import dayjs from 'dayjs'

export default {
  name: 'MessageRecipients',
  components: { BaseIcon },
  props: {
    recipients: {
      type: Array,
      required: true
    },
    nbRecipients: {
      type: Number,
      default: 1
    }
  },
  data () {
    return {
      isAllRecipientsDisplayed: false,
      nbDisplayed: 2
    }
  },
  computed: {
    computedRecipientList () {
      if (this.isAllRecipientsDisplayed) {
        return this.recipients
      } else {
        return this.recipients.slice(0, this.nbDisplayed)
      }
    },
    formattedOtherRecipients () {
      const nbOtherRecipients = this.nbRecipients - this.nbDisplayed
      return nbOtherRecipients > 1
        ? this.$t('Messaging.OtherRecipient1') + nbOtherRecipients + this.$t('Messaging.OtherRecipient2')
        : this.$t('Messaging.OtherRecipient')
    }
  },
  created () {
    this.isAllRecipientsDisplayed = false
  },
  methods: {
    toggleAllRecipientsDisplay () {
      this.isAllRecipientsDisplayed = !this.isAllRecipientsDisplayed
    },
    formatReadDate (readDate) {
      if (readDate === undefined) {
        return ''
      }
      return dayjs(readDate, 'YYYY/MM/DD HH:mm:ss')
        .format('[ ' + this.$t('Moment.the') + '] DD/MM/YYYY [' + this.$t('Moment.at') + '] HH:mm')
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";
.message-recipients {
  display: flex;
  width: 100%;

  .recipients-list {
    flex: 1;
    display: flex;
    flex-wrap: wrap;
    align-items: center;

    .to-label {
      margin-right: 0.5em;
    }

    .recipient {
      display: flex;
      align-items: center;
      font-size: 0.875em;
      color: $color-messaging-dark-text;
      margin-right: 0.5em;

      &.last-recipient {
        margin-right: 0;
      }

      .has-read-icon {
        margin-left: 5px;
        font-size: 0.8em;
        color: green;
      }
    }

    .others {
      font-size: 0.875em;
      color: $color-messaging-dark-text;
      margin-left: 0.3em;
    }
  }

  .toggle-icon-container {
    margin-right: 10px;
    margin-left: 5px;
    cursor: pointer;
    font-size: 0.875em;
    color: blue;

    &:hover {
      font-weight: bold;
    }
  }
}

</style>
