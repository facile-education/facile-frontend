<template>
  <button
    class="base-folder"
    :class="{'selected': ($store.state.messaging.currentFolder.folderId === folder.folderId), 'active': isActive, 'theme-background-color': isActive }"
    @click="selectFolder(folder)"
    @dragover="setActive"
    @dragleave="cancelActive"
    @drop="moveToFolder"
  >
    <span class="img-container">
      <img
        v-if="isIconImage"
        :style="`width: ${iconWidth};`"
        :src="icon"
        :alt="alt"
      >
      <CustomIcon
        v-else
        class="font-icon"
        :icon-name="icon"
      />
    </span>
    {{ folder.folderName }}
    <span
      v-if="nbUnread > 0"
      class="nb-new-messages"
    >
      {{ '(' + nbUnread + ')' }}
    </span>
  </button>
</template>

<script>
import CustomIcon from '@components/Base/CustomIcon.vue'

import messageService from '@/api/messaging/message.service'
import { MESSAGING } from '@/constants/appConstants'

export default {
  name: 'MenuRootFolder',
  components: { CustomIcon },
  inject: ['mq'],
  props: {
    folder: {
      type: Object,
      required: true
    },
    iconWidth: {
      type: String,
      default: 'auto'
    },
    icon: {
      type: String,
      required: true
    },
    alt: {
      type: String,
      default: ''
    },
    dropAllowed: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      isActive: false
    }
  },
  computed: {
    isIconImage () {
      return this.icon?.indexOf('svg') !== -1
    },
    currentFolderId () {
      return this.$store.state.messaging.currentFolder.folderId
    },
    nbUnread () {
      for (const folder of this.$store.state.messaging.messagingFolders) {
        if (folder.folderId === this.folder.folderId) {
          return folder.nbUnread
        }
      }
      return 0
    }
  },
  methods: {
    selectFolder (folder) {
      this.$store.dispatch('messaging/selectFolder', folder)
      // Reset messageId param in url
      this.$router.push({ name: MESSAGING })
      if (this.mq.phone || this.mq.tablet) {
        this.$store.dispatch('messaging/hideMenuPanel')
      }
    },
    cancelHandlers (e) {
      e.preventDefault()
      e.stopPropagation()
    },
    setActive (e) {
      if (this.dropAllowed && this.folder.folderId !== this.currentFolderId) {
        this.isActive = true
        this.cancelHandlers(e)
      }
    },
    cancelActive (e) {
      this.isActive = false
      this.cancelHandlers(e)
    },
    moveToFolder (e) {
      if (this.isActive) {
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
}
</script>

<style lang="scss" scoped>
@import '@design';

button {
  margin: 0;
  padding: 0;
  border: none;

  &:not(.theme-background-color) {
    background-color: transparent;
  }
}

.base-folder {
  height: 40px;
  cursor: pointer;
  margin-right: 10px;
  width: 100%;
  display: flex;
  align-items: center;
  font-size: 1em;
  letter-spacing: 0;
  line-height: 24px;

  .nb-new-messages {
    margin-left: 4px;
  }

  .img-container {
    min-width: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 10px;

    .font-icon {
      font-size: 1.2rem;
    }
  }

  img {
    width: 16px;
  }

  .inbox-icon {
    width: 20px;
  }

  .sent-icon {
    width: 20px;
  }

  .folder-icon {
    width: 20px;
    margin-right: 10px;
  }
  &:hover:not(.selected) {
    font-weight: bold;
  }
  &.selected {
    font-weight: bold;
  }
}
</style>
