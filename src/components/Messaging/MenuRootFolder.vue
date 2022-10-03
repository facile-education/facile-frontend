<template>
  <div
    class="base-folder"
    :class="{'selected': ($store.state.messaging.currentFolder.folderId === folder.folderId), 'active': isActive}"
    @click="selectFolder(folder)"
    @dragover="setActive"
    @dragleave="cancelActive"
    @drop="moveToFolder"
  >
    <div class="img-container">
      <img
        :style="`width: ${iconWidth};`"
        :src="icon"
        :alt="alt"
      >
    </div>
    {{ folder.folderName }}
    <div
      v-if="nbNotification > 0"
      class="nb-new-messages"
    >
      {{ '(' + nbNotification + ')' }}
    </div>
  </div>
</template>

<script>
import messageService from '@/api/messaging/message.service'

export default {
  name: 'MenuRootFolder',
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
    nbNotification: {
      type: Number,
      default: 0
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
    currentFolderId () {
      return this.$store.state.messaging.currentFolder.folderId
    }
  },
  methods: {
    selectFolder (folder) {
      this.$store.dispatch('messaging/selectFolder', folder)
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

.base-folder {
  height: 40px;
  cursor: pointer;
  margin-right: 10px;
  width: 100%;
  color: $color-messaging-dark-text;
  display: flex;
  align-items: center;
  font-size: 1em;
  letter-spacing: 0;
  line-height: 24px;

  .nb-new-messages {
    margin-left: 4px;
  }

  .img-container {
    width: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 10px;
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

  &.active {
    color: lightgrey;
    background-color: grey;
  }

  .folder-icon {
    width: 20px;
    margin-right: 10px;
  }
  &:hover:not(.selected) {
    //background-color: $light-grey-bg;
    //border-radius: 0 20px 20px 0;
    font-weight: bold;
  }
  &.selected {
    font-weight: bold;
    //color: white;
    //background-color: $color-messaging-bg;
    //border-radius: 0 20px 20px 0;
  }
}
</style>
