<template>
  <div class="student">
    <span> {{ formattedStudent }} </span>
    <span
      v-if="student.subject"
      v-t="formattedSubject"
      class="subject"
    />
    <div class="right-section">
      <PentilaCheckbox
        v-if="isPresentCheckBoxActive"
        class="is-present-checkbox"
        label=""
        :title="$t('NotUsualSlots.StudentListModal.present')"
        :model-value="student.isPresent"
        @update:modelValue="handleCheck"
      />
      <NeroIcon
        v-if="isSignOut"
        name="fa-sign-out-alt"
        class="icon"
        data-test="unregister"
        :title="$t('NotUsualSlots.StudentListModal.unsubscribe')"
        @click="isStudentDeregistrationModalDisplayed = true"
      />
    </div>

    <teleport
      v-if="isStudentDeregistrationModalDisplayed"
      to="body"
    >
      <StudentRegistrationModal
        :removed-student="student"
        :event="event"
        :deregistration="true"
        :full-screen="mq.phone"
        @deregister="deregisterStudent"
        @close="isStudentDeregistrationModalDisplayed = false"
      />
    </teleport>
  </div>
</template>

<script>
import { toPascalCase } from '@/utils/commons.util'
import notUsualSlotsConstants from '@/constants/notUsualSlots'
import dayjs from 'dayjs'
import NeroIcon from '@/components/Nero/NeroIcon'

import { defineAsyncComponent } from 'vue'
const StudentRegistrationModal = defineAsyncComponent(() => import('@components/NotUsualSlotManager/StudentRegistrationModal/StudentRegistrationModal'))

export default {
  name: 'StudentListItem',
  components: { NeroIcon, StudentRegistrationModal },
  inject: ['mq'],
  props: {
    student: {
      type: Object,
      required: true
    },
    event: {
      type: Object,
      required: true
    },
    isCurrentTeacher: {
      type: Boolean,
      default: true
    }
  },
  emits: ['deregisterStudent', 'update:isPresent'],
  data () {
    return {
      isStudentDeregistrationModalDisplayed: false
    }
  },
  computed: {
    currentUser () {
      return this.$store.state.user
    },
    slotType () {
      return notUsualSlotsConstants.getSlotTypeByNumber(this.event.type)
    },
    formattedStudent () {
      return toPascalCase(this.student.firstName) + ' ' + toPascalCase(this.student.lastName) + ' - ' + this.student.className
    },
    formattedSubject () {
      return this.student.subject ? toPascalCase(this.student.subject) : ''
    },
    isPresentCheckBoxActive () {
      return this.isCurrentTeacher &&
        !(this.slotType.type === notUsualSlotsConstants.firedType) &&
        !(this.slotType.type === notUsualSlotsConstants.tutoringType) &&
        dayjs().isAfter(dayjs(this.event.start))
    },
    isRegisterer () {
      return this.student.registererId === this.currentUser.userId
    },
    isSignOut () {
      switch (this.slotType.type) {
        case notUsualSlotsConstants.studyType:
          return true
        case notUsualSlotsConstants.firedType:
          return this.currentUser.isDoyen || this.currentUser.isDirectionMember || this.currentUser.isSecretariat
        case notUsualSlotsConstants.tutoringType:
          return this.isRegisterer
        default:
          return this.isRegisterer || this.currentUser.isDoyen || this.currentUser.isSecretariat || this.currentUser.isDirectionMember
      }
    }
  },
  created () {
    this.isPresent = this.student.isPresent
  },
  methods: {
    deregisterStudent () {
      this.$emit('deregisterStudent')
    },
    handleCheck (check) {
      this.$emit('update:isPresent', { student: this.student, isPresent: check })
    }
  }
}
</script>

<style lang="scss" scoped>
.student {
  display: flex;
  margin: 10px 0;
  justify-content: space-between;
}

.subject {
  font-size: 0.85rem;
  font-style: italic;
  display: flex;
  align-items: center;
}

.right-section {
  display: flex;
}

.is-present-checkbox {
  margin-right: 30px;
}

.icon {
  cursor: pointer;
  margin-right: 30px;
  // width: 25px;
  // height: 25px;

  // &:hover {
  //   border: 1px solid grey;
  // }
}

</style>
