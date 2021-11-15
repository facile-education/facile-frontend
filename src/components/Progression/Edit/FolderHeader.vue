<template>
  <div
    v-if="currentFolder"
    class="folder-header"
  >
    <PentilaInput
      ref="folderName"
      v-model="folderNameInputText"
      :maxlength="75"
      class="folder-title"
      @blur="saveNewFolderName"
      @keyup.enter="pressEnter"
    />

    <PentilaButton
      class="delete-folder-button"
      cls="cancel"
      @click="confirmFolderDeletion"
    >
      <img
        class="trash-icon"
        src="@assets/trash.svg"
        :alt="$t('delete')"
        :title="$t('delete')"
      >
      <span v-t="'delete'" />
    </PentilaButton>
  </div>
</template>

<script>
export default {
  name: 'FolderHeader',
  data () {
    return {
      folderNameInputText: ''
    }
  },
  computed: {
    currentFolder () {
      return this.$store.state.progression.currentFolder
    },
    currentFolderName () {
      return this.currentFolder ? this.currentFolder.name : undefined
    },
    haveToFocusFolderNameInput () {
      return this.$store.state.progression.haveToFocusFolderNameInput
    }
  },
  watch: {
    currentFolderName (newName) {
      // When selected folder changes
      // Put its name in the input
      this.folderNameInputText = newName
    },
    haveToFocusFolderNameInput (value) {
      if (value) {
        this.focusNameInput()
      }
    }
  },
  created () {
    this.folderNameInputText = this.currentFolderName
  },
  mounted () {
    if (this.haveToFocusFolderNameInput) {
      this.focusNameInput()
    }
  },
  methods: {
    pressEnter () {
      this.$refs.folderName.$el.blur()
    },
    saveNewFolderName () {
      if (this.folderNameInputText === '') {
        this.folderNameInputText = this.currentFolderName // Reset name to old one
      } else {
        if (this.folderNameInputText !== this.$store.state.progression.currentFolder.name) {
          // TODO: handle WS error to 'unUpdate' folderNameInputText
          this.$store.dispatch('progression/updateFolderName', {
            folder: this.currentFolder,
            newFolderName: this.folderNameInputText
          })
        }
      }
    },
    confirmFolderDeletion () {
      this.$store.dispatch('warningModal/addWarning', {
        text: this.$t('warning'),
        lastAction: { fct: this.deleteFolder }
      })
    },
    deleteFolder () {
      this.$store.dispatch('progression/deleteFolder', this.currentFolder)
    },
    focusNameInput () { // TODO: focus title when it's a new created folder
      this.$refs.folderName.focus()
      this.$refs.folderName.select()
      this.$store.dispatch('progression/haveFocusedFolderNameInput')
    }
  }
}
</script>

<style lang="scss" scoped>

.folder-header {
  display: flex;
  align-items: center;
  height: 62px;

  .folder-title {
    margin-right: 15px;
    padding-left: 0;
    /* TODO adapt width (or input size property) with text size */
    flex: 1;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow-x: hidden;
    font-size: 1.5rem;
    font-weight: 500;
    letter-spacing: 0;
    line-height: 19px;

    /** prettier but non-conform **/
    background: none;

    &:focus {
      background-color: #F5F5F5;
    }
    &:not(:hover) {
      border: none;
      margin-bottom: 1px;
    }
  }

  .delete-folder-button {
    margin-left: auto;
    height: 39px;
    display: flex;
    justify-content: center;
    align-items: center;

    span {
      margin-left: 12px;
    }

    .trash-icon {
      width: 20px;
      height: 20px;
    }
  }
}
</style>

<i18n locale="fr">
{
  "delete": "Supprimer cette section",
  "warning": "La suppression de cette section est définitive."
}
</i18n>
