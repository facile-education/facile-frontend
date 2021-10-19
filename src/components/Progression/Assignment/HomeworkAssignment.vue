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
      <span>{{ sessionDetails.name }}</span>
      <span>{{ sessionDetails.teachers }}</span>
      <span>{{ sessionDetails.room }}</span>
    </div>

    <!-- Dropdown for student selection -->
    <div
      class="student-selection"
    >
      <PentilaDropdown
        v-if="(students && students.length > 0)"
        v-model="selectedStudents"
        class="students"
        :list="students"
        display-field="studentName"
      />
    </div>

    <!-- Dropdown for target session selection -->
    <div
      class="target-session"
    >
      <span>{{ $t('render-date') }}</span>
      <PentilaDropdown
        v-if="(nextSessions && nextSessions.length > 0)"
        v-model="selectedSession"
        class="sessions"
        :list="nextSessions"
        display-field="sessionName"
      />
    </div>
    <hr>
  </div>
</template>

<script>
import dayjs from 'dayjs'
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
  data () {
    return {
      sessionDetails: {
        sessionId: 12345,
        room: 'B43',
        color: '#F45678',
        students: [{ studentId: 123, studentName: 'Jean Bon' }, { studentId: 4565, studentName: 'Coucou Marc' }],
        nextSessions: [{ sessionId: 345, sessionName: 'AC10B1', sessionDate: '2021-10-23 14:10' }, { sessionId: 345, sessionName: 'AC10B1', sessionDate: '2021-10-25 10:00' }]
      },
      selectedStudents: {},
      selectedSession: {}
    }
  },
  computed: {
    formatDate (date) {
      return dayjs(date, 'DD MMMM YYYY [à] HH[h]MM')
    },
    getColor () {
      return 'background-color: ' + this.sessionDetails.color
    },
    students () {
      const res = [this.$t('all-students')]
      if (this.sessionDetails !== undefined) {
        Array.prototype.push.apply(res, this.sessionDetails.students)
      }
      console.log('students=', res)
      return res
    },
    nextSessions () {
      const res = [this.$t('pick-a-session')]
      if (this.sessionDetails !== undefined) {
        Array.prototype.push.apply(res, this.sessionDetails.nextSessions)
      }
      console.log('nextSessions=', res)
      return res
    }
  },
  created () {
    console.log('session=', this.session)
    getSessionDetails(this.session.id).then(
      (data) => {
        if (data.success) {
          this.sessionDetails = data.sessionDetails
          this.selectedStudents = data.sessionDetails.selectedStudents
        }
      },
      (err) => {
        // TODO toastr
        console.error(err)
      })
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
.session {
  height: 100px;
  display: flex;
  justify-content: space-between;
}
</style>

<i18n locale="fr">
{
  "all-students" : "Pour tous",
  "render-date": "Date de rendu",
  "pick-a-session": "Choisir une séance cible"
}
</i18n>
