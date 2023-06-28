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
        :key="calendarView"
        class="calendar"
        :options="definitiveCalendarOptions"
        @click.stop
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
    @optionClicked="optionClicked"
    @close="unselectEvent"
  />
</template>

<script>
import CalendarEvent from '@components/Base/CustomCalendar/CalendarEvent.vue'
import frLocale from '@fullcalendar/core/locales/fr'
import interactionPlugin from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid'
import FullCalendar from '@fullcalendar/vue3'
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
    calendarView () {
      return this.mq.phone ? 'timeGridDay' : 'timeGridWeek' // Use as component key to force it to re-render when view change
    },
    defaultCalendarOptions () {
      return {
        locale: frLocale,
        plugins: [timeGridPlugin],
        initialView: this.calendarView,
        viewDidMount: this.goToDisplayDate,
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
        eventDidMount: this.onEventMount,
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
        events: this.formattedEvents
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
    formattedEvents () {
      const formattedEvents = [...this.events]
      for (let i = 0; i < formattedEvents.length; i++) {
        formattedEvents[i] = this.formatCalendarSlot(formattedEvents[i], i)
      }
      return formattedEvents
    },
    hiddenDays () {
      const hiddenDays = []
      let dayNumber
      const schoolDays = this.configuration.schoolDays
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
      handler () {
        this.goToDisplayDate()
      }
    }
  },
  created () {
    if (!this.configuration) {
      this.$store.dispatch('calendar/getConfiguration')
    }
  },
  methods: {
    goToDisplayDate () {
      if (this.$refs.fullCalendar) {
        const calendar = this.$refs.fullCalendar.getApi()
        calendar.gotoDate(this.displayDate.toDate())
      }
    },
    optionClicked (option) {
      this.$emit('eventOptionClicked', { event: this.matchFCEventWithPropsEvents(this.selectedEvent), option: option })
      this.unselectEvent()
    },
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
      const schoolDays = this.configuration.schoolDays
      if (schoolDays.indexOf(newDate.day()) === -1) {
        this.selectPreviousDay(newDate)
      } else {
        this.$emit('selectDate', newDate.startOf().toDate())
      }
    },
    selectNextDay (date) {
      const newDate = date.add(1, 'day')
      // Skip hidden days
      const schoolDays = this.configuration.schoolDays
      if (schoolDays.indexOf(newDate.day()) === -1) {
        this.selectNextDay(newDate)
      } else {
        this.$emit('selectDate', newDate.toDate())
      }
    },
    formatCalendarSlot (slot, eventPosition) {
      return {
        extendedProps: { ...slot, ...{ eventPosition: eventPosition } },
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
    onEventMount (event) {
      if (event.event.extendedProps.grayed) { // Put this here because I can't find out how to access to event el from CalendarEvent component
        event.el.classList.add('grayed')
      }
    },
    matchFCEventWithPropsEvents (event) {
      // Do not only based on sessionId because some views can display two times the same slot session (like in HHC when we select user registered in existing HHC)
      if (event.event.extendedProps.sessionId === this.events[event.event.extendedProps.eventPosition].sessionId) {
        return this.events[event.event.extendedProps.eventPosition]
      } else {
        console.error('Cannot match props event with the clicked calendar event', event, this.events)
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
        this.$emit('createSlot', { start: dayjs(selection.start), end: dayjs(selection.end) })
      }
    }
  }
}
</script>

<style lang="scss">
@import 'src/design/fullcalendar';
</style>

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
