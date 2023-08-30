<template>
  <PentilaWindow
    v-if="configuration"
    :modal="true"
    :max-width="750"
    :full-screen="mq.phone"
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

      <div class="time-selection">
        <span class="time-selection-left">{{ slotLabel }}</span>
        <TimeSelection
          :range="{start: newEvent.startDate.format('HH:mm'), end: newEvent.endDate.format('HH:mm')}"
          @update:range="updateRange"
        />
      </div>

      <div
        v-if="isEventCreation"
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
          @updateDates="updateSlotDates"
        />
        <PentilaSpinner v-else />
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
        <PentilaErrorMessage :error-message="formErrorList.teacher" />
      </div>

      <div
        class="room-part"
        data-test="room-part"
      >
        <PentilaInput
          v-model="newEvent.room"
          :placeholder="$t('NotUsualSlots.EditSlotModal.roomNamePlaceHolder')"
          @blur="v$.newEvent.room.$touch()"
        />
        <PentilaErrorMessage :error-message="formErrorList.room" />
      </div>

      <div data-test="capacity-part">
        <PentilaInput
          v-model="newEvent.capacity"
          type="number"
          :placeholder="capacityLabel"
          @blur="v$.newEvent.capacity.$touch()"
        />
        <PentilaErrorMessage :error-message="formErrorList.capacity" />
      </div>
    </template>

    <template #footer>
      <div class="footer">
        <PentilaButton
          :label="$t('Commons.submit')"
          class="confirm"
          @click="confirm"
        />
      </div>
    </template>
  </PentilaWindow>
</template>

<script>
import DateRangePicker from '@components/Base/DateRangePicker.vue'
import TimeSelection from '@components/NotUsualSlotManager/EditSlotModal/TimeSelection'
import UserCompletion from '@components/NotUsualSlotManager/UserCompletion'
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import dayjs from 'dayjs'

import schoolLifeService from '@/api/schoolLife-portlet.service'

const moreThanRegistered = (value, vm) => {
  if (value < 0) {
    return false
  }
  return (vm.eventToEdit) ? value >= vm.eventToEdit.nbRegisteredStudents : true
}

export default {
  name: 'EditSlotModal',
  components: { DateRangePicker, UserCompletion, TimeSelection },
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
      capacity: { required, moreThanRegistered },
      room: { required }
    }
  },
  data () {
    return {
      width: 0,
      isTimeError: false,
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
          ? (form.capacity.required.$invalid ? this.$t('Commons.formRequired') : this.$t('Commons.formMoreThanRegistered'))
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
        return this.$t('all-the') + ' ' + dayjs(this.eventToEdit.startDate).format('dddd') + 's ' + this.$t('from')
      } else {
        return this.$t('the') + ' ' + dayjs(this.eventToEdit.startDate).format('dddd') + ' ' + this.$t('from')
      }
    },
    configuration () {
      return this.$store.state.calendar.configuration
    },
    schoolYearStartDate () {
      return dayjs(this.configuration.schoolYearStartDate, 'YYYY-MM-DD')
    },
    schoolYearEndDate () {
      return dayjs(this.configuration.schoolYearEndDate, 'YYYY-MM-DD')
    }
  },
  watch: {
    configuration: {
      immediate: true,
      handler () {
        if (this.configuration) {
          this.newEvent.lastSessionDate = dayjs(this.configuration.schoolYearEndDate, 'YYYY-MM-DD')
        } else {
          this.$store.dispatch('calendar/getConfiguration')
        }
      }
    }
  },
  created () {
    this.newEvent.startDate = dayjs(this.eventToEdit.startDate, 'YYYY/MM/DD HH:mm')
    this.newEvent.endDate = dayjs(this.eventToEdit.endDate, 'YYYY/MM/DD HH:mm')

    this.newEvent.firstSessionDate = dayjs(this.eventToEdit.startDate, 'YYYY/MM/DD HH:mm')

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
    updateRange (range) {
      this.newEvent.startDate = dayjs((this.newEvent.startDate.format('YYYY/MM/DD') + ' ' + range.start), 'YYYY/MM/DD HH:mm')
      this.newEvent.endDate = dayjs((this.newEvent.endDate.format('YYYY/MM/DD') + ' ' + range.end), 'YYYY/MM/DD HH:mm')
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
            this.newEvent.firstSessionDate.format('YYYY-MM-DD HH:mm'), // convert from calendar format to back-end format
            this.newEvent.lastSessionDate.format('YYYY-MM-DD HH:mm'),
            this.newEvent.startDate.day(),
            this.newEvent.startDate.format('HH:mm'),
            this.newEvent.endDate.format('HH:mm'),
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
            this.newEvent.firstSessionDate.format('YYYY-MM-DD HH:mm'), // convert from calendar format to back-end format
            this.newEvent.lastSessionDate.format('YYYY-MM-DD HH:mm'),
            this.newEvent.startDate.day(),
            this.newEvent.startDate.format('HH:mm'),
            this.newEvent.endDate.format('HH:mm'),
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
  "all-the": "Tous les ",
  "the": "Le ",
  "from": "de",
  "until-school-year-end": "jusqu'à la fin de l'année scolaire.",
  "onThePeriod": "Sur la période"
}
</i18n>
