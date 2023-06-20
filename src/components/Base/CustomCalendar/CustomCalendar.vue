<template>
  <div
    v-if="configuration"
    v-touch:swipe.left="swipeLeft"
    v-touch:swipe.right="swipeRight"
    class="swipe-container"
  >
    <div
      class="swipe-wrapper"
      :style="`transform: translate3d(${pan}px, 0px, 0px);`"
    >
      <FullCalendar
        ref="fullCalendar"
        class="calendar"
        :options="definitiveCalendarOptions"
      >
        <template #eventContent="event">
          <CalendarEvent
            :event="event"
            :show-popover="showPopover"
            @unselect="unselectEvent"
          />
        </template>
      </FullCalendar>
    </div>
  </div>

  <CalendarEventPopover
    v-if="selectedEvent && showPopover"
    :selected-event="selectedEvent"
    @optionClicked="$emit('eventOptionClicked', {event: matchFCEventWithPropsEvents(selectedEvent), option: $event})"
  />
</template>

<script>
import FullCalendar from '@fullcalendar/vue3'
import frLocale from '@fullcalendar/core/locales/fr'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import CalendarEvent from '@components/Base/CustomCalendar/CalendarEvent.vue'
import dayjs from 'dayjs'
import { defineAsyncComponent } from 'vue'
const CalendarEventPopover = defineAsyncComponent(() => import('@components/Base/CustomCalendar/CalendarEventPopover.vue'))

export default {
  name: 'CustomCalendar',
  components: { CalendarEventPopover, CalendarEvent, FullCalendar },
  inject: ['mq'],
  props: {
    events: {
      type: Array,
      required: true
    },
    displayDate: {
      type: Object,
      default: dayjs()
    },
    showPopover: {
      type: Boolean,
      default: true
    },
    canCreateSlots: {
      type: Boolean,
      default: false
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
  emits: ['eventOptionClicked', 'unselectEvent', 'selectEvent', 'selectDate', 'createSlot'],
  data () {
    return {
      selectedEvent: undefined,
      pan: 0
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
    definitiveCalendarOptions () { // Include and override default options by custom props options
      const definitiveOptions = {
        ...this.defaultCalendarOptions,
        ...this.calendarOptions
      }

      if (this.canCreateSlots) { // Add specific options if props canCreateSlots is true
        definitiveOptions.plugins.push(interactionPlugin)
        definitiveOptions.selectable = true
        definitiveOptions.selectAllow = this.allowSelection
        definitiveOptions.select = this.onDateSelect
      }

      return definitiveOptions
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
  watch: {
    displayDate: {
      immediate: true,
      handler (value) {
        if (this.$refs.fullCalendar) {
          const calendar = this.$refs.fullCalendar.getApi()
          calendar.gotoDate(value.toDate())
        }
      }
    }
  },
  created () {
    if (!this.configuration) {
      this.$store.dispatch('calendar/getConfiguration')
    }
  },
  methods: {
    swipeLeft () {
      if (this.definitiveCalendarOptions.initialView === 'timeGridDay') {
        this.selectNextDay(this.displayDate)
      }
    },
    swipeRight () {
      if (this.definitiveCalendarOptions.initialView === 'timeGridDay') {
        this.selectPreviousDay(this.displayDate)
      }
    },
    selectPreviousDay (date) {
      const newDate = date.subtract(1, 'day')
      // Skip hidden days
      const schoolDays = [1, 2, 3, 4, 5] // TODO: to get from backend
      if (schoolDays.indexOf(newDate.day()) === -1) {
        this.selectPreviousDay(newDate)
      } else {
        this.$emit('selectDate', newDate.startOf().toDate())
      }
    },
    selectNextDay (date) {
      const newDate = date.add(1, 'day')
      // Skip hidden days
      const schoolDays = [1, 2, 3, 4, 5] // TODO: to get from backend
      if (schoolDays.indexOf(newDate.day()) === -1) {
        this.selectNextDay(newDate)
      } else {
        this.$emit('selectDate', newDate.toDate())
      }
    },
    formatCalendarSlot (slot) {
      return {
        extendedProps: slot,
        title: slot.title || slot.groupName,
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
      this.$emit('selectEvent', this.matchFCEventWithPropsEvents(event))
    },
    unselectEvent () {
      if (this.selectedEvent.el.parentNode != null) {
        this.selectedEvent.el.parentNode.classList.remove('selected')
      }
      this.selectedEvent = undefined
      this.$emit('unselectEvent')
    },
    matchFCEventWithPropsEvents (event) {
      const eventId = event.event.extendedProps.sessionId
      const index = this.events.map(event => event.sessionId).indexOf(eventId)
      if (index !== -1) {
        return this.events[index]
      } else {
        return undefined
      }
    },
    allowSelection (selectInfo) {
      return selectInfo.start.getDay() === selectInfo.end.getDay()
    },
    onDateSelect (selection) {
      if (this.selectedEvent) {
        this.unselectEvent()
      } else {
        this.$emit('createSlot', { start: selection.start, end: selection.end })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
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
