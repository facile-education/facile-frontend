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
          v-model="startHour"
          class="datetime-input"
        />
        {{ $t('hour') }}
        <PentilaInput
          v-model="startMinute"
          class="datetime-input"
        />
        <p
          class="datetime-label"
        >
          {{ $t('to') }}
        </p>
        <PentilaInput
          v-model="endHour"
          class="datetime-input"
        />
        {{ $t('hour') }}
        <PentilaInput
          v-model="endMinute"
          class="datetime-input"
        />
      </div>
      <PentilaErrorMessage
        :error-message="formErrorList.day"
      />
      <PentilaErrorMessage
        :error-message="formErrorList.hour"
      />
      <PentilaErrorMessage
        :error-message="formErrorList.minute"
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
          display-field="lastName"
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
import { getSchoolTeachers, getGroups, createSession } from '@/api/cdt.service'
import dayjs from 'dayjs'

const teachersRequired = (value, vm) => {
  return value !== undefined && value.length > 0
}

const hourRequired = (value, vm) => {
  return value !== undefined && value >= 0 && value < 24
}

const minuteRequired = (value, vm) => {
  return value !== undefined && value >= 0 && value < 59
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
    startHour: { hourRequired },
    startMinute: { minuteRequired },
    endHour: { hourRequired },
    endMinute: { minuteRequired },
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
      startHour: 8,
      startMinute: 0,
      endHour: 10,
      endMinute: 0,
      isRecurrent: false
    }
  },
  computed: {
    formErrorList () {
      return {
        day: (this.v$.selectedDay.$invalid && this.v$.selectedDay.$dirty) ? this.$t('Validation.day') : '',
        hour: ((this.v$.startHour.$invalid && this.v$.startHour.$dirty) || (this.v$.endHour.$invalid && this.v$.endHour.$dirty)) ? this.$t('Validation.hour') : '',
        minute: ((this.v$.startMinute.$invalid && this.v$.startMinute.$dirty) || (this.v$.endMinute.$invalid && this.v$.endMinute.$dirty)) ? this.$t('Validation.minute') : '',
        group: (this.v$.selectedGroup.$invalid && this.v$.selectedGroup.$dirty) ? this.$t('Validation.group') : '',
        selectedTeachers: (this.v$.selectedTeachers.$invalid && this.v$.selectedTeachers.$dirty) ? this.$t('Validation.teachers') : '',
        subject: (this.v$.subject.$invalid && this.v$.subject.$dirty) ? this.$t('Validation.required') : ''
      }
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
    getSchoolTeachers(this.$store.state.user.selectedSchool.schoolId).then((data) => {
      if (data.success) {
        this.teacherList = data.teachers
      }
    })

    // Get group list from backend
    getGroups(this.$store.state.user.selectedSchool.schoolId).then((data) => {
      if (data.success) {
        this.groupList = data.groups
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
        const startDate = dayjs().day(this.selectedDay.dayNb).hour(this.startHour).minute(this.startMinute)
        const endDate = dayjs().day(this.selectedDay.dayNb).hour(this.endHour).minute(this.endMinute)

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
    width: 60px;
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
  "recurrence": "Chaque semaine jusqu'à la fin de l'année",
  "Create": "Créer",
  "Validation": {
    "day": "Veuillez sélectionner le jour",
    "hour": "L'heure doit être comprise entre 0 et 23",
    "minute": "Les minutes doivent être comprises entre 0 et 59",
    "group": "Veuillez sélectionner un groupe",
    "teachers" : "Veuillez sélectionner au moins un enseignant",
    "required": "Champ requis"
  }
}
</i18n>
