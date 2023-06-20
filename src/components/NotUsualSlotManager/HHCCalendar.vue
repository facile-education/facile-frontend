<template>
  <div class="calendar">
    <PentilaSpinner v-if="isSpinnerDisplayed" />
    <template v-if="configuration && currentUser">
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
      <!--      <div-->
      <!--        v-if="!mq.desktop"-->
      <!--        v-touch:swipe.left="onSwipeLeft"-->
      <!--        v-touch:swipe.right="onSwipeRight"-->
      <!--        class="swipe-container"-->
      <!--      >-->
      <!--        <div-->
      <!--          class="swipe-wrapper"-->
      <!--          :style="`transform: translate3d(${pan}px, 0px, 0px);`"-->
      <!--        >-->
      <!--          <FullCalendar-->
      <!--            ref="fullCalendar"-->
      <!--            class="calendar"-->
      <!--            :options="calendarOptions"-->
      <!--            @click.stop-->
      <!--          />-->
      <!--        </div>-->
      <!--      </div>-->
      <!--      <FullCalendar-->
      <!--        v-else-->
      <!--        ref="fullCalendar"-->
      <!--        :options="calendarOptions"-->
      <!--        @click.stop-->
      <!--      />-->
      <!--      <EventPopover-->
      <!--        v-if="selectedEvent"-->
      <!--        :selected-event="selectedEvent"-->
      <!--        @editEvent="editEvent"-->
      <!--        @openRegistration="openRegistration"-->
      <!--        @showStudentList="showStudentList"-->
      <!--        @close="unselectEvent"-->
      <!--      />-->

      <CustomCalendar
        :display-date="selectedDate"
        :events="eventList"
        :can-create-slots="canCreateSlots"
        @selectDate="onSelectDate"
        @createSlot="createSlot"
        @eventOptionClicked="handleEventOption"
      />
      <!--              @eventOptionClicked="handleEventOption"-->
    </template>
  </div>
  <teleport
    v-if="isEditSlotModalDisplayed || isRegistrationModalDisplayed || isListModalDisplayed"
    to="body"
  >
    <EditSlotModal
      v-if="isEditSlotModalDisplayed"
      :event-to-edit="eventToEdit"
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
import { getTeachersLabel } from '@utils/commons.util'
import { isEditableSlot } from '@utils/notUsualSlot.util'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'

import CustomCalendar from '@components/Base/CustomCalendar/CustomCalendar.vue'
// import FCEvent from '@components/Horaires/FCEvent'
import { defineAsyncComponent } from 'vue'

import { slotLabelList } from '@/constants/appConstants'

const NotUsualSlotsToolBar = defineAsyncComponent(() => import('@components/NotUsualSlotManager/NotUsualSlotsToolBar'))
const Timeline = defineAsyncComponent(() => import('@components/Horaires/Timeline')) // Needed for event creation
const StudentRegistrationModal = defineAsyncComponent(() => import('@components/NotUsualSlotManager/StudentRegistrationModal/StudentRegistrationModal'))
const StudentListModal = defineAsyncComponent(() => import('@components/NotUsualSlotManager/StudentListModal/StudentListModal'))
const EditSlotModal = defineAsyncComponent(() => import('@components/NotUsualSlotManager/EditSlotModal/EditSlotModal'))

dayjs.extend(customParseFormat)

export default {
  name: 'HHCCalendar',
  components: {
    CustomCalendar,
    NotUsualSlotsToolBar,
    Timeline,
    StudentRegistrationModal,
    StudentListModal,
    EditSlotModal
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
    queriedUser () {
      return this.$store.state.notUsualSlots.queriedUser
    },
    selectedClass () {
      return this.$store.state.notUsualSlots.selectedClass
    },
    configuration () {
      return this.$store.state.horaires.configuration
    },
    minDate () {
      return dayjs(this.configuration.startDateSchool, 'YYYY-MM-DD HH:mm')
    },
    maxDate () {
      return dayjs(this.configuration.endDateSchool, 'YYYY-MM-DD HH:mm')
    },
    eventList () {
      return this.notComputedSlotsToDisplay
    },
    userSlots () {
      return this.$store.state.notUsualSlots.userSlots
    },
    currentNonUsualSlots () {
      return this.$store.state.notUsualSlots.currentNonUsualSlots
    },
    allSlotsToDisplay () {
      return this.isSpinnerDisplayed ? [] : [...this.userSlots, ...this.currentNonUsualSlots]
    },
    canCreateSlots () {
      return this.currentUser.isDoyen || this.currentUser.isDirectionMember || this.currentUser.isSecretariat
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
  methods: {
    handleEventOption (eventOption) {
      switch (eventOption.option.name) {
        case 'showStudentList':
          this.eventToEdit = eventOption.event
          this.isListModalDisplayed = true
          break
        case 'updateSlot':
          this.eventToEdit = eventOption.event
          this.isEditSlotModalDisplayed = true
          break
        case 'registerStudent':
          this.eventToEdit = eventOption.event
          this.isRegistrationModalDisplayed = true
          break
        default:
          console.error('no option exist with name ' + eventOption.option.name)
          break
      }
    },
    isAlreadyRegister (event) {
      // Search if this slot already exist in userSlots
      return this.$store.state.notUsualSlots.userSlots.find(userSlot => userSlot.sessionId === event.sessionId)
    },
    onSelectDate (date) {
      this.selectedDate = dayjs(date).startOf('day')

      // If swipe provide from tablet, get slot for the entire week and not only the current day
      const startDate = this.mq.phone ? dayjs(date) : dayjs(date).startOf('week')
      const endDate = this.mq.phone ? dayjs(date).endOf('day') : dayjs(date).endOf('week')
      this.$store.dispatch('notUsualSlots/setDisplayedDates', {
        startDate: startDate,
        endDate: endDate
      })
    },
    onSelectWeek (week) {
      this.selectedDate = dayjs(week.firstDayOfWeek).startOf('day')

      this.$store.dispatch('notUsualSlots/setDisplayedDates', {
        startDate: dayjs(week.firstDayOfWeek, 'YYYY-MM-DD'),
        endDate: dayjs(week.lastDayOfWeek, 'YYYY-MM-DD')
      })
    },
    editEvent (event) {
      if (isEditableSlot(event)) { // Only edit notUsualSlots
        this.eventToEdit = event
        this.isEditSlotModalDisplayed = true
      }
    },
    showStudentList (event) {
      if (isEditableSlot(event)) {
        this.eventToEdit = event
        this.isListModalDisplayed = true
      }
    },
    createSlot (slot) {
      this.eventToEdit = { startDate: slot.start.format('YYYY/MM/DD HH:mm'), endDate: slot.end.format('YYYY/MM/DD HH:mm') }
      this.isEditSlotModalDisplayed = true
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
