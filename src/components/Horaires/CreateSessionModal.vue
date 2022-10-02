<template>
  <PentilaWindow
    :modal="true"
    :draggable="true"
    :class="{'create-session': mq.phone}"
    @close="closeModal"
  >
    <template #header>
      <span v-t="'title'" />
    </template>

    <template #body>
      <div
        class="datetime"
      >
        <p
          class="datetime-firstlabel"
        >
          {{ $t('the') }}
        </p>
        <PentilaDropdown
          v-model="selectedDay"
          class="days-list"
          :list="daysList"
          display-field="dayName"
        />
        <p
          class="datetime-label"
        >
          {{ $t('from') }}
        </p>
        <PentilaInput
          v-model="startTime"
          class="datetime-input"
        />
        <p
          class="datetime-label"
        >
          {{ $t('to') }}
        </p>
        <PentilaInput
          v-model="endTime"
          class="datetime-input"
        />
      </div>
      <PentilaErrorMessage
        :error-message="formErrorList.day"
      />
      <PentilaErrorMessage
        :error-message="formErrorList.time"
      />

      <!-- Groupe -->
      <div
        class="group"
      >
        {{ $t('group') }}
        <PentilaDropdown
          v-model="selectedGroup"
          class="group-list"
          :placeholder="$t('group')"
          :list="groupList"
          display-field="groupName"
        />
      </div>
      <PentilaErrorMessage
        :error-message="formErrorList.group"
      />

      <div
        class="teachers"
      >
        <PentilaTagsInput
          ref="tagsinput"
          v-model="selectedTeachers"
          :close-on-select="true"
          :completion-only="false"
          :min-length="1"
          :placeholder="$t('teachersPlaceHolder')"
          display-field="fullName"
          id-field="userId"
          :list="teacherList"
          class="tags"
        />
      </div>
      <PentilaErrorMessage
        :error-message="formErrorList.selectedTeachers"
      />

      <!-- Subject -->
      <div
        class="subject"
      >
        <PentilaInput
          v-model="subject"
          class="subject-input"
          :placeholder="$t('subjectPlaceHolder')"
        />
      </div>
      <PentilaErrorMessage
        :error-message="formErrorList.subject"
      />

      <!-- Room -->
      <div
        class="room"
      >
        <PentilaInput
          v-model="room"
          class="room-input"
          :placeholder="$t('roomPlaceHolder')"
        />
      </div>

      <!-- Recurrence -->
      <div class="recurrence">
        <PentilaCheckbox
          v-model="isRecurrent"
          class="checkbox"
          label=""
        />
        {{ $t('recurrence') }}
      </div>
    </template>

    <template #footer>
      <PentilaButton
        form="createsessionform"
        :label="$t('Create')"
        @click="onCreate"
      />
    </template>
  </PentilaWindow>
</template>

<script>
import { required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { createSession } from '@/api/cdt.service'
import { getSchoolsTeachers } from '@/api/organization.service'
import { getUserGroups } from '@/api/groups.service'
import dayjs from 'dayjs'

const teachersRequired = (value) => {
  return value !== undefined && value.length > 0
}

const timeRequired = (value) => {
  const time = dayjs(value, 'HH:mm')
  return !time.$invalid
}

export default {
  name: 'SessionTeacherModal',
  components: {},
  inject: ['mq'],
  props: {
  },
  emits: ['close'],
  setup: () => ({ v$: useVuelidate() }),
  validations: {
    selectedGroup: { required },
    selectedDay: { required },
    startTime: { timeRequired },
    endTime: { timeRequired },
    selectedTeachers: { teachersRequired },
    subject: { required }
  },
  data () {
    return {
      teacherList: [],
      selectedTeachers: [],
      groupList: [],
      selectedGroup: undefined,
      room: '',
      subject: '',
      selectedDay: {},
      startTime: '8:00',
      endTime: '10:00',
      isRecurrent: false
    }
  },
  computed: {
    formErrorList () {
      return {
        day: (this.v$.selectedDay.$invalid && this.v$.selectedDay.$dirty) ? this.$t('Validation.day') : '',
        time: ((this.v$.startTime.$invalid && this.v$.startTime.$dirty) || (this.v$.endTime.$invalid && this.v$.endTime.$dirty)) ? this.$t('Validation.time') : (this.isStartBeforeAfter ? '' : this.$t('Validation.startBeforeAfter')),
        group: (this.v$.selectedGroup.$invalid && this.v$.selectedGroup.$dirty) ? this.$t('Validation.group') : '',
        selectedTeachers: (this.v$.selectedTeachers.$invalid && this.v$.selectedTeachers.$dirty) ? this.$t('Validation.teachers') : '',
        subject: (this.v$.subject.$invalid && this.v$.subject.$dirty) ? this.$t('Validation.required') : ''
      }
    },
    isStartBeforeAfter () {
      const start = dayjs(dayjs().format('YYYY-MM-DD') + ' ' + this.startTime, 'YYYY-MM-DD HH:mm')
      const end = dayjs(dayjs().format('YYYY-MM-DD') + ' ' + this.endTime, 'YYYY-MM-DD HH:mm')
      return start.isBefore(end)
    }
  },
  created () {
    this.daysList = [
      { dayNb: 1, dayName: 'Lundi' },
      { dayNb: 2, dayName: 'Mardi' },
      { dayNb: 3, dayName: 'Mercredi' },
      { dayNb: 4, dayName: 'Jeudi' },
      { dayNb: 5, dayName: 'Vendredi' },
      { dayNb: 6, dayName: 'Samedi' },
      { dayNb: 7, dayName: 'Dimanche' }
    ]
    this.selectedDay = this.daysList[0]

    // Get teacher list from backend
    this.teacherList.length = 0
    getSchoolsTeachers().then((data) => {
      if (data.success) {
        this.teacherList = data.teachers
      }
    })

    getUserGroups(0, true, true, true).then((data) => {
      if (data.success) {
        this.groupList = this.groupList.concat(data.groups)
        // Pre-select current group if any
        if (this.$store.state.horaires.selectedGroup.groupId !== 0) {
          this.selectedGroup = this.$store.state.horaires.selectedGroup
        }
      }
    })
  },
  methods: {
    closeModal () {
      this.$store.dispatch('horaires/setCreateSessionModalDisplayed', false)
    },
    onCreate (e) {
      e.preventDefault()
      if (this.v$.$invalid) {
        this.v$.$touch()
      } else {
        // Build startDate and endDate
        const startDate = dayjs(dayjs().format('YYYY-MM-DD') + ' ' + this.startTime, 'YYYY-MM-DD HH:mm')
        const endDate = dayjs(dayjs().format('YYYY-MM-DD') + ' ' + this.endTime, 'YYYY-MM-DD HH:mm')

        createSession(this.selectedGroup.groupId, this.subject, this.room, startDate, endDate, this.selectedTeachers, this.isRecurrent).then((data) => {
          if (data.success) {
            this.teacherList = data.teachers
          }
        })
        this.closeModal()
      }
    }
  }
}
</script>

<style lang="scss">
.create-session .window-body {
  overflow: auto;
}
</style>

<style lang="scss" scoped>

.datetime {
  display: flex;
  align-items: center;

  .datetime-firstlabel {
    margin-right: 15px;
  }
  .datetime-label {
    margin-left: 15px;
    margin-right: 15px;
  }
  .datetime-input {
    width: 80px;
    margin-left: 5px;
    margin-right: 5px;
  }
}

.group, .teachers, .subject, .room, .recurrence {
  margin-top: 10px;
  .group-list {
    margin-left: 10px;
  }
}
</style>

<i18n locale="fr">
{
  "title": "Création de séances",
  "the": "Le",
  "from": "de",
  "to": "à",
  "hour": "h",
  "group": "Groupe",
  "subjectPlaceHolder": "Discipline",
  "teachersPlaceHolder" : "Enseignants",
  "roomPlaceHolder": "Salle",
  "recurrence": "Chaque semaine jusqu'à la fin de l'année scolaire",
  "Create": "Créer",
  "Validation": {
    "day": "Veuillez sélectionner le jour",
    "time": "Veuillez saisir une plage d'horaires valide (hh:mm)",
    "startBeforeAfter": "L'heure de début doit être antérieure à l'heure de fin",
    "group": "Veuillez sélectionner un groupe",
    "teachers" : "Veuillez sélectionner au moins un enseignant",
    "required": "Champ requis"
  }
}
</i18n>
