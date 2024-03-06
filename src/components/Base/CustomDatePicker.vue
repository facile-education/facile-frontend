<template>
  <DatePicker
    v-model="formattedDate"
    :max-date="maxDate"
    :min-date="minDate"
    :mode="withHours ? 'dateTime' : 'date'"
    :is-required="isRequired"
    :rules="rules"
    class="date"
    :is24hr="is24H"
    :disabled-dates="disabledDates"
    :locale="locale"
  >
    <template
      v-if="buttonForm"
      #default="{ togglePopover }"
    >
      <button
        :disabled="disabled"
        @click="togglePopover()"
      >
        <span class="label">
          {{ selectedDateLabel }}
        </span>
        <CustomIcon icon-name="icon-calendar" />
      </button>
    </template>
  </DatePicker>
</template>

<script>
import 'v-calendar/style.css'

import CustomIcon from '@components/Base/CustomIcon.vue'
import dayjs from 'dayjs'
import { DatePicker } from 'v-calendar'

export default {
  name: 'CustomDatePicker',
  components: { CustomIcon, DatePicker },
  props: {
    selectedDate: {
      type: Object,
      required: true
    },
    buttonForm: {
      type: Boolean,
      default: true
    },
    maxDate: {
      type: Date,
      default: undefined
    },
    minDate: {
      type: Date,
      default: undefined
    },
    withHours: {
      type: Boolean,
      default: false
    },
    isRequired: {
      type: Boolean,
      default: false
    },
    minuteIncrement: {
      type: Number,
      default: undefined
    },
    hiddenDays: {
      type: Array,
      default: () => { return [] }
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:selectedDate'],
  computed: {
    locale () {
      return this.$store.state.user.locale.frontId
    },
    is24H () {
      return this.locale !== 'en'
    },
    disabledDates () {
      return this.hiddenDays.length > 0 ? [{ repeat: { weekdays: this.hiddenDays } }] : undefined
    },
    formattedDate: {
      get () {
        return this.selectedDate.toDate()
      },
      set (date) {
        this.$emit('update:selectedDate', dayjs(date))
      }
    },
    rules () {
      return this.minuteIncrement ? { minutes: { interval: this.minuteIncrement } } : undefined
    },
    selectedDateLabel () {
      if (this.selectedDate) {
        return this.selectedDate.format('DD/MM/YYYY' + (this.withHours ? ' - HH:mm' : ''))
      } else {
        return ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

.date {
  display: flex;
  align-items: center;
}

button {
  background-color: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  border: 1px solid $neutral-60;
  border-radius: 6px;
  padding: 4px;

  &:hover {
    filter: brightness(115%);
    @include transition(filter, 0.2s, linear);
  }
}

.label {
  padding: 0 6px;
  @extend %font-regular-m;
}

.icon-calendar {
  font-size: 1rem;
}
</style>
