<template>
  <div
    v-if="configuration"
    class="weekly-horizontal-timeline"
    data-test="weekList"
  >
    <button
      :disabled="disablePrevious"
      class="nav-btn horizontal-timeline-left reverse-icon"
      :title="$t('Horaires.Timeline.previous')"
      :aria-label="$t('Horaires.Timeline.previous')"
      @click="onClickPrevious()"
    >
      <CustomIcon :icon-name="'icon-chevron-right-s'" />
    </button>

    <ul class="horizontal-timeline-center">
      <li
        v-for="week in displayedWeeks"
        :key="week"
      >
        <TimeLineWeekItem
          :week="week"
          :is-selected="selectedWeek.weekNumber === week.weekNumber"
          @select-week="selectWeek(week)"
        />
      </li>
    </ul>

    <button
      class="nav-btn horizontal-timeline-right"
      :disabled="disableNext"
      :title="$t('Horaires.Timeline.next')"
      :aria-label="$t('Horaires.Timeline.next')"
      @click="onClickNext()"
    >
      <CustomIcon :icon-name="'icon-chevron-right-s'" />
    </button>
  </div>
</template>

<script>
import CustomIcon from '@components/Base/CustomIcon.vue'
import TimeLineWeekItem from '@components/Horaires/TimeLineWeekItem.vue'
import dayjs from 'dayjs'
import weekOfYear from 'dayjs/plugin/weekOfYear'

import { DATE_EXCHANGE_FORMAT } from '@/api/constants'

dayjs.extend(weekOfYear)

export default {
  name: 'Timeline',
  components: { CustomIcon, TimeLineWeekItem },
  props: {
    nbWeeksAfterCurrent: {
      type: Number,
      default: 3
    },
    nbWeeksBeforeCurrent: {
      type: Number,
      default: 2
    },
    initialDate: {
      type: Object,
      default: undefined
    }
  },
  emits: ['selectWeek'],
  data () {
    return {
      date: undefined,
      startDate: undefined,
      endDate: undefined,
      selectedWeek: {}
    }
  },
  computed: {
    displayedWeeks () {
      let weekList = []
      this.monthList.forEach(month => {
        weekList = [...weekList, ...month.weekList]
      })
      return weekList
    },
    configuration () {
      return this.$store.state.calendar.configuration
    },
    minDate () {
      return this.configuration !== undefined ? dayjs(this.configuration.schoolYearStartDate, DATE_EXCHANGE_FORMAT) : dayjs()
    },
    maxDate () {
      return this.configuration !== undefined ? dayjs(this.configuration.schoolYearEndDate, DATE_EXCHANGE_FORMAT) : dayjs()
    },
    disableNext () {
      if (!this.monthList || this.monthList.length === 0) return false

      const lastMonth = this.monthList[this.monthList.length - 1]
      const lastWeek = lastMonth.weekList[lastMonth.weekList.length - 1].firstDayOfWeek
      return (dayjs(lastWeek, 'YYYY-MM-DD').week() === this.maxDate.week())
    },
    disablePrevious () {
      if (!this.monthList || this.monthList.length === 0) return false

      const firstWeek = this.monthList[0].weekList[0].firstDayOfWeek
      return (dayjs(firstWeek, 'YYYY-MM-DD').week() === this.minDate.week())
    },
    firstDayOfWeekDisplayed () {
      if (this.startDate === undefined) return undefined

      let firstDayOfWeek = this.startDate.clone()
      if (firstDayOfWeek.isBefore(dayjs(this.minDate, 'YYYY-MM-DD'))) {
        firstDayOfWeek = this.minDate.startOf('week')
      }
      return firstDayOfWeek
    },
    lastDayOfWeekDisplayed () {
      if (this.endDate === undefined) return undefined

      let lastDayOfWeek = this.endDate.clone()
      if (lastDayOfWeek.isAfter(this.maxDate)) {
        lastDayOfWeek = this.maxDate.endOf('week')
      }
      return lastDayOfWeek
    },
    monthList () {
      const monthList = []

      let dateIndex = this.firstDayOfWeekDisplayed.clone()
      const endOfLastMonth = this.lastDayOfWeekDisplayed.endOf('month')

      while (endOfLastMonth.isAfter(dateIndex)) {
        let firstWeekOfMonth = dateIndex.startOf('month').startOf('week')
        let lastWeekOfMonth = dateIndex.endOf('month').endOf('week')

        // Check the dates with the limits
        if (firstWeekOfMonth.isBefore(this.firstDayOfWeekDisplayed)) {
          firstWeekOfMonth = this.firstDayOfWeekDisplayed.startOf('week')
        }

        if (lastWeekOfMonth.isAfter(this.lastDayOfWeekDisplayed)) {
          lastWeekOfMonth = this.lastDayOfWeekDisplayed.endOf('week')
        }

        // If week is between 2 months, then count it as the beginning of the second month (prevent it to appear twice)
        if (lastWeekOfMonth.isAfter(dateIndex, 'month')) {
          lastWeekOfMonth = lastWeekOfMonth.subtract(1, 'week')
        }

        if (lastWeekOfMonth.isAfter(firstWeekOfMonth)) {
          monthList.push({
            date: dateIndex.format('YYYY-MM'),
            name: dateIndex.format('MMMM'),
            weekList: []
          })
        }

        while (lastWeekOfMonth.isAfter(firstWeekOfMonth)) {
          const week = {
            weekNumber: this.getWeekNumber(firstWeekOfMonth),
            firstDayOfWeek: firstWeekOfMonth.format('YYYY-MM-DD')
          }

          monthList[monthList.length - 1].weekList.push(week)
          firstWeekOfMonth = firstWeekOfMonth.add(1, 'week')
        }

        dateIndex = dateIndex.add(1, 'month')
      }

      return monthList
    },
    nbWeeksDisplayed () {
      return this.nbWeeksBeforeCurrent + 1 + this.nbWeeksAfterCurrent
    }
  },
  watch: {
    configuration () {
      this.initSelectedWeek()
    }
  },
  created () {
    if (!this.configuration) {
      this.$store.dispatch('calendar/getConfiguration')
    }

    this.date = this.initialDate ? this.initialDate : dayjs()
    if (this.date.isAfter(this.maxDate)) {
      this.date = this.maxDate.clone()
    } else if (this.date.isBefore(this.minDate)) {
      this.date = this.minDate.clone()
    }

    this.startDate = this.date.subtract(this.nbWeeksBeforeCurrent, 'week').startOf('week')
    this.endDate = this.date.add(this.nbWeeksAfterCurrent, 'week').endOf('week')

    if (this.configuration) {
      this.initSelectedWeek()
    }
  },
  methods: {
    initSelectedWeek () { // Need a valid minDate (schoolYearStartDate)
      const initialDisplayWeek = this.getWeekFromLocalWeekList(this.date)
      if (initialDisplayWeek) {
        this.selectedWeek = initialDisplayWeek
      }
    },
    getWeekNumber (date) {
      return date.diff(this.minDate.startOf('week'), 'week') + 1
    },
    getWeekFromLocalWeekList (date) {
      for (const month of this.monthList) {
        for (const week of month.weekList) {
          if (week.weekNumber === date.diff(this.minDate.startOf('week'), 'week') + 1) {
            return week
          }
        }
      }
      console.error('cannot fink week for day ' + date.format('YYYY/MM/DD') + ' in list ', this.monthList)
      return undefined
    },
    onClickNext () {
      // Go n weeks to the right
      this.startDate = this.startDate.add(this.nbWeeksDisplayed, 'week')
      this.endDate = this.endDate.add(this.nbWeeksDisplayed, 'week')
    },
    onClickPrevious () {
      // Go n weeks to the left
      this.startDate = this.startDate.subtract(this.nbWeeksDisplayed, 'week')
      this.endDate = this.endDate.subtract(this.nbWeeksDisplayed, 'week')
    },
    selectWeek (week) {
      this.selectedWeek = week
      this.$emit('selectWeek', week)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/design';

.weekly-horizontal-timeline {
  display: flex;
  padding: 1rem min(2vw, 1.5rem);
  justify-content: space-between;
  align-items: center;
  border-radius: 6px;
  background: $neutral-20;
}

.nav-btn {
  cursor: pointer;
  height: 40px;
  width: 40px;
  min-width: 40px;
  border-radius: 20px;
  padding: 0;
  border: none;
  background-color: $neutral-10;
  display: flex;
  align-items: center;
  justify-content: center;

  &.reverse-icon {
    transform: rotate(180deg);
  }

  &:disabled {
    cursor: not-allowed;
    background-color: $neutral-40;
  }
}

.horizontal-timeline-center {
  display: flex;
  align-items: center;
  gap: 2rem;
  margin: 0;
  padding: 0;
  list-style-type: none;
}

@media screen and (max-width: 1000px) {
  .horizontal-timeline-center {
    gap: 1.5vw;
  }
}

</style>
