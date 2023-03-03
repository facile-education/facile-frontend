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
      <div class="dates">
        <div class="start-date">
          <div v-t="'startDateLabel'" />
          <CustomDatePicker
            :selected-date="startDate"
            :min-date="minDate"
            :is-required="true"
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
            :is-required="true"
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

      <CKEditor
        v-model="description"
        class="ck-editor"
        :editor="editor"
        :config="editorConfig"
      />
      <PentilaErrorMessage
        :error-message="formErrorList.description"
      />

      <div class="population-selection">
        <PentilaTagsInput
          v-model="populations"
          :placeholder="$t('populationPlaceholder') + '*'"
          :list="availablePopulationsList"
          :close-on-select="true"
          display-field="populationName"
          :disabled="isLoadingEventPopulations"
        />
        <PentilaErrorMessage
          :error-message="formErrorList.populations"
        />
        <PentilaSpinner v-if="isLoadingEventPopulations" />
      </div>

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
import validators from '@utils/validators'
import { useVuelidate } from '@vuelidate/core'
import dayjs from 'dayjs'
import InlineEditor from '@ckeditor/ckeditor5-build-inline'
import { required } from '@vuelidate/validators'
import { getSchoolNewsBroadcastGroups, getNewsDetails, addNews, editNews } from '@/api/news.service'
import { component as CKEditor } from '@ckeditor/ckeditor5-vue'
import CustomDatePicker from '@components/Base/CustomDatePicker.vue'

const inputMaxSize = 75
const ckMaxSize = 63206
const isUnderInputMaxSize = (value) => validators.isUnderMaxSize(value, inputMaxSize)
const isUnderCKMaxSize = (value) => validators.isUnderMaxSize(value, ckMaxSize)
const isNotEmpty = (list) => validators.isNotEmpty(list)
export default {
  name: 'SaveAnnouncementModal',
  components: { CustomDatePicker, CKEditor },
  props: {
    initAnnouncement: {
      type: Object,
      default: undefined
    }
  },
  emits: ['close', 'createAnnouncement', 'updateAnnouncement'],
  setup: () => ({ v$: useVuelidate() }),
  data () {
    return {
      title: '',
      description: '',
      startDate: dayjs(),
      endDate: dayjs(),
      populations: [],
      markAsUnreadForAll: false,

      editor: InlineEditor,
      editorConfig: {
        placeholder: this.$t('descriptionPlaceHolder')
      },
      availablePopulationsList: [],
      isLoadingEventPopulations: false
    }
  },
  validations: {
    title: {
      required,
      isUnderInputMaxSize
    },
    description: {
      isUnderCKMaxSize
    },
    populations: {
      isNotEmpty
    },
    startDate: { // Should be in future (or today)
      required,
      function (value) {
        return value.diff(dayjs().hour(0)) >= 0
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
      return this.initAnnouncement === undefined
    },
    minDate () {
      return dayjs().toDate()
    },
    formErrorList () {
      return {
        title: (this.v$.title.$invalid && this.v$.title.$dirty)
          ? (this.v$.title.$errors[0].$validator === 'required' ? this.$t('Commons.required') : this.$t('sizeLimit1') + inputMaxSize + this.$t('sizeLimit2'))
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
      this.title = this.initAnnouncement.title
      this.description = this.initAnnouncement.description
      this.startDate = dayjs(this.initAnnouncement.startDate)
      this.endDate = dayjs(this.initAnnouncement.endDate)
      this.initPopulations(this.initAnnouncement.newsId)
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
      this.startDate = dayjs(date).hour(0)

      // Update end date if needed
      if (this.startDate.isAfter(this.endDate)) {
        this.endDate = this.startDate
      }
    },
    updateEndDate (date) {
      this.endDate = dayjs(date).hour(0)
    },
    initPopulations (eventId) {
      this.isLoadingEventPopulations = true
      getNewsDetails(eventId).then((data) => {
        this.isLoadingEventPopulations = false
        if (data.success) {
          this.populations = data.populations
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
          this.createAnnouncement()
        } else {
          this.updateAnnouncement()
        }
      }
    },
    createAnnouncement () {
      addNews(this.title, this.description, true, false, 0, this.startDate, this.endDate, this.populations, []).then((data) => {
        if (data.success) {
          this.$emit('createAnnouncement')
          this.onClose()
        } else {
          this.$store.dispatch('popups/pushPopup', { message: this.$t('Popup.error'), type: 'error' })
        }
      })
    },
    updateAnnouncement () {
      editNews(this.initAnnouncement.newsId, this.title, this.description, false, 0, this.startDate, this.endDate, this.populations, [], this.markAsUnreadForAll).then((data) => {
        if (data.success) {
          this.$emit('updateAnnouncement')
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

</style>
