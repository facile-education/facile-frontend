<template>
  <div class="messaging-tab">
    <!-- Forward -->
    <div class="param-header">
      <PentilaCheckbox
        v-model="configuration.forward.isActive"
        class="checkbox"
        label=""
      />
      {{ $t('Messaging.Parameters.forward') }}
    </div>
    <PentilaTagsInput
      v-model="configuration.forward.addresses"
      placeholder="Adresses"
      display-field="text"
      id-field="id"
      :disabled="!configuration.forward.isActive"
      class="param-value"
    />

    <!-- Signature -->
    <div class="param-header">
      <PentilaCheckbox
        v-model="configuration.signature.isActive"
        class="checkbox"
        label=""
      />
      {{ $t('Messaging.Parameters.signature') }}
    </div>
    <PentilaInput
      id="signature-input"
      v-model="configuration.signature.content"
      class="param-value"
      data-test="signature-input"
      :disabled="!configuration.signature.isActive"
      :placeholder="$t('Messaging.Parameters.signaturePlaceHolder')"
    />

    <!-- Auto-reply -->
    <div class="param-header">
      <PentilaCheckbox
        v-model="configuration.autoReply.isActive"
        class="checkbox"
        label=""
      />
      {{ $t('Messaging.Parameters.autoReply') }}
    </div>
    <PentilaInput
      id="autoReply-input"
      v-model="configuration.autoReply.content"
      class="param-value"
      data-test="autoReply-input"
      :disabled="!configuration.autoReply.isActive"
      :placeholder="$t('Messaging.Parameters.autoReplyPlaceHolder')"
    />
  </div>
</template>

<script>
import configurationService from '@/api/messaging/configuration.service'

export default {
  name: 'MessagingTab',
  data () {
    return {
      configuration: {}
      // validation: [{
      //   classes: 'email',
      //   rule: /^(.+)@(.+)\.(.+)$/,
      //   disableAdd: true
      // }]
    }
  },
  created () {
    this.getConfiguration()
  },
  methods: {
    getConfiguration () {
      configurationService.getMessagingConfiguration().then((data) => {
        if (data.success) {
          this.configuration = data.configuration
        }
      })
    },
    updateConfiguration () {
      configurationService.updateMessagingConfiguration(this.configuration).then((data) => {
        if (data.success) {
          this.$store.dispatch('popups/pushPopup', { message: this.$t('successMessage'), type: 'success' })
          this.$store.dispatch('messaging/setSignature', this.configuration.signature.content)
          this.onClose()
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.messaging-tab {
  .param-header {
    padding-left: 20px;
    display: flex;
    margin-top: 40px;
    margin-bottom: 10px;
  }
  .param-value {
    padding-left: 20px;
  }
}
</style>
