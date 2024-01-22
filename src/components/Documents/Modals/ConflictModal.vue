<template>
  <WeprodeWindow
    :modal="true"
    :draggable="true"
    class="conflict-modal"
    data-test="conflict-modal"
    :width="600"
    @close="handleChoice(modes.ignore)"
  >
    <template #header>
      <span v-t="'ConflictModal.header'" />
    </template>

    <template #body>
      <div class="body">
        <NeroIcon
          name="fa-exclamation-triangle"
          class="icon"
        />
        <p
          class="context-message"
        >
          {{ '"' + entityNamesToDisplay + '"' + $t(canReplaceOriginalDoc ? 'ConflictModal.text': 'ConflictModal.textWithoutReplaceOption') }}
        </p>
      </div>
    </template>

    <template #footer>
      <div class="window-footer">
        <WeprodeButton
          class="button"
          cls="cancel"
          :label="$t('ConflictModal.cancelButton')"
          @click="handleChoice(modes.ignore)"
        />
        <WeprodeButton
          v-if="canReplaceOriginalDoc"
          class="button"
          cls="replace"
          :label="$t('ConflictModal.replaceButton')"
          @click="handleChoice(modes.replace)"
        />
        <WeprodeButton
          class="button"
          cls="rename"
          :label="$t('ConflictModal.renameButton')"
          @click="handleChoice(modes.rename)"
        />
      </div>
    </template>
  </WeprodeWindow>
</template>

<script>
import WeprodeButton from '@/components/Base/Weprode/WeprodeButton.vue'
import WeprodeWindow from '@/components/Base/Weprode/WeprodeWindow.vue'
import NeroIcon from '@/components/Nero/NeroIcon'
import { conflicts } from '@/constants/documentsConstants'

export default {
  name: 'ConflictModal',
  components: { NeroIcon, WeprodeButton, WeprodeWindow },
  computed: {
    modes () {
      return {
        replace: conflicts.MODE_REPLACE,
        rename: conflicts.MODE_RENAME,
        ignore: conflicts.MODE_IGNORE
      }
    },
    conflict () {
      return this.$store.getters['conflictModal/firstConflict']
    },
    lastAction () {
      return this.conflict.lastAction
    },
    docInParametersThatCauseConflict () {
      return this.conflict.docInParametersThatCauseConflict
    },
    canReplaceOriginalDoc () {
      return this.docInParametersThatCauseConflict.canReplaceOriginalDoc
    },
    isFolderInConflict () {
      return this.conflict.folderNameInConflict !== undefined
    },
    entityNamesToDisplay () {
      if (this.isFolderInConflict) {
        return this.conflict.folderNameInConflict
      } else {
        return this.docInParametersThatCauseConflict.name
      }
    }
  },
  methods: {
    handleChoice (mode) {
      let parameters

      if (this.conflict.isUploadConflict) {
        parameters = [...this.lastAction.params]
        const nextDocumentListToUpload = parameters[1]
        if (this.conflict.folderNameInConflict) {
          this.applyChosenModeToAllFolderFilesInTheUploadList(nextDocumentListToUpload, mode)
        } else {
          nextDocumentListToUpload[0].mode = mode // upload mode for the entity in conflict only
        }
      } else if (this.conflict.isClipboardConflict) {
        parameters = [this.lastAction.params.storePath, { ...this.lastAction.params.storeParams, mode }] // Normally contains only one element
      }

      this.lastAction.fct.apply(this, parameters)
      this.onClose()
    },
    applyChosenModeToAllFolderFilesInTheUploadList (remainingDocumentListToUpload, mode) {
      remainingDocumentListToUpload.forEach(documentToUpload => {
        const parts = documentToUpload.name.split('/')
        if (parts.indexOf(this.conflict.folderNameInConflict) !== -1) {
          if (mode === conflicts.MODE_IGNORE) {
            documentToUpload.mode = conflicts.MODE_IGNORE
          } else {
            documentToUpload.mode = conflicts.MODE_MERGE
          }
        }
      })
      remainingDocumentListToUpload[0].mode = mode
    },
    onClose () {
      this.$store.dispatch('conflictModal/removeFirstConflict')
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

.conflict-modal {
  z-index: calc(#{$popup-z-index} + 1); /* To be over the upload progression popover */
}

.body {
  display: flex;
  align-items: center;
}

.icon {
  font-size: 40px;
  color: orange;
}

.context-message{
  display: inline;
  vertical-align: 14px;
  margin-left: 10px;
}

.window-footer{
  display: flex;
  justify-content: space-evenly;
}

.button {
  width: min(130px, 25vw);
}
</style>
