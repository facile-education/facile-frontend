<template>
  <WeprodeWindow
    :modal="true"
    @close="onClose"
  >
    <template #header>
      {{ title }}
    </template>

    <template #body>
      <div>
        {{ message }}
      </div>
    </template>

    <template #footer>
      <WeprodeButton
        :label="confirmBtnLabel"
        @click="onConfirm"
      />
    </template>
  </WeprodeWindow>
</template>

<script>
import WeprodeButton from '@/components/Base/Weprode/WeprodeButton.vue'
import WeprodeWindow from '@/components/Base/Weprode/WeprodeWindow.vue'

export default {
  name: 'WeprodeConfirmModal',
  components: {
    WeprodeButton,
    WeprodeWindow
  },
  computed: {
    message () {
      return this.$store.state.nero.confirmModal.message
    },
    title () {
      return this.$store.state.nero.confirmModal.title
    },
    confirmBtnLabel () {
      return this.$store.state.nero.confirmModal.buttonLabel
    }
  },
  methods: {
    onClose () {
      this.$store.dispatch('nero/closeConfirmModal')
    },
    onConfirm () {
      this.$store.state.nero.confirmModal.onConfirm()
      this.onClose()
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
