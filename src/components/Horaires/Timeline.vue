<template>
  <div
    v-if="configuration"
    class="weekly-horizontal-timeline"
  >
    <button
      :disabled="disablePrevious"
      class="nav-btn horizontal-timeline-left"
      :title="$t('previous')"
      :aria-label="$t('previous')"
      @click="onClickPrevious()"
    >
      <img
        class="reverse-icon"
        src="@/assets/icons/chevron-right.svg"
        :alt="$t('previous')"
      >
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
      :title="$t('next')"
      :aria-label="$t('next')"
      @click="onClickNext()"
    >
      <img
        src="@/assets/icons/chevron-right.svg"
        :alt="$t('next')"
      >
    </button>
  </div>
</template>

<script>
import TimeLineWeekItem from '@components/Horaires/TimeLineWeekItem.vue'
import dayjs from 'dayjs'
import weekOfYear from 'dayjs/plugin/weekOfYear'

dayjs.extend(weekOfYear)

export default {
  name: 'Timeline',
  components: { TimeLineWeekItem },
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
      return dayjs(this.configuration.schoolYearStartDate, 'YYYY-MM-DD')
    },
    maxDate () {
      return dayjs(this.configuration.schoolYearEndDate, 'YYYY-MM-DD')
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
    firstMondayDisplayed () {
      if (this.startDate === undefined) return undefined

      let firstMonday = this.startDate.clone()
      if (firstMonday.isBefore(dayjs(this.minDate, 'YYYY-MM-DD'))) {
        firstMonday = dayjs(this.minDate, 'YYYY-MM-DD').startOf('week')
      }
      return firstMonday
    },
    lastSundayDisplayed () {
      if (this.endDate === undefined) return undefined

      let lastSunday = this.endDate.clone()
      if (lastSunday.isAfter(dayjs(this.maxDate, 'YYYY-MM-DD'))) {
        lastSunday = dayjs(this.maxDate, 'YYYY-MM-DD').endOf('week')
      }
      return lastSunday
    },
    monthList () {
      const monthList = []

      let dateIndex = this.firstMondayDisplayed.clone()
      const endOfLastMonth = this.lastSundayDisplayed.endOf('month')

      while (endOfLastMonth.isAfter(dateIndex)) {
        let firstWeekOfMonth = dateIndex.startOf('month').startOf('week')
        let lastWeekOfMonth = dateIndex.endOf('month').endOf('week')

        // Check the dates with the limits
        if (firstWeekOfMonth.isBefore(this.firstMondayDisplayed)) {
          firstWeekOfMonth = this.firstMondayDisplayed.startOf('week')
        }

        if (lastWeekOfMonth.isAfter(this.lastSundayDisplayed)) {
          lastWeekOfMonth = this.lastSundayDisplayed.endOf('week')
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
  created () {
    if (!this.configuration) {
      this.$store.dispatch('calendar/getConfiguration')
    }

    let date = dayjs()
    if (date.isAfter(this.maxDate)) {
      date = this.maxDate.clone()
    } else if (date.isBefore(this.minDate)) {
      date = this.minDate.clone()
    }

    this.startDate = date.subtract(this.nbWeeksBeforeCurrent, 'week').startOf('week')
    this.endDate = date.add(this.nbWeeksAfterCurrent, 'week').endOf('week')

    const initialDisplayWeek = this.getWeekFromLocalWeekList(this.initialDate ? this.initialDate : dayjs())
    if (initialDisplayWeek !== undefined) {
      this.selectWeek(initialDisplayWeek)
    }
  },
  methods: {
    getWeekNumber (date) {
      return date.diff(dayjs(this.minDate, 'YYYY-MM-DD').startOf('week'), 'week') + 1
    },
    getWeekFromLocalWeekList (date) {
      for (const month of this.monthList) {
        for (const week of month.weekList) {
          if (week.weekNumber === date.diff(dayjs(this.minDate, 'YYYY-MM-DD').startOf('week'), 'week') + 1) {
            return week
          }
        }
      }
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

  .reverse-icon {
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

<i18n locale="fr">
  {
    "previous": "Précédent",
    "next": "Suivant"
  }
</i18n>
