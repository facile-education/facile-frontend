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
          :disabled="isLoadingAnnouncementPopulations"
        />
        <PentilaErrorMessage
          :error-message="formErrorList.populations"
        />
        <PentilaSpinner v-if="isLoadingAnnouncementPopulations" />
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

      <div
        class="add-content-buttons"
      >
        <img
          class="add-content-button"
          src="@assets/options/icon_upload.svg"
          :alt="$t('addFile')"
          :title="$t('addFile')"
          @click="isFilePickerDisplayed = true"
        >
      </div>
      <AttachedFiles
        :attached-files="attachedFiles"
        :read-only="false"
        @removeAttachedFile="removeFile"
      />

      <div
        v-if="!isCreation"
        class="unread-checkbox"
      >
        <span v-t="'markAsUnreadForAll'" />
        <PentilaToggleSwitch
          v-model="markAsUnreadForAll"
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
import { getSchoolNewsBroadcastGroups, getNewsDetails, addNews, editNews } from '@/api/dashboard/news.service'
import CustomDatePicker from '@components/Base/CustomDatePicker.vue'
import { defineAsyncComponent } from 'vue'
import AttachedFiles from '@components/Base/AttachedFiles.vue'
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
  name: 'SaveAnnouncementModal',
  components: { AttachedFiles, FilePickerModal, CustomDatePicker, CKEditor },
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
      content: '',
      releaseDate: dayjs(),
      populations: [],
      attachedFiles: [],
      markAsUnreadForAll: false,

      editor: InlineEditor,
      editorConfig: {
        placeholder: this.$t('contentPlaceHolder')
      },
      availablePopulationsList: [],
      isReleaseDateDisabled: false,
      isLoadingAnnouncementPopulations: false,
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
      this.title = this.initAnnouncement.title
      this.content = this.initAnnouncement.content
      this.releaseDate = dayjs(this.initAnnouncement.publicationDate)
      if (this.releaseDate.isBefore(dayjs().hour(0))) { // If Announcement is already release (for more that one day), cannot modify the release date
        this.isReleaseDateDisabled = true
      }
      this.initDetails(this.initAnnouncement.newsId)
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
      this.isLoadingAnnouncementPopulations = true
      getNewsDetails(newsId).then((data) => {
        this.isLoadingAnnouncementPopulations = false
        if (data.success) {
          this.populations = data.news.populations
          // TODO: init attachedFiles at the same time
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
      addNews(this.title, this.content, true, false, 0, this.releaseDate, this.populations, this.attachedFileIds).then((data) => {
        if (data.success) {
          this.$emit('createAnnouncement')
          this.onClose()
        } else {
          this.$store.dispatch('popups/pushPopup', { message: this.$t('Popup.error'), type: 'error' })
        }
      })
    },
    updateAnnouncement () {
      editNews(this.initAnnouncement.newsId, this.title, this.content, false, 0, this.releaseDate, this.populations, this.attachedFileIds, this.markAsUnreadForAll).then((data) => {
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

<style lang="scss">
.update-announcement-modal {
  .window-body {
    overflow-y: auto;
  }
}
</style>

<style lang="scss" scoped>
@import "@design";

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

.add-content-buttons {

  .add-content-button {
    border: 1px solid transparent;
    border-radius: 5px;
    padding: 7px;
    margin: 5px;

    &:hover {
      background-color: $color-hover-bg;
      cursor: pointer;
    }
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
  "creationTitle": "Créer une annonce",
  "updateTitle": "Modifier une annonce",
  "releaseDateLabel": "Parution",
  "namePlaceHolder": "Titre",
  "contentPlaceHolder": "Contenu",
  "populationPlaceholder": "Population cible",
  "addFile": "Ajouter une pièce jointe",
  "markAsUnreadForAll": "Notifier les destinataires",
  "creationSubmit": "Créer",
  "updateSubmit": "Modifier",
  "sizeLimit1": "Ne doit pas dépasser ",
  "sizeLimit2": " caractères",
  "selectPopulations": "Veuillez séléctionner une population cible",
  "dateInPast": "La date de parution ne doit pas se situer dans le passé"
}
</i18n>
