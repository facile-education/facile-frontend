<template>
  <div
    class="file-picker-area"
    @dragover="setActive"
  >
    <!-- transform deposit zone in input? -->
    <div
      v-if="isActive"
      class="deposit-zone"
      @dragleave="cancelActive"
      @drop="fileAdded"
    >
      <div class="message">
        <span class="text">
          <BaseIcon name="folder-open" />
          {{ $t('dropZoneLabel') }}
        </span>
      </div>
    </div>
    <div class="slot">
      <slot />
    </div>
  </div>
</template>

<script>
import BaseIcon from '@components/Base/BaseIcon'

import { returnAddedFiles } from '@/utils/upload.util'

export default {
  name: 'FilePickerArea',
  components: { BaseIcon },
  inject: ['mq'],
  props: {
    accept: {
      type: String,
      default: '*/*'
    },
    allowMultiple: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  emits: ['fileAdded'],
  data: function () {
    return {
      isActive: false
    }
  },
  computed: {
    isThereInternDocumentDrag () {
      return this.$store.state.misc.isThereDocumentDrag
    }
  },
  methods: {
    cancelHandlers (e) {
      e.preventDefault()
      e.stopPropagation()
    },
    setActive (e) {
      if (!this.isThereInternDocumentDrag && !this.disabled) {
        const dt = e.dataTransfer
        if (dt.types && (dt.types.indexOf ? dt.types.indexOf('Files') !== -1 : dt.types.contains('Files'))) { // Prevent to be active on any draggable element (only on files)
          this.isActive = true
          this.cancelHandlers(e)
        }
      }
    },
    cancelActive (e) {
      if (!this.isThereInternDocumentDrag) {
        this.isActive = false
        this.cancelHandlers(e)
      }
    },
    fileAdded (e) {
      if (!this.isThereInternDocumentDrag) {
        this.cancelActive(e)
        returnAddedFiles(e, this.$store).then((result) => {
          if (result.listFiles.length !== 0) {
            this.$emit('fileAdded', result.listFiles)
          } else if (!result.sizeException) {
            this.$store.dispatch('popups/pushPopup', { message: this.$t('errorNoFiles'), type: 'error' })
          }
        })
      }
    }
  }
}
</script>

<style scoped lang="scss">
@import "@design";

.file-picker-area {
  width: 100%;
  height: 100%;
  transition: 0.3s;
  position: relative;
  z-index: $body-z-index;
}

.slot {
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: $body-z-index+1;
  display: flex;
  flex-direction: column;
  top: 0;
  left: 0;
}

.deposit-zone {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: $body-z-index + 2;
  background-color: $drop-zone-area-bg;
  opacity: 0.7;
  display: flex;
  align-items: center;
  justify-content: center;
}

.message {
  width: 30em;
  height: 15em;
  border: 5px dashed blue;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.text {
  font-size: 30px;
  color: black;
  pointer-events: none;
}
</style>

<i18n locale="fr">
{
  "errorNoFiles": "Le chargement n'est pas autorisé",
  "dropZoneLabel": "Déposer un document"
}
</i18n>
