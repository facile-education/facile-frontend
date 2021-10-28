<template>
  <PentilaWindow
    :modal="true"
    class="edit-slot-modal"
    :class="{'mobile': mq.phone}"
    data-test="edit-slot-modal"
    @close="closeModal"
  >
    <template #header>
      <span v-t="'NotUsualSlots.EditSlotModal.header'" />
    </template>

    <template #body>
      <TimeSelection
        v-model:start="newEvent.start"
        v-model:end="newEvent.end"
        @error="updateTimeErrorStatus"
      >
        <strong>
          {{ currentSlotType.label }}
        </strong>
      </TimeSelection>

      <div
        class="teacher-part"
        data-test="teacher-part"
      >
        <label v-t="'NotUsualSlots.EditSlotModal.teacherNamePlaceHolder'" />
        <UserCompletion
          user-type="teacher"
          :placeholder="$t('NotUsualSlots.EditSlotModal.teacherNamePlaceHolder')"
          :initial-user-list="newEvent.extendedProps.teacher? [newEvent.extendedProps.teacher] : undefined"
          @blur="v$.newEvent.extendedProps.teacher.teacherId.$touch()"
          @selectUser="updateTeacher"
        />
        <PentilaErrorMessage :error-message="formErrorList.teacher" />
      </div>

      <div
        class="room-part"
        data-test="room-part"
      >
        <PentilaInput
          v-model="newEvent.extendedProps.room"
          :placeholder="$t('NotUsualSlots.EditSlotModal.roomNamePlaceHolder')"
          @blur="v$.newEvent.extendedProps.room.$touch()"
        />
        <PentilaErrorMessage :error-message="formErrorList.room" />
      </div>

      <div data-test="capacity-part">
        <PentilaInput
          v-model="newEvent.extendedProps.capacity"
          type="number"
          :placeholder="capacityLabel"
          @blur="v$.newEvent.extendedProps.capacity.$touch()"
        />
        <PentilaErrorMessage :error-message="formErrorList.capacity" />
      </div>
    </template>

    <template #footer>
      <div class="footer">
        <PentilaButton
          v-if="!isEventCreation"
          :label="mq.phone ? $t('NotUsualSlots.EditSlotModal.deleteSlot') : $t('NotUsualSlots.EditSlotModal.longDeleteSlot')"
          class="delete"
          @click="confirmSlotDeletion"
        />
        <PentilaButton
          :label="$t('Commons.submit')"
          class="confirm"
          :class="{'disabled' : v$.$invalid || isTimeError}"
          @click="confirm"
        />
      </div>
    </template>
  </PentilaWindow>
</template>

<script>
import TimeSelection from '@components/NotUsualSlotManager/EditSlotModal/TimeSelection'
import UserCompletion from '@components/NotUsualSlotManager/UserCompletion'
import schoolLifeService from '@/api/schoolLife-portlet.service'
import dayjs from 'dayjs'
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'

const moreThanRegistered = (value, vm) => {
  if (value < 0) {
    return false
  }
  return vm.eventToEdit.extendedProps ? value >= vm.eventToEdit.extendedProps.nbRegisteredStudents : true
}

export default {
  name: 'EditSlotModal',
  components: { UserCompletion, TimeSelection },
  inject: ['mq'],
  props: {
    eventToEdit: {
      type: Object,
      required: true
    },
    createEventMethod: {
      type: Function,
      required: true
    },
    updateEventMethod: {
      type: Function,
      required: true
    }
  },
  emits: ['close'],
  setup: () => ({ v$: useVuelidate() }),
  validations: {
    newEvent: {
      extendedProps: {
        teacher: {
          teacherId: { required }
        },
        capacity: { required, moreThanRegistered },
        room: { required }
      }
    }
  },
  data () {
    return {
      isTimeError: false,
      newEvent: {
        extendedProps: {
          id: undefined,
          subject: undefined,
          teacher: undefined,
          room: undefined,
          type: undefined,
          capacity: undefined,
          nbRegisteredStudents: undefined
        },
        title: undefined,
        start: undefined,
        end: undefined,
        backgroundColor: undefined,
        borderColor: undefined
      }
    }
  },
  computed: {
    formErrorList () {
      const form = this.v$.newEvent
      return {
        teacher: (form.extendedProps.teacher.teacherId.$invalid && form.extendedProps.teacher.teacherId.$dirty) ? this.$t('Commons.formRequired') : '',
        capacity: (form.extendedProps.capacity.$invalid && form.extendedProps.capacity.$dirty)
          ? (form.extendedProps.capacity.required.$invalid ? this.$t('Commons.formRequired') : this.$t('Commons.formMoreThanRegistered'))
          : '',
        room: (form.extendedProps.room.$invalid && form.extendedProps.room.$dirty) ? this.$t('Commons.formRequired') : ''
      }
    },
    capacityLabel () {
      let label = this.$t('NotUsualSlots.EditSlotModal.remainingPlaces')
      if (!this.isEventCreation) {
        label += ' - ' + this.newEvent.extendedProps.nbRegisteredStudents + ' ' + this.$t('NotUsualSlots.EditSlotModal.registered')
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
    }
  },
  created () {
    this.newEvent.start = this.eventToEdit.start
    this.newEvent.end = this.eventToEdit.end

    if (this.isEventCreation) {
      this.newEvent.title = this.currentSlotType.label
      this.newEvent.backgroundColor = this.currentSlotType.color
      this.newEvent.borderColor = this.currentSlotType.color
    } else { // Event update
      this.newEvent.extendedProps.id = this.eventToEdit.extendedProps.id
      this.newEvent.extendedProps.teacher = { ...this.eventToEdit.extendedProps.teacher } // create a copy to not trigger store state change out of a mutation
      this.newEvent.extendedProps.capacity = this.eventToEdit.extendedProps.capacity
      this.newEvent.extendedProps.nbRegisteredStudents = this.eventToEdit.extendedProps.nbRegisteredStudents
      this.newEvent.extendedProps.room = this.eventToEdit.extendedProps.room
      this.newEvent.extendedProps.type = this.eventToEdit.extendedProps.type
      this.newEvent.borderColor = this.eventToEdit.borderColor
      this.newEvent.backgroundColor = this.eventToEdit.backgroundColor
    }
  },
  methods: {
    updateTimeErrorStatus (status) {
      this.isTimeError = status
    },
    confirmSlotDeletion () {
      this.$store.dispatch('warningModal/addWarning', {
        text: this.$t('NotUsualSlots.warning'),
        lastAction: { fct: this.deleteSlot, params: [] }
      })
    },
    deleteSlot () {
      const momentStartTime = dayjs(this.newEvent.start)
      schoolLifeService.deleteSlot(
        this.newEvent.extendedProps.id,
        momentStartTime.format('YYYY-MM-DD HH:mm') // convert from calendar format to back-end format
      ).then((data) => {
        if (data.success) {
          this.$store.dispatch('notUsualSlots/refreshCalendar')
          this.closeModal()
        } else {
          console.error(data.error) // TODO: better error gesture
        }
      })
    },
    updateTeacher (selectedUser) {
      this.newEvent.extendedProps.teacher = selectedUser
    },
    confirm () {
      if (this.v$.$invalid || this.isTimeError) {
        this.v$.$touch()
      } else {
        const momentStartTime = dayjs(this.newEvent.start)
        const momentEndTime = dayjs(this.newEvent.end)
        if (this.isEventCreation) {
          schoolLifeService.createSlot(
            this.selectedSchool.schoolId,
            momentStartTime.format('YYYY-MM-DD HH:mm'), // convert from calendar format to back-end format
            momentStartTime.day(),
            momentStartTime.format('HH:mm'),
            momentEndTime.format('HH:mm'),
            this.newEvent.extendedProps.teacher.teacherId,
            this.currentSlotType.type,
            this.newEvent.extendedProps.room,
            this.newEvent.extendedProps.capacity
          ).then((data) => {
            if (data.success) {
              // this.createEventMethod(this.newEvent) // With returned slot, instead of reload calendar
              this.$store.dispatch('notUsualSlots/refreshCalendar')
              this.closeModal()
            } else {
              console.error(data.error) // TODO: better error gesture
            }
          })
        } else {
          schoolLifeService.updateSlot(
            this.newEvent.extendedProps.id,
            dayjs(this.eventToEdit.start).format('YYYY-MM-DD HH:mm'), // pass the old slot start hour (edit all events of tis slot, beginning from this date)
            momentStartTime.day(),
            momentStartTime.format('HH:mm'),
            momentEndTime.format('HH:mm'),
            this.newEvent.extendedProps.teacher.teacherId,
            this.currentSlotType.type,
            this.newEvent.extendedProps.room,
            this.newEvent.extendedProps.capacity
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
.edit-slot-modal .window-wrapper {
  max-width: 500px;
  &.mobile {
    width: 100%;
  }
}
</style>

<style lang="scss" scoped>
.teacher-part, .room-part {
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
