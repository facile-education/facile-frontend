<template>
  <div
    class="progression-item"
  >
    <!-- Left panel -->
    <div
      class="vertical-1"
    >
      <!-- Homework case -->
      <div
        v-if="item.isHomework"
        class="item-type"
      >
        <img
          class="item-type-icon homework"
          src="@assets/devoir.svg"
          :alt="$t('homework')"
          :title="$t('homework')"
        >
        <span>{{ $t('homework') }}</span>
      </div>

      <!-- Session case -->
      <div
        v-else
        class="item-type"
      >
        <img
          class="item-type-icon session"
          src="@assets/seance.svg"
          :alt="$t('session')"
          :title="$t('session')"
        >
        <span>{{ $t('session') }}</span>
      </div>

      <hr>
      <!-- Preview -->
      <div
        class="preview"
        @click="togglePreviewModalDisplay"
      >
        <img
          src="@assets/icon_apercu.svg"
          :title="$t('previewContent')"
          class="preview-icon"
          alt=""
        >
        <span>{{ $t('preview') }}</span>
      </div>

      <hr>
      <!-- Delete item button-->
      <div
        v-if="!isSpecificItem"
        class="delete-item"
        @click="confirmItemDeletion(item)"
      >
        <img
          class="delete-icon"
          src="@assets/trash.svg"
          :alt="$t('delete')"
          :title="$t('delete')"
        >
        <span>{{ $t('delete') }}</span>
      </div>
    </div>

    <!-- Main -->
    <div
      class="vertical-2"
    >
      <div
        class="item-header"
      >
        <!-- Item title is editable in classic case -->
        <!-- For specific session/homework content, it is readonly -->
        <PentilaInput
          v-if="!isSpecificItem"
          ref="itemName"
          :model-value="updatedItemName"
          :placeholder="$t('title')"
          :maxlength="75"
          class="item-title"
          :class="{'fullWidth': !item.isHomework}"
          @update:modelValue="updateItemName"
          @blur="saveNewItemName"
          @keyup.enter="pressEnter"
        />
        <span
          v-if="isSpecificItem && item !== undefined"
          class="item-title"
        >
          {{ item.name }}
        </span>

        <!-- Homework type menu -->
        <PentilaDropdown
          v-if="item.isHomework"
          v-model="selectedHomeworkType"
          class="homework-type"
          :list="homeworkTypes"
          :sort="false"
          display-field="name"
          @update:modelValue="changeHomeworkType"
        />
        <!-- Homework duration -->
        <PentilaDropdown
          v-if="item.isHomework"
          v-model="selectedHomeworkDuration"
          class="homework-duration"
          :list="homeworkDurations"
          :sort="false"
          @update:modelValue="changeHomeworkDuration"
        />
      </div>

      <!-- Item contents in proper order -->
      <div
        class="item-contents"
      >
        <ProgressionItemContent
          v-for="(content, index) in sortedItemContents"
          :key="content.contentId"
          :content="content"
          :index="index"
          class="item-content"
          @editContent="editContent"
        />
      </div>

      <!-- Add document to complete in case of homework -->
      <div
        v-if="item.isHomework && item.type === 3"
        class="add-document"
        @click="openFilePicker"
      >
        <PentilaButton
          class="round"
        >
          <img
            class="delete-icon"
            src="@assets/add-white.svg"
            :alt="$t('add-document')"
            :title="$t('add-document')"
          >
        </PentilaButton>
        <span>{{ $t('add-document') }}</span>
      </div>

      <!-- Add content buttons -->
      <div
        class="add-content-buttons"
      >
        <img
          class="add-content-button"
          src="@assets/icon_text.svg"
          :alt="$t('addText')"
          :title="$t('addText')"
          @click="addText()"
        >
        <img
          class="add-content-button"
          src="@assets/icon_record.svg"
          :alt="$t('addSound')"
          :title="$t('addSound')"
          @click="toggleAudioRecordModalDisplay()"
        >
        <img
          class="add-content-button"
          src="@assets/icon_link.svg"
          :alt="$t('addLink')"
          :title="$t('addLink')"
          @click="toggleLinkModalDisplay()"
        >
        <img
          class="add-content-button"
          src="@assets/icon_play.svg"
          :alt="$t('addVideo')"
          :title="$t('addVideo')"
          @click="toggleVideoModalDisplay()"
        >
        <img
          class="add-content-button"
          src="@assets/options/icon_upload.svg"
          :alt="$t('addFile')"
          :title="$t('addFile')"
          @click="openFilePicker()"
        >
        <img
          class="add-content-button"
          src="@assets/icon_h5p.svg"
          :alt="$t('addH5p')"
          :title="$t('addH5p')"
          @click="toggleH5PModalDisplay()"
        >
      </div>
    </div>
    <teleport to="body">
      <PreviewModal
        v-if="isPreviewModalDisplayed"
        :item="item"
        @close="togglePreviewModalDisplay"
      />
    </teleport>
    <teleport to="body">
      <FilePickerModal
        v-if="isFilePickerDisplayed"
        height="30em"
        :multi-selection="isMultiSelectionAllowed"
        :allow-files-from-device="true"
        @addedFiles="attachNewFiles"
        @close="closeFilePicker"
      />
    </teleport>
    <teleport to="body">
      <AudioRecorderModal
        v-if="isAudioRecordModalDisplayed"
        height="30em"
        :item="item"
        @close="toggleAudioRecordModalDisplay"
        @save="saveAudioRecording"
      />
    </teleport>
    <teleport to="body">
      <LinkModal
        v-if="isLinkModalDisplayed"
        height="30em"
        :item="item"
        :edited-content="editedContent"
        @close="toggleLinkModalDisplay"
      />
    </teleport>
    <teleport to="body">
      <VideoModal
        v-if="isVideoModalDisplayed"
        height="30em"
        :item="item"
        :edited-content="editedContent"
        @close="toggleVideoModalDisplay"
      />
    </teleport>
    <teleport to="body">
      <H5PModal
        v-if="isH5PModalDisplayed"
        height="30em"
        :item="item"
        :edited-content="editedContent"
        @close="toggleH5PModalDisplay"
      />
    </teleport>
  </div>
</template>

<script>
import ProgressionItemContent from '@/components/Progression/Edit/ProgressionItemContent'

import { defineAsyncComponent, nextTick } from 'vue'
const PreviewModal = defineAsyncComponent(() => import('@/components/Progression/Edit/PreviewModal'))
const LinkModal = defineAsyncComponent(() => import('@/components/Progression/Edit/LinkModal'))
const VideoModal = defineAsyncComponent(() => import('@/components/Progression/Edit/VideoModal'))
const AudioRecorderModal = defineAsyncComponent(() => import('@/components/Progression/Edit/AudioRecorderModal'))
const H5PModal = defineAsyncComponent(() => import('@/components/Progression/Edit/H5PModal'))
const FilePickerModal = defineAsyncComponent(() => import('@/components/FilePicker/FilePickerModal'))

export default {
  name: 'ProgressionItem',
  components: { ProgressionItemContent, PreviewModal, LinkModal, VideoModal, AudioRecorderModal, H5PModal, FilePickerModal },
  props: {
    item: {
      type: Object,
      required: true
    },
    isSpecificItem: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data () {
    return {
      editorOptions: {},
      isPreviewModalDisplayed: false,
      isLinkModalDisplayed: false,
      isVideoModalDisplayed: false,
      isAudioRecordModalDisplayed: false,
      isH5PModalDisplayed: false,
      isFilePickerDisplayed: false,
      isMultiSelectionAllowed: true,
      homeworkTypes: [
        { type: 1, name: 'Consigne simple' },
        { type: 2, name: 'Doc. à compléter' },
        { type: 3, name: 'Doc. à rendre' }
      ],
      homeworkDurations: ['15 min', '30 min', '45 min', '1h', '1h15', '1h30'],
      selectedHomeworkType: undefined,
      selectedHomeworkDuration: undefined,
      updatedItemName: '',
      editedContent: {}
    }
  },
  computed: {
    sortedItemContents () {
      // TODO order by 'order'
      return this.item.contents
    }
  },
  created () {
    this.selectedHomeworkType = this.homeworkTypes[this.item.type - 1]
    this.selectedHomeworkDuration = 'Durée'
    this.updatedItemName = this.item.name
  },
  mounted () {
    // Set focus on item name input
    if (this.$store.state.progression.currentItem !== undefined) {
      nextTick(() => {
        this.$refs.itemName.focus()
        this.$refs.itemName.select()
      })
    }
    // this.$refs.itemName.focus()
  },
  methods: {
    addText () {
      this.$store.dispatch('progression/addItemContent', { itemId: this.item.itemId, contentType: 1, contentValue: '' })
    },
    addH5p () {
      this.$store.dispatch('progression/addItemContent', { itemId: this.item.itemId, contentType: 6, contentValue: '' })
    },
    pressEnter () {
      this.$refs.itemName.blur()
    },
    updateItemName (value) {
      this.updatedItemName = value
    },
    saveAudioRecording (formData) {
      this.$store.dispatch('progression/addItemFileContent', { itemId: this.item.itemId, contentType: 2, formData: formData })
    },
    saveNewItemName () {
      if (this.updatedItemName === '') {
        this.updatedItemName = this.item.name // Reset name to old one
      } else {
        if (this.updatedItemName !== this.item.name) {
          this.$store.dispatch('progression/updateItem',
            {
              itemId: this.item.itemId,
              folderId: this.item.folderId,
              name: this.updatedItemName,
              type: (this.item.isHomework ? this.selectedHomeworkType.type : 0),
              order: this.item.order
            }
          )
        }
      }
    },
    togglePreviewModalDisplay () {
      this.isPreviewModalDisplayed = !this.isPreviewModalDisplayed
    },
    toggleAudioRecordModalDisplay () {
      this.isAudioRecordModalDisplayed = !this.isAudioRecordModalDisplayed
    },
    toggleLinkModalDisplay () {
      if (this.isLinkModalDisplayed) {
        this.editedContent = {}
      }
      this.isLinkModalDisplayed = !this.isLinkModalDisplayed
    },
    toggleVideoModalDisplay () {
      if (this.isVideoModalDisplayed) {
        this.editedContent = {}
      }
      this.isVideoModalDisplayed = !this.isVideoModalDisplayed
    },
    toggleH5PModalDisplay () {
      if (this.isH5PModalDisplayed) {
        this.editedContent = {}
      }
      this.isH5PModalDisplayed = !this.isH5PModalDisplayed
    },
    confirmItemDeletion (item) {
      this.$store.dispatch('warningModal/addWarning', {
        text: this.$t('deleteItemWarning'),
        lastAction: { fct: this.deleteItem, params: [item] }
      })
    },
    deleteItem (item) {
      this.$store.dispatch('progression/deleteItem', item)
    },
    openFilePicker () {
      this.isFilePickerDisplayed = true
    },
    closeFilePicker () {
      this.isFilePickerDisplayed = false
    },
    attachNewFiles (selectedFiles) {
      selectedFiles.forEach((selectedFile) => {
        this.$store.dispatch('progression/addItemContent', { itemId: this.item.itemId, contentType: 5, contentName: selectedFile.name, contentValue: '', fileEntryId: selectedFile.id })
      })
    },
    changeHomeworkType () {
      if (this.selectedHomeworkType.type !== this.item.type) {
        this.$store.dispatch('progression/updateItem',
          { itemId: this.item.itemId, folderId: this.item.folderId, name: this.item.name, type: this.selectedHomeworkType.type, order: this.item.order }
        )
      }
    },
    changeHomeworkDuration () {
      if (this.selectedHomeworkDuration !== this.item.duration) {
        this.$store.dispatch('progression/updateItem',
          { itemId: this.item.itemId, folderId: this.item.folderId, name: this.item.name, type: this.item.type, duration: this.selectedHomeworkDuration, order: this.item.order }
        )
      }
    },
    editContent (content) {
      this.editedContent = content
      if (content.contentType === 3) {
        this.toggleLinkModalDisplay()
      } else if (content.contentType === 4) {
        this.toggleVideoModalDisplay()
      } else if (content.contentType === 6) {
        this.toggleH5PModalDisplay()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@design';

.progression-item {
  width: 100%;
  border: 1px solid $color-border;
  border-radius: 6px;
  margin: 5px 0 25px 0;
  display: flex;

  .vertical-1 {
    width: 8%;
    display: flex;
    flex-direction: column;

    .item-type {
      display: flex;
      flex-direction: column;
      margin-top: 8px;
      margin-bottom: 4px;

      .item-type-icon {
        margin: auto;
        width: 20px;
        height: 20px;
      }

      .homework, .session {
        width: 40px;
        height: 40px;
      }

      span {
        margin: auto;
        font-size: 0.875rem;
      }
    }

    hr {
      margin-left: 15px;
      margin-right: 15px;
      border: 0;
      border-top: 1px solid $color-border;
    }

    .preview {
      display: flex;
      flex-direction: column;
      border: 1px solid transparent;
      border-radius: 5px;
      margin: 10px 0;

      .preview-icon {
        margin: auto;
        width: 20px;
        height: 20px;
      }

      span {
        text-align: center;
        margin: auto;
        font-size: 0.875rem;
      }

      &:hover {
        cursor: pointer;
      }
    }

    .delete-item {
      display: flex;
      flex-direction: column;
      border: 1px solid transparent;
      border-radius: 5px;
      margin: 10px 0;

      .delete-icon {
        margin: auto;
        width: 20px;
        height: 20px;
      }

      span {
        text-align: center;
        margin: auto;
        font-size: 0.875rem;
      }

      &:hover {
        cursor: pointer;
      }
    }
}

  .vertical-2 {
    width: 92%;

    .item-header {
      height: 50px;
      display: flex;
      justify-content: space-around;
      margin: 20px 10px 10px 0;

      .item-title {
        width: 70%;
        margin-right: 20px;

        &.fullWidth {
          width: 100%;
          margin-right: 0;
        }
      }
      span.item-title {
        width: 100%;
        margin: auto;
      }

      .homework-type {
        width: 20%;
        min-width: 190px;
        margin-right: 10px;
      }

      .homework-duration {
        margin-left: 10px;
        margin-right: 10px;
        min-width: 110px;
        width: 10%;
      }
    }

    .item-contents {
      .item-content {
        margin: 10px 10px 10px 0;
      }
    }

    .add-document {
      margin-left: 10px;

      button {
        margin-right: 10px;
        border-radius: 20px;
      }

      span {
        text-decoration: underline;
        color: blue;
      }
    }

    .add-content-buttons {
      margin: 40px auto 20px auto;
      width: 300px;
      display: flex;
      justify-content: space-around;

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
  }
}
</style>

<i18n locale="fr">
{
  "add-document": "Ajouter un document à compléter",
  "addFile": "Ajouter une pièce jointe",
  "addH5p": "Ajouter un élément h5p",
  "addLink": "Ajouter un lien",
  "addSound": "S'enregistrer",
  "addText": "Ajouter du texte",
  "addVideo": "Ajouter une vidéo",
  "changeItemType": "Modifier le type de devoir",
  "delete": "Supprimer",
  "deleteItemWarning": "Supprimer ce contenu ?",
  "duration": "Durée",
  "fileToSendType": "Fichier à compléter",
  "homework": "Devoir",
  "preview": "Aperçu",
  "previewContent": "Pré-visualiser ce contenu",
  "simpleHomeworkType": "Consigne simple",
  "session": "Séance",
  "title": "Titre"
}
</i18n>
