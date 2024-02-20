<template>
  <nav v-if="configuration">
    <button
      class="arrow-button previous"
      data-test="PreviousDay"
      :title="$t('Dashboard.DayNavigation.goPrevious')"
      :aria-label="$t('Dashboard.DayNavigation.goPrevious')"
      @click="$emit('go-previous')"
    >
      <CustomIcon icon-name="icon-chevron-left" />
    </button>

    <div class="middle-section">
      <DatePicker
        v-if="configuration"
        :value="formattedDate"
        :min-date="minDate"
        :max-date="maxDate"
        :disabled-dates="disabledDates"
        @dayclick="onDayClick"
      >
        <template #default="{ togglePopover }">
          <div
            class="date"
            data-test="date"
            :class="{'theme-text-color': isToday, 'theme-extra-light-background-color': isToday}"
            @click="togglePopover()"
          >
            {{ dateLabel }}
          </div>
        </template>
      </DatePicker>
    </div>

    <button
      class="arrow-button after"
      data-test="NextDay"
      :title="$t('Dashboard.DayNavigation.goAfter')"
      :aria-label="$t('Dashboard.DayNavigation.goAfter')"
      @click="$emit('go-after')"
    >
      <CustomIcon icon-name="icon-chevron-left" />
    </button>
  </nav>
</template>

<script>
import 'v-calendar/style.css'

import CustomIcon from '@components/Base/CustomIcon.vue'
import dayjs from 'dayjs'
import { DatePicker } from 'v-calendar'

export default {
  name: 'DayNavigation',
  components: { CustomIcon, DatePicker },
  props: {
    selectedDate: {
      type: Object,
      required: true
    }
  },
  emits: ['select-date', 'go-previous', 'go-after'],
  computed: {
    configuration () {
      return this.$store.state.calendar.configuration
    },
    minDate () {
      return dayjs(this.configuration.schoolYearStartDate).toDate()
    },
    maxDate () {
      return dayjs(this.configuration.schoolYearEndDate).toDate()
    },
    formattedDate () {
      return this.selectedDate.toDate()
    },
    isToday () {
      return this.selectedDate.isSame(dayjs(), 'day')
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
    disabledDates () {
      return this.hiddenDays.length > 0 ? [{ repeat: { weekdays: this.hiddenDays } }] : undefined
    },
    dateLabel () {
      return this.selectedDate.format('ddd DD/MM')
    }
  },
  created () {
    if (!this.configuration) {
      this.$store.dispatch('calendar/getConfiguration')
    } else if (this.selectedDate.isAfter(this.maxDate)) {
      this.$emit('select-date', this.maxDate)
    } else if (this.selectedDate.isBefore(this.minDate)) {
      this.$emit('select-date', this.minDate)
    }
  },
  methods: {
    onDayClick (date) {
      this.$emit('select-date', dayjs(date.startDate))
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@design';

nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-self: stretch;

  .arrow-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    padding: 0;
    cursor: pointer;
    border: none;
    background: $neutral-10;

    img {
      height: 1rem;
    }
  }

  .middle-section {
    min-width: 50px;
  }
}

.date {
  display: flex;
  padding: 0.5rem 1rem;
  align-items: flex-start;
  gap: 0.5rem;
  align-self: stretch;
  cursor: pointer;

  border-radius: 0.375rem;

  text-align: center;
  @extend %font-bold-l;
}

.after {
  transform: rotate(180deg);
}

</style>
