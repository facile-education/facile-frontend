<template>
  <div
    class="session"
  >
    <!-- Cours name -->
    <div
      v-if="sessionDetails !== undefined"
      class="cours-name"
      :style="getColor"
    >
      <span>{{ sessionDetails.title }}</span>
      <span>{{ sessionTeachers }}</span>
      <span>{{ sessionDetails.room }}</span>
      <span>{{ formatDate(sessionDetails.startDate) }}</span>
    </div>

    <div class="homework-details">
      <div
        v-if="isCreation"
        class="is-given"
      >
        <span>{{ $t('not-given') }}</span>
      </div>
      <div
        v-else
        class="is-given"
      >
        <span>{{ getHomeworkGivenDate() }}</span>
      </div>

      <div class="homework-parameters">
        <!-- Dropdown for student selection -->
        <div
          class="student-selection"
        >
          <span>{{ nbStudents }}</span>
          <img
            class="content-button"
            src="@assets/edit.svg"
            :alt="$t('edit')"
            :title="$t('edit')"
            @click="displayStudentsList()"
          >
          <div
            v-if="isStudentsListDisplayed"
          >
            <StudentListModal
              :students="availableStudents"
              @close="onCloseStudentModal"
            />
          </div>
        </div>

        <!-- Dropdown for target session selection -->
        <div
          class="target-session"
        >
          <span>{{ $t('render-date') }}</span>
          <PentilaDropdown
            v-model="homework.targetSession"
            class="sessions"
            :list="nextSessions"
            :sort="false"
            display-field="sessionDescription"
            @update:modelValue="onTargetSessionSelect"
          />
        </div>
        <NeroDatePicker
          v-if="homework.isCustomDate"
          v-model="homework.targetDate"
          :min-date="minDate.toDate()"
          :max-date="maxDate.toDate()"
          @update:modelValue="onUpdateCustomDate"
        />
      </div>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import _ from 'lodash'

import { getSessionDetails } from '@/api/schedule.service'
import NeroDatePicker from '@/components/Progression/Assignment/NeroDatePicker.vue'
import StudentListModal from '@/components/Progression/Assignment/StudentListModal.vue'

export default {
  name: 'HomeworkAssignment',
  components: { StudentListModal, NeroDatePicker },
  props: {
    session: {
      type: Object,
      required: true
    }
  },
  emits: ['editedHomework'],
  data () {
    return {
      sessionDetails: {},
      availableStudents: [],
      isCreation: true,
      isStudentsListDisplayed: false,
      homework: {
        homeworkId: 0,
        sourceSessionId: this.session.sessionId,
        targetSession: undefined,
        toDate: undefined,
        targetDate: dayjs(),
        isWholeClass: true,
        selectedStudents: [],
        type: this.$store.state.progression.assignedItem.type,
        estimatedTime: this.$store.state.progression.assignedItem.duration,
        isCustomDate: false
      },
      minDate: dayjs(this.session.startDate),
      maxDate: dayjs('2031-07-01')
    }
  },
  computed: {
    getColor () {
      return 'background-color: ' + this.sessionDetails.color + '50'
    },
    sessionTeachers () {
      let teachers = ''
      if (this.sessionDetails.teachers !== undefined) {
        for (let idx = 0; idx < this.sessionDetails.teachers.length; ++idx) {
          teachers += this.sessionDetails.teachers[idx].fullName
          if (idx !== this.sessionDetails.teachers.length - 1) {
            teachers += ', '
          }
        }
      }
      return teachers
    },
    nbStudents () {
      if (!this.homework.isWholeClass && this.homework.selectedStudents.length === 1) {
        return this.$t('for') + ' ' + this.homework.selectedStudents.length + ' ' + this.$t('student') + this.availableStudents.length
      } else if (!this.homework.isWholeClass && this.homework.selectedStudents.length > 0) {
        return this.$t('for') + ' ' + this.homework.selectedStudents.length + ' ' + this.$t('students') + this.availableStudents.length
      } else {
        return this.$t('for') + ' ' + this.$t('all-students')
      }
    },
    nextSessions () {
      const res = [{ sessionId: 0, sessionDescription: this.$t('custom-date'), isCustomDate: true }]
      if (this.sessionDetails !== undefined && this.sessionDetails.nextSessions !== undefined) {
        // Build sessionDescription
        for (let idx = 0; idx < this.sessionDetails.nextSessions.length; ++idx) {
          const nextSession = this.sessionDetails.nextSessions[idx]
          if (nextSession.startDate !== undefined) {
            nextSession.sessionDescription = 'Le ' + this.formatDate(nextSession.startDate)
          }
          res.push(nextSession)
        }
      }
      return _.orderBy(res, 'startDate', 'asc')
    }
  },
  created () {
    getSessionDetails(this.session.sessionId).then(
      (data) => {
        if (data.success) {
          this.sessionDetails = data.sessionDetails
          this.availableStudents = data.sessionDetails.students
          // Among all homeworks given from the current session, pick the one that may be the current homework
          if (data.sessionDetails.givenHomework !== undefined && data.sessionDetails.givenHomework.length > 0) {
            for (let idx = 0; idx < data.sessionDetails.givenHomework.length; ++idx) {
              const givenHomework = data.sessionDetails.givenHomework[idx]

              if (givenHomework.assignedItemId !== undefined && givenHomework.assignedItemId === this.$store.state.progression.assignedItem.itemId) {
                this.isCreation = false
                this.homework = givenHomework
                this.homework.targetSession = { sessionId: givenHomework.targetSessionId, sessionDescription: this.formatDate(givenHomework.toDate) }
                this.homework.targetDate = dayjs(this.homework.toDate)
                if (!givenHomework.isWholeClass) {
                  // Set the selected students
                  for (let idx = 0; idx < this.availableStudents.length; ++idx) {
                    for (let idx2 = 0; idx2 < this.homework.selectedStudents.length; ++idx2) {
                      if (this.availableStudents[idx].userId === this.homework.selectedStudents[idx2].userId) {
                        this.availableStudents[idx].isSelected = true
                      }
                    }
                  }
                }
              }
            }
          }
          // Default target session is the next session
          if (this.isCreation) {
            let defaultSession = data.sessionDetails.nextSessions[0]
            for (let idx = 0; idx < data.sessionDetails.nextSessions.length; ++idx) {
              const nextSession = data.sessionDetails.nextSessions[idx]
              if (dayjs(nextSession.startDate).isBefore(dayjs(defaultSession.startDate))) {
                defaultSession = nextSession
              }
            }
            this.homework.targetSession = { sessionId: defaultSession.sessionId, sessionDescription: this.formatDate(defaultSession.startDate) }
            this.homework.toDate = defaultSession.startDate
            this.homework.targetDate = dayjs(this.homework.toDate)
            this.homework.isCustomDate = false
          }
          // Emit default homework if not updated later
          this.$emit('editedHomework', this.homework)
        }
      },
      (err) => {
        // TODO toastr
        console.error(err)
      })
  },
  methods: {
    displayStudentsList () {
      this.isStudentsListDisplayed = !this.isStudentsListDisplayed
    },
    formatDate (date) {
      return dayjs(date, 'YYYY-MM-DD HH:mm').format('DD MMMM YYYY [à] HH[h]mm')
    },
    getHomeworkGivenDate () {
      return this.$t('given-date') + dayjs(this.homework.assignedDate, 'YYYY-MM-DD HH:mm').format('DD MMMM YYYY [à] HH[h]mm')
    },
    onTargetSessionSelect (selectedSession) {
      if (selectedSession.isCustomDate) {
        // Display date picker
        this.homework.isCustomDate = true
      } else {
        this.homework.isCustomDate = false
        this.homework.targetSession = selectedSession
        this.homework.targetSessionId = selectedSession.sessionId
        this.$emit('editedHomework', this.homework)
      }
    },
    onUpdateCustomDate (targetDate) {
      this.homework.toDate = this.homework.targetDate.format('YYYY-MM-DD HH:mm')
      this.homework.targetSessionId = 0
      this.$emit('editedHomework', this.homework)
    },
    onCloseStudentModal (students, isWholeClass) {
      this.isStudentsListDisplayed = false
      this.homework.isWholeClass = isWholeClass
      // If specific students, keep the selected ones
      if (!isWholeClass) {
        this.homework.selectedStudents = []
        for (let idx = 0; idx < students.length; ++idx) {
          if (students[idx].isSelected) {
            this.homework.selectedStudents.push(students[idx])
          }
        }
      }
      this.$emit('editedHomework', this.homework)
    }
  }
}
</script>

<style lang="scss" scoped>
.session {
  height: 150px;
  display: flex;
  .cours-name {
    border : 1px solid black;
    width: 250px;
    height: 130px;
    margin-left: 20px;
    margin-right: 20px;
    display: flex;
    flex-direction: column;
    span {
      margin: 3px;
    }
  }
  .homework-details {
    display: flex;
    flex-direction: column;
    .is-given {
      margin-top: 10px;
      margin-bottom: 10px;
    }
    .homework-parameters {
      display: flex;
      justify-content: space-between;

      .student-selection {
        width: 250px;
        margin-right: 20px;
        display: flex;
        margin: auto;
        span {
          margin-right: 10px;
        }
        .content-button {
          border : 1px solid transparent;
          &:hover {
            border : 1px solid black;
            cursor: pointer;
          }
        }
      }
      .target-session {
        display: flex;
        width: 450px;
        span {
          margin: auto;
        }
        .sessions {
          width: 300px;
          margin: auto;
        }
      }
    }
  }
}
</style>

<i18n locale="fr">
{
  "given-date": "Donné le ",
  "not-given": "Devoir non donné",
  "all-students" : "tous les élèves",
  "for": "Pour",
  "student": "élève sur ",
  "students": "élèves sur ",
  "edit": "Modifier la liste des élèves",
  "render-date": "Date de rendu",
  "custom-date": "Date libre"
}
</i18n>
