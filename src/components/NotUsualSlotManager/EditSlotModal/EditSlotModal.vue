<template>
  <PentilaWindow
    :modal="true"
    class="edit-slot-modal"
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
      />
      <UserCompletion
        user-type="teacher"
        :placeholder="$t('NotUsualSlots.EditSlotModal.teacherNamePlaceHolder')"
        @selectUser="updateTeacher"
      />
      <PentilaInput
        v-model="newEvent.extendedProps.room"
        class="input"
        :placeholder="$t('NotUsualSlots.EditSlotModal.roomNamePlaceHolder')"
      />
      <PentilaInput
        v-model="newEvent.extendedProps.inscriptionLeft"
        class="input"
        :placeholder="$t('NotUsualSlots.EditSlotModal.inscriptionLeftPlaceHolder')"
      />
    </template>

    <template #footer>
      <div class="footer">
        <div
          v-t="'Commons.delete'"
          class="button delete-button"
          @click="deleteSlot"
        />
        <div
          v-t="'Commons.submit'"
          class="button confirm-button"
          @click="confirm"
        />
      </div>
    </template>
  </PentilaWindow>
</template>

<script>
import TimeSelection from '@components/NotUsualSlotManager/EditSlotModal/TimeSelection'
import UserCompletion from '@components/NotUsualSlotManager/UserCompletion'
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
  data () {
    return {
      newEvent: {
        extendedProps: {
          id: undefined,
          subject: undefined,
          teacher: undefined,
          inscriptionLeft: undefined,
          room: undefined
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
    currentSlotType () {
      return this.$store.state.notUsualSlots.currentSlotType
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
      this.newEvent.backgroundColor = this.eventToEdit.backgroundColor
      this.newEvent.borderColor = this.eventToEdit.borderColor
      this.newEvent.extendedProps.inscriptionLeft = this.eventToEdit.inscriptionLeft
      this.newEvent.extendedProps.room = this.eventToEdit.room
    }
  },
  methods: {
    deleteSlot () {
      console.log('TODO: delete slot')
      this.closeModal()
    },
    updateTeacher (selectedUser) {
      this.newEvent.extendedProps.teacher = selectedUser
    },
    confirm () {
      // TODO fields verification

      if (this.isEventCreation) {
        // if success = true && add event fields to object
        this.createEventMethod(this.newEvent)
        this.closeModal()
      } else {
        // if success = true && add event fields to object
        this.updateEventMethod(this.newEvent)
        this.closeModal()

        // TODO or maybe refresh calendar
      }
    },
    closeModal () {
      this.$emit('close')
    }
  }
}
</script>

<style scoped>

.container {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(128, 128, 128, 0.5);
  font-family: "Roboto", sans-serif;
  color: #0B3C5F;
}

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
  margin: 0 10px;
  color: white;
  cursor: pointer;
}

.delete-button {
  background-color: red;
}

.confirm-button {
  background-color: #C4C4C4;
}

</style>
