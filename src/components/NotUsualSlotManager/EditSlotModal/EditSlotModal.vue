<template>
  <WeprodeWindow
    v-if="configuration"
    :modal="true"
    :max-width="750"
    :full-screen="mq.phone || mq.tablet"
    class="edit-slot-modal"
    :class="{'mobile': mq.phone}"
    data-test="edit-slot-modal"
    @close="closeModal"
  >
    <template #header>
      <span> {{ modalTitle }} </span>
    </template>

    <template #body>
      <div
        v-if="!isEventCreation"
        v-t="'updateMessage'"
        class="update-message"
      />

      <div
        class="time-selection"
        data-test="time-selection"
      >
        <span class="time-selection-left">{{ slotLabel }}</span>
        <WeprodeDropdown
          v-if="slotList"
          v-model="selectedSlot"
          class="slots-list"
          :list="slotList"
          display-field="slotLabel"
          :sort="false"
          :filtered="false"
        />
      </div>

      <div
        v-if="isEventCreation"
        data-test="period"
        class="period"
      >
        <span
          v-t="'onThePeriod'"
          class="label"
        />
        <DateRangePicker
          v-if="newEvent.lastSessionDate"
          :initial-range="{start: newEvent.firstSessionDate, end: newEvent.lastSessionDate}"
          :min-date="schoolYearStartDate.toDate()"
          :max-date="schoolYearEndDate.toDate()"
          @update-dates="updateSlotDates"
        />
        <WeprodeSpinner v-else />
      </div>

      <div
        class="teacher-part"
        data-test="teacher-part"
      >
        <UserCompletion
          user-type="teacher"
          :placeholder="$t('NotUsualSlots.EditSlotModal.teacherNamePlaceHolder')"
          :model-value="newEvent.teacher? [newEvent.teacher] : []"
          @blur="v$.newEvent.teacher.teacherId.$touch()"
          @update:model-value="updateTeacher"
        />
        <WeprodeErrorMessage :error-message="formErrorList.teacher" />
      </div>

      <div
        class="room-part"
        data-test="room-part"
      >
        <WeprodeInput
          v-model="newEvent.room"
          :placeholder="$t('NotUsualSlots.EditSlotModal.roomNamePlaceHolder')"
          @blur="v$.newEvent.room.$touch()"
        />
        <WeprodeErrorMessage :error-message="formErrorList.room" />
      </div>

      <div data-test="capacity-part">
        <WeprodeInput
          v-model="newEvent.capacity"
          type="number"
          :placeholder="capacityLabel"
          @blur="v$.newEvent.capacity.$touch()"
        />
        <WeprodeErrorMessage :error-message="formErrorList.capacity" />
      </div>
    </template>

    <template #footer>
      <div class="footer">
        <WeprodeButton
          :label="$t('Commons.submit')"
          class="confirm"
          @click="confirm"
        />
      </div>
    </template>
  </WeprodeWindow>
</template>

<script>
import DateRangePicker from '@components/Base/DateRangePicker.vue'
import WeprodeButton from '@components/Base/Weprode/WeprodeButton.vue'
import UserCompletion from '@components/NotUsualSlotManager/UserCompletion'
import { formatSlot } from '@utils/commons.util'
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import dayjs from 'dayjs'

import { DATE_EXCHANGE_FORMAT } from '@/api/constants'
import { getSchoolSlotConfiguration } from '@/api/schedule.service'
import schoolLifeService from '@/api/schoolLife-portlet.service'
import WeprodeDropdown from '@/components/Base/Weprode/WeprodeDropdown.vue'
import WeprodeErrorMessage from '@/components/Base/Weprode/WeprodeErrorMessage.vue'
import WeprodeInput from '@/components/Base/Weprode/WeprodeInput.vue'
import WeprodeSpinner from '@/components/Base/Weprode/WeprodeSpinner.vue'
import WeprodeWindow from '@/components/Base/Weprode/WeprodeWindow.vue'

export default {
  name: 'EditSlotModal',
  components: { WeprodeButton, DateRangePicker, UserCompletion, WeprodeDropdown, WeprodeErrorMessage, WeprodeInput, WeprodeSpinner, WeprodeWindow },
  inject: ['mq'],
  props: {
    eventToEdit: {
      type: Object,
      required: true
    }
  },
  emits: ['close'],
  setup: () => ({ v$: useVuelidate() }),
  validations: {
    newEvent: {
      teacher: {
        teacherId: { required }
      },
      capacity: {
        required,
        function (value) {
          if (value < 0) {
            return false
          }
          return (this.eventToEdit.nbRegisteredStudents) ? value >= this.eventToEdit.nbRegisteredStudents : true
        }
      },
      room: { required }
    }
  },
  data () {
    return {
      width: 0,
      isTimeError: false,
      slotList: undefined,
      selectedSlot: undefined,
      newEvent: {
        sessionId: undefined,
        subject: undefined,
        teacher: undefined,
        room: undefined,
        type: undefined,
        capacity: undefined,
        nbRegisteredStudents: undefined,
        title: undefined,
        firstSessionDate: undefined,
        lastSessionDate: undefined,
        backgroundColor: undefined,
        borderColor: undefined
      }
    }
  },
  computed: {
    formErrorList () {
      const form = this.v$.newEvent
      return {
        teacher: (form.teacher.teacherId.$invalid && form.teacher.teacherId.$dirty) ? this.$t('Commons.formRequired') : '',
        capacity: (form.capacity.$invalid && form.capacity.$dirty)
          ? (form.capacity.required.$invalid ? this.$t('Commons.formRequired') : this.$t('formMoreThanRegistered'))
          : '',
        room: (form.room.$invalid && form.room.$dirty) ? this.$t('Commons.formRequired') : ''
      }
    },
    capacityLabel () {
      let label = this.$t('NotUsualSlots.EditSlotModal.remainingPlaces')
      if (!this.isEventCreation) {
        label += ' - ' + this.newEvent.nbRegisteredStudents + ' ' + this.$t('NotUsualSlots.EditSlotModal.registered')
      }
      return label
    },
    currentSlotType () {
      return this.$store.state.notUsualSlots.currentSlotType
    },
    selectedSchool () {
      return this.$store.state.user.selectedSchool
    },
    isEventCreation () {
      return this.eventToEdit.title === undefined
    },
    modalTitle () {
      return this.isEventCreation ? this.$t('NotUsualSlots.EditSlotModal.header-create', { slotType: this.currentSlotType.label }) : this.$t('NotUsualSlots.EditSlotModal.header-modify', { slotType: this.currentSlotType.label })
    },
    slotLabel () {
      if (this.isEventCreation) {
        return this.$t('all-the') + ' ' + dayjs(this.eventToEdit.startDate).format('dddd') + 's ' + this.$t('on')
      } else {
        return this.$t('the') + ' ' + dayjs(this.eventToEdit.startDate).format('dddd') + ' ' + this.$t('on')
      }
    },
    configuration () {
      return this.$store.state.calendar.configuration
    },
    schoolYearStartDate () {
      return dayjs(this.configuration.schoolYearStartDate, DATE_EXCHANGE_FORMAT)
    },
    schoolYearEndDate () {
      return dayjs(this.configuration.schoolYearEndDate, DATE_EXCHANGE_FORMAT)
    }
  },
  watch: {
    configuration: {
      immediate: true,
      handler () {
        if (this.configuration) {
          this.newEvent.lastSessionDate = dayjs(this.configuration.schoolYearEndDate, DATE_EXCHANGE_FORMAT)
        } else {
          this.$store.dispatch('calendar/getConfiguration')
        }
      }
    }
  },
  created () {
    this.getSlotList()
    this.newEvent.startDate = dayjs(this.eventToEdit.startDate, DATE_EXCHANGE_FORMAT)
    this.newEvent.firstSessionDate = dayjs(this.eventToEdit.startDate, DATE_EXCHANGE_FORMAT)

    if (this.isEventCreation) {
      this.newEvent.title = this.currentSlotType.label
      this.newEvent.backgroundColor = this.currentSlotType.color
      this.newEvent.borderColor = this.currentSlotType.color
    } else { // Event update
      this.newEvent.sessionId = this.eventToEdit.sessionId
      this.newEvent.teacher = { ...this.eventToEdit.teachers[0] } // create a copy to not trigger store state change out of a mutation
      this.newEvent.capacity = this.eventToEdit.capacity
      this.newEvent.nbRegisteredStudents = this.eventToEdit.nbRegisteredStudents
      this.newEvent.room = this.eventToEdit.room
      this.newEvent.type = this.eventToEdit.type
      this.newEvent.borderColor = this.eventToEdit.borderColor
      this.newEvent.backgroundColor = this.eventToEdit.backgroundColor
    }
  },
  methods: {
    getSlotList () {
      getSchoolSlotConfiguration(this.$store.state.user.selectedSchool.schoolId).then((data) => {
        if (data.success) {
          this.slotList = data.configuration
          this.slotList.forEach((slot) => {
            formatSlot(slot)
          })

          // Select the right slot
          this.selectCloserSlot(dayjs(this.eventToEdit.startDate, DATE_EXCHANGE_FORMAT))
        }
      })
    },
    selectCloserSlot (startHourDate) {
      // Force the startHour date to be today (so we can compare with slot hours using dayjs) (maybe find an other way to compare hours)
      const today = dayjs()
      const hours = startHourDate.hour()
      const minutes = startHourDate.minute()
      startHourDate = today.hour(hours).minute(minutes)

      // For each slot (P1, P2, etc...) set the linked today's date and select the first slot have is endHour after the startHourDate
      for (let i = 0; i < this.slotList.length; i++) {
        const slotEndDate = dayjs(dayjs().format('YYYY/MM/DD') + ' ' + this.slotList[i].slotEndHour, 'YYYY/MM/DD HH:mm')
        if (startHourDate.isBefore(slotEndDate)) {
          this.selectedSlot = this.slotList[i]
          break
        }
      }

      if (!this.selectedSlot) { // if no slot after, select the first one by default
        this.selectedSlot = this.slotList[0]
      }
    },
    updateSlotDates (range) {
      this.newEvent.firstSessionDate = dayjs(range.start)
      this.newEvent.lastSessionDate = dayjs(range.end)
    },
    updateTeacher (value) {
      this.newEvent.teacher = value[0]
    },
    confirm () {
      if (this.v$.$invalid || this.isTimeError) {
        this.v$.$touch()
      } else {
        if (this.isEventCreation) {
          schoolLifeService.createSlot(
            this.selectedSchool.schoolId,
            this.newEvent.firstSessionDate.format(DATE_EXCHANGE_FORMAT),
            this.newEvent.lastSessionDate.format(DATE_EXCHANGE_FORMAT),
            this.newEvent.startDate.day(),
            this.selectedSlot.slotStartHour,
            this.selectedSlot.slotEndHour,
            this.newEvent.teacher.teacherId,
            this.currentSlotType.type,
            this.newEvent.room,
            this.newEvent.capacity
          ).then((data) => {
            if (data.success) {
              this.$store.dispatch('notUsualSlots/refreshCalendar')
              this.closeModal()
            } else {
              console.error(data.error) // TODO: better error gesture
            }
          })
        } else {
          schoolLifeService.updateSlot(
            this.newEvent.sessionId,
            this.newEvent.firstSessionDate.format(DATE_EXCHANGE_FORMAT), // convert from calendar format to back-end format
            this.newEvent.lastSessionDate.format(DATE_EXCHANGE_FORMAT),
            this.newEvent.startDate.day(),
            this.selectedSlot.slotStartHour,
            this.selectedSlot.slotEndHour,
            this.newEvent.teacher.teacherId,
            this.currentSlotType.type,
            this.newEvent.room,
            this.newEvent.capacity
          ).then((data) => {
            if (data.success) {
              this.$store.dispatch('notUsualSlots/refreshCalendar')
              this.closeModal()
            } else {
              console.error(data.error) // TODO: better error gesture
            }
          })
        }
      }
    },
    closeModal () {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss">
.edit-slot-modal{
  .window-body {
    overflow: visible !important;
  }
}
</style>

<style lang="scss" scoped>
.update-message {
  font-style: italic;
  margin-bottom: 1rem;
}

.slot-title {
  margin-right: 10px;
}

.time-selection {
  display: inline-flex;
  .time-selection-left {
    margin: auto;
    margin-right: 10px;
  }
  .time-selection-right {
    margin: auto;
    margin-left: 10px;
  }
}

.period {
  margin-top: 1rem;
  display: flex;
  align-items: center;

  .label {
    margin-right: 1rem;
  }
}

.teacher-part, .room-part {
  margin-top: 20px;
  margin-bottom: 20px;
}

.footer {
  display: flex;
  justify-content: space-between;
}

.confirm {
  width: 130px;
  margin-left: auto;
}
</style>

<i18n locale="fr">
{
  "updateMessage": "Les modifications affecteront toutes les sessions concernées par ce créneau",
  "formMoreThanRegistered": "La capacité de la salle doit être au moins supérieure au nombre d'inscrits",
  "all-the": "Tous les ",
  "the": "Le ",
  "on": "en",
  "until-school-year-end": "jusqu'à la fin de l'année scolaire.",
  "onThePeriod": "Sur la période"
}
</i18n>
