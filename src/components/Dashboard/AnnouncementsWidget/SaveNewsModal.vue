<template>
  <WeprodeWindow
    class="update-news-modal"
    data-test="update-news-modal"
    :modal="true"
    :max-width="1000"
    :full-screen="mq.phone || mq.tablet"
    @close="confirmClosure"
  >
    <template #header>
      <span v-t="isCreation ? (isSchoolNews ? 'Dashboard.SaveNewsModal.schoolCreationTitle' : 'Dashboard.SaveNewsModal.creationTitle') : (isSchoolNews ? 'Dashboard.SaveNewsModal.schoolUpdateTitle' : 'Dashboard.SaveNewsModal.updateTitle')" />
    </template>

    <template #body>
      <WeprodeSpinner
        v-if="isProcessingSave"
        class="save-spinner"
      />
      <div class="first-line">
        <ThumbnailSelector
          :thumbnail-url="thumbnail"
          @select-image="selectImage"
        />

        <div
          v-if="!mq.phone && !mq.tablet"
          class="population-selection"
        >
          <WeprodeTagsInput
            ref="tagsInput"
            v-model="populations"
            :placeholder="$t('Dashboard.SaveNewsModal.populationPlaceholder') + '*'"
            :list="availablePopulationsList"
            :close-on-select="true"
            sort-field="order"
            display-field="populationName"
            :disabled="isLoadingNewsDetails"
          />
          <WeprodeErrorMessage
            :error-message="formErrorList.populations"
          />
          <WeprodeSpinner v-if="isLoadingNewsDetails" />
        </div>

        <div
          class="release-date"
          :class="{'phone': mq.phone || mq.tablet}"
        >
          <div v-t="'Dashboard.SaveNewsModal.releaseDateLabel'" />
          <CustomDatePicker
            v-model:selected-date="releaseDate"
            :min-date="minDate"
            :with-hours="true"
            :is-required="true"
            :minute-increment="15"
            :disabled="isReleaseDateDisabled"
          />
          <WeprodeErrorMessage
            :error-message="formErrorList.releaseDate"
          />
        </div>
      </div>

      <div
        v-if="mq.phone || mq.tablet"
        class="population-selection"
      >
        <WeprodeTagsInput
          ref="tagsInput"
          v-model="populations"
          class="last-population-selection"
          :placeholder="$t('Dashboard.SaveNewsModal.populationPlaceholder') + '*'"
          :list="availablePopulationsList"
          sort-field="order"
          :sort="true"
          :close-on-select="true"
          display-field="populationName"
          :disabled="isLoadingNewsDetails"
        />
        <WeprodeErrorMessage
          :error-message="formErrorList.populations"
        />
        <WeprodeSpinner v-if="isLoadingNewsDetails" />
      </div>

      <div class="title">
        <WeprodeInput
          ref="nameInput"
          v-model="title"
          :placeholder="$t('Dashboard.SaveNewsModal.namePlaceHolder') + '*'"
        />
        <WeprodeErrorMessage
          :error-message="formErrorList.title"
        />
      </div>

      <TextContent
        v-if="content !== undefined"
        v-model:content="content"
        class="ck-editor"
        :placeholder="$t('Dashboard.SaveNewsModal.contentPlaceHolder')"
      />

      <WeprodeErrorMessage
        :error-message="formErrorList.content"
      />

      <AttachedFiles
        v-model="attachedFiles"
        :read-only="false"
        :max-height="(mq.phone) ? '120px' : '300px'"
        @remove-attached-file="removeFile"
      />

      <div
        v-if="isSchoolNews && !isCreation"
        class="unread-checkbox"
      >
        <span v-t="'Dashboard.SaveNewsModal.markAsUnreadForAll'" />
        <WeprodeToggleSwitch
          v-model="markAsUnreadForAll"
          data-test="markAsUnreadForAll"
        />
        <InformationIcon
          class="info"
          :is-above=" true"
          :text="$t('Dashboard.SaveNewsModal.switchHelp')"
        />
      </div>
    </template>

    <template #footer>
      <WeprodeButton
        data-test="submitButton"
        :label="isCreation? $t('Dashboard.SaveNewsModal.creationSubmit') : $t('Dashboard.SaveNewsModal.updateSubmit')"
        :disabled="isLoadingFiles"
        @click="submit"
      />
    </template>
  </WeprodeWindow>

  <teleport
    v-if="isFilePickerDisplayed"
    to="body"
  >
    <FilePickerModal
      :multi-selection="true"
      :allow-files-from-device="true"
      @added-files="attachNewFiles"
      @close="isFilePickerDisplayed = false"
    />
  </teleport>
</template>

<script>
import AttachedFiles from '@components/AttachedFiles/AttachedFiles.vue'
import CustomDatePicker from '@components/Base/CustomDatePicker.vue'
import InformationIcon from '@components/Base/InformationIcon.vue'
import TextContent from '@components/Base/TextContent.vue'
import ThumbnailSelector from '@components/Base/ThumbnailSelector.vue'
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
import WeprodeButton from '@/components/Base/Weprode/WeprodeButton.vue'
import WeprodeErrorMessage from '@/components/Base/Weprode/WeprodeErrorMessage.vue'
import WeprodeInput from '@/components/Base/Weprode/WeprodeInput.vue'
import WeprodeSpinner from '@/components/Base/Weprode/WeprodeSpinner.vue'
import WeprodeTagsInput from '@/components/Base/Weprode/WeprodeTagsInput.vue'
import WeprodeToggleSwitch from '@/components/Base/Weprode/WeprodeToggleSwitch.vue'
import WeprodeWindow from '@/components/Base/Weprode/WeprodeWindow.vue'
import { ckMaxSize } from '@/constants/appConstants'
import { defaultImagesKeys } from '@/constants/icons'

const FilePickerModal = defineAsyncComponent(() => import('@components/FilePicker/FilePickerModal.vue'))

const inputMaxSize = 75
const isUnderInputMaxSize = (value) => validators.isUnderMaxSize(value, inputMaxSize)
const isUnderCKMaxSize = (value) => validators.isUnderMaxSize(value, ckMaxSize)
const isNotEmpty = (list) => validators.isNotEmpty(list)

export default {
  name: 'SaveNewsModal',
  components: { TextContent, InformationIcon, ThumbnailSelector, AttachedFiles, FilePickerModal, CustomDatePicker, WeprodeButton, WeprodeErrorMessage, WeprodeInput, WeprodeSpinner, WeprodeTagsInput, WeprodeToggleSwitch, WeprodeWindow },
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
    isLoadingFiles () {
      return this.$store.state.currentActions.isLoadingProgressionDisplayed
    },
    thumbnail () {
      if (defaultImagesKeys.indexOf(this.thumbnailUrl) !== -1) {
        return new URL(`../../../assets/images/defaultImages/${this.thumbnailUrl}.svg`, import.meta.url).href
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
          ? (this.v$.title.$errors[0].$validator === 'required' ? this.$t('Commons.required') : this.$t('Dashboard.SaveNewsModal.sizeLimit', { maxSize: inputMaxSize }))
          : '',
        content: (this.v$.content.$invalid && this.v$.content.$dirty)
          ? this.$t('Dashboard.SaveNewsModal.sizeLimit', { maxSize: ckMaxSize })
          : '',
        populations: (this.v$.populations.$invalid && this.v$.populations.$dirty)
          ? this.$t('Dashboard.SaveNewsModal.selectPopulations')
          : '',
        releaseDate: (this.v$.releaseDate.$invalid && this.v$.releaseDate.$dirty)
          ? this.$t('Dashboard.SaveNewsModal.dateInPast')
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
    } else {
      this.roundMinutes()
    }
    this.isSchoolNews ? this.getSchoolNewsBroadcastGroups() : this.getGroupNewsBroadcastGroups()
    this.setInitialForm()
  },
  mounted () {
    if (this.isCreation) {
      const input = this.$refs.tagsInput
      input.focus()
    } else {
      const input = this.$refs.nameInput
      input.focus()
      input.select()
    }
  },
  methods: {
    roundMinutes () {
      // Round releaseDate to the previous quarter-hour (to have a compliant behaviour with v-calendar 15min suggestion list)
      const currentQuarterNumber = Math.floor(this.releaseDate.minute() / 15)
      this.releaseDate = this.releaseDate.minute((currentQuarterNumber) * 15)
    },
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
    addOrderAttributeToAllPopulationItems (populationList) { // TODO : to remove and patch the problem
      populationList.forEach(population => {
        if (!population.order) {
          population.order = 'order_9' // Put at the bottom of the list if no order specified
        }
      })
    },
    getSchoolNewsBroadcastGroups () {
      getSchoolNewsBroadcastGroups().then((data) => {
        if (data.success) {
          // Concat all populations of all schools in one list
          this.availablePopulationsList = []

          // Global
          if (data.global) {
            this.availablePopulationsList = [...this.availablePopulationsList, ...data.global]
          }

          const schools = data.schoolsGroups
          schools.forEach((school) => {
            if (school.populations) {
              this.availablePopulationsList = [...this.availablePopulationsList, ...school.populations]
            }
            if (school.subjects) {
              this.availablePopulationsList = [...this.availablePopulationsList, ...school.subjects]
            }
            if (school.classes) {
              school.classes.forEach((schoolClass) => {
                this.availablePopulationsList = [...this.availablePopulationsList, ...schoolClass.populations]
              })
            }
            if (school.volees) {
              school.volees.forEach((schoolVolee) => {
                this.availablePopulationsList = [...this.availablePopulationsList, ...schoolVolee.populations]
              })
            }
          })
          this.addOrderAttributeToAllPopulationItems(this.availablePopulationsList)
          this.availablePopulationsList.sort((a, b) => {
            if (a.order < b.order) {
              return 1
            } else if (a.order > b.order) {
              return -1
            }
            return 0
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
          this.addOrderAttributeToAllPopulationItems(this.availablePopulationsList)
          this.availablePopulationsList.sort((a, b) => {
            if (a.order < b.order) {
              return 1
            } else if (a.order > b.order) {
              return -1
            }
            return 0
          })
        } else {
          console.error('Error')
        }
      })
    },
    submit () {
      if (this.v$.$invalid) {
        this.v$.$touch()
      } else if (this.isCreation) {
        this.createNews()
      } else {
        this.updateNews()
      }
    },
    createNews () {
      this.isProcessingSave = true
      addNews(this.title, this.content, this.isSchoolNews, false, this.thumbnailId, this.releaseDate, this.populations, this.attachedFileIds).then((data) => {
        this.isProcessingSave = false
        if (data.success) {
          if (this.releaseDate.isAfter(dayjs())) {
            this.$store.dispatch('popups/pushPopup', { message: this.isSchoolNews ? this.$t('Dashboard.SaveNewsModal.announcementCreationSuccess') : this.$t('Dashboard.SaveNewsModal.groupNewsCreationSuccess'), type: 'success' })
          }
          this.$emit('create')
          this.onClose()
        } else {
          this.$store.dispatch('popups/pushPopup', { message: this.$t('Popup.error'), type: 'error' })
        }
      }, (err) => {
        this.isProcessingSave = false
        console.error(err)
        this.$store.dispatch('popups/pushPopup', { message: this.$t('Popup.error'), type: 'error' })
      })
    },
    updateNews () {
      this.isProcessingSave = true
      editNews(this.initNews.newsId, this.title, this.content, false, this.thumbnailId, this.releaseDate, this.populations, this.attachedFileIds, this.markAsUnreadForAll).then((data) => {
        this.isProcessingSave = false
        if (data.success) {
          if (this.releaseDate.isAfter(dayjs())) {
            this.$store.dispatch('popups/pushPopup', { message: this.isSchoolNews ? this.$t('Dashboard.SaveNewsModal.announcementUpdateSuccess') : this.$t('Dashboard.SaveNewsModal.groupNewsUpdateSuccess'), type: 'success' })
          }
          this.$emit('update')
          this.onClose()
        } else {
          this.$store.dispatch('popups/pushPopup', { message: this.$t('Popup.error'), type: 'error' })
        }
      }, (err) => {
        this.isProcessingSave = false
        console.error(err)
        this.$store.dispatch('popups/pushPopup', { message: this.$t('Popup.error'), type: 'error' })
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
          text: this.$t('Dashboard.SaveNewsModal.confirmClosure'),
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
  .ck-editor {
    p {
      margin: 5px 0;
      line-height: 1.25rem;
    }
  }

  .ck-editor__editable {
    min-height: 15rem;
  }

  &.phone .ck-editor__editable {
    min-height: 12rem;
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
  align-items: center;
}

.release-date {
  color: $color-new-light-text;
  white-space: nowrap;

  &:not(.phone) {
    height: $news-thumbnail-size-in-modal;
  }
}

.population-selection {
  position: relative;
  flex: 1;
}

.first-line, .title, .last-population-selection {
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
