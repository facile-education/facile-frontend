<template>
  <div
    class="student"
    data-test="student-list-item"
  >
    <a
      href="#"
      style="color: black;"
      class="name toggle-user-card"
      @click.stop="openUserCardModal"
    > {{ formattedStudent }}
    </a>
    <span
      v-if="student.subject"
      v-t="formattedSubject"
      class="subject"
    />
    <div class="right-section">
      <WeprodeCheckbox
        v-if="isPresentCheckBoxActive"
        class="is-present-checkbox"
        label=""
        :title="$t('NotUsualSlots.StudentListModal.present')"
        :model-value="student.isPresent"
        @update:model-value="handleCheck"
      />
      <button
        v-if="isSignOut"
        :title="$t('NotUsualSlots.StudentListModal.unsubscribe')"
        :aria-label="$t('NotUsualSlots.StudentListModal.unsubscribe')"
        data-test="unregister"
        @click="isStudentDeregistrationModalDisplayed = true"
      >
        <CustomIcon icon-name="icon-out" />
      </button>
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
import CustomIcon from '@components/Base/CustomIcon.vue'
import dayjs from 'dayjs'
import { defineAsyncComponent } from 'vue'

import { DATE_EXCHANGE_FORMAT } from '@/api/constants'
import WeprodeCheckbox from '@/components/Base/Weprode/WeprodeCheckbox.vue'
import notUsualSlotsConstants from '@/constants/notUsualSlots'
import { toPascalCase } from '@/utils/commons.util'
const StudentRegistrationModal = defineAsyncComponent(() => import('@components/NotUsualSlotManager/StudentRegistrationModal/StudentRegistrationModal'))

export default {
  name: 'StudentListItem',
  components: { CustomIcon, StudentRegistrationModal, WeprodeCheckbox },
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
      return this.student.firstName + ' ' + this.student.lastName + ' - ' + this.student.className
    },
    formattedSubject () {
      return this.student.subject ? toPascalCase(this.student.subject) : ''
    },
    isPresentCheckBoxActive () {
      return this.isCurrentTeacher &&
        this.slotType.type !== notUsualSlotsConstants.firedType &&
        this.slotType.type !== notUsualSlotsConstants.tutoringType &&
        dayjs().isAfter(dayjs(this.event.startDate, DATE_EXCHANGE_FORMAT))
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
    },
    openUserCardModal () {
      this.$store.dispatch('userCard/initUserCard', {
        userId: this.student.userId
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.student {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 10px 0;
}

.subject {
  flex: 1;
  font-size: 0.85rem;
  font-style: italic;
  padding: 0 0.5rem;
}

.right-section {
  text-align: right;
  display: flex;
}

.is-present-checkbox {
  margin-right: 30px;
}

button {
  margin: 0;
  padding: 0;
  background-color: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;

  .icon-out {
    font-size: 1.25rem;
  }
}

</style>
