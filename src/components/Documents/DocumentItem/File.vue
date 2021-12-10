<template>
  <GenericDocument
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
  <teleport
    v-if="isDisplayed"
    to="body"
  >
    <FileDisplayModal
      :file="file"
      @close="isDisplayed = false"
    />
  </teleport>
</template>

<script>
import { icons } from '@/constants/icons'
import GenericDocument from '@components/Documents/DocumentItem/GenericDocument'
import FileDisplayModal from '@components/Documents/FileDisplay/FileDisplayModal'

export default {
  name: 'File',
  components: { FileDisplayModal, GenericDocument },
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
  data () {
    return {
      isDisplayed: false
    }
  },
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
      this.isDisplayed = true
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
