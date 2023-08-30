<template>
  <DatePicker
    v-model="formattedDate"
    :max-date="maxDate"
    :min-date="minDate"
    :mode="withHours ? 'dateTime' : 'date'"
    :is-required="isRequired"
    :rules="rules"
    class="date"
    :is24hr="true"
    :disabled-dates="disabledDates"
  >
    <template #default="{ togglePopover }">
      <button
        :disabled="disabled"
        @click="togglePopover()"
      >
        <span class="label">
          {{ selectedDateLabel }}
        </span>
        <NeroIcon
          name="fa-calendar-alt"
          type="far"
          class="icon"
        />
      </button>
    </template>
  </DatePicker>
</template>

<script>
import 'v-calendar/style.css'

import { DatePicker } from 'v-calendar'

import NeroIcon from '@/components/Nero/NeroIcon.vue'

export default {
  name: 'CustomDatePicker',
  components: { DatePicker, NeroIcon },
  props: {
    selectedDate: {
      type: Object,
      required: true
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
  emits: ['selectDate'],
  computed: {
    disabledDates () {
      console.log(this.hiddenDays)
      return this.hiddenDays.length > 0 ? [{ repeat: { weekdays: this.hiddenDays } }] : undefined
    },
    formattedDate: {
      get () {
        return this.selectedDate.toDate()
      },
      set (date) {
        this.$emit('selectDate', date)
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
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  cursor: pointer;
  border: 1px solid $color-border;
  border-radius: 6px;

  &:hover {
    background-color: $color-hover-bg;
  }
}

.label {
  display: flex;
  margin-top: 3px;
  margin-right: 5px;
  margin-left: 0.5em;
  font-size: 14px;
  font-weight: bold;
}

.icon {
  font-size: 2.5rem;
  padding: 0 0.5rem;
  cursor: pointer;
}
</style>
