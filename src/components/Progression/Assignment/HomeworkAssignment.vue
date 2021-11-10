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
        <span>{{ $t('given-date') }}</span>
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
              :students="studentList"
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
            @dropdown-update="onRenderDateSelect"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import _ from 'lodash'
import { getSessionDetails } from '@/api/cdt.service'
import StudentListModal from '@/components/Progression/Assignment/StudentListModal.vue'

export default {
  name: 'HomeworkAssignment',
  components: { StudentListModal },
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
      studentList: [],
      isCreation: true,
      isStudentsListDisplayed: false,
      homework: {
        homeworkId: 0,
        sourceSessionId: this.session.sessionId,
        targetSession: undefined,
        toDate: undefined,
        isWholeClass: true,
        selectedStudents: [],
        type: 0
      }
    }
  },
  computed: {
    getColor () {
      return 'background-color: ' + this.sessionDetails.color
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
      if (this.homework.selectedStudents !== undefined && this.homework.selectedStudents.length > 0) {
        return this.$t('for') + ' ' + this.homework.selectedStudents.length + ' ' + this.$t('students') + this.studentList.length
      } else {
        return this.$t('for') + ' ' + this.$t('all-students')
      }
    },
    nextSessions () {
      const res = [{ sessionId: 0, sessionDescription: this.$t('pick-a-session') }]
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
    console.log('session=', this.session)
    getSessionDetails(this.session.sessionId).then(
      (data) => {
        if (data.success) {
          this.sessionDetails = data.sessionDetails
          this.studentList = data.sessionDetails.students

          // Among all homeworks given from the current session, pick the one that may be the current homework
          if (data.sessionDetails.givenHomework !== undefined && data.sessionDetails.givenHomework.length > 0) {
            for (let idx = 0; idx < data.sessionDetails.givenHomework.length; ++idx) {
              const givenHomework = data.sessionDetails.givenHomework[idx]
              console.log('givenHomework=', givenHomework)

              if (givenHomework.assignedItemId !== undefined && givenHomework.assignedItemId === this.$store.state.progression.assignedItem.itemId) {
                console.log('Found existing homework ', givenHomework)
                this.isCreation = false
                this.homework = givenHomework
                this.homework.targetSession = { sessionId: givenHomework.targetSessionId, sessionDescription: this.formatDate(givenHomework.toDate) }

                // Mark the selected students
                if (!givenHomework.isWholeClass) {
                  for (let idx = 0; idx < givenHomework.selectedStudents.length; ++idx) {
                    console.log('selectedStudent = ', givenHomework.selectedStudents[idx])
                    const studentIndex = this.studentList.map(student => student.userId).indexOf(givenHomework.selectedStudents[idx].userId)
                    if (studentIndex !== -1) {
                      this.studentList[studentIndex].isSelected = true
                    }
                  }
                } else {
                  // Reset the student list in case of whole class
                  this.homework.selectedStudents = []
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
            this.homework.targetSessionId = defaultSession.sessionId
            this.homework.toDate = defaultSession.startDate
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
    onRenderDateSelect () {
      console.log('on render date')
      this.homework.toDate = this.nextSessions()[0].startDate
      this.$emit('editedHomework', this.homework)
    },
    onCloseStudentModal (updatedStudents, isWholeClass) {
      console.log('Closed student modal: isWholeClass=', isWholeClass)
      console.log('Closed student modal: updatedStudents=', updatedStudents)
      this.homework.isWholeClass = isWholeClass
      if (!isWholeClass) {
        this.homework.selectedStudents = []
        for (let idx = 0; idx < updatedStudents.length; ++idx) {
          if (updatedStudents[idx].isSelected) {
            this.homework.selectedStudents.push(updatedStudents[idx])
          }
        }
      }
      this.isStudentsListDisplayed = false

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
  "students": "élèves sur ",
  "edit": "Modifier la liste des élèves",
  "render-date": "Date de rendu",
  "pick-a-session": "Choisir une séance cible"
}
</i18n>
