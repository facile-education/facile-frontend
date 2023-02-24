<template>
  <PentilaWindow
    :modal="true"
    :draggable="true"
    class="newsWindow"
    :width="600"
    :class="{'mobile': mq.phone}"
    @close="closeModal"
  >
    <template #header>
      <span v-if="isCreation && !isGroupNews">{{ $t('school-news-creation-title') }}</span>
      <span v-if="isCreation && isGroupNews">{{ $t('group-news-creation-title') }}</span>
      <span v-if="!isCreation && !isGroupNews">{{ $t('school-news-edition-title') }}</span>
      <span v-if="!isCreation && isGroupNews">{{ $t('group-news-edition-title') }}</span>
    </template>

    <template #body>
      <div class="news-title">
        <PentilaInput
          ref="titleInput"
          v-model="title"
          :maxlength="200"
          :placeholder="$t('titlePlaceholder')"
          @keyup.enter.stop="pressEnter"
        />
        <PentilaErrorMessage
          :error-message="formErrorList.title"
        />
      </div>

      <!-- Content -->
      <CKEditor
        class="ck-editor"
        :model-value="content"
        :editor="editor"
        :config="editorOptions"
      />

      <!-- Groups -->
      <div class="news-groups">
        <div class="news-files-header">
          <span>{{ $t('news-groups') }}</span>
          <PentilaButton
            class="round"
            type="circle"
            @click="isGroupPickerDisplayed = true"
          >
            <img
              class="delete-icon"
              src="@assets/add-white.svg"
              :alt="$t('add-group')"
              :title="$t('add-group')"
            >
          </PentilaButton>
        </div>

        <span
          v-if="groups.length === 0"
          class="no-group"
        >
          {{ $t('no-group-selected') }}
        </span>
        <div
          v-for="group in groups"
          :key="group.groupId"
          class="news-group"
        >
          <span>{{ group.groupName }}</span>
          <img
            class="button"
            src="@assets/trash.svg"
            :alt="$t('delete-group')"
            :title="$t('delete-group')"
            @click.stop="deleteGroup(group)"
          >
        </div>
      </div>

      <!-- Attach files -->
      <div class="news-files">
        <div class="news-files-header">
          <span>{{ $t('news-files') }}</span>
          <PentilaButton
            class="round"
            type="circle"
            @click="isFilePickerDisplayed = true"
          >
            <img
              class="add-icon"
              src="@assets/add-white.svg"
              :alt="$t('add-file')"
              :title="$t('add-file')"
            >
          </PentilaButton>
        </div>

        <span
          v-if="attachFiles.length === 0"
          class="no-file"
        >
          {{ $t('no-attach-file-selected') }}
        </span>
        <div
          v-for="attachFile in attachFiles"
          :key="attachFile.id"
          class="news-file"
        >
          <span>{{ attachFile.name }}</span>
          <img
            class="button"
            src="@assets/trash.svg"
            :alt="$t('delete-file')"
            :title="$t('delete-file')"
            @click.stop="deleteFile(attachFile)"
          >
        </div>
      </div>

      <!-- Publication and expiration dates -->
      <div class="news-dates">
        <div class="publication-date">
          <span>{{ $t('publication-date') }}</span>
          <NeroDatePicker
            v-model="publicationDate"
            class="news-date"
            :min-date="minDate.toDate()"
          />
        </div>
        <div class="expiration-date">
          <span>{{ $t('expiration-date') }}</span>
          <NeroDatePicker
            v-model="expirationDate"
            class="news-date"
            :min-date="minDate.toDate()"
          />
        </div>
      </div>

      <teleport to="body">
        <GroupPickerModal
          v-if="isGroupPickerDisplayed"
          :is-school-news="!isSchoolNews"
          :initial-groups="groups"
          @close="onGroupPickerSelectedGroups"
        />
      </teleport>
      <teleport to="body">
        <FilePickerModal
          v-if="isFilePickerDisplayed"
          :multi-selection="true"
          :allow-files-from-device="true"
          @addedFiles="attachNewFiles"
          @close="closeFilePicker"
        />
      </teleport>
    </template>

    <template #footer>
      <PentilaButton
        v-if="isCreation"
        :label="$t('add')"
        class="button"
        @click="addNews"
      />
      <PentilaButton
        v-else
        :label="$t('edit')"
        class="button"
        @click="editNews"
      />
    </template>
  </PentilaWindow>
</template>

<script>
import dayjs from 'dayjs'
import { defineAsyncComponent } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import InlineEditor from '@ckeditor/ckeditor5-build-inline'
import { component as CKEditor } from '@ckeditor/ckeditor5-vue'
import NeroDatePicker from '@/components/Progression/Assignment/NeroDatePicker.vue'
import GroupPickerModal from '@/components/Dashboard/News/GroupPickerModal.vue'
const FilePickerModal = defineAsyncComponent(() => import('@/components/FilePicker/FilePickerModal'))

export default {
  name: 'NewsModal',
  components: { CKEditor, NeroDatePicker, GroupPickerModal, FilePickerModal },
  inject: ['mq'],
  props: {
    isSchoolNews: {
      type: Boolean,
      required: true
    }
  },
  emits: ['close'],
  setup: () => ({ v$: useVuelidate() }),
  validations: {
    title: { required }
  },
  data () {
    return {
      title: '',
      content: '',
      publicationDate: dayjs(),
      expirationDate: dayjs().add(1, 'month'),
      groups: [],
      attachFiles: [],
      editor: InlineEditor,
      editorOptions: {
        removePlugins: [
          'CKFinder',
          'CKFinderUploadAdapter',
          'CloudServicesUploadAdapter',
          'CloudServices',
          'EasyImage',
          'Image',
          'ImageCaption',
          'ImageStyle',
          'ImageToolbar',
          'ImageUpload',
          'MediaEmbed'
        ],
        toolbar: ['heading', '|', 'bold', 'italic', 'link', 'numberedList', 'bulletedList', '|', 'outdent', 'indent', '|', 'blockQuote', 'insertTable', 'undo', 'redo'],
        language: 'fr'
      },
      isGroupPickerDisplayed: false,
      isFilePickerDisplayed: false,
      minDate: dayjs()
    }
  },
  computed: {
    isCreation () {
      const isCrea = this.$store.state.dashboard.editedNews === undefined
      return isCrea
    },
    formErrorList () {
      return {
        title: (this.v$.title.$invalid && this.v$.title.$dirty) ? this.$t('Commons.required') : ''
      }
    },
    news () {
      return this.$store.state.dashboard.editedNews
    },
    getFileIds () {
      const ids = []
      for (let i = 0; i < this.attachFiles.length; i++) {
        ids.push(this.attachFiles.fileId)
      }
      return ids
    }
  },
  mounted () {
    if (!this.isCreation) {
      this.title = this.news.title
      this.content = this.news.content
      this.publicationDate = this.news.publicationDate
      this.expirationDate = this.news.expirationDate
      this.groups = this.news.groups
      this.attachFiles = this.news.attachFiles
    } else {
      this.publicationDate = dayjs()
      this.expirationDate = dayjs().add(1, 'month')
    }

    // Focus form
    const input = this.$refs.titleInput
    input.focus()
    input.select()
  },
  methods: {
    closeModal () {
      this.$emit('close')
    },
    pressEnter (e) {
      this.isCreation ? this.addNews(e) : this.editNews(e)
    },
    addNews (e) {
      e.preventDefault()
      if (this.v$.$invalid) {
        this.v$.$touch()
      } else {
        this.$store.dispatch('dashboard/addNews', {
          title: this.title,
          content: this.content,
          isSchoolNews: this.isSchoolNews,
          isImportant: false,
          imageId: 0,
          publicationDate: dayjs(this.publicationDate).format('YYYY-MM-DD HH:mm'),
          expirationDate: dayjs(this.expirationDate).format('YYYY-MM-DD HH:mm'),
          population: JSON.stringify(this.groups),
          attachFiles: JSON.stringify(this.getFileIds)
        })
        this.closeModal()
      }
    },
    editNews (e) {
      e.preventDefault()
      if (this.v$.$invalid) {
        this.v$.$touch()
      } else {
        this.$store.dispatch('dashboard/editNews', {
          newsId: this.news.newsId,
          title: this.title,
          content: this.content,
          isSchoolNews: this.isSchoolNews,
          isImportant: false,
          imageId: 0,
          publicationDate: dayjs(this.publicationDate).format('YYYY-MM-DD HH:mm'),
          expirationDate: dayjs(this.expirationDate).format('YYYY-MM-DD HH:mm'),
          population: JSON.stringify(this.groups),
          attachFiles: JSON.stringify(this.getFileIds)
        })
        this.closeModal()
      }
    },
    onGroupPickerSelectedGroups (selectedGroups) {
      this.groups = selectedGroups
      this.isGroupPickerDisplayed = false
    },
    closeFilePicker () {
      this.isFilePickerDisplayed = false
    },
    attachNewFiles (selectedFiles) {
      this.attachFiles.push(selectedFiles)
    },
    deleteGroup (group) {
      const groupIndex = this.groups.map(group => group.groupId).indexOf(group.groupId)
      if (groupIndex !== -1) {
        this.groups.splice(groupIndex, 1)
      }
    },
    deleteFile (file) {
      const fileIndex = this.attachFiles.map(attachFile => attachFile.id).indexOf(file.id)
      if (fileIndex !== -1) {
        this.attachFiles.splice(fileIndex, 1)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.newsWindow {
  span {
    text-align: center;
    margin: 10px;
  }
  .news-dates {
    display: flex;
    margin-top: 10px;
    justify-content: space-between;
    div {
      display: flex;
    }
    span,.news-date {
      margin: auto;
      margin-right: 5px;
    }
  }
  .news-title {

  }
  .ck-editor {
    border: 1px solid black;
    height: 100px;
    margin-top: 30px;
  }
  .news-groups {
    border-left: 2px solid black;
    margin-top: 10px;
    .news-groups-header {
      display: flex;
    }
    span {
      margin-left: 20px;
    }
  }
  .news-files {
    border-left: 2px solid black;
    margin-top: 10px;
    .news-files-header {
      display: flex;
    }
    span {
      margin-left: 20px;
    }
  }
}
</style>

<i18n locale="fr">
{
  "group-news-creation-title": "Créer une actualité",
  "group-news-edition-title": "Modifier une actualité",
  "school-news-creation-title": "Créer une annonce d'établissement",
  "school-news-edition-title": "Modifier une annonce d'établissement",
  "publication-date": "Publication",
  "expiration-date": "Expiration",
  "cancel": "Annuler",
  "add": "Créer",
  "edit": "Modifier",
  "titlePlaceholder": "Titre",
  "urlPlaceholder": "https://www.monlien.com",
  "news-groups": "Groupes",
  "news-files": "Pièces jointes",
  "add-group": "Ajouter un groupe de diffusion",
  "no-group-selected": "Aucun groupe sélectionné",
  "delete-group": "Supprimer le groupe de la diffusion",
  "delete-file": "Supprimer la pièce jointe",
  "add-file": "Ajouter une pièce jointe",
  "no-attach-file-selected" : "Aucune pièce jointe"
}
</i18n>
