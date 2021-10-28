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
    />

    <PentilaButton
      class="delete-folder-button"
      @click="deleteFolder"
    >
      <img
        class="trash-icon"
        src="@assets/trash.svg"
        :alt="$t('delete')"
        :title="$t('delete')"
      >
      <span>{{ $t('delete') }}</span>
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
    }
  },
  watch: {
    currentFolderName (newName) {
      // When selected folder changes
      // Put its name in the input
      this.folderNameInputText = newName
      // With focus on it
      // if (this.$store.state.progression.currentFolder !== undefined && this.$refs.folderName !== undefined && this.$refs.folderName !== null) {
      //   this.$nextTick(() => this.$refs.folderName.$el.focus())
      // }
    }
  },
  created () {
    this.folderNameInputText = this.currentFolderName
  },
  methods: {
    saveNewFolderName () {
      if (this.updatedFolderName !== this.$store.state.progression.currentFolder.name) {
        // TODO: handle WS error to 'unUpdate' folderNameInputText
        this.$store.dispatch('progression/updateFolderName', { folder: this.currentFolder, newFolderName: this.folderNameInputText })
      }
    },
    deleteFolder () {
      this.$store.dispatch('progression/deleteFolder', this.currentFolder)
    },
    focusNameInput () { // TODO: focus title when it's a new created folder
      this.$refs.folderName.$el.focus()
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
    width: 249px;
    border-radius: 6px;
    background-color: #F5F5F5;
    color: black;
    display: flex;
    justify-content: center;
    align-items: center;

    .trash-icon {
      width: 20px;
      height: 20px;
      margin-right: 10px;
    }
  }
}
</style>

<i18n locale="fr">
{
  "delete": "Supprimer cette section"
}
</i18n>
