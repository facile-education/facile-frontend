<template>
  <div data-test="parametersModal">
    <PentilaWindow
      :modal="true"
      class="modal"
      :height="550"
      @close="onClose"
      @keydown.exact.enter.stop=""
      @keydown.exact.backspace.stop=""
      @keydown.exact.delete.stop=""
      @keydown.exact.f2.stop=""
      @keydown.ctrl.stop=""
      @keydown.exact.escape.stop="onClose"
    >
      <template #header>
        <span v-t="'Messaging.Parameters.header'" />
      </template>

      <template #body>
        <div v-if="configuration.signature != undefined">
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

      <template #footer>
        <PentilaButton
          data-test="submitButton"
          :label="$t('Messaging.Parameters.submitButton')"
          class="dark"
          @click="updateConfiguration"
        />
      </template>
    </PentilaWindow>
  </div>
</template>

<script>

import configurationService from '@/api/messaging/configuration.service'

export default {
  name: 'MessagingParametersModal',
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
  computed: {
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
    },
    onClose () {
      this.$store.dispatch('messaging/closeParametersModal')
    }
  }
}
</script>

<style lang="scss" scoped>
.modal {
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

<i18n locale="fr">
{
  "successMessage": "paramètres sauvegardés"
}
</i18n>
