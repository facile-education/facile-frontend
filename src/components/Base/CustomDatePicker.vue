<template>
  <DatePicker
    v-model="formattedDate"
    :max-date="maxDate"
    :min-date="minDate"
    :mode="withHours ? 'dateTime' : undefined"
    :is-required="isRequired"
    :minute-increment="minuteIncrement"
    class="date"
    :is24hr="true"
    :disabled-dates="{ weekdays: hiddenDays }"
  >
    <template #default="{ togglePopover }">
      <button @click="togglePopover()">
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
import NeroIcon from '@components/Nero/NeroIcon.vue'
import { DatePicker } from 'v-calendar'

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
    }
  },
  emits: ['selectDate'],
  computed: {
    formattedDate: {
      get () {
        return this.selectedDate.toDate()
      },
      set (date) {
        this.$emit('selectDate', date)
      }
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
  height: 100%;
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
