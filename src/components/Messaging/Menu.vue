<template>
  <section
    class="menu-panel"
    :class="{'phone': mq.phone || mq.tablet}"
  >
    <div
      v-if="mq.phone || mq.tablet"
      class="menu-header"
    >
      <h3 v-t="'Messaging.boxes'" />
    </div>

    <nav
      v-if="folderList.length > 0"
      class="menu"
    >
      <ul>
        <li>
          <!-- Inbox -->
          <MenuRootFolder
            ref="inboxFolder"
            class="base-folder"
            :folder="inboxFolder"
            :icon="require('@assets/icon_reception.svg')"
            :drop-allowed="true"
            icon-width="21px"
            alt="icon reception"
          />
        </li>
        <li>
          <!-- Draft -->
          <MenuRootFolder
            class="base-folder"
            :folder="draftFolder"
            :icon="require('@assets/icons/messaging_draft.svg')"
            :drop-allowed="true"
            icon-width="16px"
            alt="icon draft"
          />
        </li>
        <li>
          <!-- Sent -->
          <MenuRootFolder
            class="base-folder"
            :folder="sentFolder"
            :icon="require('@assets/icons/messaging_sent.svg')"
            :drop-allowed="true"
            icon-width="19px"
            alt="icon sent"
          />
        </li>
        <li>
          <!-- Trash -->
          <MenuRootFolder
            class="base-folder"
            :folder="trashFolder"
            :icon="require('@assets/icons/trash.svg')"
            :drop-allowed="true"
            icon-width="18px"
            alt="icon trash"
          />
        </li>
      </ul>

      <!-- Personal folders -->
      <div
        class="personal-folders base-folder"
        data-test="personalFolders"
        @click="togglePersonalFolders"
        @dragover="isPersonalFoldersExpanded = true"
      >
        <div class="icon-container">
          <img
            src="@assets/icons/messaging_folders.svg"
            alt=""
            class="folder-icon"
          >
        </div>
        {{ $t('Messaging.personalFolders') }}
        <button
          v-if="!(mq.phone || mq.tablet)"
          class="folder-actions"
          :class="{'display-input': displayNewFolderInput}"
          data-test="createMessagingFolder"
          :title="$t('Messaging.addFolder')"
          @click.stop="toggleNewFolderInput"
        >
          <BaseIcon
            name="plus"
            class="fa-lg folder-action"
          />
        </button>
      </div>
      <PentilaInput
        v-if="displayNewFolderInput"
        ref="newFolderInput"
        v-model="newFolderName"
        class="new-folder-input"
        placeholder="Nouveau dossier"
        @blur="createPersonalRootFolder"
        @keyup.enter.stop="blurNewFolderNameInput"
        @keyup.escape="displayNewFolderInput = false"
      />

      <!-- Sub folders -->
      <ul v-if="isPersonalFoldersExpanded">
        <MenuFolder
          v-for="folder in personalFolders"
          :key="folder.folderId"
          class="personal-sub-folder"
          :folder="folder"
        />
      </ul>
    </nav>
  </section>
</template>

<script>

import folderService from '@/api/messaging/folder.service'
import constants from '@/constants/messagingConstants'
import BaseIcon from '@components/Base/BaseIcon'
import messageService from '@/api/messaging/message.service'
import MenuFolder from '@components/Messaging/MenuFolder'
import MenuRootFolder from '@components/Messaging/MenuRootFolder'
import { nextTick } from 'vue'
import messagingUtils from '@utils/messaging.utils'
import PentilaUtils from 'pentila-utils'

export default {
  name: 'Menu',
  components: {
    MenuRootFolder,
    BaseIcon,
    MenuFolder
  },
  inject: ['mq'],
  props: {
    isDisplayed: {
      type: Boolean,
      default: false
    }
  },
  data: function () {
    return {
      isLoadingFolders: false,
      isPersonalFoldersExpanded: true,
      displayNewFolderInput: false,
      newFolderName: '',
      isTrashActive: false
    }
  },
  computed: {
    folderList () {
      return this.$store.state.messaging.messagingFolders
    },
    inboxFolder () {
      return this.folderList.find(folder => folder.type === constants.messagingInboxFolderType)
    },
    draftFolder () {
      return this.folderList.find(folder => folder.type === constants.messagingDraftFolderType)
    },
    sentFolder () {
      return this.folderList.find(folder => folder.type === constants.messagingSentFolderType)
    },
    trashFolder () {
      return this.folderList.find(folder => folder.type === constants.messagingTrashFolderType)
    },
    personalFolders () {
      return PentilaUtils.Array.sortWithString(this.folderList.filter(folder => folder.type === constants.messagingPersonalFolderType), false, 'folderName')
    },
    isAPersonalFolderSelected () {
      for (let i = 0; i < this.personalFolders.length; i++) {
        const selectedFolderId = this.$store.state.messaging.currentFolder.folderId
        if (messagingUtils.getFolderFromId(this.personalFolders[i].subFolders, selectedFolderId) !== undefined) {
          return true
        }
      }
      return false
    },
    isDisplayMessageFromRouting () {
      return this.$store.state.messaging.displayMessageFromRouting
    }
  },
  watch: {
    isAPersonalFolderSelected: {
      immediate: true,
      handler () {
        if (this.isDisplayMessageFromRouting && this.isAPersonalFolderSelected) {
          this.isPersonalFoldersExpanded = true
        }
      }
    },
    isDisplayed (value) {
      if (value) {
        this.$refs.inboxFolder.$el.focus()
      }
    }
  },
  methods: {
    blurNewFolderNameInput () {
      const vm = this
      nextTick(function () {
        vm.$refs.newFolderInput.blur()
      })
    },
    toggleSideMenuPanel () {
      this.$store.dispatch('messaging/toggleSideMenuPanel')
    },
    togglePersonalFolders () {
      this.isPersonalFoldersExpanded = !this.isPersonalFoldersExpanded
    },
    toggleNewFolderInput (event) {
      this.displayNewFolderInput = !this.displayNewFolderInput
      if (this.displayNewFolderInput && (event.pointerType === 'mouse' || event.mozInputSource === 1)) {
        // Focus input
        const vm = this
        nextTick(function () {
          vm.$refs.newFolderInput.focus()
        })
      }
    },
    nbUnread (folderId) {
      for (const folder in this.$store.state.messaging.messagingFolders) {
        if (folder.folderId === folderId) {
          return folder.nbUnread
        }
      }
      return 0
    },
    createPersonalRootFolder () {
      this.displayNewFolderInput = false
      if (this.newFolderName.length > 0) { // Basic check, TODO: Other form like verifications?
        folderService.addFolder(0, this.newFolderName).then((data) => {
          if (data.success) {
            this.$store.dispatch('messaging/addPersonalRootFolder', data.folder)
            this.isPersonalFoldersExpanded = true
            this.newFolderName = ''
          }
        })
      }
    },
    cancelHandlers (e) {
      e.preventDefault()
      e.stopPropagation()
    },
    setTrashActive (e) {
      this.isTrashActive = true
      this.cancelHandlers(e)
    },
    cancelTrashActive (e) {
      this.isTrashActive = false
      this.cancelHandlers(e)
    },
    moveToTrash (e) {
      this.cancelTrashActive(e)
      const messageIdsToMove = []
      const draggedThreads = JSON.parse(e.dataTransfer.getData('draggedThreads'))
      for (const draggedThread of draggedThreads) {
        for (const message of draggedThread.messages) {
          messageIdsToMove.push(message.messageId)
        }
      }
      messageService.moveMessages(this.trashFolder.folderId, messageIdsToMove).then((data) => {
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

.menu-panel {
  background-color: white;
  height: 100%;
  overflow: auto;
  border-right: 1px solid $color-border;

  &.phone {
    border-right: none;

    .menu .base-folder {
      padding-left: 20px;
    }
  }
}

ul {
  margin: 0;
  padding: 0;
  list-style-type: none;
}

.menu-header {
  height: calc(#{$messaging-header-height + 1px});
  width: 100%;
  display: flex;
  align-items: center;
  font-size: 1.25em;
  margin-left: 20px;
  margin-top: 15px;
}
hr {
  margin: 0;
}
.menu {
  width: 100%;

  .base-folder {
    padding-left: 10px;
  }

  .personal-folders {
    height: 40px;
    display: flex;
    align-items: center;
    cursor: pointer;

    &:hover {
      font-weight: bold;
    }

    .icon-container {
      min-width: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 10px;

      .folder-icon {
        width: 19px;
      }
    }

    .folder-actions {
      cursor: pointer;
      margin-left: auto;
      margin-right: 25px;
      background-color: transparent;
      border: none;
      opacity: 0;

      &:focus, .display-input{
        opacity: 1;
      }
    }
    &:hover .folder-actions {
      opacity: 1;
    }
  }

  .new-folder-input {
    height: 40px;
    margin-left: 20px;
  }

  .personal-sub-folder {
    margin-left: 30px;
  }
}
</style>
