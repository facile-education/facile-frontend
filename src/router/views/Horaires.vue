<template>
  <Layout :is-allowed="!($store.state.user.isStudent || $store.state.user.isParent)">
    <HorairesToolbar
      class="toolbar"
      :selected-date="selectedDate"
      @selectDate="onSelectDate"
    />
    <template v-if="configuration">
      <Timeline
        v-if="!mq.phone"
        :min-date="minDate"
        :max-date="maxDate"
        @selectWeek="onSelectWeek"
      />
      <div
        v-if="mq.phone"
        v-hammer:swipe.horizontal="onSwipe"
        class="swipe-container"
      >
        <div
          class="swipe-wrapper"
          :style="`transform: translate3d(${pan}px, 0px, 0px);`"
        >
          <FullCalendar
            ref="fullCalendar"
            class="calendar"
            :options="calendarOptions"
          >
            <template #eventContent="arg">
              <FCEvent :arg="arg" />
            </template>
          </FullCalendar>
        </div>
      </div>
      <FullCalendar
        v-else
        ref="fullCalendar"
        :options="calendarOptions"
      >
        <template #eventContent="arg">
          <FCEvent :arg="arg" />
        </template>
      </FullCalendar>
    </template>
    <PentilaSpinner v-if="isLoading" />
  </Layout>
</template>

<script>
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'

import FullCalendar from '@fullcalendar/vue3'
import frLocale from '@fullcalendar/core/locales/fr'
import timeGridPlugin from '@fullcalendar/timegrid'
import Layout from '@/router/layouts/EmptyLayout'
import HorairesToolbar from '@/components/Horaires/HorairesToolbar'

// Lazy loading
import { defineAsyncComponent } from 'vue'
const Timeline = defineAsyncComponent(() => import('@/components/Horaires/Timeline'))
const FCEvent = defineAsyncComponent(() => import('@/components/Horaires/FCEvent'))

dayjs.extend(customParseFormat)

export default {
  name: 'Horaires',
  components: {
    FullCalendar,
    HorairesToolbar,
    Layout,
    Timeline,
    FCEvent
  },
  inject: ['mq'],
  data () {
    return {
      // pan: -320,
      pan: 0,
      selectedDate: dayjs(),
      selectedEvent: undefined
    }
  },
  computed: {
    calendarOptions () {
      return {
        locale: frLocale,
        plugins: [timeGridPlugin],
        initialView: this.mq.phone ? 'timeGridDay' : 'timeGridWeek',
        // 125 is toolbar (50) + margin (10) + timeline (65)
        height: this.mq.phone ? '100%' : 'max(800px, calc(100% - 125px))',
        expandRows: true,
        headerToolbar: {
          left: '',
          center: '',
          right: ''
        },
        eventTextColor: '#333',
        eventTimeFormat: {
          hour: '2-digit',
          minute: '2-digit'
          // omitZeroMinute: true
        },
        eventClick: this.onEventClick,
        views: {
          day: {
            dayHeaderFormat: { weekday: 'long', month: 'numeric', day: 'numeric' }
          },
          timeGrid: {
            allDaySlot: false,
            hiddenDays: this.hiddenDays,
            nowIndicator: true,
            slotDuration: '01:00:00',
            slotMinTime: this.configuration.startDayTime,
            slotMaxTime: this.configuration.endDayTime
          }
        },
        events:
          this.eventList.map(slot => this.formatCalendarSlot(slot))
      }
    },
    configuration () {
      return (this.$store.state.cdt.configuration.schoolDays.length > 0) ? this.$store.state.cdt.configuration : undefined
    },
    eventList () {
      return this.$store.state.horaires.sessionList
    },
    hiddenDays () {
      const hiddenDays = []
      let dayNumber
      for (dayNumber = 0; dayNumber <= 6; ++dayNumber) {
        if (this.configuration.schoolDays.indexOf(dayNumber) === -1) {
          hiddenDays.push(dayNumber)
        }
      }
      return hiddenDays
    },
    isLoading () {
      return this.$store.state.horaires.isLoading || !this.configuration
    },
    minDate () {
      return dayjs(this.configuration.startDateSchool, 'YYYY-MM-DD HH:mm')
    },
    maxDate () {
      return dayjs(this.configuration.endDateSchool, 'YYYY-MM-DD HH:mm')
    },
    isTeacherSelected () {
      return this.$store.state.horaires.selectedUser.isTeacher
    }
  },
  created () {
    this.$store.dispatch('cdt/getConfiguration')
    if (this.mq.phone) {
      this.onSelectDate(new Date())
    }
  },
  methods: {
    formatCalendarSlot (slot) {
      const json = {
        extendedProps: {
          id: (slot.sessionId === undefined ? slot.schoollifeSessionId : slot.sessionId),
          subject: slot.subject,
          teachers: this.getTeachersLabel(slot.teachers),
          room: slot.room,
          cy: dayjs(slot.startDate, 'YYYY-MM-DD HH:mm').format('MM-DD_HH:mm')
        },
        title: slot.title,
        start: dayjs(slot.startDate, 'YYYY-MM-DD HH:mm').format('YYYY-MM-DDTHH:mm'),
        end: dayjs(slot.endDate, 'YYYY-MM-DD HH:mm').format('YYYY-MM-DDTHH:mm'),
        backgroundColor: slot.color,
        borderColor: slot.color
      }
      return json
    },
    getTeachersLabel (teachers) {
      let label = ''
      if (teachers !== undefined) {
        for (let index = 0; index < teachers.length; ++index) {
          if (!this.isTeacherSelected || teachers[index].userId !== this.$store.state.horaires.selectedUser.userId) {
            const name = teachers[index].firstName.substring(0, 1) + '. ' + teachers[index].lastName
            label += (label === '') ? name : ', ' + name
          }
        }
      }
      return label
    },
    onEventClick (info) {
      // Handle event selection display
      if (this.selectedEvent) {
        const sameEvent = (this.selectedEvent.el === info.el)
        this.unselectEvent()
        if (sameEvent) {
          return
        }
      }

      info.el.parentNode.classList.add('selected')
      this.selectedEvent = info
    },
    onSelectDate (date) {
      this.selectedDate = dayjs(date).startOf('day')

      if (this.$refs.fullCalendar) {
        const calendar = this.$refs.fullCalendar.getApi()
        calendar.gotoDate(date)
      }

      this.$store.dispatch('horaires/selectDates',
        { start: dayjs(date).subtract(1, 'day'), end: dayjs(date).add(2, 'day') })
    },
    onSelectWeek (week) {
      if (this.$refs.fullCalendar) {
        const calendar = this.$refs.fullCalendar.getApi()
        calendar.gotoDate(new Date(week.firstDayOfWeek))
      }
      this.$store.dispatch('horaires/selectDates',
        { start: dayjs(week.firstDayOfWeek, 'YYYY-MM-DD'), end: dayjs(week.lastDayOfWeek, 'YYYY-MM-DD') })
    },
    onSwipe (event) {
      if (this.mq.phone) {
        switch (event.type) {
          case 'swipeleft':
            // this.pan -= 320
            if (event.isFinal) this.nextDate()
            break
          case 'swiperight':
            // this.pan += 320
            if (event.isFinal) this.previousDate()
            break
        }
      }
    },
    nextDate () {
      this.selectedDate = this.selectedDate.add(1, 'day')
      // Skip hidden days
      if (this.configuration.schoolDays.indexOf(this.selectedDate.day()) === -1) {
        this.nextDate()
      } else {
        this.onSelectDate(this.selectedDate.toDate())
      }
    },
    previousDate () {
      this.selectedDate = this.selectedDate.subtract(1, 'day')
      // Skip hidden days
      if (this.configuration.schoolDays.indexOf(this.selectedDate.day()) === -1) {
        this.previousDate()
      } else {
        this.onSelectDate(this.selectedDate.startOf().toDate())
      }
    },
    unselectEvent () {
      this.selectedEvent.el.parentNode.classList.remove('selected')
      this.selectedEvent = undefined
    }
  }
}
</script>

<style lang="scss" scoped>
.toolbar {
  min-height: 50px;
  margin-bottom: 10px;
}

.swipe-container {
  overflow-x: hidden;
  height: max(800px, calc(100% - 125px));
}

.swipe-wrapper {
  transition-duration: 320ms;
  height: 100%;
  display: flex;
  transition-property: transform;
  width: 100%
}

.calendar {
  transition-property: transform;
  position: relative;
  flex-shrink: 0;
  width: 100%;
}
</style>

<style lang="scss">
@import 'src/design/fullcalendar';
</style>
