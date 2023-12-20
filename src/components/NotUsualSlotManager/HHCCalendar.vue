<template>
  <div class="calendar">
    <WeprodeSpinner v-if="isSpinnerDisplayed" />
    <Timeline
      v-if="mq.desktop"
      @select-week="onSelectWeek"
    />
    <NotUsualSlotsToolBar
      v-if="!mq.desktop"
      :selected-date="selectedDate"
      @select-date="onSelectDate"
    />

    <CustomCalendar
      :display-date="selectedDate"
      :events="eventList"
      :can-create-slots="canCreateSlots"
      @select-date="onSelectDate"
      @create-slot="createSlot"
      @event-option-clicked="handleEventOption"
    />
  </div>
  <teleport
    v-if="isEditSlotModalDisplayed || isRegistrationModalDisplayed || isListModalDisplayed || isDeleteSlotModalDisplayed"
    to="body"
  >
    <EditSlotModal
      v-if="isEditSlotModalDisplayed"
      :event-to-edit="eventToEdit"
      @close="isEditSlotModalDisplayed = false"
    />
    <DeleteSlotModal
      v-if="isDeleteSlotModalDisplayed"
      :init-event="eventToEdit"
      @close="isDeleteSlotModalDisplayed = false"
    />
    <StudentRegistrationModal
      v-if="isRegistrationModalDisplayed"
      :event="eventToEdit"
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
import CustomCalendar from '@components/Base/CustomCalendar/CustomCalendar.vue'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { defineAsyncComponent } from 'vue'

import WeprodeSpinner from '@/components/Base/Weprode/WeprodeSpinner.vue'

const NotUsualSlotsToolBar = defineAsyncComponent(() => import('@components/NotUsualSlotManager/NotUsualSlotsToolBar'))
const Timeline = defineAsyncComponent(() => import('@components/Horaires/Timeline')) // Needed for event creation
const StudentRegistrationModal = defineAsyncComponent(() => import('@components/NotUsualSlotManager/StudentRegistrationModal/StudentRegistrationModal'))
const StudentListModal = defineAsyncComponent(() => import('@components/NotUsualSlotManager/StudentListModal/StudentListModal'))
const EditSlotModal = defineAsyncComponent(() => import('@components/NotUsualSlotManager/EditSlotModal/EditSlotModal'))
const DeleteSlotModal = defineAsyncComponent(() => import('@components/NotUsualSlotManager/DeleteSlotModal/DeleteSlotModal.vue'))

dayjs.extend(customParseFormat)

export default {
  name: 'HHCCalendar',
  components: {
    CustomCalendar,
    NotUsualSlotsToolBar,
    Timeline,
    StudentRegistrationModal,
    StudentListModal,
    EditSlotModal,
    DeleteSlotModal,
    WeprodeSpinner
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
      isDeleteSlotModalDisplayed: false,
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
        case 'deleteSlot':
          this.eventToEdit = eventOption.event
          this.isDeleteSlotModalDisplayed = true
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
        startDate,
        endDate
      })
    },
    onSelectWeek (week) {
      this.selectedDate = dayjs(week.firstDayOfWeek).startOf('day')

      this.$store.dispatch('notUsualSlots/setDisplayedDates', {
        startDate: dayjs(week.firstDayOfWeek, 'YYYY-MM-DD'),
        endDate: dayjs(week.firstDayOfWeek, 'YYYY-MM-DD').endOf('week')
      })
    }
  }
}
</script>
