<template>
  <div class="calendar">
    <PentilaSpinner v-if="isSpinnerDisplayed" />
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
  <teleport
    v-if="isEditSlotModalDisplayed"
    to="body"
  >
    <EditSlotModal
      :event-to-edit="eventToEdit"
      :create-event-method="createEvent"
      :update-event-method="updateEvent"
      @close="isEditSlotModalDisplayed = false"
    />
  </teleport>
</template>

<script>
import { slotLabelList } from '@/constants/appConstants'
import { isNotUsualSlot } from '@/utils/notUsualSlotUtils'
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
    isSpinnerDisplayed () {
      return this.$store.getters['currentActions/areActionsInProgress']
    },
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
              if (vm.selectedEvent) {
                vm.unselectEvent()
              }
              const calendar = vm.$refs.fullCalendar.getApi()
              calendar.prev()
              vm.$store.dispatch('notUsualSlots/setDisplayedDates', {
                startDate: moment(calendar.currentData.currentDate).startOf('week'),
                endDate: moment(calendar.currentData.currentDate).endOf('week')
              })
            }
          },
          customNext: {
            text: '>',
            click: function () {
              if (vm.selectedEvent) {
                vm.unselectEvent()
              }
              const calendar = vm.$refs.fullCalendar.getApi()
              calendar.next()
              vm.$store.dispatch('notUsualSlots/setDisplayedDates', {
                startDate: moment(calendar.currentData.currentDate).startOf('week'),
                endDate: moment(calendar.currentData.currentDate).endOf('week')
              })
            }
          },
          customToday: {
            text: this.$t('Moment.today'),
            click: function () {
              if (vm.selectedEvent) {
                vm.unselectEvent()
              }
              const calendar = vm.$refs.fullCalendar.getApi()
              calendar.today()
              vm.$store.dispatch('notUsualSlots/setDisplayedDates', {
                startDate: moment(calendar.currentData.currentDate).startOf('week'),
                endDate: moment(calendar.currentData.currentDate).endOf('week')
              })
            }
          }
        },
        selectable: true,
        selectAllow: this.allowSelection,
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
    allowSelection (selectInfo) {
      // TODO disable selection if the current user has not the good role
      return selectInfo.start.getDay() === selectInfo.end.getDay()
    },
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
          id: slot.cdtSessionId || slot.schoollifeSessionId,
          subject: slot.title,
          teacher: slot.teacher,
          inscriptionLeft: slot.remainingCapacity,
          room: slot.room,
          type: slot.type
        },
        title: title,
        start: moment(slot.sessionStart, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DDTHH:mm'),
        end: moment(slot.sessionEnd, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DDTHH:mm'),
        backgroundColor: color,
        borderColor: color
      }
    },
    editEvent (event) {
      if (isNotUsualSlot(event)) { // Only edit notUsualSlots
        this.eventToEdit = event
        this.isEditSlotModalDisplayed = true
      }
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
      if (!isNotUsualSlot(info.event)) { // Make grey student slots
        info.el.classList.add('grayed')
      }
      const container = info.el.getElementsByClassName('fc-event-main-frame')[0]
      if (info.event.extendedProps.teacher) {
        let tag = document.createElement('div')
        tag.classList.add('full-text')
        let label = info.event.extendedProps.teacher.firstName + ' ' + info.event.extendedProps.teacher.lastName
        // if (info.event.extendedProps.subject) {
        //   label += ' - ' + info.event.extendedProps.subject
        // }
        tag.appendChild(document.createTextNode(label))
        container.appendChild(tag)
        tag = document.createElement('div')
        tag.classList.add('short-text')
        label = info.event.extendedProps.teacher.firstName[0] + '. ' + info.event.extendedProps.teacher.lastName
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
@import 'src/design/fullcalendar';
</style>
