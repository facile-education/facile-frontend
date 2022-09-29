<template>
  <div
    class="popup"
    title=""
    @click.stop
  >
    <div
      v-for="(recipient, index) in recipients"
      :key="index"
      class="recipient"
    >
      <div class="recipient-name">
        {{ recipient.text }}
      </div>
      <BaseIcon
        v-if="recipient.hasRead === true"
        class="has-read-icon"
        name="check"
        :title="$t('Messaging.hasRead') + formatReadDate(recipient.readDate)"
      />
    </div>
  </div>
</template>

<script>
import BaseIcon from '@components/Base/BaseIcon'
import dayjs from 'dayjs'
export default {
  name: 'AllRecipientsPopup',
  components: { BaseIcon },
  props: {
    recipients: {
      type: Array,
      required: true
    }
  },
  emits: ['close'],
  mounted () {
    window.addEventListener('click', this.clickOutside)
  },
  beforeUnmount () {
    window.removeEventListener('click', this.clickOutside)
  },
  methods: {
    formatReadDate (readDate) {
      if (readDate === undefined) {
        return ''
      }
      return dayjs(readDate, 'YYYY/MM/DD HH:mm:ss')
        .format('[ ' + this.$t('Moment.the') + '] DD/MM/YYYY [' + this.$t('Moment.at') + '] HH:mm') // TODO call a suitable calendar ?
    },
    clickOutside (e) {
      const self = this
      if (self.$el && !self.$el.contains(e.target)) {
        this.close()
      }
    },
    close () {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

.popup {
  width: 225px;
  max-height: 1000px;
  overflow: auto;
  cursor: default;
  background-color: white;
  border: 1px solid $color-border-menu;
  border-radius: 6px;
  padding: 5px 20px;
  box-shadow: 0 2px 14px 0 rgba(0,0,0,0.1);

  .recipient {
    margin: 10px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .has-read-icon {
      margin-left: 5px;
      font-size: 1em;
      color: green;
    }
  }
}
</style>
