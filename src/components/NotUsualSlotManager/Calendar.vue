<template>
  <div class="calendar">
    <PentilaSpinner v-if="isSpinnerDisplayed" />
    <template v-if="configuration">
      <Timeline
        v-if="mq.desktop"
        :min-date="minDate"
        :max-date="maxDate"
        @selectWeek="onSelectWeek"
      />
      <NotUsualSlotsToolBar
        v-if="!mq.desktop"
        :selected-date="selectedDate"
        @selectDate="onSelectDate"
      />
      <div
        v-if="!mq.desktop"
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
      :full-screen="mq.phone"
      @close="isEditSlotModalDisplayed = false"
    />
    <StudentRegistrationModal
      v-if="isRegistrationModalDisplayed"
      :event="eventToEdit"
      :full-screen="mq.phone"
      @close="isRegistrationModalDisplayed = false"
    />
    <StudentListModal
      v-if="isListModalDisplayed"
      :event="eventToEdit"
      :full-screen="mq.phone"
      @close="isListModalDisplayed = false"
    />
  </teleport>
</template>

<script>
import { slotLabelList } from '@/constants/appConstants'
import { isEditableSlot } from '@utils/notUsualSlot.util'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import notUsualSlotsConstants from '@/constants/notUsualSlots'
import FullCalendar from '@fullcalendar/vue3'
import frLocale from '@fullcalendar/core/locales/fr'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
// import FCEvent from '@components/Horaires/FCEvent'

import { defineAsyncComponent } from 'vue'
import { getTeachersLabel } from '@utils/commons.util'

const NotUsualSlotsToolBar = defineAsyncComponent(() => import('@components/NotUsualSlotManager/NotUsualSlotsToolBar'))
const Timeline = defineAsyncComponent(() => import('@components/Horaires/Timeline')) // Needed for event creation
const EventPopover = defineAsyncComponent(() => import('@/components/NotUsualSlotManager/EventPopover'))
const StudentRegistrationModal = defineAsyncComponent(() => import('@components/NotUsualSlotManager/StudentRegistrationModal/StudentRegistrationModal'))
const StudentListModal = defineAsyncComponent(() => import('@components/NotUsualSlotManager/StudentListModal/StudentListModal'))
const EditSlotModal = defineAsyncComponent(() => import('@components/NotUsualSlotManager/EditSlotModal/EditSlotModal'))

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
  inject: ['mq'],
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
    configuration () {
      return (this.$store.state.horaires.configuration.schoolDays.length > 0) ? this.$store.state.horaires.configuration : undefined
    },
    minDate () {
      return dayjs(this.configuration.startDateSchool, 'YYYY-MM-DD HH:mm')
    },
    maxDate () {
      return dayjs(this.configuration.endDateSchool, 'YYYY-MM-DD HH:mm')
    },
    calendarOptions () {
      // const vm = this
      return {
        locale: frLocale,
        plugins: [timeGridPlugin, interactionPlugin],
        initialView: this.mq.phone ? 'timeGridDay' : 'timeGridWeek',
        height: this.mq.phone ? 'max(800px, 100%)' : 'max(800px, calc(100% - 63px))',
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
    },
    mq: { // To correctly handle date and slots when we move from portrait to landscape
      deep: true,
      handler (value) {
        if (!value.desktop) {
          this.onSelectDate(this.selectedDate.toDate())

          if (this.$refs.fullCalendar) {
            const calendar = this.$refs.fullCalendar.getApi()
            calendar.changeView(value.phone ? 'timeGridDay' : 'timeGridWeek')
          }
        }
      }
    }
  },
  // mounted () { // TODO: Avoid calendar to go after limit date
  //   const calendar = this.$refs.fullCalendar.getApi()
  //   const currentDate = dayjs(calendar.getDate())
  //
  //   if (currentDate > this.maxDate.endOf('week')) {
  //     calendar.gotoDate(new Date(this.maxDate.startOf('week')))
  //     this.$store.dispatch('notUsualSlots/setDisplayedDates', {
  //       startDate: dayjs(this.maxDate.startOf('week').format('YYYY-MM-DD'), 'YYYY-MM-DD'),
  //       endDate: dayjs(this.maxDate.endOf('week').format('YYYY-MM-DD'), 'YYYY-MM-DD')
  //     })
  //   }
  // },
  methods: {
    allowSelection (selectInfo) {
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
      // If swipe provide from tablet, get slot for the entire week and not only the current day
      const startDate = this.mq.phone ? dayjs(date) : dayjs(date).startOf('week')
      const endDate = this.mq.phone ? dayjs(date).endOf('day') : dayjs(date).endOf('week')
      this.$store.dispatch('notUsualSlots/setDisplayedDates',
        { startDate: startDate, endDate: endDate })
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
        { startDate: dayjs(week.firstDayOfWeek, 'YYYY-MM-DD'), endDate: dayjs(week.lastDayOfWeek, 'YYYY-MM-DD') })
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
    nextDate () {
      const unit = this.mq.phone ? 'day' : 'week'
      this.selectedDate = this.selectedDate.add(1, unit)
      // Skip hidden days
      if (this.configuration.schoolDays.indexOf(this.selectedDate.day()) === -1) {
        this.nextDate()
      } else {
        this.onSelectDate(this.selectedDate.toDate())
      }
    },
    previousDate () {
      const unit = this.mq.phone ? 'day' : 'week'
      this.selectedDate = this.selectedDate.subtract(1, unit)
      // Skip hidden days
      if (this.configuration.schoolDays.indexOf(this.selectedDate.day()) === -1) {
        this.previousDate()
      } else {
        this.onSelectDate(this.selectedDate.startOf().toDate())
      }
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
          teachers: slot.teachers,
          inscriptionLeft: slot.capacity - slot.nbRegisteredStudents,
          capacity: slot.capacity,
          nbRegisteredStudents: slot.nbRegisteredStudents,
          room: slot.room,
          type: slot.type,
          isUserSlot: slot.nbRegisteredStudents === undefined, // The difference between slots and student's sessions is the nbRegisteredStudents attribute
          cy: dayjs(slot.startDate, 'YYYY-MM-DD HH:mm').format('MM-DD_HH:mm')
        },
        title: title,
        start: dayjs(slot.startDate, 'YYYY-MM-DD HH:mm').format('YYYY-MM-DDTHH:mm'),
        end: dayjs(slot.endDate, 'YYYY-MM-DD HH:mm').format('YYYY-MM-DDTHH:mm'),
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
      container.setAttribute('data-test', dayjs(info.event.start).format('MM-DD_HH:mm'))

      // Add time to title
      const title = container.getElementsByClassName('fc-event-title')[0]
      const tag = document.createElement('span')
      tag.appendChild(document.createTextNode(dayjs(info.event.start).format('HH:mm') + ' - ' + dayjs(info.event.end).format('HH:mm')))
      tag.style.fontSize = '0.75rem'
      tag.style.fontWeight = 'normal'
      tag.style.marginLeft = '5px'
      tag.style.whiteSpace = 'nowrap'
      tag.style.overflowX = 'hidden'
      tag.style.textOverflow = 'ellipsis'

      title.appendChild(tag)

      if (info.event.extendedProps.teacher || info.event.extendedProps.teachers) {
        const tag = document.createElement('div')
        tag.classList.add('fc-event-teacher')
        const label = (info.event.extendedProps.teacher !== undefined)
          ? getTeachersLabel([info.event.extendedProps.teacher])
          : getTeachersLabel(info.event.extendedProps.teachers)
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
      return event.extendedProps.capacity !== undefined ? (this.$t('NotUsualSlots.capacity') + (event.extendedProps.capacity - event.extendedProps.nbRegisteredStudents) + '/' + event.extendedProps.capacity) : ''
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
  //overflow: auto; /* To make only the calendar scroll and not the header */
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
