<template>
  <GenericDocument
    class="folder-document"
    data-test="folder"
    :class="{ 'active': isActive }"
    :document="folder"
    :document-icon="folderIcon"
    :quick-options="quickOptions"
    :dark="dark"
    :display="display"
    :is-draggable="isDraggable"
    @triggerAction="changeDir"
    @shiftSelect="dispatchEvent"
    @dragover="setActive"
    @dragleave="cancelActive"
    @drop="dropFile"
    @openContextMenu="openContextMenu"
  />
</template>

<script>
import { icons } from '@/constants/icons'
import GenericDocument from '@components/Documents/DocumentItem/GenericDocument'

export default {
  name: 'Folder',
  components: { GenericDocument },
  inject: ['mq'],
  myIcons: icons,
  props: {
    folder: {
      type: Object,
      required: true,
      validator: function (obj) {
        return (typeof obj.id === 'string') &&
          (typeof obj.name === 'string' && obj.name.length > 0)
      }
    },
    display: {
      type: String,
      default: 'list'
    },
    isDraggable: {
      type: Boolean,
      default: false
    },
    quickOptions: {
      type: Array,
      default: function () {
        return []
      }
    },
    dark: {
      type: Boolean,
      default: false
    }
  },
  emits: ['shiftSelect', 'openContextMenu'],
  data () {
    return {
      isActive: false,
      isDragging: false
    }
  },
  computed: {
    isThereInternDocumentDrag () {
      return this.$store.state.misc.isThereDocumentDrag
    },
    isSelected () {
      return this.$store.state.documents.selectedEntities.find(selectedEntity => selectedEntity.id === this.folder.id) !== undefined
    },
    draggedFiles () {
      return this.$store.state.misc.draggedEntities
    },
    isDragged () {
      for (let i = 0; i < this.draggedFiles.length; ++i) {
        if (this.folder.id === this.draggedFiles[i].id) {
          return true
        }
      }
      return false
    },
    folderIcon () {
      return this.isActive ? this.$options.myIcons.folderOpen : this.$options.myIcons.folder
    }
  },
  methods: {
    cancelHandlers (e) {
      e.preventDefault()
      e.stopPropagation()
    },
    setActive (e) {
      if (this.isThereInternDocumentDrag && !this.isDragged) {
        this.isActive = true
        this.cancelHandlers(e)
      }
    },
    cancelActive (e) {
      if (this.isThereInternDocumentDrag && !this.isDragged) {
        this.isActive = false
        this.cancelHandlers(e)
      }
    },
    dropFile (e) {
      if (this.isThereInternDocumentDrag && !this.isDragged) {
        this.cancelActive(e)
        // dropFileAction
        this.$store.dispatch('clipboard/drop', {
          entities: JSON.parse(e.dataTransfer.getData('entitiesToDrop')),
          folder: this.folder
        })
      }
    },
    dispatchEvent (file) {
      this.$emit('shiftSelect', { id: file.id, name: file.name })
    },
    changeDir () {
      this.$router.push({ name: 'Documents', params: { folderId: this.folder.id } })
    },
    openContextMenu (e) {
      this.$emit('openContextMenu', e)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@design';

.folder-document {
  &.active {
    color: $color-light-text;
    background-color: $color-active-bg;
  }
}

</style>
