<template>
  <div class="weekly-horizontal-timeline">
    <div class="weekly-timeline-container">
      <div class="horizontal-timeline-left">
        <button
          type="button"
          :disabled="disablePrevious"
          class="nav-btn"
          @click="onClickPrevious()"
        >
          <NeroIcon
            name="fa-chevron-circle-left"
            class="theme-text-color"
          />
        </button>
      </div>
      <div class="horizontal-timeline-center">
        <div class="horizontal-timeline-progress">
          <ul class="horizontal-timeline-bg">
            <li
              v-for="month in monthList"
              :key="month"
              class="horizontal-timeline-month"
              :style="'width: ' + (100/(nbWeeks/month.weekList.length)) + '%'"
            >
              <!-- <span
                class="timeline-label"
                :title="month.date"
              >
              {{ month.name }}
              </span> -->
              <ul>
                <li
                  v-for="(week, index) in month.weekList"
                  :key="week"
                  class="horizontal-timeline-week"
                  :style="'left: ' + (index * (100/month.weekList.length)) + '%, width: ' + (100/month.weekList.length) + '%'"
                >
                  <div
                    class="weeknumber-label"
                    :class="{ 'current-week theme-border-color': week.isCurrent, 'theme-background-color': week.isSelected }"
                    :title="formatWeekNbPopup(month.date)"
                    @click="onClickWeek(week)"
                  >
                    S.{{ week.weekNumber }}
                  </div>
                  <div
                    class="timeline-label"
                    :class="{ 'theme-color': week.isCurrent}"
                    :title="week.label"
                  >
                    {{ week.label }}
                  </div>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
      <div class="horizontal-timeline-right">
        <button
          type="button"
          class="nav-btn"
          :disabled="disableNext"
          @click="onClickNext()"
        >
          <NeroIcon
            name="fa-chevron-circle-right"
            class="theme-text-color"
          />
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import NeroIcon from '@/components/Nero/NeroIcon'

dayjs.extend(weekOfYear)

export default {
  name: 'Timeline',
  components: { NeroIcon },
  props: {
    minDate: {
      type: Object,
      required: true
    },
    maxDate: {
      type: Object,
      required: true
    },
    nbWeeksAfterCurrent: {
      type: Number,
      default: 3
    },
    nbWeeksBeforeCurrent: {
      type: Number,
      default: 2
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
            weekNumber: (firstWeekOfMonth.diff(dayjs(this.minDate, 'YYYY-MM-DD').startOf('week'), 'week') + 1),
            label: firstWeekOfMonth.format('D MMM'),
            firstDayOfWeek: firstWeekOfMonth.format('YYYY-MM-DD'),
            lastDayOfWeek: firstWeekOfMonth.endOf('week').format('YYYY-MM-DD')
          }

          if (firstWeekOfMonth.week() === dayjs().week()) {
            week.isCurrent = true
            if (this.selectedWeek.weekNumber === undefined) {
              this.onClickWeek(week)
            }
          }

          if (this.selectedWeek.weekNumber === week.weekNumber) {
            this.setSelectedWeek(week)
          }

          monthList[monthList.length - 1].weekList.push(week)
          firstWeekOfMonth = firstWeekOfMonth.add(1, 'week')
        }

        dateIndex = dateIndex.add(1, 'month')
      }

      return monthList
    },
    nbWeeks () {
      return this.monthList.reduce((sum, month) => sum + month.weekList.length, 0)
    },
    nbWeeksDisplayed () {
      return this.nbWeeksBeforeCurrent + 1 + this.nbWeeksAfterCurrent
    }
  },
  created () {
    let date = dayjs()
    if (date.isAfter(this.maxDate)) {
      date = this.maxDate.clone()
    } else if (date.isBefore(this.minDate)) {
      date = this.minDate.clone()
    }

    this.startDate = date.subtract(this.nbWeeksBeforeCurrent, 'week').startOf('week')
    this.endDate = date.add(this.nbWeeksAfterCurrent, 'week').endOf('week')
  },
  methods: {
    onClickNext () {
      // Go n weeks to the right
      this.startDate = this.startDate.add(this.nbWeeksDisplayed, 'week')
      this.endDate = this.endDate.add(this.nbWeeksDisplayed, 'week')
      // this.monthList.length = 0
    },
    onClickPrevious () {
      // Go n weeks to the left
      this.startDate = this.startDate.subtract(this.nbWeeksDisplayed, 'week')
      this.endDate = this.endDate.subtract(this.nbWeeksDisplayed, 'week')
      // this.monthList.length = 0
    },
    onClickWeek (week) {
      if (week.weekNumber !== this.selectedWeek.weekNumber) {
        this.$emit('selectWeek', week)
        this.setSelectedWeek(week)
      }
    },
    setSelectedWeek (week) {
      this.selectedWeek.isSelected = false
      week.isSelected = true
      this.selectedWeek = week
    },
    formatWeekNbPopup (date) {
      return dayjs(date).format('MMM YYYY')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/design';

.weekly-timeline-container {
  display: flex;
  align-items: center;
  max-width: 50rem;
  margin: auto;
}

.weekly-horizontal-timeline {
  .horizontal-timeline-left button, .horizontal-timeline-right button {
    background-color: rgba(0, 0, 0, 0);
    border: none;
    padding: 0;
  }
  .horizontal-timeline-left button {
    &:focus, &:hover {
      background-color: transparent;
    }
  }
  .horizontal-timeline-right button {
    &:focus, &:hover {
      background-color: transparent;
    }
  }

  .nav-btn {
    cursor: pointer;
    font-size: 1.5rem;

    &:disabled {
      cursor: not-allowed;

      svg {
        color: grey;
      }
    }
  }
}

.horizontal-timeline-center {
  width: 100%;
  display: flex;
  align-content: center;

  .horizontal-timeline-progress {
    width: 100%;

    ul {
      display: flex;
      align-content: center;
      justify-content: space-around;
      padding: 0;
      margin-bottom: 0;
    }
  }
}

.horizontal-timeline-month {
  display: inline-block;
}

.timeline-label {
  text-align: right;
  font-size: 0.8rem;
}

.horizontal-timeline-week {
  display: flex;
  flex-direction: column;
  margin: 0;
}

.weeknumber-label {
  padding: 0.2rem 1rem;
  text-align: center;
  border-radius: 2px;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0,0,0,0.5);

  @extend %no-text-highlight;
}

.current-week {
  border-left: solid 5px;
}
</style>
