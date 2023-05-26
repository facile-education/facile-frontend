<template>
  <PentilaWindow
    class="update-news-modal"
    data-test="update-news-modal"
    :modal="true"
    :draggable="true"
    @close="onClose"
  >
    <template #header>
      <span v-t="isCreation ? 'creationTitle' : 'updateTitle'" />
    </template>

    <template #body>
      <PentilaSpinner
        v-if="isProcessingSave"
        class="save-spinner"
      />
      <div class="first-line">
        <div class="image-picker">
          <img
            :src="thumbnailUrl"
            alt="thumbnail"
          >
        </div>

        <div class="right-section">
          <div class="release-date">
            <div v-t="'releaseDateLabel'" />
            <CustomDatePicker
              :selected-date="releaseDate"
              :min-date="minDate"
              :with-hours="true"
              :is-required="true"
              :minute-increment="15"
              :disabled="isReleaseDateDisabled"
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
      </div>

      <div class="population-selection">
        <PentilaTagsInput
          v-model="populations"
          :placeholder="$t('populationPlaceholder') + '*'"
          :list="availablePopulationsList"
          :close-on-select="true"
          display-field="populationName"
          :disabled="isLoadingNewsDetails"
        />
        <PentilaErrorMessage
          :error-message="formErrorList.populations"
        />
        <PentilaSpinner v-if="isLoadingNewsDetails" />
      </div>

      <CKEditor
        v-model="content"
        class="ck-editor"
        :editor="editor"
        :config="editorConfig"
      />
      <PentilaErrorMessage
        :error-message="formErrorList.content"
      />

      <AttachedFiles
        v-model="attachedFiles"
        :read-only="false"
        @removeAttachedFile="removeFile"
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

  <teleport to="body">
    <FilePickerModal
      v-if="isFilePickerDisplayed"
      :multi-selection="true"
      :allow-files-from-device="true"
      @addedFiles="attachNewFiles"
      @close="isFilePickerDisplayed = false"
    />
  </teleport>
</template>

<script>
import validators from '@utils/validators'
import { useVuelidate } from '@vuelidate/core'
import dayjs from 'dayjs'
import InlineEditor from '@ckeditor/ckeditor5-build-inline'
import { required } from '@vuelidate/validators'
import CustomDatePicker from '@components/Base/CustomDatePicker.vue'
import AttachedFiles from '@components/Base/AttachedFiles.vue'
import { defineAsyncComponent } from 'vue'
import {
  addNews,
  editNews,
  getGroupNewsBroadcastGroups,
  getNewsDetails
} from '@/api/dashboard/news.service'
const FilePickerModal = defineAsyncComponent(() => import('@components/FilePicker/FilePickerModal.vue'))
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
  name: 'SaveNewsModal',
  components: { AttachedFiles, FilePickerModal, CustomDatePicker, CKEditor },
  props: {
    initNews: {
      type: Object,
      default: undefined
    }
  },
  emits: ['close', 'createNews', 'updateNews'],
  setup: () => ({ v$: useVuelidate() }),
  data () {
    return {
      title: '',
      content: '',
      releaseDate: dayjs(),
      populations: [],
      attachedFiles: [],
      thumbnailUrl: require('@/assets/images/default_news_0.png'),

      editor: InlineEditor,
      editorConfig: {
        placeholder: this.$t('contentPlaceHolder')
      },
      availablePopulationsList: [],
      isReleaseDateDisabled: false,
      isLoadingNewsDetails: false,
      isProcessingSave: false,
      isFilePickerDisplayed: false
    }
  },
  validations: {
    title: {
      required,
      isUnderInputMaxSize
    },
    content: {
      isUnderCKMaxSize
    },
    populations: {
      isNotEmpty
    },
    releaseDate: { // Should be in future or today (or whatever if it's already past)
      required,
      function (value) {
        return this.isReleaseDateDisabled ? true : value.diff(dayjs().hour(0)) >= 0
      }
    }
  },
  computed: {
    isCreation () {
      return this.initNews === undefined
    },
    minDate () {
      return dayjs().toDate()
    },
    formErrorList () {
      return {
        title: (this.v$.title.$invalid && this.v$.title.$dirty)
          ? (this.v$.title.$errors[0].$validator === 'required' ? this.$t('Commons.required') : this.$t('sizeLimit1') + inputMaxSize + this.$t('sizeLimit2'))
          : '',
        content: (this.v$.content.$invalid && this.v$.content.$dirty)
          ? this.$t('sizeLimit1') + ckMaxSize + this.$t('sizeLimit2')
          : '',
        populations: (this.v$.populations.$invalid && this.v$.populations.$dirty)
          ? this.$t('selectPopulations')
          : '',
        releaseDate: (this.v$.releaseDate.$invalid && this.v$.releaseDate.$dirty)
          ? this.$t('dateInPast')
          : ''
      }
    },
    attachedFileIds () {
      return this.attachedFiles.map(attachedFile => attachedFile.id)
    }
  },
  created () {
    this.$store.dispatch('misc/incrementModalCount')
    if (!this.isCreation) {
      this.title = this.initNews.title
      this.content = this.initNews.content
      this.releaseDate = dayjs(this.initNews.publicationDate)
      if (this.releaseDate.isBefore(dayjs().hour(0))) { // If News is already release (for more that one day), cannot modify the release date
        this.isReleaseDateDisabled = true
      }
      this.initDetails(this.initNews.newsId)
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
    attachNewFiles (selectedFiles) {
      this.attachedFiles = [...this.attachedFiles, ...selectedFiles]
    },
    removeFile (file) {
      const fileIndex = this.attachedFiles.map(attachFile => attachFile.id).indexOf(file.id)
      if (fileIndex !== -1) {
        this.attachedFiles.splice(fileIndex, 1)
      } else {
        console.error('Cannot remove attached file', file)
      }
    },
    initDetails (newsId) {
      this.isLoadingNewsDetails = true
      getNewsDetails(newsId).then((data) => {
        this.isLoadingNewsDetails = false
        if (data.success) {
          this.populations = data.news.populations
          this.content = data.news.content
          this.attachedFiles = data.news.attachedFiles
        } else {
          console.error('Error')
        }
      })
    },
    getBroadcastGroups () {
      getGroupNewsBroadcastGroups().then((data) => {
        if (data.success) {
          // Concat all populations of all schools in one list
          this.availablePopulationsList = []
          const groupTree = data.schoolsGroups
          this.availablePopulationsList = [...this.availablePopulationsList, ...groupTree.Communities]
          groupTree.schools.forEach((school) => {
            // TODO: courses?
            if (school.subjects) {
              this.availablePopulationsList = [...this.availablePopulationsList, ...school.subjects]
            }
            if (school.classes) {
              school.classes.forEach((schoolClass) => {
                // this.availablePopulationsList = [...this.availablePopulationsList, ...schoolClass.populations]
              })
            }
            if (school.volees) {
              school.volees.forEach((schoolVolee) => {
                // this.availablePopulationsList = [...this.availablePopulationsList, ...schoolVolee.populations]
              })
            }
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
          this.createNews()
        } else {
          this.updateNews()
        }
      }
    },
    createNews () {
      this.isProcessingSave = true
      addNews(this.title, this.content, false, false, 0, this.releaseDate, this.populations, this.attachedFileIds).then((data) => {
        this.isProcessingSave = false
        if (data.success) {
          this.$emit('createNews')
          this.onClose()
        } else {
          this.$store.dispatch('popups/pushPopup', { message: this.$t('Popup.error'), type: 'error' })
        }
      })
    },
    updateNews () {
      this.isProcessingSave = true
      editNews(this.initNews.newsId, this.title, this.content, false, 0, this.releaseDate, this.populations, this.attachedFileIds, false).then((data) => {
        this.isProcessingSave = false
        if (data.success) {
          this.$emit('updateNews')
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
.update-news-modal {
  .window-body {
    position: relative;
    overflow-y: auto;
    max-height: 70vh !important;
  }
}
</style>

<style lang="scss" scoped>
@import "@design";

.save-spinner {
  z-index: 100;
}

.image-picker {
  height: 131px;
  width: 100px;
  margin-right: 20px;
  margin-bottom: 20px;
  background-color: #01d801;
}

.release-date {
  color: $color-new-light-text;
}

.population-selection {
  position: relative;
}

.title, .population-selection, .release-date {
  margin-bottom: 20px;
}

.ck-editor {
  @extend %inline-modal-ck;
  margin-bottom: 15px;
}

.add-content-button {
  border: 1px solid transparent;
  border-radius: 5px;
  padding: 7px;
  margin: 5px;
  background-color: transparent;

  &:hover {
    background-color: $color-hover-bg;
    cursor: pointer;
  }
}

.unread-checkbox {
  display: flex;
  align-items: center;
  margin-top: 20px;

  span {
    margin-right: 1em;
  }
}

@media screen and (min-width: 700px) {
  .first-line {
    display: flex;

    .right-section {
      flex: 1;
    }
  }
}
</style>

<i18n locale="fr">
{
  "creationTitle": "Partager une information",
  "updateTitle": "Modifier une information",
  "releaseDateLabel": "Parution",
  "namePlaceHolder": "Titre",
  "contentPlaceHolder": "Description",
  "populationPlaceholder": "Destinataires",
  "addFile": "Ajouter un fichier",
  "creationSubmit": "Créer",
  "updateSubmit": "Modifier",
  "sizeLimit1": "Ne doit pas dépasser ",
  "sizeLimit2": " caractères",
  "selectPopulations": "Veuillez séléctionner une population cible",
  "dateInPast": "La date de parution ne doit pas se situer dans le passé"
}
</i18n>
