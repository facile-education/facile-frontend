<template>
  <div class="calendar">
    <PentilaSpinner v-if="isSpinnerDisplayed" />
    <Timeline
      v-if="configuration"
      :min-date="minDate"
      :max-date="maxDate"
      @selectWeek="onSelectWeek"
    />
    <FullCalendar
      ref="fullCalendar"
      :options="calendarOptions"
      @click.stop
    />
    <EventPopover
      v-if="selectedEvent"
      :selected-event="selectedEvent"
      @editEvent="editEvent"
      @openRegistration="openRegistration"
      @showStudentList="showStudentList"
      @close="unselectEvent"
    />
  </div>
  <teleport
    v-if="isEditSlotModalDisplayed || isRegistrationModalDisplayed || isListModalDisplayed"
    to="body"
  >
    <EditSlotModal
      v-if="isEditSlotModalDisplayed"
      :event-to-edit="eventToEdit"
      :create-event-method="createEvent"
      :update-event-method="updateEvent"
      @close="isEditSlotModalDisplayed = false"
    />
    <StudentRegistrationModal
      v-if="isRegistrationModalDisplayed"
      :event="eventToEdit"
      :student="queriedUser"
      @close="isRegistrationModalDisplayed = false"
    />
    <StudentListModal
      v-if="isListModalDisplayed"
      :event="eventToEdit"
      @close="isListModalDisplayed = false"
    />
  </teleport>
</template>

<script>
import { slotLabelList } from '@/constants/appConstants'
import { isEditableSlot } from '@/utils/notUsualSlotUtils'
import moment from 'moment'
import notUsualSlotsConstants from '@/constants/notUsualSlots'
import EditSlotModal from '@components/NotUsualSlotManager/EditSlotModal/EditSlotModal'
import EventPopover from '@/components/NotUsualSlotManager/EventPopover'
import FullCalendar from '@fullcalendar/vue3'
import frLocale from '@fullcalendar/core/locales/fr'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import StudentListModal from '@components/NotUsualSlotManager/StudentListModal/StudentListModal'
import StudentRegistrationModal from '@components/NotUsualSlotManager/StudentRegistrationModal/StudentRegistrationModal'
import Timeline from '@components/Horaires/Timeline' // Needed for event creation
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'

dayjs.extend(customParseFormat)

export default {
  name: 'Calendar',
  components: {
    Timeline,
    StudentRegistrationModal,
    StudentListModal,
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
      selectedEvent: undefined,
      eventToEdit: undefined,
      isEditSlotModalDisplayed: false,
      isRegistrationModalDisplayed: false,
      isListModalDisplayed: false
    }
  },
  computed: {
    isSpinnerDisplayed () {
      return this.$store.getters['currentActions/areActionsInProgress']
    },
    queriedUser () {
      return this.$store.state.notUsualSlots.queriedUser
    },
    configuration () {
      return (this.$store.state.cdt.configuration.schoolDays.length > 0) ? this.$store.state.cdt.configuration : undefined
    },
    minDate () {
      return dayjs(this.configuration.startDateSchool, 'DD/MM/YYYY HH:mm')
    },
    maxDate () {
      return dayjs(this.configuration.endDateSchool, 'DD/MM/YYYY HH:mm')
    },
    calendarOptions () {
      // const vm = this
      return {
        locale: frLocale,
        plugins: [timeGridPlugin, interactionPlugin],
        initialView: 'timeGridWeek', // TODO Change to timeGridDay on mobile
        height: '100%',
        expandRows: true,
        headerToolbar: {
          left: '',
          center: '',
          right: ''
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
      return this.isSpinnerDisplayed ? [] : [...this.userSlots, ...this.currentNonUsualSlots]
    }
  },
  mounted () {
    const calendar = this.$refs.fullCalendar.getApi()
    const currentDate = dayjs(calendar.getDate())

    if (currentDate > this.maxDate.endOf('week')) {
      calendar.gotoDate(new Date(this.maxDate.startOf('week')))
      this.$store.dispatch('notUsualSlots/setDisplayedDates', {
        startDate: moment(this.maxDate.startOf('week').format('YYYY-MM-DD'), 'YYYY-MM-DD'),
        endDate: moment(this.maxDate.endOf('week').format('YYYY-MM-DD'), 'YYYY-MM-DD')
      })
    }
  },
  methods: {
    allowSelection (selectInfo) {
      // TODO disable selection if the current user has not the good role
      return selectInfo.start.getDay() === selectInfo.end.getDay()
    },
    onSelectWeek (week) {
      if (this.$refs.fullCalendar) {
        const calendar = this.$refs.fullCalendar.getApi()
        calendar.gotoDate(new Date(week.firstDayOfWeek))
      }
      this.$store.dispatch('notUsualSlots/setDisplayedDates',
        { startDate: moment(week.firstDayOfWeek, 'YYYY-MM-DD'), endDate: moment(week.lastDayOfWeek, 'YYYY-MM-DD') })
    },
    formatCalendarSlot (slot) {
      let title = slot.title
      let color = slot.color
      if (slot.subject === undefined && slot.type !== undefined) {
        const slotType = notUsualSlotsConstants.getSlotTypeByNumber(slot.type)
        title = slotType.label
        color = slotType.color
      }

      return {
        extendedProps: {
          id: slot.cdtSessionId || slot.schoollifeSessionId,
          subject: slot.subject,
          teacher: slot.teacher,
          inscriptionLeft: slot.remainingCapacity,
          room: slot.room,
          type: slot.type,
          isUserSlot: slot.isUserSlot
        },
        title: title,
        start: moment(slot.sessionStart, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DDTHH:mm'),
        end: moment(slot.sessionEnd, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DDTHH:mm'),
        backgroundColor: color,
        borderColor: color
      }
    },
    editEvent (event) {
      if (isEditableSlot(event)) { // Only edit notUsualSlots
        this.eventToEdit = event
        this.isEditSlotModalDisplayed = true
      }
    },
    openRegistration (event) {
      if (isEditableSlot(event)) {
        this.eventToEdit = event
        this.isRegistrationModalDisplayed = true
      }
    },
    showStudentList (event) {
      if (isEditableSlot(event)) {
        this.eventToEdit = event
        this.isListModalDisplayed = true
      }
    },
    onDateSelect (selection) {
      if (this.selectedEvent) {
        this.unselectEvent()
      } else {
        this.eventToEdit = {
          start: selection.start,
          end: selection.end
        }
        this.isEditSlotModalDisplayed = true
      }
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
      if (!isEditableSlot(info.event)) { // Make grey student slots
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
        tag.setAttribute('title', label)
        container.appendChild(tag)
        tag = document.createElement('div')
        tag.classList.add('short-text')
        label = info.event.extendedProps.teacher.teacherId !== -1 ? (info.event.extendedProps.teacher.firstName[0] + '. ' + info.event.extendedProps.teacher.lastName) : ''
        // if (info.event.extendedProps.subject) {
        //   label += ' - ' + info.event.extendedProps.subject
        // }
        tag.appendChild(document.createTextNode(label))
        tag.setAttribute('title', label)
        container.appendChild(tag)
      }
      if (info.event.extendedProps.room) {
        const tag = document.createElement('div')
        tag.classList.add('fc-event-room')
        const label = this.formattedRoomAndPlacesLabel(info.event)
        tag.appendChild(document.createTextNode(label))
        container.appendChild(tag)
      }
    },
    formattedRoomAndPlacesLabel (event) {
      return (event.extendedProps.inscriptionLeft !== undefined ? (event.extendedProps.inscriptionLeft + ' ' + this.$t('NotUsualSlots.remainingPlaces') + (event.extendedProps.inscriptionLeft > 1 ? 's' : '')) : '')
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
