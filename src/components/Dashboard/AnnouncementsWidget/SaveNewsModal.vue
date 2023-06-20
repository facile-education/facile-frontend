<template>
  <PentilaWindow
    class="update-news-modal"
    data-test="update-news-modal"
    :modal="true"
    :draggable="true"
    @close="confirmClosure"
  >
    <template #header>
      <span v-t="isCreation ? (isSchoolNews ? 'schoolCreationTitle' : 'creationTitle') : (isSchoolNews ? 'schoolUpdateTitle' : 'updateTitle')" />
    </template>

    <template #body>
      <PentilaSpinner
        v-if="isProcessingSave"
        class="save-spinner"
      />
      <div class="first-line">
        <ThumbnailSelector
          :thumbnail-url="thumbnail"
          @selectImage="selectImage"
        />

        <div
          v-if="!mq.phone && !mq.tablet"
          class="population-selection"
        >
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

      <div
        v-if="mq.phone || mq.tablet"
        class="population-selection"
      >
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
        :max-height="mq.phone ? '120px' : '300px'"
        @removeAttachedFile="removeFile"
      />

      <div
        v-if="isSchoolNews && !isCreation"
        class="unread-checkbox"
      >
        <span v-t="'markAsUnreadForAll'" />
        <PentilaToggleSwitch
          v-model="markAsUnreadForAll"
        />
        <InformationIcon
          class="info"
          :text="$t('switchHelp')"
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

  <teleport
    v-if="isFilePickerDisplayed"
    to="body"
  >
    <FilePickerModal
      :multi-selection="true"
      :allow-files-from-device="true"
      @addedFiles="attachNewFiles"
      @close="isFilePickerDisplayed = false"
    />
  </teleport>
</template>

<script>
import InlineEditor from '@ckeditor/ckeditor5-build-inline'
import AttachedFiles from '@components/AttachedFiles/AttachedFiles.vue'
import CustomDatePicker from '@components/Base/CustomDatePicker.vue'
import ImagePicker from '@components/Nero/ImagePicker.vue'
import validators from '@utils/validators'
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import dayjs from 'dayjs'
import { defineAsyncComponent } from 'vue'

import {
  addNews,
  editNews,
  getGroupNewsBroadcastGroups,
  getNewsDetails, getSchoolNewsBroadcastGroups
} from '@/api/dashboard/news.service'
import { defaultImagesKeys } from '@/constants/icons'
import ThumbnailSelector from '@components/Base/ThumbnailSelector.vue'
import InformationIcon from '@components/Base/InformationIcon.vue'
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
  components: { InformationIcon, ThumbnailSelector, AttachedFiles, FilePickerModal, CustomDatePicker, CKEditor },
  inject: ['mq'],
  props: {
    initNews: {
      type: Object,
      default: undefined
    },
    isSchoolNews: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close', 'create', 'update'],
  setup: () => ({ v$: useVuelidate() }),
  data () {
    return {
      title: '',
      content: '',
      releaseDate: dayjs(),
      populations: [],
      thumbnailId: 0,
      thumbnailUrl: this.isSchoolNews ? 'default_school_news_0' : 'default_news_0',
      attachedFiles: [],
      markAsUnreadForAll: false,

      initialForm: undefined,

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
    thumbnail () {
      if (defaultImagesKeys.indexOf(this.thumbnailUrl) !== -1) {
        return require('@assets/images/' + this.thumbnailUrl + '.png')
      } else { // Returned url is a key for local default image
        return this.thumbnailUrl
      }
    },
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
    this.setInitialForm()
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
    this.isSchoolNews ? this.getSchoolNewsBroadcastGroups() : this.getGroupNewsBroadcastGroups()
  },
  mounted () {
    const input = this.$refs.nameInput
    input.focus()
    input.select()
  },
  methods: {
    setInitialForm () {
      this.initialForm = {
        title: this.title,
        content: this.content,
        releaseDate: this.releaseDate,
        populations: [...this.populations],
        thumbnailId: this.thumbnailId,
        attachedFiles: [...this.attachedFiles],
        markAsUnreadForAll: this.markAsUnreadForAll
      }
    },
    selectImage (tempFile) {
      this.thumbnailId = tempFile.id
      this.thumbnailUrl = tempFile.fileUrl
    },
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
          this.thumbnailId = data.news.thumbnailId
          this.thumbnailUrl = data.news.thumbnailUrl
          this.setInitialForm()
        } else {
          console.error('Error')
        }
      })
    },
    getSchoolNewsBroadcastGroups () {
      getSchoolNewsBroadcastGroups().then((data) => {
        if (data.success) {
          // Concat all populations of all schools in one list
          this.availablePopulationsList = []
          const schools = data.schoolsGroups
          schools.forEach((school) => {
            this.availablePopulationsList = [...this.availablePopulationsList, ...school.populations]
            // this.availablePopulationsList = [...this.availablePopulationsList, ...school.subjects]
            school.classes.forEach((schoolClass) => {
              this.availablePopulationsList = [...this.availablePopulationsList, ...schoolClass.populations]
            })
            school.volees.forEach((schoolVolee) => {
              this.availablePopulationsList = [...this.availablePopulationsList, ...schoolVolee.populations]
            })
          })
        } else {
          console.error('Error')
        }
      })
    },
    getGroupNewsBroadcastGroups () {
      getGroupNewsBroadcastGroups().then((data) => {
        if (data.success) {
          // Concat all populations of all schools in one list
          this.availablePopulationsList = []
          const groupTree = data.schoolsGroups
          this.availablePopulationsList = [...this.availablePopulationsList, ...groupTree.Communities]
          groupTree.schools.forEach((school) => {
            if (school.subjects) {
              this.availablePopulationsList = [...this.availablePopulationsList, ...school.subjects]
            }
            if (school.classes) {
              school.classes.forEach((schoolClass) => {
                this.availablePopulationsList = [...this.availablePopulationsList, ...schoolClass.populations]
              })
            }
            if (school.cours) {
              school.cours.forEach((schoolCours) => {
                this.availablePopulationsList = [...this.availablePopulationsList, ...schoolCours.populations]
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
      addNews(this.title, this.content, this.isSchoolNews, false, this.thumbnailId, this.releaseDate, this.populations, this.attachedFileIds).then((data) => {
        this.isProcessingSave = false
        if (data.success) {
          if (this.releaseDate.isAfter(dayjs())) {
            this.$store.dispatch('popups/pushPopup', { message: this.isSchoolNews ? this.$t('announcementCreationSuccess') : this.$t('groupNewsCreationSuccess'), type: 'success' })
          }
          this.$emit('create')
          this.onClose()
        } else {
          this.$store.dispatch('popups/pushPopup', { message: this.$t('Popup.error'), type: 'error' })
        }
      })
    },
    updateNews () {
      this.isProcessingSave = true
      editNews(this.initNews.newsId, this.title, this.content, false, this.thumbnailId, this.releaseDate, this.populations, this.attachedFileIds, this.markAsUnreadForAll).then((data) => {
        this.isProcessingSave = false
        if (data.success) {
          if (this.releaseDate.isAfter(dayjs())) {
            this.$store.dispatch('popups/pushPopup', { message: this.isSchoolNews ? this.$t('announcementUpdateSuccess') : this.$t('groupNewsUpdateSuccess'), type: 'success' })
          }
          this.$emit('update')
          this.onClose()
        } else {
          this.$store.dispatch('popups/pushPopup', { message: this.$t('Popup.error'), type: 'error' })
        }
      })
    },
    confirmClosure () {
      const actualForm = {
        title: this.title,
        content: this.content,
        releaseDate: this.releaseDate,
        populations: this.populations,
        thumbnailId: this.thumbnailId,
        attachedFiles: this.attachedFiles,
        markAsUnreadForAll: this.markAsUnreadForAll
      }

      if (JSON.stringify(actualForm) !== JSON.stringify(this.initialForm)) {
        this.$store.dispatch('warningModal/addWarning', {
          text: this.$t('confirmClosure'),
          lastAction: { fct: this.onClose }
        })
      } else {
        this.onClose()
      }
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
    overflow-y: visible;
    max-height: 70vh !important;
  }
}
</style>

<style lang="scss" scoped>
@import "@design";

.save-spinner {
  z-index: 100;
}

.first-line {
  display: flex;
  gap: 1rem;
}

.release-date {
  color: $color-new-light-text;
  white-space: nowrap;
}

.population-selection {
  position: relative;
  flex: 1;
}

.first-line, .title, .population-selection {
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

.attached-files {
  max-height: 300px;
  overflow: auto;
}

.unread-checkbox {
  display: flex;
  align-items: center;
  margin-top: 20px;

  span {
    margin-right: 1em;
  }

  .info {
    margin-left: 1rem;
  }
}
</style>

<i18n locale="fr">
{
  "creationTitle": "Partager une information",
  "updateTitle": "Modifier une information",
  "schoolCreationTitle": "Créer une annonce",
  "schoolUpdateTitle": "Modifier une annonce",
  "releaseDateLabel": "Parution",
  "namePlaceHolder": "Titre",
  "contentPlaceHolder": "Description",
  "populationPlaceholder": "Destinataires",
  "addFile": "Ajouter un fichier",
  "markAsUnreadForAll": "Notifier les destinataires",
  "creationSubmit": "Créer",
  "updateSubmit": "Modifier",
  "sizeLimit1": "Ne doit pas dépasser ",
  "sizeLimit2": " caractères",
  "selectPopulations": "Veuillez séléctionner une population cible",
  "dateInPast": "La date de parution ne doit pas se situer dans le passé",
  "switchHelp": "Cette option permet de notifier les destinataires et l'annonce sera considérée comme non lue",
  "confirmClosure": "Souhaitez-vous fermer cette fenêtre ? (Vous perdrez son contenu)",
  "announcementCreationSuccess": "Annonce créée",
  "groupNewsCreationSuccess": "Information créée",
  "announcementUpdateSuccess": "Annonce modifiée",
  "groupNewsUpdateSuccess": "Information modifiée"
}
</i18n>
