<template>
  <div
    class="tag"
    :class="isDone ? 'done' : (isToDo ? 'to-do' : 'not-done')"
  >
    {{ label }}
  </div>
  <div
    v-if="isDone"
    class="done-data"
  >
    <span v-if="!mq.phone">
      {{ $t('Call.by') + ' ' }}
    </span>
    <a
      v-if="!mq.phone"
      href="#"
      style="color: black;"
      class="toggle-user-card"
      @click="openUserCardModal"
    >
      {{ getFullName(call.author) }}
    </a>
    <span>
      {{ formattedDoneDate }}
    </span>
  </div>
</template>

<script>

import dayjs from 'dayjs'

import { DATE_EXCHANGE_FORMAT } from '@/api/constants.js'
import { getFullName } from '@/utils/commons.util.js'

export default {
  name: 'CallStatus',
  inject: ['mq'],
  props: {
    call: {
      type: Object,
      required: true
    },
    isEditable: {
      type: Boolean,
      required: true
    }
  },
  computed: {
    isDone () {
      return this.call.callDate !== undefined
    },
    isToDo () {
      return !this.isDone && this.isEditable
    },
    label () {
      if (this.isDone) {
        return this.$t('Call.done')
      } else if (this.isToDo) {
        return this.$t('Call.toDo')
      } else {
        return this.$t('Call.notDone')
      }
    },
    formattedDoneDate () {
      if (this.mq.phone) {
        return dayjs(this.call.callDate, DATE_EXCHANGE_FORMAT).format(
          this.$t('Call.callDoneDate')
        )
      } else {
        return dayjs(this.call.callDate, DATE_EXCHANGE_FORMAT).format(
          this.$t('Call.callDoneDateFull')
        )
      }
    }
  },
  methods: {
    getFullName,
    openUserCardModal () {
      this.$store.dispatch('userCard/initUserCard', this.call.author)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";
.tag {
  display: flex;
  padding: 2px 8px;
  justify-content: center;
  align-items: center;
  border-radius: $border-radius;
  @extend %font-regular-m;
}

.done {
  background-color: $success;
  color: white;
}

.to-do {
  background-color: $danger;
  color: white;
}

.not-done {
  background-color: $neutral-40;
}

.done-data {
  @extend %font-regular-l;
}
</style>
