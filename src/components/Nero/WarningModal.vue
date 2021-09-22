<template>
  <PentilaWindow
    :modal="true"
    class="warning-modal"
    data-test="warning-modal"
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
          class="cancel-button"
          :label="$t('WarningModal.cancelButton')"
          @click="onClose"
        />
        <PentilaButton
          data-test="confirmButton"
          class="confirm-button"
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
  methods: {
    forceLastAction () {
      this.lastAction.fct.apply(this, this.lastAction.params)
      this.onClose()
    },
    onClose () {
      this.$store.dispatch('warningModal/removeFirstWarning')
    }
  }
}
</script>

<style scoped>
  .body{
    padding: 10px;
    display: flex;
    align-items: center;
  }

  .icon {
    font-size: 40px;
    color: orange;
  }

  .warning-modal {
    display: flex;
  }

  .context-message{
    display: inline;
    vertical-align: 14px;
    padding-left: 10px;
  }

  .window-footer{
    display: flex;
    justify-content: space-evenly;
  }

  .cancel-button{
    flex: 1;
    margin: 0 10px;
    min-width: 200px;
    height: 35px;
    font-weight: bold;
    font-size: 15px;
    background-color: gray;
    color: white;
  }

  .confirm-button{
    flex: 1;
    margin: 0 10px;
    min-width: 200px;
    height: 35px;
    font-weight: bold;
    font-size: 15px;
    background-color: red;
    color: white;
  }
</style>
