<template>
  <PentilaWindow
    :modal="true"
    class="student-registration-modal"
    :class="{'mobile': mq.phone}"
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
      <div
        v-if="isFired"
        class="fired-fields"
      >
        <div class="arrival">
          <span v-t="'NotUsualSlots.StudentRegistrationModal.arrival'" />
          <span>{{ arrivalTime }}</span>
        </div>
        <div class="source-slot">
          <span
            v-if="studentsDaySessions.length === 0"
            v-t="'NotUsualSlots.StudentRegistrationModal.noSlotAvailable'"
          />
          <div v-else>
            <span v-t="'NotUsualSlots.StudentRegistrationModal.sourceSlot'" />
            <PentilaDropdown
              v-model="selectedSession"
              :list="studentsDaySessions"
              display-field="label"
            />
            <PentilaErrorMessage
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
          <PentilaDropdown
            v-else-if="selectedSession.teachers.length > 1"
            v-model="dropdownSelectedTeacher"
            :list="selectedSession.teachers"
            display-field="name"
          />
        </div>
      </div>
      <div v-if="isReplayTest">
        <span v-t="'NotUsualSlots.StudentRegistrationModal.subject'" />
        <span
          v-if="availableSubjects.length === 0"
          v-t="'NotUsualSlots.StudentRegistrationModal.noSubjectsAvailable'"
        />
        <PentilaDropdown
          v-else
          v-model="selectedSubject"
          :list="availableSubjects"
          display-field="name"
        />
        <PentilaErrorMessage
          v-if="haveToSelectSlot"
          :error-message="$t('NotUsualSlots.StudentRegistrationModal.haveToSelectSubject')"
        />
      </div>
      <textarea
        v-if="isCommentDisplayed"
        ref="commentTextarea"
        v-model="comment"
        :placeholder="$t('NotUsualSlots.StudentRegistrationModal.commentPlaceholder')"
        @keydown.enter.stop=""
      />
      <PentilaCheckbox
        v-if="isNotifyParentsDisplayed"
        class="notify-parents"
        :label="$t('NotUsualSlots.StudentRegistrationModal.notifyParents')"
        :model-value="notifyParents"
        @update:modelValue="handleCheck"
      />
    </template>

    <template #footer>
      <div class="footer">
        <PentilaButton
          v-if="deregistration"
          :label="$t('NotUsualSlots.StudentRegistrationModal.unregister')"
          class="register"
          @click="submit"
        />
        <PentilaButton
          v-else
          :label="$t('NotUsualSlots.StudentRegistrationModal.register')"
          class="register"
          @click="submit"
        />
      </div>
    </template>
  </PentilaWindow>
</template>

<script>

import notUsualSlotsConstants from '@/constants/notUsualSlots'
import schoolLifeService from '@/api/schoolLife-portlet.service'
import userManagementService from '@/api/userManagement.service'
import { toPascalCase } from '@/utils/commons.util'
import { nextTick } from 'vue'
import moment from 'moment'

export default {
  name: 'StudentRegistrationModal',
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
    deregistration: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close', 'deregistre'],
  data () {
    return {
      comment: '',
      notifyParents: true,
      studentsDaySessions: [],
      availableSubjects: [],
      haveToSelectSlot: false,
      selectedSubject: { subjectId: -1, name: this.$t('NotUsualSlots.StudentRegistrationModal.selectSubject') },
      selectedSession: { sessionId: -1, label: this.$t('NotUsualSlots.StudentRegistrationModal.selectSlot') },
      dropdownSelectedTeacher: undefined
    }
  },
  computed: {
    slotType () {
      return notUsualSlotsConstants.getSlotTypeByNumber(this.event.extendedProps.type)
    },
    formattedStudent () {
      return toPascalCase(this.student.firstName) + ' ' + toPascalCase(this.student.lastName) + ' - ' + this.student.className
    },
    formattedSlot () {
      return this.$t('Moment.the') + ' ' + moment(this.event.start, 'YYYY-MM-DDTHH:mm').format('DD MMMM YYYY ' + this.$t('Moment.at') + ' HH:mm')
    },
    isCommentDisplayed () {
      return !this.deregistration && this.slotType.type === notUsualSlotsConstants.detentionType
    },
    isNotifyParentsDisplayed () {
      return !this.deregistration && this.slotType.type === notUsualSlotsConstants.studyType
    },
    isFired () {
      return !this.deregistration && this.slotType.type === notUsualSlotsConstants.firedType
    },
    isReplayTest () {
      return !this.deregistration && this.slotType.type === notUsualSlotsConstants.replayTestType
    },
    arrivalTime () {
      return this.$t('Moment.the') + ' ' + moment().format('DD MMMM YYYY ' + this.$t('Moment.at') + ' HH:mm')
    }
  },
  created () {
    if (this.isFired) {
      schoolLifeService.getCandidateSessions(this.student, this.event.extendedProps.id).then((data) => {
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
        vm.$refs.commentTextarea.focus()
      })
    }
  },
  methods: {
    formatSession (session) {
      if (session.schoollifeSessionId) {
        session.sessionId = 0
      }
      session.label = moment(session.startDate, 'YYYY/MM/DD HH:mm').format('HH:mm') + ' / ' + moment(session.endDate, 'YYYY/MM/DD HH:mm').format('HH:mm') + ' - ' + session.title
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
      schoolLifeService.registerStudent(this.student, this.event.extendedProps.id, this.comment, this.notifyParents, subjectName).then((data) => {
        if (data.success) {
          this.$store.dispatch('notUsualSlots/refreshCalendar')
          this.closeModal()
        }
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
      })
    },
    registerFiring () {
      const sourceTeacherId = this.selectedSession.teacher ? this.selectedSession.teacher.teacherId : this.selectedSession.teachers.length > 1 ? this.dropdownSelectedTeacher.teacherId : this.selectedSession.teachers[0].teacherId
      const sourceSchoollifeSessionId = (this.selectedSession.schoollifeSessionId === undefined) ? 0 : this.selectedSession.schoollifeSessionId
      schoolLifeService.registerFiring(this.event.extendedProps.id, this.student, this.selectedSession.sessionId, sourceTeacherId, sourceSchoollifeSessionId).then((data) => {
        if (data.success) {
          this.$store.dispatch('notUsualSlots/refreshCalendar')
          this.closeModal()
        }
      })
    },
    deregisterFiring () {
      schoolLifeService.unRegisterFiring(this.event.extendedProps.id, this.student).then((data) => {
        if (data.success) {
          this.$store.dispatch('notUsualSlots/refreshCalendar')
          this.$emit('deregistre')
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
  overflow: auto;
  max-width: 500px;
  &.mobile {
    width: 100%;
  }
}

</style>

<style lang="scss" scoped>
@import '@design';

.student-registration-modal {
  font-family: "Roboto", sans-serif;
  color: $color-cadyco-dark-text;
}

.body {
  margin-left: 20px;
}

h1 {
  font-size: 1.25em;
}

.student, .slot {
  font-weight: bold;
}

.slot{
  margin: 10px 0 15px 0;
}

textarea {
  width: 100%;
  height: 100px;
  margin-bottom: 15px;
  padding: 10px 10px;
  line-height: 10px;
  resize: none;
  border: 1px solid $color-cadyco-dark-text;
  border-radius: 6px;
  color: $color-cadyco-dark-text;
}

.notify-parents {
  margin-top: 10px;
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
