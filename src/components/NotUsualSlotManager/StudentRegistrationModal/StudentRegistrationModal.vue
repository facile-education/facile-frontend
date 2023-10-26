<template>
  <WeprodeWindow
    :modal="true"
    :draggable="true"
    :full-screen="mq.phone || mq.tablet"
    class="student-registration-modal"
    data-test="student-registration-modal"
    :max-width="800"
    @close="closeModal"
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
      <h3>{{ slotType.label }}</h3>
      <div
        v-if="student"
        class="student"
      >
        <span v-t="'NotUsualSlots.StudentRegistrationModal.student'" />
        <span>{{ formattedStudent }}</span>
      </div>
      <div
        v-else
        class="class"
      >
        <span v-t="'NotUsualSlots.StudentRegistrationModal.class'" />
        <span>{{ selectedClass.orgName }}</span>
      </div>
      <div class="slot">
        <span v-t="'NotUsualSlots.StudentRegistrationModal.slot'" />
        <span>{{ formattedSlot }}</span>
      </div>
      <div
        v-if="isFired"
        class="fired-fields"
      >
        <div class="arrival">
          <span v-t="'NotUsualSlots.StudentRegistrationModal.arrival'" />
          <WeprodeInput
            v-model="inputStartHour"
            class="input"
            :placeholder="'hh:mm'"
            :labelled="false"
          />
          <WeprodeErrorMessage
            v-if="error"
            :error-message="error"
          />
        </div>
        <div class="source-slot">
          <span
            v-if="studentsDaySessions.length === 0"
            v-t="'NotUsualSlots.StudentRegistrationModal.noSlotAvailable'"
          />
          <div v-else>
            <span v-t="'NotUsualSlots.StudentRegistrationModal.sourceSlot'" />
            <WeprodeDropdown
              v-model="selectedSession"
              :list="studentsDaySessions"
              display-field="label"
            />
            <WeprodeErrorMessage
              v-if="haveToSelectSlot"
              :error-message="$t('NotUsualSlots.StudentRegistrationModal.haveToSelectSlot')"
            />
          </div>
        </div>
        <div
          v-if="selectedSession.sessionId !== -1"
          class="fired-by"
        >
          <span v-t="'NotUsualSlots.StudentRegistrationModal.firedBy'" />
          <span v-if="selectedSession.teacher">{{ selectedSession.teacher.firstName + ' ' + selectedSession.teacher.lastName }}</span>
          <span v-else-if="selectedSession.teachers.length === 1">{{ selectedSession.teachers[0].name }}</span>
          <WeprodeDropdown
            v-else-if="selectedSession.teachers.length > 1"
            v-model="dropdownSelectedTeacher"
            :list="selectedSession.teachers"
            display-field="name"
          />
        </div>
      </div>
      <div
        v-if="isReplayTest"
        class="select-course"
      >
        <span v-t="'NotUsualSlots.StudentRegistrationModal.subject'" />
        <span
          v-if="availableSubjects.length === 0"
          v-t="'NotUsualSlots.StudentRegistrationModal.noSubjectsAvailable'"
        />
        <WeprodeDropdown
          v-else
          v-model="selectedSubject"
          :list="availableSubjects"
          display-field="name"
        />
        <WeprodeErrorMessage
          v-if="haveToSelectSlot"
          :error-message="$t('NotUsualSlots.StudentRegistrationModal.haveToSelectSubject')"
        />
      </div>
      <WeprodeTextArea
        v-if="isCommentDisplayed"
        ref="commentTextarea"
        v-model="comment"
        :placeholder="$t('NotUsualSlots.StudentRegistrationModal.commentPlaceholder')"
        class="comment"
        style="height:100px;resize: none;"
        @keydown.enter.stop=""
      />
      <WeprodeCheckbox
        v-if="isNotifyParentsDisplayed"
        class="notify-parents"
        :label="$t('NotUsualSlots.StudentRegistrationModal.notifyParents')"
        :model-value="notifyParents"
        @update:model-value="handleCheck"
      />
    </template>

    <template #footer>
      <WeprodeButton
        v-if="deregistration"
        :label="$t('NotUsualSlots.StudentRegistrationModal.unregister')"
        class="register"
        @click="submit"
      />
      <WeprodeButton
        v-else
        :label="$t('NotUsualSlots.StudentRegistrationModal.register')"
        class="register"
        @click="submit"
      />
    </template>
  </WeprodeWindow>
</template>

<script>
import WeprodeButton from '@components/Base/Weprode/WeprodeButton.vue'
import dayjs from 'dayjs'
import { nextTick } from 'vue'

import schoolLifeService from '@/api/schoolLife-portlet.service'
import userManagementService from '@/api/userManagement.service'
import WeprodeCheckbox from '@/components/Base/Weprode/WeprodeCheckbox.vue'
import WeprodeDropdown from '@/components/Base/Weprode/WeprodeDropdown.vue'
import WeprodeErrorMessage from '@/components/Base/Weprode/WeprodeErrorMessage.vue'
import WeprodeInput from '@/components/Base/Weprode/WeprodeInput.vue'
import WeprodeTextArea from '@/components/Base/Weprode/WeprodeTextArea.vue'
import WeprodeWindow from '@/components/Base/Weprode/WeprodeWindow.vue'
import notUsualSlotsConstants from '@/constants/notUsualSlots'

export default {
  name: 'StudentRegistrationModal',
  components: { WeprodeButton, WeprodeCheckbox, WeprodeDropdown, WeprodeErrorMessage, WeprodeInput, WeprodeTextArea, WeprodeWindow },
  inject: ['mq'],
  props: {
    event: {
      type: Object,
      required: true
    },
    deregistration: {
      type: Boolean,
      default: false
    },
    removedStudent: {
      type: Object,
      default: undefined
    }
  },
  emits: ['close', 'deregister'],
  data () {
    return {
      comment: '',
      notifyParents: true,
      studentsDaySessions: [],
      availableSubjects: [],
      haveToSelectSlot: false,
      registrationDate: dayjs(),
      error: '',
      inputStartHour: dayjs().format('HH:mm'),
      selectedSubject: { subjectId: -1, name: this.$t('NotUsualSlots.StudentRegistrationModal.selectSubject') },
      selectedSession: { sessionId: -1, label: this.$t('NotUsualSlots.StudentRegistrationModal.selectSlot') },
      dropdownSelectedTeacher: undefined
    }
  },
  computed: {
    slotType () {
      return notUsualSlotsConstants.getSlotTypeByNumber(this.event.type)
    },
    formattedStudent () {
      return this.student.firstName + ' ' + this.student.lastName + ' - ' + this.student.className
    },
    formattedSlot () {
      return this.$t('Moment.the') + ' ' + dayjs(this.event.startDate).format('DD MMMM YYYY ' + this.$t('Moment.at') + ' HH:mm')
    },
    isCommentDisplayed () {
      return !this.deregistration && this.slotType.type === notUsualSlotsConstants.detentionType
    },
    isNotifyParentsDisplayed () {
      return !this.deregistration && (this.slotType.type !== notUsualSlotsConstants.firedType && this.slotType.type !== notUsualSlotsConstants.tutoringType)
    },
    isFired () {
      return !this.deregistration && this.slotType.type === notUsualSlotsConstants.firedType
    },
    isReplayTest () {
      return !this.deregistration && this.slotType.type === notUsualSlotsConstants.replayTestType
    },
    arrivalTime () {
      return this.$t('Moment.the') + ' ' + dayjs().format('DD MMMM YYYY ' + this.$t('Moment.at') + ' HH:mm')
    },
    selectedClass () {
      return this.$store.state.notUsualSlots.selectedClass
    },
    student () {
      return this.removedStudent || this.$store.state.notUsualSlots.queriedUser
    }
  },
  watch: {
    inputStartHour (value) {
      const hour = dayjs(value, 'HH:mm', true)

      if (hour.isValid()) {
        this.error = ''
        this.registrationDate = dayjs(dayjs(this.event.startDate).format('YYYY-MM-DD') + ' ' + value, 'YYYY-MM-DD HH:mm')
      } else {
        this.error = this.$t('NotUsualSlots.StudentRegistrationModal.haveToSelectValidTime')
      }
    },
    selectedSession () {
      this.haveToSelectSlot = false
    }
  },
  created () {
    if (this.isFired) {
      schoolLifeService.getCandidateSessions(this.student, this.event.sessionId).then((data) => {
        if (data.success) {
          this.studentsDaySessions = data.candidateSessions
          this.studentsDaySessions.forEach((session) => { this.formatSession(session) })
        }
      },
      (err) => {
        console.error(err)
      })
    } if (this.isReplayTest) {
      userManagementService.getSubjects().then((data) => {
        if (data.success) {
          this.availableSubjects = data.subjects
        }
      },
      (err) => {
        console.error(err)
      })
    }
  },
  mounted () {
    if (this.isCommentDisplayed) { // Focus textArea
      const vm = this
      nextTick(function () {
        vm.$refs.commentTextarea.$el.childNodes[0].focus()
      })
    }
  },
  methods: {
    formatSession (session) {
      if (session.type !== undefined) {
        // HHC slot
        session.label = dayjs(session.startDate, 'YYYY/MM/DD HH:mm').format('HH:mm') + ' / ' + dayjs(session.endDate, 'YYYY/MM/DD HH:mm').format('HH:mm') + ' - ' + notUsualSlotsConstants.getSlotTypeByNumber(session.type).label
      } else {
        // Classic session slot
        session.label = dayjs(session.startDate, 'YYYY/MM/DD HH:mm').format('HH:mm') + ' / ' + dayjs(session.endDate, 'YYYY/MM/DD HH:mm').format('HH:mm') + ' - ' + session.groupName
      }
    },
    submit () {
      if (this.deregistration) {
        this.slotType.type === notUsualSlotsConstants.firedType ? this.deregisterFiring() : this.confirmDeregistration()
      } else {
        if (this.isFired) {
          if (this.selectedSession.sessionId === -1) {
            this.haveToSelectSlot = true
          } else {
            this.registerFiring()
          }
        } else if (this.isReplayTest) {
          if (this.selectedSubject.subjectId === -1) {
            this.haveToSelectSlot = true
          } else {
            this.confirmRegistration()
          }
        } else {
          this.confirmRegistration()
        }
      }
    },
    confirmRegistration () {
      const subjectName = this.selectedSubject.subjectId !== -1 ? this.selectedSubject.name : ''

      if (this.student) {
        schoolLifeService.registerStudent(this.student, this.event.sessionId, this.comment, this.notifyParents, subjectName).then((data) => {
          if (data.success) {
            this.$store.dispatch('notUsualSlots/refreshCalendar')
            this.closeModal()
          }
        })
      } else if (this.selectedClass.orgId > 0) {
        schoolLifeService.registerClass(this.selectedClass.orgId, this.event.sessionId, this.comment, this.notifyParents, subjectName).then((data) => {
          if (data.success) {
            this.$store.dispatch('notUsualSlots/refreshCalendar')
            this.closeModal()
          }
        })
      }
    },
    confirmDeregistration () {
      const allSession = this.slotType.type === notUsualSlotsConstants.studyType
      schoolLifeService.unRegisterStudent(this.student, this.event.sessionId, this.comment, this.notifyParents, allSession).then((data) => {
        if (data.success) {
          this.$store.dispatch('notUsualSlots/refreshCalendar')
          this.$emit('deregister')
          this.closeModal()
        }
      })
    },
    registerFiring () {
      const sourceTeacherId = this.selectedSession.teacher ? this.selectedSession.teacher.teacherId : this.selectedSession.teachers.length > 1 ? this.dropdownSelectedTeacher.teacherId : this.selectedSession.teachers[0].teacherId
      const sourceSchoollifeSessionId = (this.selectedSession.sessionId === undefined) ? 0 : this.selectedSession.sessionId
      schoolLifeService.registerFiring(this.event.sessionId, this.student, this.selectedSession.sessionId, sourceTeacherId, sourceSchoollifeSessionId, this.registrationDate.format('YYYY-MM-DD HH:mm')).then((data) => {
        if (data.success) {
          this.$store.dispatch('notUsualSlots/refreshCalendar')
          this.closeModal()
        }
      })
    },
    deregisterFiring () {
      schoolLifeService.unRegisterFiring(this.event.sessionId, this.student).then((data) => {
        if (data.success) {
          this.$store.dispatch('notUsualSlots/refreshCalendar')
          this.$emit('deregister')
          this.closeModal()
        }
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

<style lang="scss">
.student-registration-modal .window-wrapper {
  max-width: 500px;
}

.student-registration-modal {
  .window-body {
    overflow: visible !important;
  }
}

</style>

<style lang="scss" scoped>
@import '@design';

h3 {
  margin-top: 0;
}

.student, .slot {
  font-weight: bold;
}

.slot{
  margin: 10px 0 15px 0;
}

.select-course {
  margin-bottom: 15px;
}

.source-slot {
  margin-top: 10px;
}

.comment {
  height: 100px;
  margin-bottom: 15px;
}

.input {
  max-width: 62px;
  padding-left: 8px;
  padding-right: 8px;
  border-bottom: none;
}

.notify-parents {
  margin-top: 10px;
}

.register {
  width: 130px;
}
</style>
