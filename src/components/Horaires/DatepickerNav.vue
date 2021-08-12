<template>
  <DatePicker
    v-if="configuration"
    v-model="formattedDate"
    :max-date="maxDate"
    :min-date="minDate"
    :disabled-dates="{ weekdays: hiddenDays }"
  >
    <template #default="{ togglePopover }">
      <i
        class="far fa-calendar-alt"
        @click="togglePopover()"
      />
    </template>
  </DatePicker>
</template>

<script>
import dayjs from 'dayjs'
import { DatePicker } from 'v-calendar'

export default {
  name: 'DatepickerNav',
  components: {
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
      return (this.$store.state.cdt.configuration.schoolDays.length > 0) ? this.$store.state.cdt.configuration : undefined
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
      for (dayNumber = 0; dayNumber <= 6; ++dayNumber) {
        if (this.configuration.schoolDays.indexOf(dayNumber) === -1) {
          // Add one cause datepicker config is not the same as calendar
          // 1 to 7 instead of 0 to 6
          hiddenDays.push(dayNumber + 1)
        }
      }
      return hiddenDays
    },
    maxDate () {
      return dayjs(this.configuration.endDateSchool).toDate()
    },
    minDate () {
      return dayjs(this.configuration.startDateSchool).toDate()
    }
  }
}
</script>

<style lang="scss" scoped>
.fa-calendar-alt {
  font-size: 1.2rem;
  padding: 0 0.5rem;
  cursor: pointer;
}
</style>
