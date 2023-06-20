<template>
  <PentilaWindow
    :modal="true"
    :draggable="true"
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
        :range="{start: newEvent.startDate.format('HH:mm'), end: newEvent.endDate.format('HH:mm')}"
        @update:range="updateRange"
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
          :model-value="newEvent.teacher? [newEvent.teacher] : []"
          @blur="v$.newEvent.teacher.teacherId.$touch()"
          @update:modelValue="updateTeacher"
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
          v-if="!isEventCreation"
          :label="mq.phone ? $t('NotUsualSlots.EditSlotModal.deleteSlot') : $t('NotUsualSlots.EditSlotModal.longDeleteSlot')"
          class="delete"
          @click="confirmSlotDeletion"
        />
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
  components: { UserCompletion, TimeSelection },
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
    }
  },
  created () {
    this.newEvent.startDate = dayjs(this.eventToEdit.startDate, 'YYYY/MM/DD HH:mm')
    this.newEvent.endDate = dayjs(this.eventToEdit.endDate, 'YYYY/MM/DD HH:mm')

    if (this.isEventCreation) {
      this.newEvent.title = this.currentSlotType.label
      this.newEvent.backgroundColor = this.currentSlotType.color
      this.newEvent.borderColor = this.currentSlotType.color
    } else { // Event update
      this.newEvent.sessionId = this.sessionId
      this.newEvent.teacher = { ...this.eventToEdit.teacher } // create a copy to not trigger store state change out of a mutation
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
    confirmSlotDeletion () {
      this.$store.dispatch('warningModal/addWarning', {
        text: this.$t('NotUsualSlots.warning'),
        lastAction: { fct: this.deleteSlot, params: [] }
      })
    },
    deleteSlot () {
      schoolLifeService.deleteSlot(
        this.newEvent.sessionId,
        this.newEvent.startDate.format('YYYY-MM-DD HH:mm') // convert from calendar format to back-end format
      ).then((data) => {
        if (data.success) {
          this.$store.dispatch('notUsualSlots/refreshCalendar')
          this.closeModal()
        } else {
          console.error(data.error) // TODO: better error gesture
        }
      })
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
            this.newEvent.startDate.format('YYYY-MM-DD HH:mm'), // convert from calendar format to back-end format
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
            dayjs(this.eventToEdit.startDate).format('YYYY-MM-DD HH:mm'), // pass the old slot start hour (edit all events of tis slot, beginning from this date)
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
