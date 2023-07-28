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
          :sort="false"
          :filtered="false"
        />
        <p
          class="datetime-label"
        >
          {{ $t('in') }}
        </p>
        <PentilaDropdown
          v-model="selectedSlot"
          class="slots-list"
          :list="slotList"
          display-field="slotLabel"
          :sort="false"
          :filtered="false"
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
        <span class="label">{{ $t('group') }}</span>
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

      <!-- Subject -->
      <div
        class="subject"
      >
        <span class="label">{{ $t('subject') }}</span>
        <PentilaDropdown
          v-model="subject"
          class="subject-list"
          :list="subjectList"
          display-field="name"
        />
      </div>
      <PentilaErrorMessage
        :error-message="formErrorList.subject"
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
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import dayjs from 'dayjs'

import { getUserGroups } from '@/api/groups.service'
import { createSession, getSchoolSlotConfiguration } from '@/api/schedule.service'
import { getSubjects } from '@/api/userManagement.service'
import { getSchoolTeachers } from '@/api/userSearch.service'

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
      subjectList: [],
      subject: '',
      slotList: [],
      selectedSlot: '',
      selectedDay: {},
      isRecurrent: false
    }
  },
  computed: {
    formErrorList () {
      return {
        day: (this.v$.selectedDay.$invalid && this.v$.selectedDay.$dirty) ? this.$t('Validation.day') : '',
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
      { dayNb: 6, dayName: 'Samedi' }
    ]
    this.selectedDay = this.daysList[0]

    // Get teacher list from backend
    this.teacherList.length = 0
    getSchoolTeachers(this.$store.state.user.selectedSchool.schoolId).then((data) => {
      if (data.success) {
        this.teacherList = data.teachers
        // Pre-select if teacher is selected in main panel
        if (this.$store.state.horaires.selectedUser && this.$store.state.horaires.selectedUser.userId !== 0 && this.$store.state.horaires.selectedUser.isTeacher) {
          this.selectedTeachers.push(this.$store.state.horaires.selectedUser)
        }
      }
    })

    // Get subject list from backend
    this.subjectList.length = 0
    getSubjects().then((data) => {
      if (data.success) {
        this.subjectList = data.subjects
        // Pre-select first subject
        this.subject = this.subjectList[0]
      }
    })

    // Get slot list from backend
    this.slotList.length = 0
    getSchoolSlotConfiguration(this.$store.state.user.selectedSchool.schoolId).then((data) => {
      if (data.success) {
        this.slotList = data.configuration
        this.slotList.forEach((slot) => { this.formatSlot(slot) })
        // Pre-select first slot
        this.selectedSlot = this.slotList[0]
      }
    })

    getUserGroups(this.$store.state.user.selectedSchool.schoolId, true, true, true).then((data) => {
      if (data.success) {
        this.groupList = this.groupList.concat(data.groups)
        // Pre-select current group if any
        if (this.$store.state.horaires.selectedGroup && this.$store.state.horaires.selectedGroup.groupId !== 0) {
          this.selectedGroup = this.$store.state.horaires.selectedGroup
        } else {
          this.selectedGroup = data.groups[0]
        }
      }
    })
  },
  methods: {
    formatSlot (slot) {
      slot.slotLabel = 'P' + slot.slotNumber + ' (' + slot.slotStartHour + ' / ' + slot.slotEndHour + ')'
    },
    closeModal () {
      this.$store.dispatch('horaires/setCreateSessionModalDisplayed', false)
    },
    onCreate (e) {
      e.preventDefault()
      if (this.v$.$invalid) {
        this.v$.$touch()
      } else {
        createSession(this.selectedGroup.groupId, this.subject.name, this.room, this.selectedDay.dayNb, this.selectedSlot.slotNumber, this.selectedSlot.slotStartHour, this.selectedSlot.slotEndHour, this.selectedTeachers, this.isRecurrent).then((data) => {
          if (data.success) {
            this.teacherList = data.teachers
            // Select the group of the created session, in the main panel
            this.$store.dispatch('horaires/setSelectedGroup', this.selectedGroup)
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
  .group-list, .subject-list {
    margin-left: 10px;
  }
  .label {
    display: inline-block;
    width: 130px;
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
  "in": "au créneau",
  "group": "Classe / Groupe",
  "subject": "Discipline",
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
