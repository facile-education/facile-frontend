<template>
  <GenericDocument
    data-test="file"
    :document="file"
    :document-icon="fileIcon"
    :quick-options="quickOptions"
    :is-draggable="isDraggable"
    :dark="dark"
    :is-last="isLast"
    @triggerAction="openFile"
    @shiftSelect="dispatchEvent"
    @openContextMenu="openContextMenu"
  />
</template>

<script>
import GenericDocument from '@components/Documents/DocumentItem/GenericDocument'

import { icons } from '@/constants/icons'

export default {
  name: 'File',
  components: { GenericDocument },
  inject: ['mq'],
  props: {
    file: {
      type: Object,
      required: true,
      validator: function (obj) {
        return (typeof obj.id === 'string') &&
          (typeof obj.name === 'string' && obj.name.length > 0)
      }
    },
    isDraggable: {
      type: Boolean,
      default: false
    },
    isLast: {
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
  computed: {
    isSelected () {
      return this.$store.state.documents.selectedEntities.find(selectedEntity => selectedEntity.id === this.file.id) !== undefined
    },
    isThereAnOpenFile () {
      return this.$store.state.documents.openFiles.length > 0
    },
    fileIcon () {
      if (icons.extensions[this.file.extension] === undefined) {
        return icons.file
      } else {
        return icons.extensions[this.file.extension]
      }
    }
  },
  methods: {
    openFile () {
      if (!this.isThereAnOpenFile) {
        // Select file (not mandatory but more user-Friendly)
        this.$store.dispatch('documents/selectOneDocument', this.file)
        // Open it
        this.$store.dispatch('documents/openFile', this.file)
      } else {
        console.error('there is already an open file!')
      }
    },
    dispatchEvent (file) {
      this.$emit('shiftSelect', { id: file.id, name: file.name })
    },
    openContextMenu (e) {
      this.$emit('openContextMenu', e)
    }
  }
}
</script>
