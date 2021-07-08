<template>
  <PentilaWindow
    :modal="true"
    class="student-registration-modal"
    @close="closeModal"
    @keydown.exact.enter.stop=""
    @keydown.exact.backspace.stop=""
    @keydown.exact.delete.stop=""
    @keydown.exact.f2.stop=""
    @keydown.ctrl.stop=""
  >
    <template #header>
      <span v-t="'NotUsualSlots.StudentRegistrationModal.header'" />
    </template>

    <template #body>
      <h1>{{ slotType.label }}</h1>
      <div class="student">
        <span v-t="'NotUsualSlots.StudentRegistrationModal.student'" />
        <span>{{ formattedStudent }}</span>
      </div>
      <div class="slot">
        <span v-t="'NotUsualSlots.StudentRegistrationModal.slot'" />
        <span>{{ formattedSlot }}</span>
      </div>
    </template>

    <template #footer>
      <div class="footer">
        <div
          v-t="'Commons.submit'"
          class="button confirm-button"
          @click="confirmRegistration"
        />
      </div>
    </template>
  </PentilaWindow>
</template>

<script>

import notUsualSlotsConstants from '@/constants/notUsualSlots'
import schoolLifeService from '@/api/schoolLife-portlet.service'
import moment from 'moment'

export default {
  name: 'StudentRegistrationModal',
  props: {
    event: {
      type: Object,
      required: true
    }
  },
  emits: ['close'],
  data () {
    return {
      comment: '',
      notifyParents: false
    }
  },
  computed: {
    slotType () {
      return notUsualSlotsConstants.getSlotTypeByNumber(this.event.extendedProps.type)
    },
    queriedUser () {
      return this.$store.state.notUsualSlots.queriedUser
    },
    formattedStudent () {
      return this.queriedUser.firstName + ' ' + this.queriedUser.lastName
    },
    formattedSlot () {
      return moment(this.event.start, 'YYYY-MM-DDTHH:mm').format('DD/MM/YYYY ' + this.$t('Moment.at') + ' HH:mm')
    }
  },
  methods: {
    confirmRegistration () {
      schoolLifeService.registerStudent(this.queriedUser, this.event.extendedProps.id, this.comment, this.notifyParents).then((data) => {
        if (data.success) {
          this.$store.dispatch('notUsualSlots/refreshCalendar')
          this.closeModal()
        }
      },
      (err) => {
        console.log(err)
      })
    },
    closeModal () {
      this.$emit('close')
    }
  }
}
</script>

<style scoped>

.student-registration-modal {
  font-family: "Roboto", sans-serif;
  color: #0B3C5F;
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

.confirm-button {
  background-color: #C4C4C4;
}

</style>
