<template>
  <WeprodeWindow
    :modal="true"
    :draggable="true"
    class="conflict-modal"
    data-test="conflict-modal"
    :width="600"
    @close="onClose"
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
          {{ entityNamesToDisplay + $t('ConflictModal.text') }}
        </p>
      </div>
    </template>

    <template #footer>
      <div class="window-footer">
        <WeprodeButton
          data-test="cancelButton"
          class="button"
          cls="cancel"
          :label="$t('ConflictModal.cancelButton')"
          @click="cancel"
        />
        <!-- TODO check permission? >-->
        <WeprodeButton
          data-test="replaceButton"
          class="button"
          cls="replace"
          :label="$t('ConflictModal.replaceButton')"
          @click="replace"
        />
        <WeprodeButton
          data-test="renameButton"
          class="button"
          cls="rename"
          :label="$t('ConflictModal.renameButton')"
          @click="rename"
        />
      </div>
    </template>
  </WeprodeWindow>
</template>

<script>
import NeroIcon from '@/components/Nero/NeroIcon'
import { conflicts } from '@/constants/documentsConstants'

export default {
  name: 'ConflictModal',
  components: { NeroIcon },
  computed: {
    conflict () {
      return this.$store.getters['conflictModal/firstConflict']
    },
    lastAction () {
      return this.conflict.lastAction
    },
    entitiesInConflict () {
      return this.conflict.entitiesInConflict
    },
    entityNamesToDisplay () {
      let namesToDisplay = ''
      let nbConflictRemaining = this.entitiesInConflict.length
      for (let i = 0; i < this.entitiesInConflict.length && i < 3; i++) {
        namesToDisplay = namesToDisplay + '"' + this.entitiesInConflict[i].name.split('/')[0] + '" '
        nbConflictRemaining--
      }
      if (nbConflictRemaining === 1) {
        namesToDisplay = namesToDisplay + '"' + this.entitiesInConflict[this.entitiesInConflict.length - 1].name.split('/')[0] + '" '
      } else if (nbConflictRemaining > 2) {
        // TODO: translation
        namesToDisplay = namesToDisplay + 'et ' + nbConflictRemaining + ' autres'
      }
      return namesToDisplay
    }
  },
  methods: {
    replace () {
      let parameters
      if (this.lastAction.params.storePath) { // Handle case that last action is a store action and not a 'normal' parametrized method
        parameters = [this.lastAction.params.storePath, { ...this.lastAction.params.storeParams, mode: conflicts.MODE_REPLACE }]
      } else {
        parameters = [...this.lastAction.params, conflicts.MODE_REPLACE]
      }

      this.lastAction.fct.apply(this, parameters)
      this.onClose()
    },
    rename () {
      let parameters
      if (this.lastAction.params.storePath) { // Handle case that last action is a store action and not a 'normal' parametrized method
        parameters = [this.lastAction.params.storePath, { ...this.lastAction.params.storeParams, mode: conflicts.MODE_RENAME }]
      } else {
        parameters = [...this.lastAction.params, conflicts.MODE_RENAME]
      }

      this.lastAction.fct.apply(this, parameters)
      this.onClose()
    },
    cancel () {
      let parameters
      if (!this.lastAction.params.storePath) { // (Upload only) Remove entities in conflicts for the next call
        const listRemainingFiles = [...this.lastAction.params[1]]

        // Remove entities concern by the conflict
        for (let i = 0; i < listRemainingFiles.length; i++) {
          const remainingFileParts = listRemainingFiles[i].name.split('/')
          const conflictFileParts = this.entitiesInConflict[0].name.split('/')
          if (remainingFileParts[0] === conflictFileParts[0]) {
            this.$store.dispatch('currentActions/removeFileToUpload', listRemainingFiles[i])
            listRemainingFiles.splice(i, 1)
            i--
          }
        }

        // Call method
        parameters = [this.lastAction.params[0], listRemainingFiles, conflicts.MODE_NORMAL]
        this.lastAction.fct.apply(this, parameters)
      }

      this.onClose()
    },
    onClose () {
      this.$store.dispatch('conflictModal/removeFirstConflict')
    }
  }
}
</script>

<style lang="scss" scoped>
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
