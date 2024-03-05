<template>
  <WeprodeWindow
    class="create-link-modal"
    data-test="create-link-modal"
    :full-screen="mq.phone || mq.tablet"
    :modal="true"
    :draggable="true"
    :width="600"
    @close="onClose"
  >
    <template #header>
      <span v-t="'HelpModal.CreateExternalLinkModal.title'" />
    </template>

    <template #body>
      <WeprodeInput
        ref="labelInput"
        v-model="linkLabel"
        class="label-input"
        :placeholder="$t('HelpModal.CreateExternalLinkModal.linkLabelPlaceHolder')"
      />

      <WeprodeInput
        v-model="linkUrl"
        :placeholder="$t('HelpModal.CreateExternalLinkModal.linkUrlPlaceHolder')"
      />
      <WeprodeErrorMessage
        v-if="linkUrl.length > linkUrlMaxSize"
        :error-message="$t('HelpModal.CreateExternalLinkModal.overflowUrlSize', { maxSize: linkUrlMaxSize })"
      />
    </template>

    <template #footer>
      <WeprodeButton
        data-test="submitButton"
        :label="$t('HelpModal.CreateExternalLinkModal.submit')"
        :disabled="!(linkLabel.length > 0 && linkUrl.length > 0 && linkUrl.length <= linkUrlMaxSize)"
        @click="submit"
      />
    </template>
  </WeprodeWindow>
</template>

<script>
import WeprodeButton from '@components/Base/Weprode/WeprodeButton.vue'

import { saveLink } from '@/api/help.service'
import WeprodeErrorMessage from '@/components/Base/Weprode/WeprodeErrorMessage.vue'
import WeprodeInput from '@/components/Base/Weprode/WeprodeInput.vue'
import WeprodeWindow from '@/components/Base/Weprode/WeprodeWindow.vue'
export default {
  name: 'CreateExternalLinkModal',
  components: { WeprodeButton, WeprodeErrorMessage, WeprodeInput, WeprodeWindow },
  inject: ['mq'],
  emits: ['close'],
  data () {
    return {
      linkLabel: '',
      linkUrl: '',
      linkUrlMaxSize: 300
    }
  },
  computed: {
    selectedHelpItem () {
      return this.$store.state.help.selectedItem
    }
  },
  created () {
    this.$store.dispatch('misc/incrementModalCount')
  },
  mounted () {
    const input = this.$refs.labelInput
    input.focus()
    input.select()
  },
  methods: {
    submit () {
      saveLink(this.selectedHelpItem.itemId, this.linkLabel, this.linkUrl).then((data) => {
        if (data.success) {
          this.$store.dispatch('help/refreshCurrentArticle')
          this.onClose()
        } else {
          this.$store.dispatch('popups/pushPopup', { message: this.$t('Popup.error'), type: 'error' })
        }
      })
    },
    onClose () {
      this.$store.dispatch('misc/decreaseModalCount')
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
.label-input {
  margin-bottom: 15px;
}

</style>
