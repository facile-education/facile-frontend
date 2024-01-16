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
          class="button"
          cls="cancel"
          :label="$t('ConflictModal.cancelButton')"
          @click="handleChoice(modes.ignore)"
        />
        <!-- TODO check permission? >-->
        <WeprodeButton
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
import store from '@store'

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
    handleChoice (mode) {
      let parameters
      if (this.lastAction.params.storePath) { // Handle case that last action is a store action and not a 'normal' parametrized method
        parameters = [this.lastAction.params.storePath, { ...this.lastAction.params.storeParams, mode }]
      } else {
        parameters = [...this.lastAction.params, mode]
      }

      this.lastAction.fct.apply(this, parameters)
      this.onClose()
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
