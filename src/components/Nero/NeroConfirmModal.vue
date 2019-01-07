<template>
  <NeroWindow
    :modal="true"
    @close="onClose"
  >
    <span slot="header">
      {{ title }}
    </span>

    <div slot="body">
      {{ message }}
    </div>

    <NeroButton
      slot="footer"
      :label="confirmBtnLabel"
      @click="onConfirm"
    />
  </NeroWindow>
</template>

<script>
import NeroButton from '@/components/Nero/NeroButton'
import NeroWindow from '@/components/Nero/NeroWindow'

export default {
  name: 'NeroConfirmModal',
  components: {
    NeroButton,
    NeroWindow
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
@import 'src/assets/css/constants';

</style>
