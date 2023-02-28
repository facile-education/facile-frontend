<template>
  <PentilaWindow
    class="update-diary-event-modal"
    data-test="update-diary-event-modal"
    :modal="true"
    :draggable="true"
    @close="onClose"
  >
    <template #header>
      <span v-t="isCreation ? 'creationTitle' : 'updateTitle'" />
    </template>

    <template #body>
      <div class="population-selection">
        <PentilaTagsInput
          v-model="populations"
          :placeholder="$t('populationPlaceholder') + '*'"
          :list="groupsList"
          :close-on-select="true"
          display-field="groupName"
        />
        <PentilaErrorMessage
          :error-message="formErrorList.populations"
        />
      </div>

      <div class="dates">
        <div class="start-date">
          <div v-t="'startDateLabel'" />
          <CustomDatePicker
            :selected-date="startDate"
            :min-date="minDate"
            :with-hours="true"
            :is-required="true"
            :minute-increment="15"
            @selectDate="updateStartDate"
          />
        </div>
        <div class="end-date">
          <div v-t="'endDateLabel'" />
          <CustomDatePicker
            :selected-date="endDate"
            :min-date="startDate.toDate()"
            :with-hours="true"
            :is-required="true"
            :minute-increment="15"
            @selectDate="updateEndDate"
          />
          <PentilaErrorMessage
            :error-message="formErrorList.endDate"
          />
        </div>
      </div>

      <div class="input">
        <PentilaInput
          ref="nameInput"
          v-model="title"
          :placeholder="$t('namePlaceHolder') + '*'"
        />
        <PentilaErrorMessage
          :error-message="formErrorList.title"
        />
      </div>

      <div class="input">
        <PentilaInput
          v-model="location"
          :placeholder="$t('locationPlaceHolder')"
        />
        <PentilaErrorMessage
          :error-message="formErrorList.location"
        />
      </div>

      <CKEditor
        v-model="description"
        class="ck-editor"
        :editor="editor"
        :config="editorConfig"
      />
      <PentilaErrorMessage
        :error-message="formErrorList.description"
      />
    </template>

    <template #footer>
      <PentilaButton
        data-test="submitButton"
        :label="isCreation? $t('creationSubmit') : $t('updateSubmit')"
        @click="submit"
      />
    </template>
  </PentilaWindow>
</template>

<script>
import InlineEditor from '@ckeditor/ckeditor5-build-inline'
import { component as CKEditor } from '@ckeditor/ckeditor5-vue'
import { createEvent, modifyEvent } from '@/api/dashboard/agenda.service'
import dayjs from 'dayjs'
import CustomDatePicker from '@components/Base/CustomDatePicker.vue'
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import validators from '@utils/validators'
import { getSchoolNewsBroadcastGroups } from '@/api/news.service'
const inputMaxSize = 75
const ckMaxSize = 63206
const isUnderInputMaxSize = (value) => validators.isUnderMaxSize(value, inputMaxSize)
const isUnderCKMaxSize = (value) => validators.isUnderMaxSize(value, ckMaxSize)
const isNotEmpty = (list) => validators.isNotEmpty(list)

export default {
  name: 'SaveDiaryEventModal',
  components: { CustomDatePicker, CKEditor },
  props: {
    initEvent: {
      type: Object,
      default: undefined
    }
  },
  emits: ['close', 'createEvent', 'updateEvent'],
  setup: () => ({ v$: useVuelidate() }),
  data () {
    return {
      title: '',
      location: '',
      description: '',
      startDate: dayjs().add(1, 'hour').minute(0),
      endDate: dayjs().add(1, 'hour').minute(0),
      populations: [],

      editor: InlineEditor,
      editorConfig: {
        placeholder: this.$t('descriptionPlaceHolder')
      },
      groupsList: []
    }
  },
  validations: {
    title: {
      required,
      isUnderInputMaxSize
    },
    location: {
      isUnderInputMaxSize
    },
    description: {
      isUnderCKMaxSize
    },
    populations: {
      isNotEmpty
    },
    endDate: {
      function (value) {
        return value.diff(this.startDate) >= 0
      }
    }
  },
  computed: {
    isCreation () {
      return this.initEvent === undefined
    },
    minDate () {
      return dayjs().toDate()
    },
    formErrorList () {
      return {
        title: (this.v$.title.$invalid && this.v$.title.$dirty)
          ? (this.v$.title.$errors[0].$validator === 'required' ? this.$t('Commons.required') : this.$t('sizeLimit1') + inputMaxSize + this.$t('sizeLimit2'))
          : '',
        location: (this.v$.location.$invalid && this.v$.location.$dirty)
          ? this.$t('sizeLimit1') + inputMaxSize + this.$t('sizeLimit2')
          : '',
        description: (this.v$.description.$invalid && this.v$.description.$dirty)
          ? this.$t('sizeLimit1') + ckMaxSize + this.$t('sizeLimit2')
          : '',
        populations: (this.v$.populations.$invalid && this.v$.populations.$dirty)
          ? this.$t('selectPopulations')
          : '',
        endDate: (this.v$.endDate.$invalid && this.v$.endDate.$dirty)
          ? this.$t('dateOrder')
          : ''
      }
    }
  },
  created () {
    this.$store.dispatch('misc/incrementModalCount')
    if (!this.isCreation) {
      this.title = this.initEvent.title
      this.description = this.initEvent.title
      this.location = this.initEvent.location
      this.startDate = this.initEvent.startDate
      this.endDate = this.initEvent.endDate
    }
    this.getBroadcastGroups()
  },
  mounted () {
    const input = this.$refs.nameInput
    input.focus()
    input.select()
  },
  methods: {
    updateStartDate (date) {
      this.startDate = dayjs(date)

      // Update end date if needed
      if (this.startDate.isAfter(this.endDate)) {
        this.endDate = this.startDate
      }
    },
    updateEndDate (date) {
      this.endDate = dayjs(date)
    },
    getBroadcastGroups () {
      getSchoolNewsBroadcastGroups().then((data) => {
        if (data.success) {
          // Concat all groups of all schools in one list
          this.groupsList = []
          const schools = data.schoolsGroups
          schools.forEach((school) => {
            this.groupsList = [...this.groupsList, ...school.Classes]
            this.groupsList = [...this.groupsList, ...school.Volees]
            this.groupsList = [...this.groupsList, ...school.populations]
          })
        } else {
          console.error('Error')
        }
      })
    },
    submit () {
      if (this.v$.$invalid) {
        this.v$.$touch()
      } else {
        if (this.isCreation) {
          this.createEvent()
        } else {
          this.updateEvent()
        }
      }
    },
    createEvent () {
      createEvent(this.title, this.description, this.location, this.startDate, this.endDate, this.populations).then((data) => {
        if (data.success) {
          this.$emit('createEvent')
          this.onClose()
        } else {
          this.$store.dispatch('popups/pushPopup', { message: this.$t('Popup.error'), type: 'error' })
        }
      })
    },
    updateEvent () {
      modifyEvent(this.initEvent.eventId, this.title, this.description, this.location, this.startDate, this.endDate, this.populations).then((data) => {
        if (data.success) {
          this.$emit('updateEvent')
          this.onClose()
        } else {
          this.$store.dispatch('popups/pushPopup', { message: this.$t('Popup.error'), type: 'error' })
        }
      })
    },
    onClose () {
      this.$store.dispatch('misc/decreaseModalCount')
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

.ck-editor {
  border: 1px solid black;
  max-height: 30vh;
  overflow-y: auto;
}

.population-selection, .input {
  margin-bottom: 20px;
}

@media screen and (min-width: 700px) {
  .dates {
    display: flex;
  }

  .start-date, .end-date {
    flex: 1;
  }
}

.start-date, .end-date {
  color: $color-new-light-text;
  margin-bottom: 15px;
}
</style>

<i18n locale="fr">
{
  "creationTitle": "Ajouter un événement",
  "updateTitle": "Modifier l'événement",
  "namePlaceHolder": "Titre",
  "locationPlaceHolder": "Lieu",
  "startDateLabel": "Date / heure événement",
  "endDateLabel": "Date / heure de fin d'événement",
  "descriptionPlaceHolder": "Description",
  "populationPlaceholder": "Population cible",
  "creationSubmit": "Créer",
  "updateSubmit": "Modifier",
  "sizeLimit1": "Ne doit pas dépasser ",
  "sizeLimit2": " caractères",
  "selectPopulations": "Veuillez séléctionner une population cible",
  "dateOrder": "La date de fin doit être postérieure ou égale à celle de début"
}
</i18n>
