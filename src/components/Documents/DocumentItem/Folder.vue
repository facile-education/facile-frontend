<template>
  <GenericDocument
    class="folder-document"
    :class="{ 'active': isActive }"
    :document="document"
    :quick-options="quickOptions"
    :dark="dark"
    :display="display"
    :is-draggable="isDraggable"
    @click="clickOnFolder"
    @dblclick="changeDir"
    @shiftSelect="dispatchEvent"
    @open="changeDir"
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
    isMultiSelectionActive () {
      return this.$store.state.documents.isMultiSelectionActive
    },
    isSelected () {
      for (let i = 0; i < this.$store.state.documents.selectedFiles.length; ++i) {
        if (this.folder.id === this.$store.state.documents.selectedFiles[i].id) {
          return true
        }
      }
      return false
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
    document () {
      const obj = this.folder
      obj.icon = this.isActive ? this.$options.myIcons.folderOpen : this.$options.myIcons.folder
      return obj
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
      this.$store.dispatch('files/changeDirectory', this.folder.id)
      if (!this.mq.phone && !this.mq.tablet) {
        this.$store.dispatch('files/selectOneFile', this.folder)
      }
    },
    clickOnFolder () {
      if (this.mq.phone || this.mq.tablet) {
        if (this.isMultiSelectionActive) {
          this.$store.dispatch('files/updateCtrlSelectedFiles', this.folder)
        } else {
          this.changeDir()
        }
      } else {
        this.$store.dispatch('files/openDocumentPanel')
      }
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
