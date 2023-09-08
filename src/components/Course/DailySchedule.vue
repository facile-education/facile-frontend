<template>
  <div>
    <Timeline
      v-if="weekDisplay"
      :initial-date="selectedDate"
      @select-week="onSelectWeek"
    />

    <nav v-else>
      <button
        :title="$t('previousDay')"
        :aria-label="$t('previousDay')"
        @click="displayPreviousDay"
      >
        <img
          class="previous"
          src="@assets/icons/chevron-right.svg"
          :alt="$t('previousDay')"
        >
      </button>
      <DatePicker
        v-if="configuration"
        v-model="formattedDate"
        :max-date="maxDate"
        :min-date="minDate"
        :disabled-dates="disabledDates"
      >
        <template #default="{ togglePopover }">
          <div
            class="date"
            :class="{'theme-text-color': isToday, 'theme-extra-light-background-color': isToday}"
            @click="togglePopover()"
          >
            {{ dateLabel }}
          </div>
        </template>
      </DatePicker>
      <button
        :title="$t('nextDay')"
        :aria-label="$t('nextDay')"
        @click="displayNextDay"
      >
        <img
          src="@assets/icons/chevron-right.svg"
          :alt="$t('nextDay')"
        >
      </button>
    </nav>

    <button
      v-if="!mq.phone && selectedSession"
      class="display-whole-week-button"
      @click="unselectSession"
    >
      <img
        src="@/assets/icons/calendar.svg"
        alt=""
      >
      <span v-t="'displayWholeWeek'" />
    </button>

    <CustomCalendar
      ref="calendar"
      :display-date="selectedDate"
      :events="eventList"
      :calendar-options="calendarOptions"
      :show-popover="false"
      @select-event="selectEvent"
    />
  </div>
</template>

<script>
import 'v-calendar/style.css'

import CustomCalendar from '@components/Base/CustomCalendar/CustomCalendar.vue'
import dayjs from 'dayjs'
import { DatePicker } from 'v-calendar'
import { defineAsyncComponent } from 'vue'

import { getUserSchedule } from '@/api/dashboard.service'
import scheduleService from '@/api/schedule.service'
const Timeline = defineAsyncComponent(() => import('@/components/Horaires/Timeline'))

export default {
  name: 'DailySchedule',
  components: {
    Timeline,
    CustomCalendar,
    DatePicker
  },
  inject: ['mq'],
  emits: ['select-event'],
  data () {
    return {
      eventList: [],
      selectedDate: undefined,
      selectedEvent: undefined,
      updatedSession: undefined,
      isInit: undefined,
      calendarOptions: undefined
    }
  },
  computed: {
    selectedSession () {
      return this.$store.state.course.selectedSession
    },
    weekDisplay () {
      return !this.mq.phone && !this.selectedSession
    },
    configuration () {
      return this.$store.state.calendar.configuration
    },
    dateLabel () {
      return this.selectedDate.format('ddd DD/MM')
    },
    isToday () {
      return this.selectedDate.isSame(dayjs(), 'day')
    },
    disabledDates () {
      return this.hiddenDays.length > 0 ? [{ repeat: { weekdays: this.hiddenDays } }] : undefined
    },
    formattedDate: {
      get () {
        return this.selectedDate.toDate()
      },
      set (date) {
        this.selectedDate = dayjs(date)
        this.getDaySessions(true)
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
  watch: {
    weekDisplay (weekDisplayValue) {
      if (weekDisplayValue) {
        this.getWeekSessions()
      }
      this.$refs.calendar.changeView(this.weekDisplay ? 'timeGridWeek' : 'timeGridDay')
    }
  },
  created () {
    this.calendarOptions = {
      dayHeaders: this.weekDisplay,
      initialView: this.weekDisplay ? 'timeGridWeek' : 'timeGridDay'
    }
    this.isInit = true
    this.selectedDate = dayjs()
    this.getSessions()
  },
  methods: {
    getSessions () {
      if (this.weekDisplay) {
        this.getWeekSessions()
      } else {
        this.getDaySessions()
      }
    },
    getWeekSessions () {
      const startDate = this.selectedDate.startOf('week')
      const endDate = this.selectedDate.endOf('week')
      scheduleService.getUserSessions(this.$store.state.user.userId, startDate, endDate).then((data) => {
        if (data.success) {
          this.eventList = data.sessions

          if (this.isInit) {
            this.selectCurrentSession(data.sessions)
          }
        } else {
          console.error('error while loading user sessions between ' + startDate.format('YYY-MM-DD HH:mm') + ' and ' + endDate.format('YYY-MM-DD HH:mm'))
        }
      }, (err) => {
        console.error(err)
      })
    },
    getDaySessions (goForward = true) {
      getUserSchedule(this.$store.state.user.userId, this.selectedDate, goForward).then((data) => {
        if (data.success) {
          this.eventList = data.eventList
          this.selectedDate = dayjs(data.date, 'YYYY-MM-DD HH:mm')

          if (this.isInit) {
            this.selectCurrentSession(data.eventList)
          }
        } else {
          console.error('Error')
        }
      }, (err) => {
        console.error(err)
      })
    },
    selectCurrentSession (eventList) {
      eventList.forEach((event) => {
        const now = dayjs()
        const startDate = dayjs(event.startDate, 'YYYY-MM-DD HH:mm')
        const endDate = dayjs(event.endDate, 'YYYY-MM-DD HH:mm')

        if (now.isAfter(startDate) && now.isBefore(endDate)) {
          this.$store.dispatch('course/selectSession', event)
        }
      })
      this.isInit = false
    },
    selectEvent (event) {
      this.$emit('select-event')
      this.selectedDate = dayjs(event.startDate, 'YYYY-MM-DD HH:mm')
      this.$store.dispatch('course/selectSession', event)
    },
    unselectSession () {
      this.$store.dispatch('course/unselectSession')
      this.unselectEvent()
    },
    unselectEvent () {
      this.$refs.calendar.unselectEvent()
    },
    displayNextDay () {
      this.selectedDate = this.selectedDate.add(1, 'day')
      this.getDaySessions(true)
    },
    displayPreviousDay () {
      this.selectedDate = this.selectedDate.add(-1, 'day')
      this.getDaySessions(false)
    },
    onSelectWeek (week) {
      this.selectedDate = dayjs(week.firstDayOfWeek).startOf('day')
      this.getWeekSessions()
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

.display-whole-week-button {
  width: 100%;
  background-color: transparent;
  cursor: pointer;
  display: flex;
  padding: 4px 8px;
  margin-bottom: 10px;
  justify-content: center;
  align-items: center;
  align-self: stretch;
  border-radius: 6px;
  border: 1px solid $color-border;

  img {
    margin-right: 1rem;
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
  "previousDay": "Jour précédent",
  "displayWholeWeek": "Afficher la semaine complète"
}
</i18n>
