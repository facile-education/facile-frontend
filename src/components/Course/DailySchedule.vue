<template>
  <div class="main">
    <p>Horaires</p>
    <div
      v-if="mq.phone"
      v-touch:swipe.left="onSwipeLeft"
      v-touch:swipe.right="onSwipeRight"
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
            <FCEvent
              :arg="arg"
            />
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
        <FCEvent
          :arg="arg"
        />
      </template>
    </FullCalendar>
  </div>
</template>

<script>

import dayjs from 'dayjs'
import FullCalendar from '@fullcalendar/vue3'
import frLocale from '@fullcalendar/core/locales/fr'
import timeGridPlugin from '@fullcalendar/timegrid'
import { getTeachersLabel } from '@utils/commons.util'
import { defineAsyncComponent } from 'vue'
const FCEvent = defineAsyncComponent(() => import('@/components/Horaires/FCEvent'))

export default {
  name: 'DailySchedule',
  components: {
    FCEvent,
    FullCalendar
  },
  inject: ['mq'],
  data () {
    return {
      pan: 0,
      selectedDate: dayjs(),
      selectedEvent: undefined,
      updatedSession: undefined
    }
  },
  computed: {
    calendarOptions () {
      return {
        locale: frLocale,
        plugins: [timeGridPlugin],
        initialView: 'timeGridDay',
        // 110 is toolbar (50) + margin (15) + timeline (45)
        height: this.mq.phone ? '100%' : 'max(800px, calc(100% - 110px))',
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
      return this.$store.state.horaires.configuration
    },
    isConfigurationLoaded () {
      return this.$store.state.horaires.configuration.isLoaded
    },
    eventList () {
      return this.$store.state.course.sessionList
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
      return this.$store.state.horaires.isLoading || !this.configuration.isLoaded
    },
    minDate () {
      return dayjs(this.configuration.schoolYearStartDate, 'YYYY-MM-DD HH:mm')
    },
    maxDate () {
      return dayjs(this.configuration.schoolYearEndDate, 'YYYY-MM-DD HH:mm')
    }
  },
  created () {
    if (!this.isConfigurationLoaded) {
      this.$store.dispatch('horaires/getConfiguration').then((res) => {
        this.$store.dispatch('course/getSessionList')
      })
    }
  },
  methods: {
    formatCalendarSlot (slot) {
      const json = {
        extendedProps: {
          id: slot.sessionId,
          subject: slot.subject,
          teachers: getTeachersLabel(slot.teachers),
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
    nextDate () {
      this.selectedDate = this.selectedDate.add(1, 'day')
      // Skip hidden days
      if (this.configuration.schoolDays.indexOf(this.selectedDate.day()) === -1) {
        this.nextDate()
      } else {
        this.onSelectDate(this.selectedDate.toDate())
      }
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
    onSwipeLeft () {
      if (this.mq.phone) {
        this.nextDate()
      }
    },
    onSwipeRight () {
      if (this.mq.phone) {
        this.previousDate()
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
      if (this.selectedEvent.el.parentNode != null) {
        this.selectedEvent.el.parentNode.classList.remove('selected')
      }
      this.selectedEvent = undefined
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@design';

  .main-label {
    margin-top: 10em;
    text-align: center;
  }

</style>

<i18n locale="fr">
{
  "action": "Editer"
}
</i18n>
