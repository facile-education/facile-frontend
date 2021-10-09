<template>
  <div
    class="progression-item"
  >
    <div
      class="vertical-1"
    >
      <!-- Homework case -->
      <div
        v-if="item.isHomework"
        class="item-type"
        @click="toggleChangeTypeMenu()"
      >
        <img
          class="item-type-icon"
          src="@assets/devoir.svg"
          :alt="$t('homework')"
          :title="$t('homework')"
        >
        <span>{{ $t('homework') }}</span>
        <img
          src="@assets/arrow-down.svg"
          class="change-type-icon"
          :alt="$t('changeItemType')"
          :title="$t('changeItemType')"
        >
        <!-- Homework type menu -->
        <div
          v-if="isChangeTypeMenuDisplayed"
          class="change-type-menu"
        >
          <!-- Simple homework -->
          <div
            class="change-type-menu-item"
            @click="doChangeType(1)"
          >
            <span>{{ $t('simpleHomeworkType') }}</span>
          </div>
          <!-- File to send -->
          <div
            class="change-type-menu-item"
            @click="doChangeType(2)"
          >
            <span>{{ $t('fileToSendType') }}</span>
          </div>
        </div>
      </div>

      <!-- Session case -->
      <div
        v-else
        class="item-type"
      >
        <img
          class="item-type-icon"
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
      >
        <img
          src="@assets/icon_apercu.svg"
          title="Pré-visualiser ce contenu"
          class="preview-icon"
          @click="togglePreviewModalDisplay()"
        >
        <span>{{ $t('preview') }}</span>
      </div>

      <hr>
      <!-- Delete item button-->
      <div
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
    <div
      class="vertical-2"
    >
      <div
        class="item-header"
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
          @click="toggleLinkModalDisplay()"
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
    <teleport to="body">
      <LinkModal
        v-if="isLinkModalDisplayed"
        height="30em"
        :item="item"
        @close="toggleLinkModalDisplay"
      />
    </teleport>
  </div>
</template>

<script>
import ProgressionItemContent from '@/components/Progression/Edit/ProgressionItemContent'
import PreviewModal from '@/components/Progression/Edit/PreviewModal'
import LinkModal from '@/components/Progression/Edit/LinkModal'
import FilePickerModal from '@/components/FilePicker/FilePickerModal'

export default {
  name: 'ProgressionItem',
  components: { ProgressionItemContent, PreviewModal, LinkModal, FilePickerModal },
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      editorOptions: {},
      isPreviewModalDisplayed: false,
      isLinkModalDisplayed: false,
      isFilePickerDisplayed: false,
      isMultiSelectionAllowed: true,
      isChangeTypeMenuDisplayed: false
    }
  },
  computed: {
    sortedItemContents () {
      // TODO order by 'order'
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
    toggleLinkModalDisplay () {
      this.isLinkModalDisplayed = !this.isLinkModalDisplayed
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
    },
    toggleChangeTypeMenu () {
      this.isChangeTypeMenuDisplayed = !this.isChangeTypeMenuDisplayed
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
  display: flex;

  .vertical-1 {
    width: 10%;
    display: flex;
    flex-direction: column;
    .item-type {
      display: flex;
      flex-direction: column;
      margin-top: 10px;
      margin-bottom: 10px;
      .item-type-icon {
        margin: auto;
        width: 30px;
        height: 30px;
      }
      span {
        margin: auto;
        font-family: Roboto;
        font-size: 14px;
      }
      .change-type-icon {
        margin: auto;
        width: 15px;
        height: 15px;
      }
      .change-type-menu {
        width: 200px;
        height: 50px;
        .change-type-menu-item {
          margin: 5px;
          &:hover {
            background-color: #EFF3FB;
            cursor: pointer;
          }
        }
      }
    }

    hr {
      margin-left: 15px;
      margin-right: 15px;
      border: 0;
      border-top: 1px solid #D4D4D4;
    }

    .preview {
      display: flex;
      flex-direction: column;
      border: 1px solid transparent;
      border-radius: 5px;
      margin: 15px;
      .preview-icon {
        margin: auto;
        width: 25px;
        height: 25px;
      }
      span {
        text-align: center;
        margin: auto;
        font-family: Roboto;
        font-size: 14px;
      }
      &:hover {
        border: 1px solid grey;
        cursor: pointer;
      }
    }

    .delete-item {
      display: flex;
      flex-direction: column;
      border: 1px solid transparent;
      border-radius: 5px;
      margin: 15px;
      .delete-icon {
        margin: auto;
        width: 25px;
        height: 25px;
      }
      span {
        text-align: center;
        margin: auto;
        font-family: Roboto;
        font-size: 14px;
      }
      &:hover {
        border: 1px solid grey;
        cursor: pointer;
      }
    }

}

  .vertical-2 {

    width: 90%;
    .item-header {
      height: 50px;
      display: flex;
      justify-content: space-around;
      margin-top: 20px;
      margin-bottom: 10px;
      margin-left: 10px;
      margin-right: 10px;
      z-index: 0;
      .item-title {
        z-index: 5;
      }
      .header-buttons {
        width: 60px;
        display: flex;
        .header-button {
          width: 25px;
          height: 25px;
          margin: auto;
          border: 1px solid transparent;
          border-radius: 5px;
          &:hover {
            border: 1px solid grey;
            cursor: pointer;
          }
        }
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
          border: 1px solid grey;
          cursor: pointer;
        }
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
  "addH5p": "Ajouter un élément h5p",
  "delete": "Supprimer",
  "deleteItemWarning": "Supprimer ce contenu ?",
  "preview": "Aperçu",
  "changeItemType": "Modifier le type de devoir",
  "simpleHomeworkType": "Consigne simple",
  "fileToSendType": "Fichier à compléter"
}
</i18n>
