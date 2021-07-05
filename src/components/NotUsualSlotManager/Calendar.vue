<template>
  <div class="calendar">
    <FullCalendar
      ref="fullCalendar"
      :options="calendarOptions"
    />
    <EventPopover
      v-if="selectedEvent"
      :selected-event="selectedEvent"
      @editEvent="editEvent"
      @close="unselectEvent"
    />
  </div>
  <teleport to="body">
    <EditSlotModal
      v-if="isEditSlotModalDisplayed"
      :event-to-edit="eventToEdit"
      :create-event-method="createEvent"
      :update-event-method="updateEvent"
      @close="isEditSlotModalDisplayed = false"
    />
  </teleport>
</template>

<script>
import { slotLabelList } from '@/constants/appConstants'
import moment from 'moment'
import notUsualSlotsConstants from '@/constants/notUsualSlots'
import EditSlotModal from '@components/NotUsualSlotManager/EditSlotModal/EditSlotModal'
import EventPopover from '@/components/NotUsualSlotManager/EventPopover'
import FullCalendar from '@fullcalendar/vue3'
import frLocale from '@fullcalendar/core/locales/fr'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction' // Needed for event creation

export default {
  name: 'Calendar',
  components: {
    EditSlotModal,
    EventPopover,
    FullCalendar
  },
  props: {
    currentSlotType: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      isEditSlotModalDisplayed: false,
      selectedEvent: undefined,
      eventToEdit: undefined
    }
  },
  computed: {
    calendarOptions () {
      const vm = this
      return {
        locale: frLocale,
        plugins: [timeGridPlugin, interactionPlugin],
        initialView: 'timeGridWeek', // TODO Change to timeGridDay on mobile
        height: '100%',
        expandRows: true,
        headerToolbar: {
          left: 'customPrevious,customNext customToday',
          center: '',
          right: ''
        },
        customButtons: {
          customPrevious: {
            text: '<',
            click: function () {
              const calendar = vm.$refs.fullCalendar.getApi()
              calendar.prev()
              vm.$store.dispatch('setDisplayedDates', {
                startDate: moment(calendar.currentData.currentDate).startOf('week'),
                endDate: moment(calendar.currentData.currentDate).endOf('week')
              })
            }
          },
          customNext: {
            text: '>',
            click: function () {
              const calendar = vm.$refs.fullCalendar.getApi()
              calendar.next()
              vm.$store.dispatch('setDisplayedDates', {
                startDate: moment(calendar.currentData.currentDate).startOf('week'),
                endDate: moment(calendar.currentData.currentDate).endOf('week')
              })
            }
          },
          customToday: {
            text: this.$t('Moment.today'),
            click: function () {
              const calendar = vm.$refs.fullCalendar.getApi()
              calendar.today()
              vm.$store.dispatch('setDisplayedDates', {
                startDate: moment(calendar.currentData.currentDate).startOf('week'),
                endDate: moment(calendar.currentData.currentDate).endOf('week')
              })
            }
          }
        },
        selectable: true,
        select: this.onDateSelect,
        eventTextColor: '#333',
        eventTimeFormat: {
          hour: '2-digit',
          minute: '2-digit'
          // omitZeroMinute: true
        },
        eventClick: this.onEventClick,
        eventDidMount: this.onEventMount,
        views: {
          timeGrid: {
            allDaySlot: false,
            hiddenDays: [6, 0], // TODO get from config service
            nowIndicator: true,
            slotDuration: '01:00:00',
            slotMinTime: '08:00:00', // TODO get from config service
            slotMaxTime: '18:00:00', // TODO get from config service
            slotLabelDidMount: this.onSlotMount
          }
        },
        events:
          this.allSlotsToDisplay.map(slot => this.formatCalendarSlot(slot))
      }
    },
    userSlots () {
      return this.$store.state.notUsualSlots.userSlots
    },
    currentNonUsualSlots () {
      return this.$store.state.notUsualSlots.currentNonUsualSlots
    },
    allSlotsToDisplay () {
      return [...this.userSlots, ...this.currentNonUsualSlots]
    }
  },
  methods: {
    formatCalendarSlot (slot) {
      let title = slot.subject
      let color = slot.color
      if (title === undefined && slot.type !== undefined) {
        const slotType = notUsualSlotsConstants.slotTypes.find(obj => obj.type === slot.type)
        title = slotType.label
        color = slotType.color
      }

      return {
        extendedProps: {
          id: slot.cdtSessionId,
          subject: slot.title,
          teacher: slot.teacher,
          inscriptionLeft: slot.remainingCapacity,
          room: slot.room
        },
        title: title,
        start: moment(slot.sessionStart, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DDTHH:mm'),
        end: moment(slot.sessionEnd, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DDTHH:mm'),
        backgroundColor: color,
        borderColor: color
      }
    },
    editEvent (event) {
      this.eventToEdit = event
      this.isEditSlotModalDisplayed = true
    },
    onDateSelect (selection) {
      if (this.selectedEvent) {
        this.unselectEvent()
      }

      this.eventToEdit = {
        start: selection.start,
        end: selection.end
      }
      this.isEditSlotModalDisplayed = true

      // TODO display add modal and add event only on success
    },
    createEvent (event) {
      const calendar = this.$refs.fullCalendar.getApi()
      calendar.addEvent(event)
      calendar.unselect()
    },
    updateEvent (event) {
      // TODO
      console.log('update event: ' + event)
    },
    onEventClick (info) {
      // console.log('clicked !', info)
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
    onEventMount (info) {
      // console.log('mounted !', info)
      // Add infos in timegrid view
      const container = info.el.getElementsByClassName('fc-event-main-frame')[0]
      if (info.event.extendedProps.teacher) {
        const tag = document.createElement('div')
        const label = info.event.extendedProps.teacher.firstName + ' ' + info.event.extendedProps.teacher.lastName
        // if (info.event.extendedProps.subject) {
        //   label += ' - ' + info.event.extendedProps.subject
        // }
        tag.appendChild(document.createTextNode(label))
        container.appendChild(tag)
      }
      if (info.event.extendedProps.room) {
        const tag = document.createElement('div')
        tag.classList.add('fc-event-room')
        const label = info.event.extendedProps.room
        tag.appendChild(document.createTextNode(label))
        container.appendChild(tag)
      }
      if (info.event.extendedProps.inscriptionLeft) {
        const tag = document.createElement('div')
        tag.classList.add('fc-event-inscription')
        tag.appendChild(document.createTextNode(info.event.extendedProps.inscriptionLeft))
        container.appendChild(tag)
      }
    },
    onSlotMount (info) {
      // console.log('mounted slot', info.text)
      // Change hour label to P1, P2...
      const label = info.el.getElementsByClassName('fc-timegrid-slot-label-cushion')[0]
      label.innerText = slotLabelList[info.text]
    },
    unselectEvent () {
      this.selectedEvent.el.parentNode.classList.remove('selected')
      this.selectedEvent = undefined
    }
  }
}
</script>

<style lang="scss" scoped>
.calendar {
  height: 100%;
  width: 100%;
  border: 1px solid #D9E2EA;
  padding: 5px;
  overflow: auto;
}

h3 {
  text-align: center;
}

.slots-to-display {
  display: flex;
  flex-wrap: wrap;
}

.slot {
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  margin: 10px;
  padding: 10px;

  .title {
    font-weight: bold;
  }

  .room {
    font-style: italic;
  }
}
</style>

<style lang="scss">
$default-background-filter-color: #FFFFFFDD;
$selected-background-filter-color: #FFFFFF99;

.fc-timegrid-slots tr {
  border-top: 1px dotted silver;
  border-bottom: 1px dotted silver;
}

.fc-timegrid-event-harness {
  transition: inset .1s;

  &.selected {
    inset-inline-start: 0% !important;
    inset-inline-end: 0% !important;
    z-index: 10 !important;

    .fc-timegrid-event .fc-event-main {
      background-color: $selected-background-filter-color;
    }
  }

  &:hover .fc-timegrid-event .fc-event-main {
      background-color: $selected-background-filter-color;
  }
}

.fc-timegrid-event {
  border: none;
  border-left: 4px solid;
  border-radius: 0;

  .fc-event-main {
    background-color: $default-background-filter-color;
    padding-left: 4px;
  }

  .fc-event-time {
    display: none;
  }

  .fc-event-title-container {
    flex-grow: 0;
    .fc-event-title {
      font-weight: bold;
    }
  }

  .fc-event-room {
    font-style: italic;
  }

  .fc-event-inscription {
    margin-top: auto;
    margin-right: 5px;
    text-align: right;
  }
}
</style>
