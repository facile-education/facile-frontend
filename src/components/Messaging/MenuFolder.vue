<template>
  <div class="menu-folder">
    <!-- Folder icon + name + actions -->
    <button
      v-if="!displayFolderNameInput"
      ref="personalFolder"
      class="personal-folder"
      :class="{'selected': isSelected, 'active': isActive, 'theme-background-color': isActive }"
      :title="currentFolder.folderName"
      :data-test="'personalSubFolder-' + currentFolder.folderName"
      @dragover="setActive"
      @dragleave="cancelActive"
      @drop="dropThreads"
      @click="handleClick"
    >
      <span class="icon-container">
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
      </span>

      <span class="folder-name">
        {{ folder.folderName + (folder.nbUnread > 0 ? ' (' +folder.nbUnread + ')' : '') }}
      </span>

      <span
        v-if="!(mq.phone || mq.tablet)"
        class="folder-actions"
      >
        <button
          :title="$t('Messaging.rename')"
          data-test="rename"
          @click.stop="toggleFolderNameInput"
        >
          <img
            src="@/assets/icons/pencil.svg"
            alt="edit folder"
            class="folder-action edit"
          >
        </button>
        <button
          :title="$t('Messaging.addSubFolder')"
          data-test="add"
          @click.stop="toggleNewFolderInput"
        >
          <BaseIcon
            name="plus"
            class="folder-action add"
          />
        </button>
        <button
          :title="$t('Messaging.deleteFolder')"
          data-test="delete"
          @click.stop="askToConfirmFolderDeletion"
        >
          <img
            src="@/assets/icons/trash.svg"
            alt="delete folder"
            class="folder-action delete"
          >
        </button>
      </span>
    </button>

    <!-- Input for folder name edition -->
    <WeprodeInput
      v-if="displayFolderNameInput"
      ref="folderNameInput"
      v-model="currentFolder.folderName"
      class="folder-name-input"
      @blur="editFolderName"
      @keyup.enter.stop="blurFolderNameInput"
      @keyup.escape="displayFolderNameInput = false"
    />

    <!-- Input for subfolder name creation -->
    <WeprodeInput
      v-if="displayNewFolderInput"
      ref="newFolderInput"
      v-model="newFolderName"
      class="new-folder-input"
      :placeholder="$t('newFolder')"
      @blur="createSubFolder"
      @keyup.enter.stop="blurNewFolderNameInput"
      @keyup.escape="displayNewFolderInput = false"
    />

    <!-- Sub folders -->
    <ul
      v-if="isExpanded && folder.subFolders.length > 0"
      class="sub-folder-list"
    >
      <li
        v-for="subFolder in sortedSubFolders"
        :key="subFolder.folderId"
      >
        <MenuFolder
          class="sub-folder"
          :folder="subFolder"
        />
      </li>
    </ul>
  </div>
</template>

<script>
import BaseIcon from '@components/Base/BaseIcon'
import messagingUtils from '@utils/messaging.utils'
import _ from 'lodash'
import { nextTick } from 'vue'

import folderService from '@/api/messaging/folder.service'
import messageService from '@/api/messaging/message.service'
import WeprodeInput from '@/components/Base/Weprode/WeprodeInput.vue'
import { MESSAGING } from '@/constants/appConstants'

export default {
  name: 'MenuFolder',
  components: {
    BaseIcon,
    WeprodeInput
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
      currentFolderOldName: '',
      isExpanded: false,
      displayNewFolderInput: false,
      displayFolderNameInput: false,
      newFolderName: '',
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
    this.currentFolderOldName = this.currentFolder.folderName
  },
  methods: {
    handleClick (e) {
      if (e.pointerType === 'mouse' || e.mozInputSource === 1) {
        // Remove focus from button
        const vm = this
        nextTick(function () {
          vm.$refs.personalFolder.blur()
        })
      }
      this.selectFolder() // Invert following instructions to change extend behaviour
      this.$router.push({ name: MESSAGING })
      if (this.isSelected) {
        this.isExpanded = !this.isExpanded
      }
    },
    toggleFolderNameInput (e) {
      this.displayFolderNameInput = !this.displayFolderNameInput
      if (this.displayFolderNameInput && (e.pointerType === 'mouse' || e.mozInputSource === 1)) { // focus input if it's safe (enter button submit input if focused)
        const vm = this
        nextTick(function () {
          vm.$refs.folderNameInput.focus()
        })
      }
    },
    toggleNewFolderInput (e) {
      this.displayNewFolderInput = !this.displayNewFolderInput
      if (this.displayNewFolderInput && (e.pointerType === 'mouse' || e.mozInputSource === 1)) { // focus input if it's safe (enter button submit input if focused)
        const vm = this
        nextTick(function () {
          vm.$refs.newFolderInput.focus()
        })
      }
    },
    blurFolderNameInput () {
      const vm = this
      nextTick(function () {
        vm.$refs.folderNameInput.blur()
      })
    },
    blurNewFolderNameInput () {
      const vm = this
      nextTick(function () {
        vm.$refs.newFolderInput.blur()
      })
    },
    selectFolder () {
      this.$store.dispatch('messaging/selectFolder', this.folder)
      if (this.mq.phone || this.mq.tablet) {
        this.$store.dispatch('messaging/hideMenuPanel')
      }
    },
    createSubFolder () {
      this.displayNewFolderInput = false
      if (this.newFolderName.length > 0) {
        folderService.addFolder(this.folder.folderId, this.newFolderName).then((data) => {
          if (data.success) {
            this.$store.dispatch('messaging/addSubFolder', {
              personalFolder: this.currentFolder,
              subFolder: data.folder
            })
            this.isExpanded = true
            this.newFolderName = ''
          }
        })
      }
    },
    editFolderName () {
      this.displayFolderNameInput = false
      if (this.currentFolder.folderName.length === 0) {
        this.currentFolder.folderName = this.currentFolderOldName
      } else {
        folderService.renameFolder(this.folder.folderId, this.currentFolder.folderName).then((data) => {
          if (data.success) {
            this.currentFolderOldName = this.currentFolder.folderName
            this.$store.dispatch('messaging/updatePersonalFolder', data.renamedFolder)
          }
        })
      }
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

ul {
  margin: 0;
  padding: 0;
  list-style-type: none;
}

button {
  margin: 0;
  padding: 0;
  border: none;

  &:not(.theme-background-color) {
    background-color: transparent;
  }
}

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
    position: relative;
    overflow: hidden;
    text-align: left;

    &:hover:not(.selected) {
      font-weight: bold;
    }
    &.selected {
      font-weight: bold;
    }

    &:focus-within &:focus-visible {
      background-color: yellow;
    }

    &:hover, &:focus-within {
      .folder-actions {
        transform: translateX(-100%);
      }
    }

    .icon-container {
      min-width: 30px;
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
      position: absolute;
      top: 0;
      left: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      overflow: hidden;
      transition: all .3s ease;

      /* disable text selection icons */
      -ms-user-select: none;
      -moz-user-select: none;
      -webkit-user-select: none;
      user-select: none; /* CSS3 (little to no support) */

      button {
        background-color: white;
        width: 30px;
        transition: all .3s ease;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: none;
        cursor: pointer;

        &:hover {
          background-color: $color-hover-bg;
        }
      }

      .edit {
        width: 20px;
      }

      .add, .delete {
        width: 16px;
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

<i18n locale="fr">
{
  "newFolder": "Nouveau dossier"
}
</i18n>
