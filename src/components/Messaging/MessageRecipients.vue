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
        v-if="recipients.length > recipientsMaxLength && !isAllRecipientsDisplayed"
        class="others"
      >
        {{ formattedOtherRecipients }}
      </div>
    </div>
    <div
      v-if="recipients.length > recipientsMaxLength"
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
import moment from 'moment'

export default {
  name: 'MessageRecipients',
  components: { BaseIcon },
  props: {
    recipients: {
      type: Array,
      required: true
    },
    recipientsMaxLength: {
      type: Number,
      default: 3
    }
  },
  data () {
    return {
      isAllRecipientsDisplayed: false
    }
  },
  computed: {
    computedRecipientList () {
      if (this.isAllRecipientsDisplayed) {
        return this.recipients
      } else {
        return this.recipients.slice(0, this.recipientsMaxLength)
      }
    },
    formattedOtherRecipients () {
      const nbOtherRecipients = this.recipients.length - this.recipientsMaxLength
      return nbOtherRecipients > 1
        ? this.$t('Messaging.OtherRecipient1') + nbOtherRecipients + this.$t('Messaging.OtherRecipient2')
        : this.$t('Messaging.OtherRecipient')
    }
  },
  methods: {
    toggleAllRecipientsDisplay () {
      this.isAllRecipientsDisplayed = !this.isAllRecipientsDisplayed
    },
    formatReadDate (readDate) {
      if (readDate === undefined) {
        return ''
      }
      return moment(readDate, 'YYYY/MM/DD HH:mm:ss SSS')
        .format('[ ' + this.$t('Moment.the') + '] DD/MM/YYYY [' + this.$t('Moment.at') + '] HH:mm') // TODO call a suitable calendar ?
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
      color: black;
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
      color: black;
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
