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
          :list="availablePopulationsList"
          :close-on-select="true"
          display-field="populationName"
          :disabled="isLoadingEventDetails"
        />
        <PentilaErrorMessage
          :error-message="formErrorList.populations"
        />
        <PentilaSpinner v-if="isLoadingEventDetails" />
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
            :disabled="isStartDateDisabled"
            @selectDate="updateStartDate"
          />
          <PentilaErrorMessage
            :error-message="formErrorList.startDate"
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
            :disabled="isEndDateDisabled"
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

      <div
        v-if="!isCreation"
        class="unread-checkbox"
      >
        <PentilaCheckbox
          v-model="markAsUnreadForAll"
          :label="$t('markAsUnreadForAll')"
        />
      </div>
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
import { createEvent, modifyEvent, getEventDetails } from '@/api/dashboard/agenda.service'
import dayjs from 'dayjs'
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import validators from '@utils/validators'
import { getSchoolNewsBroadcastGroups } from '@/api/dashboard/news.service'
import { defineAsyncComponent } from 'vue'
import CustomDatePicker from '@components/Base/CustomDatePicker.vue' // TODO: Check time and optimise if necessary
import InlineEditor from '@ckeditor/ckeditor5-build-inline'
// const CustomDatePicker = defineAsyncComponent(() => import('@/components/Base/CustomDatePicker.vue'))
// const InlineEditor = defineAsyncComponent(() => import('@ckeditor/ckeditor5-build-inline'))
const CKEditor = defineAsyncComponent({
  loader: async () => { return (await import('@ckeditor/ckeditor5-vue')).component }
  // loadingComponent: CKLoadingPlaceholder // TODO: CKLoadingPlaceholder with same size and spinner
})
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
      startDate: dayjs(),
      endDate: dayjs().add(1, 'hour').minute(0),
      populations: [],
      markAsUnreadForAll: false,

      editor: InlineEditor,
      editorConfig: {
        placeholder: this.$t('descriptionPlaceHolder')
      },
      availablePopulationsList: [],
      isLoadingEventDetails: false,
      isMounted: false,
      timer: undefined,
      isStartDateDisabled: false,
      isEndDateDisabled: false
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
    startDate: { // Should be in future or today (or whatever if the start date as already began)
      required,
      function (value) {
        return this.isStartDateDisabled ? true : value.diff(dayjs().hour(0)) >= 0
      }
    },
    endDate: { // Should be > startDate
      required,
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
        startDate: (this.v$.startDate.$invalid && this.v$.startDate.$dirty)
          ? this.$t('dateInPast')
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
      this.location = this.initEvent.location
      this.startDate = dayjs(this.initEvent.startDate)
      if (this.startDate.isBefore(dayjs().hour(0))) { // If event has already began (for more that one day), cannot modify the start date
        this.isStartDateDisabled = true
      }
      this.endDate = dayjs(this.initEvent.endDate)
      if (this.endDate.isBefore(dayjs().hour(0))) { // If event is already finished (for more that one day), cannot modify the end date
        this.isEndDateDisabled = true
      }
      this.initDetails(this.initEvent.eventId)
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
    initDetails (eventId) {
      this.isLoadingEventDetails = true
      getEventDetails(eventId).then((data) => {
        this.isLoadingEventDetails = false
        if (data.success) {
          this.populations = data.populations
          this.description = data.description
        } else {
          console.error('Error')
        }
      })
    },
    getBroadcastGroups () {
      getSchoolNewsBroadcastGroups().then((data) => {
        if (data.success) {
          // Concat all populations of all schools in one list
          this.availablePopulationsList = []
          const schools = data.schoolsGroups
          schools.forEach((school) => {
            this.availablePopulationsList = [...this.availablePopulationsList, ...school.populations]
            school.Classes.forEach((schoolClass) => {
              this.availablePopulationsList = [...this.availablePopulationsList, ...schoolClass.populations]
            })
            school.Volees.forEach((schoolVolee) => {
              this.availablePopulationsList = [...this.availablePopulationsList, ...schoolVolee.populations]
            })
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
      modifyEvent(this.initEvent.eventId, this.title, this.description, this.location, this.startDate, this.endDate, this.populations, this.markAsUnreadForAll).then((data) => {
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

<style lang="scss">
.update-diary-event-modal {
  .window-body {
    overflow-y: auto;
  }
}
</style>

<style lang="scss" scoped>
@import "@design";

.ck-editor {
  @extend %inline-modal-ck;
}

.population-selection, .input {
  margin-bottom: 20px;
}

.unread-checkbox {
  margin-top: 20px;
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
  "markAsUnreadForAll": "Forcer cet événement à 'non lu' pour tous",
  "creationSubmit": "Créer",
  "updateSubmit": "Modifier",
  "sizeLimit1": "Ne doit pas dépasser ",
  "sizeLimit2": " caractères",
  "selectPopulations": "Veuillez séléctionner une population cible",
  "dateInPast": "La date de début ne doit pas se situer dans le passé",
  "dateOrder": "La date de fin doit être postérieure ou égale à celle de début"
}
</i18n>
