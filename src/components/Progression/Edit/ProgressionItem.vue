<template>
  <div
    class="progression-item"
  >
    <div
      class="item-header"
    >
      <span
        v-if="item.isHomework"
      >
        {{ $t('homework') }}
      </span>
      <span
        v-else
      >
        {{ $t('session') }}
      </span>

      <!-- Preview -->
      <img
        src="@assets/icon_apercu.svg"
        title="Pré-visualiser ce contenu"
        class="preview"
        @click="togglePreviewModalDisplay()"
      >

      <!-- Item title -->
      <PentilaInput
        :model-value="item.name"
        :placeholder="$t('title')"
        :maxlength="75"
        class="item-title"
        @update:modelValue="updateInput"
        @blur="blurInput"
      />

      <!-- Delete item button-->
      <NeroIcon
        name="fa-trash"
        class="header-button"
        @click="confirmItemDeletion(item)"
      />
    </div>

    <!-- Item contents in proper order -->
    <div
      class="item-contents"
    >
      <ProgressionItemContent
        v-for="content in sortedItemContents"
        :key="content.contentId"
        :content="content"
        class="item-content"
      />
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
        @click="addSound()"
      >
      <img
        class="add-content-button"
        src="@assets/icon_link.svg"
        :alt="$t('addLink')"
        :title="$t('addLink')"
        @click="addLink()"
      >
      <img
        class="add-content-button"
        src="@assets/icon_play.svg"
        :alt="$t('addVideo')"
        :title="$t('addVideo')"
        @click="addVideo()"
      >
      <img
        class="add-content-button"
        src="@assets/icon_upload.svg"
        :alt="$t('addFile')"
        :title="$t('addFile')"
        @click="openFilePicker()"
      >
      <img
        class="add-content-button"
        src="@assets/icon_h5p.svg"
        :alt="$t('addH5p')"
        :title="$t('addH5p')"
        @click="addH5p()"
      >
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
        @addedFiles="attachNewFile"
        @close="closeFilePicker"
      />
    </teleport>
  </div>
</template>

<script>
import ProgressionItemContent from '@/components/Progression/Edit/ProgressionItemContent'
import PreviewModal from '@/components/Progression/Edit/PreviewModal'
import FilePickerModal from '@/components/FilePicker/FilePickerModal'
import NeroIcon from '@/components/Nero/NeroIcon'

export default {
  name: 'ProgressionItem',
  components: { ProgressionItemContent, PreviewModal, FilePickerModal, NeroIcon },
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      textContent: 'A compléter',
      editorOptions: {},
      isPreviewModalDisplayed: false,
      isFilePickerDisplayed: false,
      isMultiSelectionAllowed: true
    }
  },
  computed: {
    sortedItemContents () {
      console.log('sortedItemContents=', this.item.contents)
      return this.item.contents
    }
  },
  created () {
  },
  methods: {
    addText () {
      this.$store.dispatch('progression/addItemContent', { itemId: this.item.itemId, contentType: 1 })
    },
    addSound () {
      this.$store.dispatch('progression/addItemContent', { itemId: this.item.itemId, contentType: 2 })
    },
    addLink () {
      this.$store.dispatch('progression/addItemContent', { itemId: this.item.itemId, contentType: 3 })
    },
    addVideo () {
      this.$store.dispatch('progression/addItemContent', { itemId: this.item.itemId, contentType: 4 })
    },
    addH5p () {
      this.$store.dispatch('progression/addItemContent', { itemId: this.item.itemId, contentType: 6 })
    },
    updateInput (value) {
      console.log('updateInput ', value)
    },
    blurInput (value) {
      console.log('blurInput ', value)
    },
    togglePreviewModalDisplay () {
      this.isPreviewModalDisplayed = !this.isPreviewModalDisplayed
    },
    confirmItemDeletion (item) {
      this.$store.dispatch('warningModal/addWarning', {
        text: this.$t('warning'),
        lastAction: { fct: this.deleteItem, params: [item] }
      })
    },
    deleteItem (item) {
      this.$store.dispatch('progression/deleteItem', item)
    },
    updateContent () {
      console.log('update ck content')
    },
    openFilePicker () {
      this.isFilePickerDisplayed = true
    },
    closeFilePicker () {
      this.isFilePickerDisplayed = false
    },
    attachNewFile (selectedFiles) {
      console.log('new files are ', selectedFiles)
    }
  }
}
</script>

<style lang="scss" scoped>
.progression-item {
  width: 90%;
  border: 1px solid #D4D4D4;
  border-radius: 6px;
  background-color: #FFFFFF;
  margin: 10px;

  .item-header {
    height: 50px;
    border-bottom: 1px solid black;
    display: flex;
    justify-content: space-around;
    margin-bottom: 10px;
    z-index: 0;
    .preview {
      width: 30px;
      height: 30px;
      margin: auto;
    }
    span {
      width: 15%;
      text-align: center;
      margin: auto;
    }
    .item-title {
      z-index: 5;
    }
    .header-button {
      width: 10%;
      margin: auto;
    }
  }
  .item-contents {
    .item-content {
      margin: 10px;
    }
  }
  .add-content-buttons {
    margin: auto;
    margin-top: 20px;
    margin-bottom: 20px;
    width: 300px;
    display: flex;
    justify-content: space-around;
    .add-content-button {
      border: 1px solid transparent;
      border-radius: 5px;
      padding: 5px;
      margin: 5px;
      &:hover {
        border: 1px solid black;
        cursor: pointer;
      }
    }
  }
}
</style>

<i18n locale="fr">
{
  "session": "Séance",
  "homework": "Devoir",
  "title": "Titre",
  "addText": "Ajouter du texte",
  "addSound": "S'enregistrer",
  "addLink": "Ajouter un lien https",
  "addVideo": "Ajouter une vidéo",
  "addFile": "Ajouter une pièce jointe",
  "addH5p": "Ajouter un élément h5p"
}
</i18n>
