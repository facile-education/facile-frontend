<template>
  <div class="student">
    <span v-t="formattedStudent" />
    <span
      v-if="student.replayTestType"
      v-t="formattedReplayTestType"
      class="replayTestType"
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
      <i
        v-if="isSignOut"
        class="fas fa-sign-out-alt"
        :title="$t('NotUsualSlots.StudentListModal.unsubscribe')"
        @click="isStudentDeregistrationModalDisplayed = true"
      />
    </div>

    <teleport
      v-if="isStudentDeregistrationModalDisplayed"
      to="body"
    >
      <StudentRegistrationModal
        :student="student"
        :event="event"
        :deregistration="true"
        :is-full-screen="$device.phone"
        @deregistre="deregistreStudent"
        @close="isStudentDeregistrationModalDisplayed = false"
      />
    </teleport>
  </div>
</template>

<script>
import StudentRegistrationModal from '@components/NotUsualSlotManager/StudentRegistrationModal/StudentRegistrationModal'
import { toPascalCase } from '@/utils/commons.util'
import notUsualSlotsConstants from '@/constants/notUsualSlots'
import dayjs from 'dayjs'

export default {
  name: 'StudentListItem',
  components: { StudentRegistrationModal },
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
  emits: ['deregistreStudent', 'update:isPresent'],
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
      return notUsualSlotsConstants.getSlotTypeByNumber(this.event.extendedProps.type)
    },
    formattedStudent () {
      return toPascalCase(this.student.firstName) + ' ' + toPascalCase(this.student.lastName) + ' - ' + this.student.className
    },
    formattedReplayTestType () {
      return this.student.replayTestType ? toPascalCase(this.student.replayTestType) : ''
    },
    isPresentCheckBoxActive () {
      return this.isCurrentTeacher &&
        !(this.slotType.type === notUsualSlotsConstants.firedType) &&
        !(this.slotType.type === notUsualSlotsConstants.tutoringType) &&
        dayjs().isAfter(dayjs(this.event.start))
    },
    isSignOut () {
      if (this.slotType.type === notUsualSlotsConstants.tutoringType) {
        return (this.event.extendedProps.teacher.teacherId === this.currentUser.userId)
      } else {
        return true
      }
    }
  },
  created () {
    this.isPresent = this.student.isPresent
  },
  methods: {
    deregistreStudent () {
      this.$emit('deregistreStudent')
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

.replayTestType {
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

.fa-sign-out-alt {
  cursor: pointer;
  display: flex;
  align-items: center;
  margin-right: 30px;
}

</style>
