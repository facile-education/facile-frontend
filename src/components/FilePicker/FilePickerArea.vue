<template>
  <div
    class="file-picker-area"
    @dragover="setActive"
  >
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

    <div
      v-if="isLoadingProgressionDisplayed"
      class="background-actions-container"
      :class="{'phone': mq.phone}"
    >
      <UploadProgression />
    </div>
  </div>
</template>

<script>
import { returnAddedFiles } from '@/utils/upload.util'
import BaseIcon from '@components/Base/BaseIcon'
import UploadProgression from '@components/Documents/UploadProgression'
export default {
  name: 'FilePickerArea',
  components: { UploadProgression, BaseIcon },
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
    requiresTypeCheck: function () {
      return this.accept !== '*/*'
    },
    acceptedTypes: function () {
      return this.accept.split(',')
    },
    isThereInternDocumentDrag () {
      return this.$store.state.misc.isThereDocumentDrag
    },
    isLoadingProgressionDisplayed () {
      return this.$store.state.currentActions.isLoadingProgressionDisplayed
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
        returnAddedFiles(e, this.$store).then((files) => {
          if (files.length !== 0) {
            this.$emit('fileAdded', files)
          } else {
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

.background-actions-container {
  background-color: white;
  z-index: $popup-z-index;
  position: absolute;
  bottom: 0;
  right: 20px;
  flex-direction: column;
  max-width: 100%;

  .action {
    color: white;
  }

  &.phone {
    bottom: 0;
    right: 50%;
    transform: translate(50%, 0);

    .action {
      width: 90vw;
      height: 50px;
    }
  }
}
</style>

<i18n locale="fr">
{
  "errorNoFiles": "Il n'y a aucun fichier valide à téléverser !",
  "dropZoneLabel": "Déposer un document"
}
</i18n>
