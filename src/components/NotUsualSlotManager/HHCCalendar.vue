<template>
  <div class="calendar">
    <PentilaSpinner v-if="isSpinnerDisplayed" />
    <Timeline
      v-if="mq.desktop"
      @selectWeek="onSelectWeek"
    />
    <NotUsualSlotsToolBar
      v-if="!mq.desktop"
      :selected-date="selectedDate"
      @selectDate="onSelectDate"
    />

    <CustomCalendar
      :display-date="selectedDate"
      :events="eventList"
      :can-create-slots="canCreateSlots"
      @selectDate="onSelectDate"
      @createSlot="createSlot"
      @eventOptionClicked="handleEventOption"
    />
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
import CustomCalendar from '@components/Base/CustomCalendar/CustomCalendar.vue'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { defineAsyncComponent } from 'vue'

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
    eventList () {
      return [...this.$store.state.notUsualSlots.userSlots, ...this.$store.state.notUsualSlots.currentNonUsualSlots]
    },
    currentUser () {
      return this.$store.state.user
    },
    canCreateSlots () {
      return this.currentUser.isDoyen || this.currentUser.isDirectionMember || this.currentUser.isSecretariat
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
    createSlot (slot) {
      this.eventToEdit = { startDate: slot.start.format('YYYY/MM/DD HH:mm'), endDate: slot.end.format('YYYY/MM/DD HH:mm') }
      this.isEditSlotModalDisplayed = true
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
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
