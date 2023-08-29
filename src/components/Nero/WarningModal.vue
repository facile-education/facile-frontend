<template>
  <PentilaWindow
    :modal="true"
    :draggable="true"
    class="warning-modal"
    data-test="warning-modal"
    :width="600"
    @close="onClose"
  >
    <template #header>
      <span v-t="'WarningModal.header'" />
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
          {{ warning.text }}
        </p>
      </div>
    </template>

    <template #footer>
      <div class="window-footer">
        <PentilaButton
          data-test="cancelButton"
          cls="cancel"
          :label="$t('WarningModal.cancelButton')"
          @click="onClose"
        />
        <PentilaButton
          data-test="confirmButton"
          cls="delete"
          :label="$t('WarningModal.confirmButton')"
          @click="forceLastAction"
        />
      </div>
    </template>
  </PentilaWindow>
</template>

<script>
import NeroIcon from '@/components/Nero/NeroIcon'

export default {
  name: 'WarningModal',
  components: { NeroIcon },
  computed: {
    warning () {
      return this.$store.getters['warningModal/firstWarning']
    },
    lastAction () {
      return this.warning.lastAction
    }
  },
  created () {
    this.$store.dispatch('misc/incrementModalCount')
  },
  methods: {
    forceLastAction () {
      this.lastAction.fct.apply(this, this.lastAction.params)
      this.onClose()
    },
    onClose () {
      this.$store.dispatch('misc/decreaseModalCount')
      this.$store.dispatch('warningModal/removeFirstWarning')
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

.cancel, .delete {
  width: 130px;
}
</style>
