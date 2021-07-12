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
      <span
        v-if="!deregistration"
        v-t="'NotUsualSlots.StudentRegistrationModal.header'"
      />
      <span
        v-else
        v-t="'NotUsualSlots.StudentRegistrationModal.deregistrationHeader'"
      />
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
      <textarea
        v-if="isCommentDisplayed"
        v-model="comment"
        :placeholder="$t('NotUsualSlots.StudentRegistrationModal.commentPlaceholder')"
        @keydown.enter.stop=""
      />
      <PentilaCheckbox
        v-if="isNotifyParentsDisplayed"
        :label="$t('NotUsualSlots.StudentRegistrationModal.notifyParents')"
        :model-value="notifyParents"
        @update:modelValue="handleCheck"
      />
    </template>

    <template #footer>
      <div class="footer">
        <div
          v-t="'Commons.submit'"
          class="button confirm-button"
          @click="submit"
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
    student: {
      type: Object,
      required: true
    },
    event: {
      type: Object,
      required: true
    },
    deregistration: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close', 'deregistre'],
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
    formattedStudent () {
      return this.student.firstName + ' ' + this.student.lastName
    },
    formattedSlot () {
      return moment(this.event.start, 'YYYY-MM-DDTHH:mm').format('DD/MM/YYYY ' + this.$t('Moment.at') + ' HH:mm')
    },
    isCommentDisplayed () {
      return !this.deregistration && this.slotType.type === notUsualSlotsConstants.detentionType
    },
    isNotifyParentsDisplayed () {
      return (!this.deregistration && this.slotType.type === notUsualSlotsConstants.detentionType) ||
        this.slotType.type === notUsualSlotsConstants.replayTestType ||
        this.slotType.type === notUsualSlotsConstants.studyType
    }
  },
  methods: {
    submit () {
      this.deregistration ? this.confirmDeregistration() : this.confirmRegistration()
    },
    confirmRegistration () {
      schoolLifeService.registerStudent(this.student, this.event.extendedProps.id, this.comment, this.notifyParents).then((data) => {
        if (data.success) {
          this.$store.dispatch('notUsualSlots/refreshCalendar')
          this.closeModal()
        }
      },
      (err) => {
        console.log(err)
      })
    },
    confirmDeregistration () {
      const allSession = this.slotType.type === notUsualSlotsConstants.studyType
      schoolLifeService.unRegisterStudent(this.student, this.event.extendedProps.id, this.comment, this.notifyParents, allSession).then((data) => {
        if (data.success) {
          this.$store.dispatch('notUsualSlots/refreshCalendar')
          this.$emit('deregistre')
          this.closeModal()
        }
      },
      (err) => {
        console.log(err)
      })
    },
    handleCheck (check) {
      this.notifyParents = check
    },
    closeModal () {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@design';

.student-registration-modal {
  font-family: "Roboto", sans-serif;
  color: $color-cadyco-dark-text;
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

textarea {
  width: 100%;
  padding: 10px 10px;
  line-height: 10px;
  resize: none;
  border: 1px solid $color-cadyco-dark-text;
  border-radius: 6px;
  color: $color-cadyco-dark-text;
}

.confirm-button {
  background-color: #C4C4C4;
}

</style>
