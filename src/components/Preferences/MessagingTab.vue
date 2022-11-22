<template>
  <div
    v-if="configuration"
    class="messaging-tab"
  >
    <!-- Forward -->
    <div class="param-header">
      <PentilaCheckbox
        v-model="configuration.forward.isActive"
        class="checkbox"
        label=""
        @update:modelValue="updateConfiguration"
      />
      {{ $t('forward') }}
      <InformationIcon
        class="info"
        :text="$t('forwardInfo')"
      />
    </div>
    <PentilaTagsInput
      v-model="configuration.forward.addresses"
      :placeholder="$t('addRedirection')"
      display-field="text"
      id-field="id"
      :disabled="!configuration.forward.isActive"
      class="param-value"
      @update:modelValue="updateConfiguration"
    />

    <!-- Signature -->
    <div class="param-header">
      <PentilaCheckbox
        v-model="configuration.signature.isActive"
        class="checkbox"
        label=""
        @update:modelValue="updateConfiguration"
      />
      {{ $t('signature') }}
    </div>
    <TextContent
      class="ck"
      data-test="signature-input"
      :content="{contentValue: signatureContent}"
      :disabled="!configuration.signature.isActive"
      :is-in-progression="false"
      @input="updateSignature"
      @blur="updateConfiguration"
    />

    <!-- Auto-reply -->
    <div class="param-header">
      <PentilaCheckbox
        v-model="configuration.autoReply.isActive"
        class="checkbox"
        label=""
        @update:modelValue="updateConfiguration"
      />
      {{ $t('autoReply') }}
    </div>
    <TextContent
      class="ck"
      data-test="signature-input"
      :content="{contentValue: autoReplyContent}"
      :disabled="!configuration.autoReply.isActive"
      :is-in-progression="false"
      @input="updateAutoReply"
      @blur="updateConfiguration"
    />
  </div>
  <PentilaSpinner v-else />
</template>

<script>
import configurationService from '@/api/messaging/configuration.service'
import InformationIcon from '@components/Base/InformationIcon'
import TextContent from '@components/Progression/Edit/Contents/TextContent'

export default {
  name: 'MessagingTab',
  components: { TextContent, InformationIcon },
  data () {
    return {
      configuration: undefined,
      isLoading: false,
      signatureContent: undefined,
      autoReplyContent: undefined
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
          // necessary to duplicate to avoid errors in ckEditor
          this.signatureContent = data.configuration.signature.content
          this.autoReplyContent = data.configuration.autoReply.content
        }
      })
    },
    updateConfiguration () {
      // TODO: form validation (mails, required...)
      if (!this.isLoading) { // because sometimes, the blur event is triggered twice (with CKEditor)
        this.isLoading = true
        configurationService.updateMessagingConfiguration(this.configuration).then((data) => {
          this.isLoading = false
          if (data.success) {
            console.log('sucess')
            this.$store.dispatch('popups/pushPopup', { message: this.$t('successMessage'), type: 'success' })
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
  "addRedirection": "Ajouter un couriel",
  "signature": "Signature",
  "autoReply": "Réponse automatique",
  "save": "Enregistrer",
  "forward": "Être averti par courriel",
  "forwardInfo": "Renseignez une adresse de courriel pour être averti de l’arrivé d’un nouveau message.",
  "successMessage": "Paramètres sauvegardés"
}
</i18n>
