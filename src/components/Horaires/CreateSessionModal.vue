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
        class="teachers-error"
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
        class="subject-error"
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
import { useVuelidate } from '@vuelidate/core'
import { getSchoolTeachers, getGroups, createSession } from '@/api/cdt.service'
import dayjs from 'dayjs'

const teachersRequired = (value, vm) => {
  console.log('validating teachers', value)
  return value !== undefined && value.length > 0
}

const subjectRequired = (value, vm) => {
  console.log('validating subject', value)
  return value !== undefined && value !== ''
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
    selectedTeachers: { teachersRequired },
    subject: { subjectRequired }
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
        selectedTeachers: this.$t('Commons.required'),
        subject: (this.subject.$invalid && this.subject.$dirty) ? this.$t('Commons.required') : ''
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
        console.log('form is invalid')
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
  "Create": "Créer"
}
</i18n>
