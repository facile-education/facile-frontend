<template>
  <div>
    <nav>
      <button @click="diplayPreviousDay()">
        <img
          class="previous"
          src="@assets/icons/chevron-right.svg"
          :alt="$t('previousDay')"
          :title="$t('previousDay')"
        >
      </button>
      <DatePicker
        v-if="configuration"
        v-model="formattedDate"
        :max-date="maxDate"
        :min-date="minDate"
        :disabled-dates="{ weekdays: hiddenDays }"
      >
        <template #default="{ togglePopover }">
          <div
            class="date theme-text-color theme-extra-light-background-color"
            @click="togglePopover()"
          >
            {{ dateLabel }}
          </div>
        </template>
      </DatePicker>
      <button @click="diplayNextDay()">
        <img
          src="@assets/icons/chevron-right.svg"
          :alt="$t('nextDay')"
          :title="$t('nextDay')"
        >
      </button>
    </nav>
    <CustomCalendar
      :display-date="selectedDate"
      :events="eventList"
      :calendar-options="calendarOptions"
      :show-popover="false"
      @select-event="selectEvent"
    />
  </div>
</template>

<script>
import CustomCalendar from '@components/Base/CustomCalendar/CustomCalendar.vue'
import dayjs from 'dayjs'
import { DatePicker } from 'v-calendar'

import { getUserSchedule } from '@/api/dashboard.service'

export default {
  name: 'DailySchedule',
  components: {
    CustomCalendar,
    DatePicker
  },
  inject: ['mq'],
  data () {
    return {
      calendarOptions: {
        dayHeaders: false,
        initialView: 'timeGridDay'
      },
      eventList: [],
      selectedDate: dayjs(),
      selectedEvent: undefined,
      updatedSession: undefined
    }
  },
  computed: {
    configuration () {
      return this.$store.state.calendar.configuration
    },
    dateLabel () {
      return this.selectedDate.format('ddd DD/MM')
    },
    formattedDate: {
      get () {
        return this.selectedDate.toDate()
      },
      set (date) {
        this.selectDate(dayjs(date))
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
    const init = (this.$store.state.course.selectedSession === undefined)
    this.selectDate(this.selectedDate, init)
  },
  methods: {
    diplayNextDay () { this.selectDate(this.selectedDate.add(1, 'day')) },
    diplayPreviousDay () { this.selectDate(this.selectedDate.add(-1, 'day'), false, false) },
    selectDate (date, init = false, goForward = true) {
      getUserSchedule(this.$store.state.user.userId, date, goForward).then((data) => {
        this.isLoading = false
        this.isFirstLoad = false
        if (data.success) {
          this.error = false
          this.eventList = data.eventList
          this.selectedDate = dayjs(data.date, 'YYYY-MM-DD HH:mm')

          if (init) {
            this.eventList.forEach((event) => {
              const now = dayjs()
              const startDate = dayjs(event.startDate, 'YYYY-MM-DD HH:mm')
              const endDate = dayjs(event.endDate, 'YYYY-MM-DD HH:mm')

              if (now.isAfter(startDate) && now.isBefore(endDate)) {
                this.$store.dispatch('course/selectSession', event)
              }
            })
          }
        } else {
          this.error = true
          console.error('Error')
        }
      }, (err) => {
        this.isLoading = false
        this.error = true
        console.error(err)
      })
    },
    selectEvent (event) {
      this.$store.dispatch('course/selectSession', event)
    }
  }
}
</script>

<style lang="scss">
.daily-schedule {
  .fc-theme-standard .fc-scrollgrid,
  .fc-theme-standard td,
  .fc-theme-standard th {
    border: none
  }
}
</style>

<style lang="scss" scoped>
@import '@design';

nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-self: stretch;

  button {
    display: flex;
    width: 2.5rem;
    height: 2.5rem;
    justify-content: center;
    align-items: center;
    cursor: pointer;

    // border-radius: 1.5625rem;
    border: none;
    background: $neutral-10;

    img {
      height: 1rem;
    }
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

.previous {
  transform: rotate(180deg);
}
</style>

<i18n locale="fr">
{
  "nextDay": "Jour suivant",
  "previousDay": "Jour précédent"
}
</i18n>
