<template>
  <WeprodeWindow
    :modal="true"
    :draggable="true"
    :full-screen="mq.phone || mq.tablet"
    :class="{'create-session': mq.phone}"
    class="create-session-modal"
    data-test="create-session-modal"
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
        <WeprodeDropdown
          v-model="selectedDay"
          class="days-list"
          data-test="day-dropdown"
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
        <WeprodeDropdown
          v-model="selectedSlot"
          class="slots-list"
          :list="slotList"
          data-test="slot-dropdown"
          display-field="slotLabel"
          :sort="false"
          :filtered="false"
        />
      </div>
      <WeprodeErrorMessage
        :error-message="formErrorList.day"
      />
      <WeprodeErrorMessage
        :error-message="formErrorList.time"
      />

      <!-- Groupe -->
      <div
        class="group"
      >
        <span class="label">{{ $t('group') }}</span>
        <WeprodeDropdown
          v-model="selectedGroup"
          class="group-list"
          data-test="group-dropdown"
          :placeholder="$t('group')"
          :list="groupList"
          display-field="groupName"
        />
      </div>
      <WeprodeErrorMessage
        :error-message="formErrorList.group"
      />

      <!-- Subject -->
      <div
        class="subject"
      >
        <span class="label">{{ $t('subject') }}</span>
        <WeprodeDropdown
          v-model="subject"
          class="subject-list"
          data-test="subject-dropdown"
          :list="subjectList"
          display-field="name"
        />
      </div>
      <WeprodeErrorMessage
        :error-message="formErrorList.subject"
      />

      <div
        class="teachers"
      >
        <WeprodeTagsInput
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
        <WeprodeErrorMessage
          :error-message="formErrorList.selectedTeachers"
        />
      </div>

      <!-- Room -->
      <div
        class="room"
      >
        <WeprodeInput
          v-model="room"
          class="room-input"
          :placeholder="$t('roomPlaceHolder')"
        />
        <WeprodeErrorMessage
          :error-message="formErrorList.room"
        />
      </div>

      <!-- Recurrence -->
      <div class="recurrence">
        <WeprodeCheckbox
          v-model="isRecurrent"
          class="checkbox"
          label=""
        />
        {{ $t('recurrence') }}
      </div>
    </template>

    <template #footer>
      <WeprodeButton
        form="createsessionform"
        :label="$t('Create')"
        @click="onCreate"
      />
    </template>
  </WeprodeWindow>
</template>

<script>
import { formatSlot } from '@utils/commons.util'
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'

import { getUserGroups } from '@/api/groups.service'
import { createSession, getSchoolSlotConfiguration } from '@/api/schedule.service'
import { getSubjects } from '@/api/userManagement.service'
import { getSchoolTeachers } from '@/api/userSearch.service'
import WeprodeButton from '@/components/Base/Weprode/WeprodeButton.vue'
import WeprodeCheckbox from '@/components/Base/Weprode/WeprodeCheckbox.vue'
import WeprodeDropdown from '@/components/Base/Weprode/WeprodeDropdown.vue'
import WeprodeErrorMessage from '@/components/Base/Weprode/WeprodeErrorMessage.vue'
import WeprodeInput from '@/components/Base/Weprode/WeprodeInput.vue'
import WeprodeTagsInput from '@/components/Base/Weprode/WeprodeTagsInput.vue'
import WeprodeWindow from '@/components/Base/Weprode/WeprodeWindow.vue'

const teachersRequired = (value) => {
  return value !== undefined && value.length > 0
}

export default {
  name: 'SessionTeacherModal',
  components: { WeprodeButton, WeprodeCheckbox, WeprodeDropdown, WeprodeErrorMessage, WeprodeInput, WeprodeTagsInput, WeprodeWindow },
  inject: ['mq'],
  emits: ['close'],
  setup: () => ({ v$: useVuelidate() }),
  validations: {
    selectedGroup: { required },
    selectedDay: { required },
    selectedTeachers: { teachersRequired },
    subject: { required },
    room: { required }
  },
  data () {
    return {
      teacherList: [],
      selectedTeachers: [],
      groupList: [],
      dayList: [],
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
        subject: (this.v$.subject.$invalid && this.v$.subject.$dirty) ? this.$t('Validation.required') : '',
        room: (this.v$.room.$invalid && this.v$.room.$dirty) ? this.$t('Validation.required') : ''
      }
    }
  },
  created () {
    this.daysList = [
      { dayNb: 1, dayName: 'lundi' },
      { dayNb: 2, dayName: 'mardi' },
      { dayNb: 3, dayName: 'mercredi' },
      { dayNb: 4, dayName: 'jeudi' },
      { dayNb: 5, dayName: 'vendredi' },
      { dayNb: 6, dayName: 'samedi' }
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
        this.slotList.forEach((slot) => { formatSlot(slot) })
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
    closeModal () {
      this.$store.dispatch('horaires/setCreateSessionModalDisplayed', false)
      this.$emit('close', true)
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
            this.$store.dispatch('horaires/getGroupSessions')
          }
        })
        this.closeModal()
      }
    }
  }
}
</script>

<style lang="scss">
.create-session-modal .window-body {
  overflow: visible !important;
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
