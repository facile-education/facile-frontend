<template>
  <PentilaWindow
    class="update-announcement-modal"
    data-test="update-announcement-modal"
    :modal="true"
    :draggable="true"
    @close="onClose"
  >
    <template #header>
      <span v-t="isCreation ? 'creationTitle' : 'updateTitle'" />
    </template>

    <template #body>
      <div class="first-line">
        <div class="image-picker">
          <img
            :src="thumbnailUrl"
            alt="thumbnail"
          >
        </div>

        <div class="release-date">
          <div v-t="'releaseDateLabel'" />
          <CustomDatePicker
            :selected-date="releaseDate"
            :min-date="minDate"
            :with-hours="true"
            :is-required="true"
            :minute-increment="15"
            @selectDate="updateReleaseDate"
          />
          <PentilaErrorMessage
            :error-message="formErrorList.releaseDate"
          />
        </div>

        <div class="title">
          <PentilaInput
            ref="nameInput"
            v-model="title"
            :placeholder="$t('namePlaceHolder') + '*'"
          />
          <PentilaErrorMessage
            :error-message="formErrorList.title"
          />
        </div>
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
          :disabled="isLoadingAnnouncementPopulations"
        />
        <PentilaErrorMessage
          :error-message="formErrorList.populations"
        />
        <PentilaSpinner v-if="isLoadingAnnouncementPopulations" />
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
      releaseDate: dayjs(),
      populations: [],
      markAsUnreadForAll: false,

      editor: InlineEditor,
      editorConfig: {
        placeholder: this.$t('descriptionPlaceHolder')
      },
      availablePopulationsList: [],
      isLoadingAnnouncementPopulations: false
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
    releaseDate: { // Should be in future or today
      required,
      function (value) {
        return value.diff(dayjs().hour(0)) >= 0
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
        releaseDate: (this.v$.releaseDate.$invalid && this.v$.releaseDate.$dirty)
          ? this.$t('dateInPast')
          : ''
      }
    }
  },
  created () {
    this.$store.dispatch('misc/incrementModalCount')
    if (!this.isCreation) {
      this.title = this.initAnnouncement.title
      this.description = this.initAnnouncement.content
      this.releaseDate = dayjs(this.initAnnouncement.publicationDate)
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
    updateReleaseDate (date) {
      this.releaseDate = dayjs(date)
    },
    initPopulations (newsId) {
      this.isLoadingAnnouncementPopulations = true
      getNewsDetails(newsId).then((data) => {
        this.isLoadingAnnouncementPopulations = false
        if (data.success) {
          this.populations = data.news.populations
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
      addNews(this.title, this.description, true, false, 0, this.releaseDate, this.populations, []).then((data) => {
        if (data.success) {
          this.$emit('createAnnouncement')
          this.onClose()
        } else {
          this.$store.dispatch('popups/pushPopup', { message: this.$t('Popup.error'), type: 'error' })
        }
      })
    },
    updateAnnouncement () {
      editNews(this.initAnnouncement.newsId, this.title, this.description, false, 0, this.releaseDate, this.populations, [], this.markAsUnreadForAll).then((data) => {
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
@import "@design";

.image-picker {
  height: 199px;
  width: 140px;
  margin-bottom: 20px;
}

.release-date {
  color: $color-new-light-text;
  margin-bottom: 15px;
}

.population-selection {
  position: relative;
}

.title, .population-selection {
  margin-bottom: 20px;
}

.ck-editor {
  border: 1px solid black;
  max-height: 30vh;
  overflow-y: auto;
  margin-bottom: 20px;
}

.unread-checkbox {
  margin-top: 20px;
}
</style>

<i18n locale="fr">
{
  "creationTitle": "Créer une annonce",
  "updateTitle": "Modifier une annonce",
  "releaseDateLabel": "Parution",
  "namePlaceHolder": "Titre",
  "descriptionPlaceHolder": "Description",
  "populationPlaceholder": "Population cible",
  "markAsUnreadForAll": "Forcer cet événement à 'non lu' pour tous",
  "creationSubmit": "Créer",
  "updateSubmit": "Modifier",
  "sizeLimit1": "Ne doit pas dépasser ",
  "sizeLimit2": " caractères",
  "selectPopulations": "Veuillez séléctionner une population cible",
  "dateInPast": "La date de parution ne doit pas se situer dans le passé"
}
</i18n>
