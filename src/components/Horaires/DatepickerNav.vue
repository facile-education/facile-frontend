<template>
  <DatePicker
    v-if="configuration"
    v-model="formattedDate"
    :max-date="maxDate"
    :min-date="minDate"
    :disabled-dates="disabledDates"
    :locale="locale"
  >
    <template #default="{ togglePopover }">
      <button
        data-test="toggle-calendar-selector"
        :aria-label="$t('Horaires.DatepickerNav.selectDate')"
        :title="$t('Horaires.DatepickerNav.selectDate')"
        @click="togglePopover()"
      >
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
  name: 'DatepickerNav',
  components: {
    CustomIcon,
    DatePicker
  },
  props: {
    selectedDate: {
      type: Object,
      required: true
    }
  },
  emits: ['selectDate'],
  computed: {
    configuration () {
      return this.$store.state.calendar.configuration
    },
    disabledDates () {
      return this.hiddenDays.length > 0 ? [{ repeat: { weekdays: this.hiddenDays } }] : undefined
    },
    locale () {
      return this.$store.state.user.locale.frontId
    },
    formattedDate: {
      get () {
        return this.selectedDate.toDate()
      },
      set (date) {
        this.$emit('selectDate', date)
      }
    },
    hiddenDays () {
      const hiddenDays = []
      let dayNumber
      const schoolDays = this.configuration.schoolDays
      for (dayNumber = 0; dayNumber <= 6; ++dayNumber) {
        if (schoolDays.indexOf(dayNumber) === -1) {
          // Add one cause datepicker config is not the same as calendar
          // 1 to 7 instead of 0 to 6
          hiddenDays.push(dayNumber + 1)
        }
      }

      return hiddenDays
    },
    maxDate () {
      return dayjs(this.configuration.schoolYearEndDate).toDate()
    },
    minDate () {
      return dayjs(this.configuration.schoolYearStartDate).toDate()
    }
  },
  created () {
    if (!this.configuration) {
      this.$store.dispatch('calendar/getConfiguration')
    }
  }
}
</script>

<style lang="scss" scoped>

button {
  margin: 0;
  padding: 0;
  background-color: transparent;
  border: none;
  cursor: pointer;
}

.icon-calendar {
  font-size: 1.7rem;
  padding: 0 0.5rem;
  cursor: pointer;
}
</style>
