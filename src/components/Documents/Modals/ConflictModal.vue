<template>
  <PentilaWindow
    :modal="true"
    :draggable="true"
    class="conflict-modal"
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
          {{ '"' + entityInConflict.name.split('/')[0] + '"' + $t('ConflictModal.text') }}
        </p>
      </div>
    </template>

    <template #footer>
      <div class="window-footer">
        <PentilaButton
          data-test="cancelButton"
          cls="cancel"
          :label="$t('ConflictModal.cancelButton')"
          @click="onClose"
        />
        <!-- TODO check permission? >-->
        <PentilaButton
          data-test="replaceButton"
          cls="replace"
          :label="$t('ConflictModal.replaceButton')"
          @click="replace"
        />
        <PentilaButton
          data-test="renameButton"
          cls="rename"
          :label="$t('ConflictModal.renameButton')"
          @click="rename"
        />
      </div>
    </template>
  </PentilaWindow>
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
    entityInConflict () {
      return this.conflict.entityInConflict
    }
  },
  methods: {
    replace () {
      this.lastAction.fct.apply(this, [...this.lastAction.params, conflicts.MODE_REPLACE])
      this.onClose()
    },
    rename () {
      this.lastAction.fct.apply(this, [...this.lastAction.params, conflicts.MODE_RENAME])
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

.conflict-modal {
  display: flex;
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

.cancel, .delete {
  width: 130px;
}
</style>
