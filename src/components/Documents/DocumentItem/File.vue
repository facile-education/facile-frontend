<template>
  <GenericDocument
    data-test="file"
    :document="file"
    :document-icon="fileIcon"
    :quick-options="quickOptions"
    :display="display"
    :is-draggable="isDraggable"
    :dark="dark"
    @triggerAction="openFile"
    @shiftSelect="dispatchEvent"
    @openContextMenu="openContextMenu"
  />
</template>

<script>
import { icons } from '@/constants/icons'
import GenericDocument from '@components/Documents/DocumentItem/GenericDocument'

export default {
  name: 'File',
  components: { GenericDocument },
  inject: ['mq'],
  myIcons: icons,
  props: {
    file: {
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
  computed: {
    isSelected () {
      return this.$store.state.documents.selectedEntities.find(selectedEntity => selectedEntity.id === this.file.id) !== undefined
    },
    fileIcon () {
      if (this.$options.myIcons.extensions[this.file.extension] === undefined) {
        return this.$options.myIcons.file
      } else {
        return this.$options.myIcons.extensions[this.file.extension]
      }
    }
  },
  methods: {
    openFile () {
      // Select file (not mandatory but more user-Friendly)
      this.$store.dispatch('documents/selectOneDocument', this.file)
      // Open it
      this.$store.dispatch('documents/openFile', this.file)
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
