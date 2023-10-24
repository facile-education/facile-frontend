<template>
  <div
    v-if="configuration"
    class="messaging-tab"
    data-test="messaging-tab"
  >
    <!-- Forward -->
    <div class="param-header">
      <WeprodeCheckbox
        v-model="configuration.forward.isActive"
        class="checkbox"
        label=""
        @update:model-value="checkForm"
      />
      {{ $t('forward') }}
      <InformationIcon
        class="info"
        :text="$t('forwardInfo')"
      />
    </div>
    <WeprodeTagsInput
      v-model="configuration.forward.addresses"
      :placeholder="$t('addRedirection')"
      display-field="text"
      id-field="id"
      :close-on-select="true"
      :disabled="!configuration.forward.isActive"
      class="param-value"
      @update:model-value="checkForm"
    />
    <WeprodeErrorMessage :error-message="errorMessage" />

    <!-- Signature -->
    <div class="param-header">
      <WeprodeCheckbox
        v-model="configuration.signature.isActive"
        class="checkbox"
        label=""
        @update:model-value="checkForm"
      />
      {{ $t('signature') }}
    </div>
    <TextContent
      class="ck"
      data-test="signature-input"
      :content="signatureContent"
      :disabled="!configuration.signature.isActive"
      @input="updateSignature"
      @blur="checkForm"
    />

    <!-- Auto-reply -->
    <div class="param-header">
      <WeprodeCheckbox
        v-model="configuration.autoReply.isActive"
        class="checkbox"
        label=""
        @update:model-value="checkForm"
      />
      {{ $t('autoReply') }}
    </div>
    <TextContent
      class="ck"
      data-test="autoReply-input"
      :content="autoReplyContent"
      :disabled="!configuration.autoReply.isActive"
      @input="updateAutoReply"
      @blur="checkForm"
    />
  </div>
  <WeprodeSpinner v-else />
</template>

<script>
import InformationIcon from '@components/Base/InformationIcon'
import TextContent from '@components/Base/TextContent.vue'

import configurationService from '@/api/messaging/configuration.service'
import WeprodeCheckbox from '@/components/Base/Weprode/WeprodeCheckbox.vue'
import WeprodeErrorMessage from '@/components/Base/Weprode/WeprodeErrorMessage.vue'
import WeprodeSpinner from '@/components/Base/Weprode/WeprodeSpinner.vue'
import WeprodeTagsInput from '@/components/Base/Weprode/WeprodeTagsInput.vue'

export default {
  name: 'MessagingTab',
  components: { TextContent, InformationIcon, WeprodeCheckbox, WeprodeErrorMessage, WeprodeSpinner, WeprodeTagsInput },
  emits: ['save'],
  data () {
    return {
      configuration: undefined,
      oldConfiguration: undefined,
      isLoading: false,
      signatureContent: undefined,
      autoReplyContent: undefined,
      errorMessage: ''
    }
  },
  created () {
    this.getConfiguration()
  },
  methods: {
    checkForm () {
      this.errorMessage = ''
      for (let i = 0; i < this.configuration.forward.addresses.length; i++) {
        const email = this.configuration.forward.addresses[i].text
        if (!this.isValidEmail(email)) {
          this.errorMessage = this.$t('invalidEmailAddress')
        }
      }
      if (this.errorMessage === '') {
        this.updateConfiguration()
      }
    },
    isValidEmail (email) {
      return /^[^@]+@\w+(\.\w+)+\w$/.test(email)
    },
    updateSignature (value) {
      this.configuration.signature.content = value
    },
    updateAutoReply (value) {
      this.configuration.autoReply.content = value
    },
    getConfiguration () {
      configurationService.getMessagingConfiguration().then((data) => {
        if (data.success) {
          this.configuration = data.configuration
          this.oldConfiguration = JSON.stringify(data.configuration)

          // Necessary to duplicate to avoid errors in ckEditor
          this.signatureContent = data.configuration.signature.content
          this.autoReplyContent = data.configuration.autoReply.content
        }
      })
    },
    updateConfiguration () {
      // TODO: form validation (mails, required...)
      if (!this.isLoading) { // because sometimes, the blur event is triggered twice (with CKEditor)
        if (JSON.stringify(this.configuration) !== this.oldConfiguration) { // Only update if there is changes (blur event can be triggered without content modification)
          this.isLoading = true
          configurationService.updateMessagingConfiguration(this.configuration).then((data) => {
            this.isLoading = false
            if (data.success) {
              this.$store.dispatch('popups/pushPopup', { message: this.$t('successMessage'), type: 'success' })
              this.oldConfiguration = JSON.stringify(this.configuration)
              if (this.configuration.signature.isActive) {
                this.$store.dispatch('messaging/setSignature', this.configuration.signature.content)
              } else {
                this.$store.dispatch('messaging/setSignature', '')
              }
              this.$emit('save')
            } else {
              this.$store.dispatch('popups/pushPopup', { message: this.$t('Popup.error'), type: 'error' })
              // Rewrite from with back-end config
              this.getConfiguration()
            }
          })
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

.messaging-tab {
  .param-header {
    display: flex;
    margin-top: 40px;
    margin-bottom: 10px;

    .info {
      margin-left: 10px;
    }
  }
  .ck {
    border: 1px solid $color-border;
  }
}
</style>

<i18n locale="fr">
{
  "addRedirection": "Ajouter un courriel",
  "signature": "Signature",
  "autoReply": "Réponse automatique",
  "save": "Enregistrer",
  "forward": "Être averti par courriel",
  "forwardInfo": "Renseignez une adresse de courriel pour être averti de l’arrivée d’un nouveau message.",
  "successMessage": "Paramètres sauvegardés",
  "invalidEmailAddress": "Adresse e-mail invalide"
}
</i18n>
