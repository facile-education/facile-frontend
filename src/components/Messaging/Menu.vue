<template>
  <div class="menu-panel">
    <div
      v-if="mq.phone || mq.tablet"
      class="menu-header"
    >
      <img
        src="@assets/menu/menu_messaging_black.svg"
        alt=""
      >
      <h3 v-t="'Messaging.boxes'" />
    </div>
    <div
      v-else
      class="menu-header"
    >
      <img
        src="@assets/icon_engrenage.svg"
        class="header-icon"
        alt="icon file"
        :title="$t('Messaging.Parameters.header')"
        @click="openParametersModal()"
      >
    </div>

    <nav
      v-if="folderList.length > 0"
      class="menu"
    >
      <!-- Inbox -->
      <MenuRootFolder
        class="base-folder"
        :folder="inboxFolder"
        :icon="require('@assets/icon_reception.svg')"
        :nb-notification="nbNewMessages"
        :drop-allowed="true"
        icon-width="21px"
        alt="icon reception"
      />

      <!-- Draft -->
      <MenuRootFolder
        class="base-folder"
        :folder="draftFolder"
        :icon="require('@assets/icon_fichier.svg')"
        :drop-allowed="true"
        icon-width="16px"
        alt="icon draft"
      />

      <!-- Sent -->
      <MenuRootFolder
        class="base-folder"
        :folder="sentFolder"
        :icon="require('@assets/icon_envoyes.svg')"
        :drop-allowed="true"
        icon-width="17px"
        alt="icon sent"
      />

      <!-- Trash -->
      <MenuRootFolder
        class="base-folder"
        :folder="trashFolder"
        :icon="require('@assets/icon_trash.svg')"
        :drop-allowed="true"
        icon-width="15px"
        alt="icon trash"
      />

      <!-- Personal folders -->
      <div
        class="personal-folders base-folder"
        data-test="personalFolders"
        @click="togglePersonalFolders"
        @dragover="isPersonalFoldersExpanded = true"
      >
        <div class="icon-container">
          <img
            src="@assets/icon_dossier_neutre.svg"
            alt=""
            class="folder-icon"
          >
        </div>
        {{ $t('Messaging.personalFolders') }}
        <div
          class="folder-actions"
          data-test="folder-actions"
        >
          <BaseIcon
            name="plus"
            data-test="createMessagingFolder"
            class="fa-lg folder-action"
            @click.stop="toggleNewFolderInput"
          />
        </div>
      </div>
      <PentilaInput
        v-if="displayNewFolderInput"
        ref="newFolderInput"
        v-model="newFolderName"
        class="new-folder-input"
        placeholder="Nouveau dossier"
        @keyup.enter.stop="createPersonalRootFolder"
        @keyup.escape="displayNewFolderInput = false"
      />

      <!-- Sub folders -->
      <div v-if="isPersonalFoldersExpanded">
        <MenuFolder
          v-for="folder in sortedPersonalFolders"
          :key="folder.folderId"
          class="personal-sub-folder"
          :folder="folder"
        />
      </div>
    </nav>
  </div>
</template>

<script>

import folderService from '@/api/messaging/folder.service'
import constants from '@/constants/messagingConstants'
import BaseIcon from '@components/Base/BaseIcon'
import messageService from '@/api/messaging/message.service'
import MenuFolder from '@components/Messaging/MenuFolder'
import _ from 'lodash'
import MenuRootFolder from '@components/Messaging/MenuRootFolder'
import { nextTick } from 'vue'

export default {
  name: 'Menu',
  components: {
    MenuRootFolder,
    BaseIcon,
    MenuFolder
  },
  inject: ['mq'],
  props: {
  },
  data: function () {
    return {
      isLoadingFolders: false,
      isPersonalFoldersExpanded: false,
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
      return this.folderList.filter(folder => folder.type === constants.messagingPersonalFolderType)
    },
    nbNewMessages () {
      return this.$store.state.messaging.nbNewMessages
    },
    sortedPersonalFolders () {
      return _.orderBy(this.personalFolders, 'folderName', 'asc')
    }
  },
  methods: {
    toggleSideMenuPanel () {
      this.$store.dispatch('messaging/toggleSideMenuPanel')
    },
    togglePersonalFolders () {
      this.isPersonalFoldersExpanded = !this.isPersonalFoldersExpanded
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
    selectFolder (folder) {
      this.$store.dispatch('messaging/selectFolder', folder)
    },
    openParametersModal () {
      this.$store.dispatch('messaging/openParametersModal')
    },
    createPersonalRootFolder () {
      this.displayNewFolderInput = false
      folderService.addFolder(0, this.newFolderName).then((data) => {
        if (data.success) {
          this.$store.dispatch('messaging/addPersonalRootFolder', data.folder)
          this.isPersonalFoldersExpanded = true
          this.newFolderName = ''
        }
      })
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
  background-color: #F3F6F8;
  height: 100%;
  overflow: auto;

  &.phone {
    .menu {
      padding-top: 0;
    }
  }
}

.menu-header {
  height: calc(#{$messaging-header-height + 1px});
  width: 100%;
  display: flex;
  align-items: center;

  .header-icon {
    margin: auto;
    padding: 5px;
    width: 35px;
    height: 35px;
    border: 1px solid transparent;

    &:hover {
      border-radius: 5px;
      border: 1px solid black;
      cursor: pointer;
    }
  }

  img {
    margin-right: 15px;
    margin-left: 20px;
  }
}
hr {
  margin: 0;
}
.menu {
  width: 100%;

  .base-folder {
    padding-left: 20px;
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
      width: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 10px;

      .folder-icon {
        width: 18px;
      }
    }

    .folder-actions {
      display: none;
    }
    &:hover .folder-actions {
      margin-left: auto;
      margin-right: 25px;
      display: block;
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
