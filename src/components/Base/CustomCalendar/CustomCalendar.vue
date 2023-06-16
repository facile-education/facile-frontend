<template>
  <FullCalendar
    v-if="configuration"
    ref="fullCalendar"
    :options="definitiveCalendarOptions"
  >
    <template #eventContent="event">
      <CalendarEvent
        :event="event"
        :is-selected="selectedEvent"
        @optionClicked="$emit('eventOptionClicked', {event: event, option: $event})"
        @unselect="unselectEvent"
      />
    </template>
  </FullCalendar>
</template>

<script>
import frLocale from '@fullcalendar/core/locales/fr'
import timeGridPlugin from '@fullcalendar/timegrid'
import FullCalendar from '@fullcalendar/vue3'
import CalendarEvent from '@components/Base/CustomCalendar/CalendarEvent.vue'
import { getTeachersLabel } from '@utils/commons.util'
import dayjs from 'dayjs'

export default {
  name: 'CustomCalendar',
  components: { CalendarEvent, FullCalendar },
  inject: ['mq'],
  props: {
    events: {
      type: Array,
      required: true
    },
    showPopover: {
      type: Boolean,
      default: true
    },
    selectFirstEventOnLoad: {
      type: Boolean,
      default: false
    },
    calendarOptions: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  emits: ['eventOptionClicked', 'unselectEvent', 'selectEvent'],
  data () {
    return {
      selectedEvent: undefined
    }
  },
  computed: {
    configuration () {
      return this.$store.state.calendar.configuration
    },
    defaultCalendarOptions () {
      return {
        locale: frLocale,
        plugins: [timeGridPlugin],
        initialView: this.mq.phone ? 'timeGridDay' : 'timeGridWeek',
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
        eventClick: this.selectEvent,
        views: {
          day: {
            dayHeaderFormat: { weekday: 'long', month: 'numeric', day: 'numeric' }
          },
          timeGrid: {
            allDaySlot: false,
            hiddenDays: this.hiddenDays,
            nowIndicator: true,
            slotDuration: '01:00:00',
            slotMinTime: '07:55', // TODO: get from backend
            slotMaxTime: '17:55'
          }
        },
        events: this.events.map(slot => this.formatCalendarSlot(slot))
      }
    },
    definitiveCalendarOptions () {
      return {
        ...this.defaultCalendarOptions,
        ...this.calendarOptions
      }
    },
    hiddenDays () {
      const hiddenDays = []
      let dayNumber
      const schoolDays = [1, 2, 3, 4, 5] // TODO: to get from backend
      for (dayNumber = 0; dayNumber <= 6; ++dayNumber) {
        if (schoolDays.indexOf(dayNumber) === -1) {
          hiddenDays.push(dayNumber)
        }
      }
      return hiddenDays
    }
  },
  created () {
    if (!this.configuration) {
      this.$store.dispatch('calendar/getConfiguration')
    }
  },
  methods: {
    formatCalendarSlot (slot) {
      return {
        extendedProps: {
          id: (slot.sessionId === undefined ? slot.schoollifeSessionId : slot.sessionId),
          subject: slot.subject,
          teachers: getTeachersLabel(slot.teachers),
          room: slot.room,
          cy: dayjs(slot.startDate, 'YYYY-MM-DD HH:mm').format('MM-DD_HH:mm')
        },
        title: slot.groupName,
        start: dayjs(slot.startDate, 'YYYY-MM-DD HH:mm').format('YYYY-MM-DDTHH:mm'),
        end: dayjs(slot.endDate, 'YYYY-MM-DD HH:mm').format('YYYY-MM-DDTHH:mm'),
        backgroundColor: slot.color,
        borderColor: slot.color
      }
    },
    selectEvent (event) {
      // Handle event selection display
      if (this.selectedEvent) {
        const sameEvent = (this.selectedEvent.el === event.el)
        this.unselectEvent()
        if (sameEvent) {
          return
        }
      }

      event.el.parentNode.classList.add('selected')
      this.selectedEvent = event
      this.$emit('selectEvent', event) // TODO: check event formatting to return event like in props eventList
    },
    unselectEvent () {
      if (this.selectedEvent.el.parentNode != null) {
        this.selectedEvent.el.parentNode.classList.remove('selected')
      }
      this.selectedEvent = undefined
      this.$emit('unselectEvent')
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
