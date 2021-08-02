<template>
  <div class="calendar">
    <PentilaSpinner v-if="isSpinnerDisplayed" />
    <template v-if="configuration">
      <Timeline
        v-if="!$device.phone"
        :min-date="minDate"
        :max-date="maxDate"
        @selectWeek="onSelectWeek"
      />
      <NotUsualSlotsToolBar
        v-if="$device.phone"
        :selected-date="selectedDate"
        @selectDate="onSelectDate"
      />
      <div
        v-if="$device.phone"
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
            @click.stop
          />
        </div>
      </div>
      <FullCalendar
        v-else
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
    </template>
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
      :is-full-screen="$device.phone"
      @close="isEditSlotModalDisplayed = false"
    />
    <StudentRegistrationModal
      v-if="isRegistrationModalDisplayed"
      :event="eventToEdit"
      :student="queriedUser"
      :is-full-screen="$device.phone"
      @close="isRegistrationModalDisplayed = false"
    />
    <StudentListModal
      v-if="isListModalDisplayed"
      :event="eventToEdit"
      :is-full-screen="$device.phone"
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
import NotUsualSlotsToolBar from '@components/NotUsualSlotManager/NotUsualSlotsToolBar'
// import FCEvent from '@components/Horaires/FCEvent'

dayjs.extend(customParseFormat)

export default {
  name: 'Calendar',
  components: {
    NotUsualSlotsToolBar,
    // FCEvent,
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
      notComputedSlotsToDisplay: [],
      pan: 0,
      selectedDate: dayjs(),
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
    currentUser () {
      return this.$store.state.user
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
        initialView: this.$device.phone ? 'timeGridDay' : 'timeGridWeek',
        height: this.$device.phone ? '100%' : 'max(600px, calc(100% - 63px))',
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
            // slotLabelDidMount: this.onSlotMount
          }
        },
        events: this.notComputedSlotsToDisplay.map(slot => this.formatCalendarSlot(slot))
      }
    },
    userSlots () {
      return this.$store.state.notUsualSlots.userSlots
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
    currentNonUsualSlots () {
      return this.$store.state.notUsualSlots.currentNonUsualSlots
    },
    allSlotsToDisplay () {
      return this.isSpinnerDisplayed ? [] : [...this.userSlots, ...this.currentNonUsualSlots]
    }
  },
  watch: {
    allSlotsToDisplay (value) {
      if (JSON.stringify(value) !== JSON.stringify(this.notComputedSlotsToDisplay)) {
        this.notComputedSlotsToDisplay = [...value]
      }
    }
  },
  // mounted () { // TODO: Avoid calendar to go after limit date, todo when we will consistent with dates
  //   const calendar = this.$refs.fullCalendar.getApi()
  //   const currentDate = dayjs(calendar.getDate())
  //
  //   if (currentDate > this.maxDate.endOf('week')) {
  //     calendar.gotoDate(new Date(this.maxDate.startOf('week')))
  //     this.$store.dispatch('notUsualSlots/setDisplayedDates', {
  //       startDate: moment(this.maxDate.startOf('week').format('YYYY-MM-DD'), 'YYYY-MM-DD'),
  //       endDate: moment(this.maxDate.endOf('week').format('YYYY-MM-DD'), 'YYYY-MM-DD')
  //     })
  //   }
  // },
  methods: {
    allowSelection (selectInfo) {
      // TODO disable selection if the current user has not the good role
      return selectInfo.start.getDay() === selectInfo.end.getDay()
    },
    onSelectDate (date) {
      this.selectedDate = dayjs(date).startOf('day')
      if (this.selectedEvent) {
        this.unselectEvent()
      }

      if (this.$refs.fullCalendar) {
        const calendar = this.$refs.fullCalendar.getApi()
        calendar.gotoDate(date)
      }
      this.$store.dispatch('notUsualSlots/setDisplayedDates',
        { startDate: moment(date, 'YYYY-MM-DD'), endDate: moment(date, 'YYYY-MM-DD').endOf('day') })
    },
    onSelectWeek (week) {
      if (this.selectedEvent) {
        this.unselectEvent()
      }

      if (this.$refs.fullCalendar) {
        const calendar = this.$refs.fullCalendar.getApi()
        calendar.gotoDate(new Date(week.firstDayOfWeek))
      }
      this.$store.dispatch('notUsualSlots/setDisplayedDates',
        { startDate: moment(week.firstDayOfWeek, 'YYYY-MM-DD'), endDate: moment(week.lastDayOfWeek, 'YYYY-MM-DD') })
    },
    onSwipe (event) {
      if (this.$device.phone) {
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
    formatCalendarSlot (slot) {
      console.log('formatCalendarSlot ', slot)
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
        start: moment(slot.startDate, 'DD/MM/YYYY HH:mm').format('YYYY-MM-DDTHH:mm'),
        end: moment(slot.endDate, 'DD/MM/YYYY HH:mm').format('YYYY-MM-DDTHH:mm'),
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
      } else if (this.currentUser.isDoyen || this.currentUser.isDirectionMember || this.currentUser.isSecretariat) {
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
      // Add infos in timegrid view
      if (!isEditableSlot(info.event)) { // Make grey student slots
        info.el.classList.add('grayed')
      }
      const container = info.el.getElementsByClassName('fc-event-main-frame')[0]
      container.setAttribute('data-test', info.event.title)

      if (info.event.extendedProps.teacher) {
        let tag = document.createElement('div')
        tag.classList.add('full-text')
        let label = info.event.extendedProps.teacher.firstName + ' ' + info.event.extendedProps.teacher.lastName
        tag.appendChild(document.createTextNode(label))
        tag.setAttribute('title', label)
        container.appendChild(tag)
        tag = document.createElement('div')
        tag.classList.add('short-text')
        label = info.event.extendedProps.teacher.teacherId !== -1 ? (info.event.extendedProps.teacher.firstName[0] + '. ' + info.event.extendedProps.teacher.lastName) : ''
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
      // Change hour label to P1, P2...
      const label = info.el.getElementsByClassName('fc-timegrid-slot-label-cushion')[0]
      label.innerText = slotLabelList[info.text]
    },
    unselectEvent () {
      if (this.selectedEvent) {
        if (this.selectedEvent.el.parentNode) {
          this.selectedEvent.el.parentNode.classList.remove('selected')
        }
        this.selectedEvent = undefined
      }
    }
  }
}
</script>

<style scoped>
.swipe-container {
  overflow-x: hidden;
  height: max(600px, calc(100% - 63px));
}
</style>

<style lang="scss" scoped>

.swipe-wrapper {
  transition-duration: 320ms;
  height: 100%;
  display: flex;
  transition-property: transform;
  width: 100%
}

.calendar {
  width: 100%;
  overflow: auto;
  flex: 1;
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
