<template>
  <PentilaWindow
    :modal="true"
    class="edit-slot-modal"
    data-test="edit-slot-modal"
    @close="closeModal"
    @keydown.exact.enter.stop=""
    @keydown.exact.backspace.stop=""
    @keydown.exact.delete.stop=""
    @keydown.exact.f2.stop=""
    @keydown.ctrl.stop=""
  >
    <template #header>
      <span v-t="'NotUsualSlots.EditSlotModal.header'" />
    </template>

    <template #body>
      <h3>
        {{ $t('NotUsualSlots.EditSlotModal.slot') + ' ' + currentSlotType.label }}
      </h3>
      <TimeSelection
        v-model:start="newEvent.start"
        v-model:end="newEvent.end"
        @error="updateTimeErrorStatus"
      />

      <div data-test="teacher-part">
        <UserCompletion
          user-type="teacher"
          :placeholder="$t('NotUsualSlots.EditSlotModal.teacherNamePlaceHolder')"
          :initial-user-list="newEvent.extendedProps.teacher? [newEvent.extendedProps.teacher] : undefined"
          @blur="v$.newEvent.extendedProps.teacher.teacherId.$touch()"
          @selectUser="updateTeacher"
        />
        <PentilaErrorMessage :error-message="formErrorList.teacher" />
      </div>

      <div data-test="room-part">
        <PentilaInput
          v-model="newEvent.extendedProps.room"
          class="input"
          :placeholder="$t('NotUsualSlots.EditSlotModal.roomNamePlaceHolder')"
          @blur="v$.newEvent.extendedProps.room.$touch()"
        />
        <PentilaErrorMessage :error-message="formErrorList.room" />
      </div>

      <div data-test="capacity-part">
        <PentilaInput
          v-model="newEvent.extendedProps.inscriptionLeft"
          class="input"
          type="number"
          :placeholder="$t('NotUsualSlots.EditSlotModal.inscriptionLeftPlaceHolder')"
          @blur="v$.newEvent.extendedProps.inscriptionLeft.$touch()"
        />
        <PentilaErrorMessage :error-message="formErrorList.inscriptionLeft" />
      </div>
    </template>

    <template #footer>
      <div class="footer">
        <div
          v-if="!isEventCreation"
          v-t="$device.phone ? 'NotUsualSlots.EditSlotModal.deleteSlot' : 'NotUsualSlots.EditSlotModal.longDeleteSlot'"
          class="button delete-button"
          :class="{'mobile': $device.phone}"
          @click="confirmSlotDeletion"
        />
        <div
          v-t="'Commons.submit'"
          class="button confirm-button"
          :class="{'form-valid' : !v$.$invalid && !isTimeError}"
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
import moment from 'moment'
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'

export default {
  name: 'EditSlotModal',
  components: { UserCompletion, TimeSelection },
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
        inscriptionLeft: { required },
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
          inscriptionLeft: undefined,
          room: undefined,
          type: undefined
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
        inscriptionLeft: (form.extendedProps.inscriptionLeft.$invalid && form.extendedProps.inscriptionLeft.$dirty) ? this.$t('Commons.formRequired') : '',
        room: (form.extendedProps.room.$invalid && form.extendedProps.room.$dirty) ? this.$t('Commons.formRequired') : ''
      }
    },
    currentSlotType () {
      return this.$store.state.notUsualSlots.currentSlotType
    },
    selectedSchool () {
      return this.$store.state.notUsualSlots.selectedSchool
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
      this.newEvent.extendedProps.inscriptionLeft = this.eventToEdit.extendedProps.inscriptionLeft
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
      const momentStartTime = moment(this.newEvent.start, 'YYYY-MM-DDTHH:mm')
      schoolLifeService.deleteSlot(
        this.newEvent.extendedProps.id,
        momentStartTime.format('YYYY/MM/DD HH:mm') // convert from calendar format to back-end format
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
        const momentStartTime = moment(this.newEvent.start, 'YYYY-MM-DDTHH:mm')
        const momentEndTime = moment(this.newEvent.end, 'YYYY-MM-DDTHH:mm')
        if (this.isEventCreation) {
          schoolLifeService.createSlot(
            this.selectedSchool.schoolId,
            momentStartTime.format('YYYY/MM/DD HH:mm'), // convert from calendar format to back-end format
            momentStartTime.day(),
            momentStartTime.format('HH:mm'),
            momentEndTime.format('HH:mm'),
            this.newEvent.extendedProps.teacher.teacherId,
            this.currentSlotType.type,
            this.newEvent.extendedProps.room,
            this.newEvent.extendedProps.inscriptionLeft
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
            moment(this.eventToEdit.start, 'YYYY-MM-DDTHH:mm').format('YYYY/MM/DD HH:mm'), // pass the old slot start hour (edit all events of tis slot, beginning from this date)
            momentStartTime.day(),
            momentStartTime.format('HH:mm'),
            momentEndTime.format('HH:mm'),
            this.newEvent.extendedProps.teacher.teacherId,
            this.currentSlotType.type,
            this.newEvent.extendedProps.room,
            this.newEvent.extendedProps.inscriptionLeft
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

.edit-slot-modal {
  font-family: "Roboto", sans-serif;
  color: #0B3C5F;
}

.input {
  margin: 10px 0;
}

.footer {
  margin-top: auto;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.button {
  display: flex;
  font-weight: bold;
  width: 125px;
  height: 35px;
  border-radius: 6px;
  align-items: center;
  justify-content: center;
  text-align: center;
  margin: 0 10px;
  color: white;
  cursor: pointer;
}

.delete-button {
  width: 250px;
  background-color: red;

  &.mobile {
    width: 125px;
  }
}

.confirm-button {
  background-color: #C4C4C4;
  cursor: default;

  &.form-valid {
    background-color: green;
    cursor: pointer;
  }
}

</style>
