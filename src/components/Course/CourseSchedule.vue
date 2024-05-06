<template>
  <div>
    <Timeline
      v-if="weekDisplay"
      :initial-date="selectedDate"
      @select-week="onSelectWeek"
    />

    <div
      v-if="weekDisplay"
      v-t="'Course.CourseSchedule.instructions'"
      class="instructions"
    />

    <DayNavigation
      v-else
      :selected-date="selectedDate"
      @go-previous="displayPreviousDay"
      @go-after="displayNextDay"
      @select-date="onSelectDay"
    />

    <button
      v-if="!mq.phone && selectedSession"
      class="display-whole-week-button"
      @click="unselectSession"
    >
      <CustomIcon icon-name="icon-calendar" />
      <span v-t="'Course.CourseSchedule.displayWholeWeek'" />
    </button>

    <CustomCalendar
      ref="calendar"
      :display-date="selectedDate"
      :events="eventList"
      :calendar-options="calendarOptions"
      :show-popover="false"
      :show-selection-icon="true"
      :select-current-event-on-load="isInit"
      @select-event="selectEvent"
    />
  </div>
</template>

<script>
import 'v-calendar/style.css'

import CustomCalendar from '@components/Base/CustomCalendar/CustomCalendar.vue'
import CustomIcon from '@components/Base/CustomIcon.vue'
import dayjs from 'dayjs'
import { defineAsyncComponent } from 'vue'

import { DATE_EXCHANGE_FORMAT } from '@/api/constants'
import { getUserSchedule } from '@/api/dashboard.service'
import scheduleService from '@/api/schedule.service'
const Timeline = defineAsyncComponent(() => import('@/components/Horaires/Timeline'))
const DayNavigation = defineAsyncComponent(() => import('@components/Dashboard/ScheduleWidget/DayNavigation.vue'))

export default {
  name: 'CourseSchedule',
  components: {
    CustomIcon,
    DayNavigation,
    Timeline,
    CustomCalendar
  },
  inject: ['mq'],
  data () {
    return {
      eventList: [],
      selectedDate: undefined,
      selectedEvent: undefined,
      updatedSession: undefined,
      isInit: undefined
    }
  },
  computed: {
    selectedSession () {
      return this.$store.state.course.selectedSession
    },
    weekDisplay () {
      return !this.mq.phone && !this.selectedSession
    },
    calendarOptions () {
      return {
        dayHeaders: this.weekDisplay,
        initialView: this.weekDisplay ? 'timeGridWeek' : 'timeGridDay'
      }
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
    this.isInit = true
    this.selectedDate = dayjs() // TODO: handle min/max date case
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
      const startDate = this.selectedDate.startOf('week').hour(4)
      const endDate = this.selectedDate.endOf('week')
      scheduleService.getUserSessions(this.$store.state.user.userId, startDate, endDate).then((data) => {
        if (data.success) {
          this.eventList = data.sessions
        } else {
          console.error('error while loading user sessions between ' + startDate.format('YYY-MM-DD HH:mm') + ' and ' + endDate.format('YYY-MM-DD HH:mm'))
        }
      }, (err) => {
        console.error(err)
      })
    },
    getDaySessions (targetDate = this.selectedDate, goForward = true) {
      getUserSchedule(this.$store.state.user.userId, targetDate, goForward).then((data) => {
        if (data.success) {
          this.eventList = data.eventList
          this.selectedDate = dayjs(data.date, DATE_EXCHANGE_FORMAT)
        } else {
          console.error('Error')
        }
      }, (err) => {
        console.error(err)
      })
    },
    selectEvent (event) {
      this.isInit = false

      // Update calendar date to correspond to the event Day
      if (!dayjs(event.startDate, DATE_EXCHANGE_FORMAT).isSame(this.selectedDate, 'day')) {
        this.selectedDate = dayjs(event.startDate, DATE_EXCHANGE_FORMAT)
      }

      this.$store.dispatch('course/selectSession', event)
    },
    unselectSession () {
      this.isInit = false
      this.$store.dispatch('course/unselectSession')
      this.unselectEvent()
    },
    unselectEvent () {
      this.$refs.calendar.unselectEvent()
    },
    displayNextDay () {
      this.getDaySessions(this.selectedDate.add(1, 'day'), true)
    },
    displayPreviousDay () {
      this.getDaySessions(this.selectedDate.add(-1, 'day'), false)
    },
    onSelectDay (day) {
      this.getDaySessions(day, true)
    },
    onSelectWeek (week) {
      this.selectedDate = dayjs(week.firstDayOfWeek).startOf('day')
      this.getWeekSessions()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@design';

.display-whole-week-button {
  width: 100%;
  background-color: transparent;
  cursor: pointer;
  display: flex;
  padding: 4px 8px;
  margin: 10px 0;
  justify-content: center;
  align-items: center;
  align-self: stretch;
  border-radius: 6px;
  border: 1px solid $color-border;

  .icon-calendar {
    margin-right: 1rem;
    font-size: 1.3rem;
  }
}

.instructions {
  @extend %content-placeholder;
}
</style>
