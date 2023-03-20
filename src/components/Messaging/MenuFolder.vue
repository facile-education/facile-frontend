<template>
  <div class="menu-folder">
    <!-- Folder icon + name + actions -->
    <div
      v-if="!displayFolderNameInput"
      class="personal-folder"
      :class="{'selected': isSelected, 'active': isActive }"
      :title="currentFolder.folderName"
      @mouseover="isHovering = true"
      @mouseleave="isHovering = false"
      @dragover="setActive"
      @dragleave="cancelActive"
      @drop="dropThreads"
      @click="handleClick"
    >
      <div class="icon-container">
        <BaseIcon
          v-if="!isExpanded && folder.subFolders.length > 0"
          name="caret-right"
          class="fa-lg folder-icon"
          @click.stop="isExpanded = true"
        />
        <BaseIcon
          v-if="isExpanded && folder.subFolders.length > 0"
          name="caret-down"
          class="fa-lg folder-icon"
          @click.stop="isExpanded = false"
        />
      </div>

      <div class="folder-name">
        {{ currentFolder.folderName }}
      </div>

      <div
        v-if="isHovering"
        class="folder-actions"
      >
        <img
          src="@/assets/options/icon_edit_texte.svg"
          alt="edit folder"
          class="folder-action edit"
          :title="$t('Messaging.rename')"
          @click.stop="toggleFolderNameInput"
        >
        <BaseIcon
          name="plus"
          class="folder-action add"
          :title="$t('Messaging.addFolder')"
          @click.stop="toggleNewFolderInput"
        />
        <img
          src="@/assets/icon_trash.svg"
          alt="delete folder"
          class="folder-action delete"
          :title="$t('Messaging.deleteFolder')"
          @click.stop="askToConfirmFolderDeletion"
        >
      </div>
    </div>

    <!-- Input for folder name edition -->
    <PentilaInput
      v-if="displayFolderNameInput"
      ref="folderNameInput"
      v-model="currentFolder.folderName"
      class="folder-name-input"
      @keyup.enter.stop="editFolderName"
      @keyup.escape="displayFolderNameInput = false"
    />

    <!-- Input for subfolder name creation -->
    <PentilaInput
      v-if="displayNewFolderInput"
      ref="newFolderInput"
      v-model="newFolderName"
      class="new-folder-input"
      placeholder="Nouveau dossier"
      @keyup.enter.stop="createSubFolder"
      @keyup.escape="displayNewFolderInput = false"
    />

    <!-- Sub folders -->
    <div
      v-if="isExpanded && folder.subFolders.length > 0"
      class="sub-folder-list"
    >
      <MenuFolder
        v-for="subFolder in sortedSubFolders"
        :key="subFolder.folderId"
        class="sub-folder"
        :folder="subFolder"
      />
    </div>
  </div>
</template>

<script>

import folderService from '@/api/messaging/folder.service'
import messageService from '@/api/messaging/message.service'
import BaseIcon from '@components/Base/BaseIcon'
import _ from 'lodash'
import { nextTick } from 'vue'
import messagingUtils from '@utils/messaging.utils'

export default {
  name: 'MenuFolder',
  components: {
    BaseIcon
  },
  inject: ['mq'],
  props: {
    folder: {
      type: Object,
      required: true
    }
  },
  data: function () {
    return {
      currentFolder: {},
      isExpanded: false,
      displayNewFolderInput: false,
      displayFolderNameInput: false,
      newFolderName: '',
      isHovering: false,
      isActive: false,
      isDragging: false
    }
  },
  computed: {
    sortedSubFolders () {
      return _.orderBy(this.folder.subFolders, 'folderName', 'asc')
    },
    isSelected () {
      return this.$store.state.messaging.currentFolder.folderId === this.folder.folderId
    },
    isSubFolderSelected () {
      const selectedFolderId = this.$store.state.messaging.currentFolder.folderId
      return messagingUtils.getFolderFromId(this.folder.subFolders, selectedFolderId) !== undefined
    },
    draggedThreads () {
      return this.$store.state.messaging.draggedThreads
    }
  },
  created () {
    this.renamedFolderName = this.folder.folderName
    this.currentFolder = JSON.parse(JSON.stringify(this.folder))
    if (this.isSubFolderSelected) {
      this.isExpanded = true
    }
  },
  methods: {
    handleClick () {
      this.selectFolder() // Invert following instructions to change extend behaviour
      this.$router.push({ name: 'Messaging' })
      if (this.isSelected) {
        this.isExpanded = !this.isExpanded
      }
    },
    toggleFolderNameInput () {
      this.displayFolderNameInput = !this.displayFolderNameInput
      if (this.displayFolderNameInput) {
        // Focus input
        const vm = this
        nextTick(function () {
          vm.$refs.folderNameInput.focus()
        })
      }
    },
    toggleNewFolderInput () {
      this.displayNewFolderInput = !this.displayNewFolderInput
      if (this.displayNewFolderInput) {
        // Focus input
        const vm = this
        nextTick(function () {
          vm.$refs.newFolderInput.focus()
        })
      }
    },
    selectFolder () {
      this.$store.dispatch('messaging/selectFolder', this.folder)
      if (this.mq.phone || this.mq.tablet) {
        this.$store.dispatch('messaging/hideMenuPanel')
      }
    },
    createSubFolder () {
      this.displayNewFolderInput = false
      folderService.addFolder(this.folder.folderId, this.newFolderName).then((data) => {
        if (data.success) {
          this.$store.dispatch('messaging/addSubFolder', { personalFolder: this.currentFolder, subFolder: data.folder })
          this.isExpanded = true
          this.newFolderName = ''
        }
      })
    },
    editFolderName () {
      this.displayFolderNameInput = false
      folderService.renameFolder(this.folder.folderId, this.currentFolder.folderName).then((data) => {
        if (data.success) {
          this.$store.dispatch('messaging/updatePersonalFolder', data.renamedFolder)
        }
      })
    },
    askToConfirmFolderDeletion () {
      this.$store.dispatch('warningModal/addWarning', {
        text: this.$t('Messaging.confirmFolderDeletionWarning'),
        lastAction: { fct: this.deleteFolder }
      })
    },
    deleteFolder () {
      folderService.deleteFolder(this.folder.folderId).then((data) => {
        if (data.success) {
          this.$store.dispatch('messaging/deletePersonalFolder', this.currentFolder)
        }
      })
    },
    cancelHandlers (e) {
      e.preventDefault()
      e.stopPropagation()
    },
    setActive (e) {
      this.isActive = true
      this.isExpanded = true
      this.cancelHandlers(e)
    },
    cancelActive (e) {
      this.isActive = false
      this.cancelHandlers(e)
    },
    dropThreads (e) {
      this.cancelActive(e)
      const messageIdsToMove = []
      const draggedThreads = JSON.parse(e.dataTransfer.getData('draggedThreads'))
      for (const draggedThread of draggedThreads) {
        for (const message of draggedThread.messages) {
          messageIdsToMove.push(message.messageId)
        }
      }
      messageService.moveMessages(this.folder.folderId, messageIdsToMove).then((data) => {
        if (data.success) {
          // Reload current folder
          this.$store.dispatch('messaging/selectFolder', this.$store.state.messaging.currentFolder)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@design';

.menu-folder {
  margin-left: 15px;
  flex-direction: column;
  align-items: center;

  .personal-folder {
    margin-right: 10px;
    width: 100%;
    height: 40px;
    cursor: pointer;
    display: flex;
    align-items: center;

    &.active {
      color: $color-light-text;
      background-color: blue;
    }

    &:hover:not(.selected) {
      //background-color: $color-menu-hover-bg;
      font-weight: bold;
    }
    &.selected {
      //background-color: $color-selected-bg;
      font-weight: bold;
    }

    .icon-container {
      width: 30px;
      display: flex;
      align-items: center;
      justify-content: center;

      .folder-icon {
        width: 20px;
        font-size: 1em;
      }
    }

    .folder-name {
      flex: 1;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      margin-right: 10px;
    }

    .folder-actions {
      display: flex;
      align-items: center;
      margin-left: auto;
      /* disable text selection icons */
      -ms-user-select: none;
      -moz-user-select: none;
      -webkit-user-select: none;
      user-select: none; /* CSS3 (little to no support) */

      .folder-action {
        margin-right: 5px;
        height: 40px;
      }

      .edit {
        width: 20px;

        &:hover {
          width: 21px;
        }
      }

      .add {
        width: 16px;
        &:hover {
          font-weight: bold;
        }
      }

      .delete {
        width: 16px;
        &:hover {
          width: 17px;
        }
      }
    }
  }

  .new-folder-input, .folder-name-input {
    width: 100%;
    height: 40px;
  }

  .sub-folder-list {
    display: flex;
    flex-direction: column;
  }
}
</style>
