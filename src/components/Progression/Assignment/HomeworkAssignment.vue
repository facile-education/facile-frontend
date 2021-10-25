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
        <span>{{ givenDate }}</span>
      </div>

      <div class="homework-parameters">
        <!-- Dropdown for student selection -->
        <div
          class="student-selection"
        >
          <span>{{ $t('for') }}</span>
          <div class="student-number">
            <span>{{ nbStudents }}</span>
            <img
              class="content-button"
              src="@assets/edit.svg"
              :alt="$t('edit')"
              :title="$t('edit')"
              @click="displayStudentsList()"
            >
          </div>
          <div
            v-if="isStudentsListDisplayed"
            class="students-list"
          >
            <div
              v-for="student in students"
              :key="student.userId"
              class="student"
            >
              <input
                v-model="student.isSelected"
                type="checkbox"
                label=""
              >
              {{ student.fullName }}
            </div>
          </div>
        </div>

        <!-- Dropdown for target session selection -->
        <div
          class="target-session"
        >
          <span>{{ $t('render-date') }}</span>
          <PentilaDropdown
            v-if="(nextSessions && nextSessions.length > 0)"
            v-model="homework.targetSession"
            class="sessions"
            :list="nextSessions"
            display-field="sessionDescription"
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

export default {
  name: 'HomeworkAssignment',
  components: {},
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
        targetSession: {},
        selectedStudents: []
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
    givenDate () {
      if (this.homework.startDate !== undefined) {
        return this.formatDate(this.homework.startDate)
      }
      return ''
    },
    nbStudents () {
      if (this.homework.selectedStudents !== undefined && this.homework.selectedStudents.length > 0) {
        return ' ' + this.homework.selectedStudents.length + ' ' + this.$t('students')
      } else {
        return ' ' + this.$t('all-students')
      }
    },
    students () {
      const res = [{ studentId: 0, studentName: this.$t('all-students') }]
      Array.prototype.push.apply(res, this.availableStudents)
      console.log('students=', res)
      return res
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
      console.log('nextSessions=', res)
      return _.orderBy(res, 'startDate', 'asc')
    }
  },
  created () {
    console.log('session=', this.session)
    getSessionDetails(this.session.id).then(
      (data) => {
        if (data.success) {
          this.sessionDetails = data.sessionDetails
          this.availableStudents = data.sessionDetails.students
          // Among all homeworks given from the current session, pick the one that may be the current homework
          if (data.sessionDetails.givenHomework !== undefined && data.sessionDetails.givenHomework.length > 0) {
            for (let idx = 0; idx < data.sessionDetails.givenHomework.length; ++idx) {
              const givenHomework = data.sessionDetails.givenHomework[idx]
              if (givenHomework.assignmentItemId !== undefined && givenHomework.assignmentItemId === this.session.sessionId) {
                console.log('Found existing homework with assignmentItemId=', givenHomework.assignmentItemId)
                this.isCreation = false
                this.homework = givenHomework
                const targetSession = { sessionId: givenHomework.targetSessionId, sessionDescription: this.formatDate(givenHomework.startDate) }
                this.homework = targetSession
              }
            }
          }
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
      console.log('formatDate date=', date)
      return dayjs(date, 'YYYY-MM-DD HH:mm').format('DD MMMM YYYY [à] HH[h]mm')
    }
  }
}
</script>

<style lang="scss" scoped>
.session {
  height: 100px;
  display: flex;
  .cours-name {
    border : 1px solid black;
    width: 200px;
    height: 100px;
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
      margin-bottom: 10px;
    }
    .homework-parameters {
      display: flex;
      justify-content: space-between;

      .student-selection {
        width: 300px;
        margin-right: 20px;
        display: flex;
        margin: auto;
        .student-number {
          width: 200px;
          display: flex;
          border : 1px solid black;
          span, img {
            margin: auto;
          }
        }
        .students-list {
          display: float;
        }
      }
      .target-session {
        display: flex;
        width: 500px;
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
  "students": "élèves",
  "edit": "Modifier la liste des élèves",
  "render-date": "Date de rendu",
  "pick-a-session": "Choisir une séance cible"
}
</i18n>
